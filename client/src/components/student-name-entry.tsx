import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface StudentNameEntryProps {
  onSubmit: (name: string) => void;
}

export default function StudentNameEntry({ onSubmit }: StudentNameEntryProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Store name in localStorage for persistence
      localStorage.setItem('studentName', name.trim());
      onSubmit(name.trim());
    }
  };

  // Load name from localStorage on mount
  useState(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      setName(savedName);
    }
  });

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Let's Get Started</h2>
            <p className="text-slate-600">
              If you're a student, you'll be able to <strong>submit your answers</strong>, 
              participate in live polls, and see how your responses compare with your classmates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="studentName" className="text-sm font-medium text-slate-700">
                Enter your Name
              </Label>
              <Input
                id="studentName"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!name.trim()}
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
