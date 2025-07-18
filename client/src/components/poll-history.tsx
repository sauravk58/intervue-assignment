import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface PollHistoryProps {
  onBack: () => void;
}

export default function PollHistory({ onBack }: PollHistoryProps) {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['/api/polls'],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-slate-800">Poll History</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600 mt-2">Loading poll history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Poll History</h2>
      </div>

      {!polls || polls.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Polls Yet</h3>
            <p className="text-slate-600">Your poll history will appear here once you create some polls</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {polls.map((poll: any, index: number) => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{poll.options?.length || 0} options</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 mb-4">{poll.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {poll.options?.map((option: any, optIndex: number) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border ${
                        option.isCorrect 
                          ? 'bg-success/10 border-success/30 text-success' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{option.id}:</span> {option.text}
                      {option.isCorrect && <span className="ml-2 text-xs">✓ Correct</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
