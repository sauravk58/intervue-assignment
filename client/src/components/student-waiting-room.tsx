import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StudentWaitingRoomProps {
  isConnected: boolean;
  activePoll: any;
  onPollStart: () => void;
}

export default function StudentWaitingRoom({ isConnected, activePoll, onPollStart }: StudentWaitingRoomProps) {
  useEffect(() => {
    if (activePoll) {
      onPollStart();
    }
  }, [activePoll, onPollStart]);

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="text-primary animate-spin" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Wait for the teacher to ask questions..
          </h2>
          <p className="text-slate-600 mb-6">
            You'll be notified when a new poll starts. Stay ready!
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isConnected ? 'Connected and waiting...' : 'Connecting...'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
