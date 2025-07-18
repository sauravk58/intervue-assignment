import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Users, X, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  role: 'teacher' | 'student';
}

interface Session {
  id: number;
  studentName: string;
  isActive: boolean;
}

interface EnhancedChatProps {
  messages: ChatMessage[];
  participants: Session[];
  userRole: "teacher" | "student";
  studentName: string;
  onSendMessage: (message: string) => void;
  onKickParticipant?: (studentName: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function EnhancedChat({
  messages,
  participants,
  userRole,
  studentName,
  onSendMessage,
  onKickParticipant,
  isOpen,
  onToggle
}: EnhancedChatProps) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKick = (participantName: string) => {
    if (onKickParticipant) {
      onKickParticipant(participantName);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-lg">
        <CardHeader className="p-4 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-blue-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-80">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Participants
                <Badge variant="secondary" className="ml-1">
                  {participants.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === userRole ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.role === userRole
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {msg.role !== userRole && (
                        <div className="text-xs font-semibold mb-1 text-gray-600">
                          {msg.sender}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    maxLength={200}
                  />
                  <Button type="submit" size="sm" disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="participants" className="flex-1 m-0">
              <div className="p-4 space-y-3 bg-gray-50 h-full overflow-y-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{participant.studentName}</div>
                        <div className="text-xs text-gray-500">
                          {participant.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                    {userRole === 'teacher' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleKick(participant.studentName)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {participants.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No participants yet
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}