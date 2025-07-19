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

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  role: 'teacher' | 'student';
}

export function useWebSocket(userRole: "teacher" | "student" | null, studentName: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [responseCount, setResponseCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userRole) return;

    const connect = () => {
      const wsUrl = import.meta.env.VITE_WS_URL;
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
              setHasSubmitted(false);
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
              setHasSubmitted(true);
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
              
            case 'chatMessage':
              const newMessage: ChatMessage = {
                id: Date.now().toString(),
                sender: data.sender,
                message: data.message,
                timestamp: new Date(data.timestamp),
                role: data.role
              };
              setChatMessages(prev => [...prev, newMessage]);
              break;
              
            case 'kicked':
              if (userRole === 'student') {
                setIsKicked(true);
                toast({
                  title: "You have been removed",
                  description: "The teacher has removed you from the session.",
                  variant: "destructive",
                });
              }
              break;
              
            case 'liveResults':
              setPollResults(data.results);
              setResponseCount(data.results.totalResponses);
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

  const sendChatMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'chatMessage',
        message: message,
        sender: userRole === 'teacher' ? 'Teacher' : studentName,
        role: userRole
      }));
    }
  };

  const kickParticipant = (participantName: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && userRole === 'teacher') {
      socket.send(JSON.stringify({
        type: 'kickParticipant',
        studentName: participantName
      }));
    }
  };

  const rejoinSession = () => {
    setIsKicked(false);
    // Reconnect the WebSocket
    if (socket) {
      socket.close();
    }
  };

  return {
    isConnected,
    activePoll,
    pollResults,
    activeSessions,
    responseCount,
    chatMessages,
    hasSubmitted,
    isKicked,
    sendMessage,
    sendChatMessage,
    kickParticipant,
    rejoinSession,
  };
}
