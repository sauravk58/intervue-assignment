import { useState } from "react";
import { Eye, Plus, History, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface TeacherLiveMonitoringProps {
  pollResults: PollResults | null;
  activeSessions: Session[];
  onCreateNewPoll: () => void;
  onViewHistory: () => void;
  onToggleChat: () => void;
  totalResponses: number;
}

const optionColors = [
  { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-800' },
];

export function TeacherLiveMonitoring({
  pollResults,
  activeSessions,
  onCreateNewPoll,
  onViewHistory,
  onToggleChat,
  totalResponses
}: TeacherLiveMonitoringProps) {
  if (!pollResults) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">Live Poll Results</h2>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {totalResponses} responses
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onToggleChat}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat & Participants
          </Button>
          <Button variant="outline" onClick={onViewHistory}>
            <History className="w-4 h-4 mr-2" />
            View Poll History
          </Button>
        </div>
      </div>

      {/* Poll Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Question: {pollResults.poll.question}</span>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">
                {activeSessions.length} participants
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pollResults.results.map((result, index) => (
              <div key={result.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${optionColors[index]?.bg || 'bg-slate-500'} rounded-lg flex items-center justify-center text-white text-sm font-medium`}>
                      {result.id}
                    </div>
                    <span className="font-medium text-slate-800">{result.text}</span>
                    {result.isCorrect && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Correct
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-600">
                      {result.count} votes
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {result.percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200">
                  <div 
                    className={`h-full transition-all duration-500 ${optionColors[index]?.bg || 'bg-slate-500'}`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Active Participants</span>
              <Badge variant="secondary">{activeSessions.length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">{session.studentName}</div>
                  <div className="text-xs text-slate-500">
                    {session.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {activeSessions.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No active participants yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ask New Question Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onCreateNewPoll}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ask new question
        </Button>
      </div>
    </div>
  );
}