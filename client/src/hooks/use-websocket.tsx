import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface PollOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  duration: number;
  isActive: boolean;
}

interface PollResults {
  poll: Poll;
  results: Array<PollOption & { count: number; percentage: number }>;
  totalResponses: number;
  correctAnswer: PollOption;
}

interface Session {
  id: number;
  studentName: string;
  isActive: boolean;
}

export function useWebSocket(userRole: "teacher" | "student" | null, studentName: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [responseCount, setResponseCount] = useState(0);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userRole) return;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        
        // Join with role
        ws.send(JSON.stringify({
          type: 'join',
          role: userRole,
          studentName: userRole === 'student' ? studentName : undefined
        }));

        toast({
          title: "Connected",
          description: "Successfully connected to the polling system",
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'pollStarted':
              setActivePoll(data.poll);
              setPollResults(null);
              setResponseCount(0);
              if (userRole === 'student') {
                toast({
                  title: "New Poll Started",
                  description: "A new question is available!",
                });
              }
              break;
              
            case 'pollEnded':
              setActivePoll(null);
              setPollResults(data.results);
              toast({
                title: "Poll Ended",
                description: "View the results now",
              });
              break;
              
            case 'responseSubmitted':
              toast({
                title: "Answer Submitted",
                description: "Your response has been recorded",
              });
              break;
              
            case 'responseUpdate':
              setResponseCount(data.responseCount);
              break;
              
            case 'activeSessionsUpdate':
              setActiveSessions(data.sessions);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        
        toast({
          variant: "destructive",
          title: "Connection Lost",
          description: "Attempting to reconnect...",
        });

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [userRole, studentName]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    activePoll,
    pollResults,
    activeSessions,
    responseCount,
    sendMessage,
  };
}
