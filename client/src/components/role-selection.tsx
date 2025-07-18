import { GraduationCap, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoleSelectionProps {
  onRoleSelect: (role: "teacher" | "student") => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="text-primary" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to the Live Polling System</h2>
        <p className="text-slate-600">Please select the role that best describes you to begin using the live polling system</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student Role Card */}
        <Card 
          className="cursor-pointer group hover:border-primary/30 hover:shadow-lg transition-all"
          onClick={() => onRoleSelect("student")}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <GraduationCap className="text-blue-600 group-hover:text-primary transition-colors" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">I'm a Student</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Submit answers and view live poll results in real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Role Card */}
        <Card 
          className="cursor-pointer group hover:border-primary/30 hover:shadow-lg transition-all"
          onClick={() => onRoleSelect("teacher")}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                <Presentation className="text-purple-600 group-hover:text-secondary transition-colors" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">I'm a Teacher</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Create polls, manage questions, and monitor student responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-slate-500">
          Select your role to continue to the polling interface
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Test Instructions:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>1. First, select "Teacher" role and create a poll using the "Quick Sample" button</p>
            <p>2. Open a new browser tab/window and select "Student" role</p>
            <p>3. Enter your name and participate in the poll</p>
            <p>4. Use the chat feature to communicate between roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
