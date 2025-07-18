import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface KickedOutProps {
  onRetry: () => void;
}

export default function KickedOut({ onRetry }: KickedOutProps) {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            You've been Kicked out !
          </h2>
          <p className="text-slate-600 mb-6">
            Looks like the teacher had removed you from the poll system. Please try again sometime.
          </p>
          
          <Button onClick={onRetry} className="w-full">
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}