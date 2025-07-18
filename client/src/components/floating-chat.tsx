import { useState, useEffect } from "react";
import { MessageCircle, Send, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  role: 'teacher' | 'student';
}

interface FloatingChatProps {
  userRole?: 'teacher' | 'student' | null;
  userName?: string;
  sendMessage?: (message: any) => void;
  messages?: Message[];
}

export default function FloatingChat({ userRole, userName, sendMessage, messages = [] }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userRole || !userName) return;

    const messageData = {
      type: 'chatMessage',
      sender: userName,
      message: newMessage.trim(),
      role: userRole,
      timestamp: new Date()
    };

    if (sendMessage) {
      sendMessage(messageData);
    }

    // Add to local messages immediately for better UX
    const localMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      message: newMessage.trim(),
      timestamp: new Date(),
      role: userRole
    };

    setChatMessages(prev => [...prev, localMessage]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 flex flex-col">
          <CardHeader className="border-b border-slate-200 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users size={20} />
                <span>Live Chat</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8">
                <MessageCircle className="mx-auto mb-2" size={32} />
                <p>No messages yet</p>
                <p>Start the conversation!</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === userName ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2 rounded-lg ${
                    msg.sender === userName 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">
                        {msg.sender}
                      </span>
                      <span className={`text-xs px-1 py-0.5 rounded ${
                        msg.role === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      } ${msg.sender === userName ? 'bg-white/20 text-white' : ''}`}>
                        {msg.role === 'teacher' ? 'Teacher' : 'Student'}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === userName ? 'text-white/70' : 'text-slate-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-slate-200 p-4">
            {userRole && userName ? (
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                  <Send size={16} />
                </Button>
              </form>
            ) : (
              <div className="text-center text-slate-500 text-sm py-2">
                <p>Please select a role to start chatting</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40"
        size="icon"
      >
        <MessageCircle size={24} />
      </Button>
    </>
  );
}
