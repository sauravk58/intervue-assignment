import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPollSchema, insertResponseSchema, insertSessionSchema } from "@shared/schema";
import { ZodError } from "zod";

interface WSClient extends WebSocket {
  role?: "teacher" | "student";
  studentName?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WSClient>();

  // WebSocket connection handling
  wss.on('connection', (ws: WSClient) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'join':
            ws.role = data.role;
            if (data.role === 'student') {
              ws.studentName = data.studentName;
              await storage.createSession({ studentName: data.studentName });
            }
            broadcastActiveSessions();
            
            // Send current active poll to student
            if (data.role === 'student') {
              const activePoll = await storage.getActivePoll();
              if (activePoll) {
                ws.send(JSON.stringify({
                  type: 'pollStarted',
                  poll: activePoll
                }));
              }
            }
            break;
            
          case 'createPoll':
            if (ws.role === 'teacher') {
              // End any active polls first
              const activePoll = await storage.getActivePoll();
              if (activePoll) {
                await storage.updatePollStatus(activePoll.id, false, new Date());
              }
              
              const poll = await storage.createPoll(data.poll);
              
              // Broadcast to all students
              broadcastToStudents({
                type: 'pollStarted',
                poll: poll
              });
              
              // Start timer
              setTimeout(async () => {
                await storage.updatePollStatus(poll.id, false, new Date());
                const responses = await storage.getResponsesByPollId(poll.id);
                const results = calculateResults(poll, responses);
                
                broadcastToAll({
                  type: 'pollEnded',
                  results: results
                });
              }, poll.duration * 1000);
            }
            break;
            
          case 'submitResponse':
            if (ws.role === 'student' && ws.studentName) {
              const activePoll = await storage.getActivePoll();
              if (activePoll) {
                await storage.createResponse({
                  pollId: activePoll.id,
                  studentName: ws.studentName,
                  selectedOption: data.selectedOption
                });
                
                // Send confirmation to student
                ws.send(JSON.stringify({
                  type: 'responseSubmitted'
                }));
                
                // Broadcast updated response count to teacher
                const responses = await storage.getResponsesByPollId(activePoll.id);
                broadcastToTeachers({
                  type: 'responseUpdate',
                  responseCount: responses.length
                });
              }
            }
            break;
            
          case 'endPoll':
            if (ws.role === 'teacher') {
              const activePoll = await storage.getActivePoll();
              if (activePoll) {
                await storage.updatePollStatus(activePoll.id, false, new Date());
                const responses = await storage.getResponsesByPollId(activePoll.id);
                const results = calculateResults(activePoll, responses);
                
                broadcastToAll({
                  type: 'pollEnded',
                  results: results
                });
              }
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });

    ws.on('close', async () => {
      if (ws.role === 'student' && ws.studentName) {
        await storage.updateSessionStatus(ws.studentName, false);
        broadcastActiveSessions();
      }
      clients.delete(ws);
    });
  });

  function broadcastToAll(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  function broadcastToStudents(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.role === 'student') {
        client.send(messageStr);
      }
    });
  }

  function broadcastToTeachers(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.role === 'teacher') {
        client.send(messageStr);
      }
    });
  }

  async function broadcastActiveSessions() {
    const sessions = await storage.getActiveSessions();
    broadcastToTeachers({
      type: 'activeSessionsUpdate',
      sessions: sessions
    });
  }

  function calculateResults(poll: any, responses: any[]) {
    const optionCounts = poll.options.reduce((acc: any, option: any) => {
      acc[option.id] = 0;
      return acc;
    }, {});

    responses.forEach(response => {
      if (optionCounts.hasOwnProperty(response.selectedOption)) {
        optionCounts[response.selectedOption]++;
      }
    });

    const total = responses.length;
    const results = poll.options.map((option: any) => ({
      ...option,
      count: optionCounts[option.id],
      percentage: total > 0 ? Math.round((optionCounts[option.id] / total) * 100) : 0
    }));

    return {
      poll,
      results,
      totalResponses: total,
      correctAnswer: poll.options.find((opt: any) => opt.isCorrect)
    };
  }

  // REST API endpoints
  app.get("/api/polls", async (req, res) => {
    try {
      const polls = await storage.getAllPolls();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch polls" });
    }
  });

  app.get("/api/polls/active", async (req, res) => {
    try {
      const poll = await storage.getActivePoll();
      res.json(poll || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active poll" });
    }
  });

  app.get("/api/polls/:id/results", async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      const responses = await storage.getResponsesByPollId(pollId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poll results" });
    }
  });

  return httpServer;
}
