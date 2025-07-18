import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingChat() {
  const handleChatClick = () => {
    // Placeholder for chat functionality
    console.log("Chat clicked - implement chat modal or window");
  };

  return (
    <Button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40"
      size="icon"
    >
      <MessageCircle size={24} />
    </Button>
  );
}
