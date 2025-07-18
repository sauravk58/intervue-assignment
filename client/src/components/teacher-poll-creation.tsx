import { useState } from "react";
import { Clock, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TeacherPollCreationProps {
  onPollCreated: () => void;
  sendMessage: (message: any) => void;
  activeSessions: Array<{ studentName: string; isActive: boolean }>;
  onViewHistory: () => void;
}

interface PollOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const optionColors = [
  { bg: 'bg-primary', label: 'A' },
  { bg: 'bg-secondary', label: 'B' },
  { bg: 'bg-emerald-500', label: 'C' },
  { bg: 'bg-orange-500', label: 'D' },
  { bg: 'bg-pink-500', label: 'E' },
  { bg: 'bg-cyan-500', label: 'F' },
];

export default function TeacherPollCreation({ 
  onPollCreated, 
  sendMessage, 
  activeSessions,
  onViewHistory 
}: TeacherPollCreationProps) {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState("60");
  const [options, setOptions] = useState<PollOption[]>([
    { id: 'A', text: '', isCorrect: false },
    { id: 'B', text: '', isCorrect: false },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const addOption = () => {
    if (options.length < 6) {
      const nextId = optionColors[options.length].label;
      setOptions([...options, { id: nextId, text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // Reset correct answer if it was the removed option
      if (correctAnswer === options[index].id) {
        setCorrectAnswer("");
      }
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || options.some(opt => !opt.text.trim()) || !correctAnswer) {
      return;
    }

    const finalOptions = options.map(opt => ({
      ...opt,
      isCorrect: opt.id === correctAnswer
    }));

    sendMessage({
      type: 'createPoll',
      poll: {
        question: question.trim(),
        options: finalOptions,
        duration: parseInt(duration)
      }
    });

    onPollCreated();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Create a New Poll</h2>
              <p className="text-slate-600">
                Create and manage polls, ask questions, and monitor your students' responses in real-time.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onViewHistory}>
                <History size={16} className="mr-2" />
                Poll History
              </Button>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-1">
                  <Clock size={16} />
                  <span>Timer Duration</span>
                </div>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="90">90 seconds</SelectItem>
                    <SelectItem value="120">120 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="question" className="text-sm font-medium text-slate-700">
                Enter your question
              </Label>
              <div className="relative mt-2">
                <Input
                  id="question"
                  type="text"
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={200}
                  required
                />
                <div className="absolute right-3 top-3 text-xs text-slate-400">
                  {question.length}/200
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-slate-700">Edit Options</Label>
                <div className="text-sm text-slate-600">Mark the correct answer</div>
              </div>

              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${optionColors[index].bg} rounded-lg flex items-center justify-center text-white text-sm font-medium`}>
                        {option.id}
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter option text"
                        value={option.text}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1"
                        required
                      />
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`correct-${option.id}`} />
                          <Label htmlFor={`correct-${option.id}`} className="text-sm text-slate-600">
                            Correct
                          </Label>
                        </div>
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {options.length < 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addOption}
                  className="mt-4 text-primary hover:text-primary/80"
                >
                  <Plus size={16} className="mr-2" />
                  Add More Options
                </Button>
              )}
            </div>

            {activeSessions.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Connected Students ({activeSessions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeSessions.map((session, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white rounded-md text-xs text-slate-600 border"
                    >
                      {session.studentName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg"
                disabled={!question.trim() || options.some(opt => !opt.text.trim()) || !correctAnswer}
              >
                Ask Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
