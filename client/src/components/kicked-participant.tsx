import { XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface KickedParticipantProps {
  onRejoin: () => void;
}

export function KickedParticipant({ onRejoin }: KickedParticipantProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              You've Been Removed
            </h2>
            <p className="text-gray-600">
              The teacher has removed you from this polling session.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={onRejoin}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try to Rejoin
            </Button>
            
            <div className="text-sm text-gray-500">
              Contact your teacher if you believe this was an error.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}