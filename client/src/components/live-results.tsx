import { Clock, Users, CheckCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PollOption {
  id: string;
  text: string;
  isCorrect: boolean;
  count?: number;
  percentage?: number;
}

interface PollResults {
  poll: {
    id: number;
    question: string;
    options: PollOption[];
  };
  results: Array<PollOption & { count: number; percentage: number }>;
  totalResponses: number;
  correctAnswer: PollOption;
}

interface LiveResultsProps {
  results: PollResults | null;
  userRole: "teacher" | "student" | null;
  onStartNewPoll?: () => void;
  onViewHistory?: () => void;
  responseCount?: number;
}

const optionColors = [
  { bg: 'bg-primary', text: 'text-primary' },
  { bg: 'bg-secondary', text: 'text-secondary' },
  { bg: 'bg-emerald-500', text: 'text-emerald-500' },
  { bg: 'bg-orange-500', text: 'text-orange-500' },
  { bg: 'bg-pink-500', text: 'text-pink-500' },
  { bg: 'bg-cyan-500', text: 'text-cyan-500' },
];

export default function LiveResults({ 
  results, 
  userRole, 
  onStartNewPoll, 
  onViewHistory,
  responseCount = 0 
}: LiveResultsProps) {
  if (!results) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <BarChart3 className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Results Yet</h3>
          <p className="text-slate-600">Results will appear here after a poll ends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm overflow-hidden">
        {/* Results Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Question Results</h3>
              <p className="text-sm text-slate-600">{results.poll.question}</p>
            </div>
            <div className="flex items-center space-x-3">
              {onViewHistory && (
                <Button variant="outline" onClick={onViewHistory}>
                  View Poll History
                </Button>
              )}
              {userRole === "teacher" && (
                <div className="text-sm text-slate-600">
                  Live responses: {responseCount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Content */}
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart Section */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-4">Response Distribution</h4>
              <div className="space-y-4">
                {results.results.map((option, index) => (
                  <div key={option.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 ${optionColors[index]?.bg || 'bg-slate-500'} rounded text-white text-xs font-medium flex items-center justify-center`}>
                          {option.id}
                        </div>
                        <span className="text-sm text-slate-700">{option.text}</span>
                        {option.isCorrect && (
                          <CheckCircle className="text-success" size={16} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {option.percentage}%
                      </span>
                    </div>
                    <Progress 
                      value={option.percentage} 
                      className="h-3"
                      style={{
                        '--progress-background': optionColors[index]?.bg.replace('bg-', '') || 'slate-500'
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-4">Poll Statistics</h4>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Responses</p>
                      <p className="text-lg font-semibold text-slate-900">{results.totalResponses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="text-success" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Correct Answer</p>
                      <p className="text-lg font-semibold text-success">
                        {results.correctAnswer.id} - {results.correctAnswer.text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
                      <Clock className="text-warning" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Accuracy Rate</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {results.totalResponses > 0 
                          ? Math.round((results.results.find(r => r.isCorrect)?.count || 0) / results.totalResponses * 100)
                          : 0
                        }%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {userRole === "teacher" && onStartNewPoll && (
                <Button onClick={onStartNewPoll} className="w-full mt-6">
                  Ask a new question
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
