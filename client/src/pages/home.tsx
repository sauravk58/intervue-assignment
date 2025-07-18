import { useState } from "react";
import { Vote } from "lucide-react";
import RoleSelection from "@/components/role-selection";
import StudentNameEntry from "@/components/student-name-entry";
import StudentWaitingRoom from "@/components/student-waiting-room";
import TeacherPollCreation from "@/components/teacher-poll-creation";
import ActivePollStudent from "@/components/active-poll-student";
import LiveResults from "@/components/live-results";
import PollHistory from "@/components/poll-history";
import FloatingChat from "@/components/floating-chat";
import { useWebSocket } from "@/hooks/use-websocket";

export type ViewType = 
  | "roleSelection"
  | "studentNameEntry" 
  | "studentWaitingRoom"
  | "teacherPollCreation"
  | "activePollStudent"
  | "liveResults"
  | "pollHistory";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("roleSelection");
  const [userRole, setUserRole] = useState<"teacher" | "student" | null>(null);
  const [studentName, setStudentName] = useState("");
  
  const { 
    isConnected, 
    activePoll, 
    pollResults, 
    activeSessions,
    responseCount,
    chatMessages,
    sendMessage 
  } = useWebSocket(userRole, studentName);

  const handleRoleSelect = (role: "teacher" | "student") => {
    setUserRole(role);
    if (role === "teacher") {
      setCurrentView("teacherPollCreation");
    } else {
      setCurrentView("studentNameEntry");
    }
  };

  const handleStudentNameSubmit = (name: string) => {
    setStudentName(name);
    setCurrentView("studentWaitingRoom");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "roleSelection":
        return <RoleSelection onRoleSelect={handleRoleSelect} />;
      case "studentNameEntry":
        return <StudentNameEntry onSubmit={handleStudentNameSubmit} />;
      case "studentWaitingRoom":
        return (
          <StudentWaitingRoom 
            isConnected={isConnected}
            activePoll={activePoll}
            onPollStart={() => setCurrentView("activePollStudent")}
          />
        );
      case "teacherPollCreation":
        return (
          <TeacherPollCreation 
            onPollCreated={() => setCurrentView("liveResults")}
            sendMessage={sendMessage}
            activeSessions={activeSessions}
            onViewHistory={() => setCurrentView("pollHistory")}
          />
        );
      case "activePollStudent":
        return (
          <ActivePollStudent 
            poll={activePoll}
            onSubmit={(selectedOption) => {
              sendMessage({
                type: 'submitResponse',
                selectedOption
              });
              setCurrentView("liveResults");
            }}
          />
        );
      case "liveResults":
        return (
          <LiveResults 
            results={pollResults}
            userRole={userRole}
            onStartNewPoll={() => setCurrentView("teacherPollCreation")}
            onViewHistory={() => setCurrentView("pollHistory")}
            responseCount={responseCount}
          />
        );
      case "pollHistory":
        return (
          <PollHistory 
            onBack={() => setCurrentView(userRole === "teacher" ? "teacherPollCreation" : "liveResults")}
          />
        );
      default:
        return <RoleSelection onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Vote className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Interactive Vote</h1>
                <p className="text-sm text-slate-500">Real-time polling system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isConnected ? 'Live' : 'Disconnected'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* Floating Chat */}
      <FloatingChat 
        userRole={userRole} 
        userName={userRole === "teacher" ? "Teacher" : studentName} 
        sendMessage={sendMessage}
        messages={chatMessages}
      />
    </div>
  );
}
