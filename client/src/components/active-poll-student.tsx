import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
}

interface ActivePollStudentProps {
  poll: Poll | null;
  onSubmit: (selectedOption: string) => void;
}

const optionColors = [
  { bg: 'bg-primary', borderColor: 'border-primary/30', hoverBg: 'hover:bg-primary/5', focusRing: 'focus:ring-primary' },
  { bg: 'bg-secondary', borderColor: 'border-secondary/30', hoverBg: 'hover:bg-secondary/5', focusRing: 'focus:ring-secondary' },
  { bg: 'bg-emerald-500', borderColor: 'border-emerald-500/30', hoverBg: 'hover:bg-emerald-50', focusRing: 'focus:ring-emerald-500' },
  { bg: 'bg-orange-500', borderColor: 'border-orange-500/30', hoverBg: 'hover:bg-orange-50', focusRing: 'focus:ring-orange-500' },
  { bg: 'bg-pink-500', borderColor: 'border-pink-500/30', hoverBg: 'hover:bg-pink-50', focusRing: 'focus:ring-pink-500' },
  { bg: 'bg-cyan-500', borderColor: 'border-cyan-500/30', hoverBg: 'hover:bg-cyan-50', focusRing: 'focus:ring-cyan-500' },
];

export default function ActivePollStudent({ poll, onSubmit }: ActivePollStudentProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!poll) return;
    
    setTimeLeft(poll.duration);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  if (!poll) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm overflow-hidden">
        {/* Poll Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-600">Question 1</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Live</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-warning" size={16} />
              <span className="text-sm font-medium text-warning">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Poll Content */}
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            {poll.question}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="space-y-3">
                {poll.options.map((option, index) => (
                  <Label
                    key={option.id}
                    className={`flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer transition-all group ${
                      optionColors[index]?.hoverBg || 'hover:bg-slate-50'
                    } ${
                      selectedOption === option.id 
                        ? `${optionColors[index]?.borderColor || 'border-slate-300'} ${optionColors[index]?.hoverBg || 'bg-slate-50'}` 
                        : ''
                    }`}
                    htmlFor={`option-${option.id}`}
                  >
                    <RadioGroupItem 
                      value={option.id} 
                      id={`option-${option.id}`}
                      className={`w-5 h-5 ${optionColors[index]?.focusRing || 'focus:ring-slate-500'}`}
                    />
                    <div className="ml-4 flex items-center space-x-3">
                      <div className={`w-8 h-8 ${optionColors[index]?.bg || 'bg-slate-500'} rounded-lg flex items-center justify-center text-white text-sm font-medium group-hover:opacity-80 transition-opacity`}>
                        {option.id}
                      </div>
                      <span className="text-slate-700 font-medium">{option.text}</span>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={!selectedOption || timeLeft === 0}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
