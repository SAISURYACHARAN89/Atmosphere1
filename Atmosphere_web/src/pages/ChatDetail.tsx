import { ArrowLeft, Send, Plus, Image as ImageIcon, Smile } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  image?: string;
  senderName?: string;
  senderAvatar?: string;
  fileType?: "image" | "video" | "document";
  fileName?: string;
}

interface Contact {
  id: string;
  name: string;
  type: "user" | "group";
  members?: number;
}

const ChatDetail = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Dummy contacts data
  const contacts: Record<string, Contact> = {
    "1": { id: "1", name: "Aditya chowdary", type: "user" },
    "2": { id: "2", name: "Ramesh paul", type: "user" },
    "3": { id: "3", name: "Priya Sharma", type: "user" },
    "4": { id: "4", name: "Vikram Singh", type: "user" },
    "5": { id: "5", name: "Ananya Desai", type: "user" },
    "6": { id: "6", name: "Karthik Reddy", type: "user" },
    "7": { id: "7", name: "Neha Gupta", type: "user" },
    "g1": { id: "g1", name: "Startup Founders Network", type: "group", members: 156 },
    "g2": { id: "g2", name: "Tech Investors Hub", type: "group", members: 89 },
    "g3": { id: "g3", name: "AI & ML Enthusiasts", type: "group", members: 234 },
  };

  const contact = contacts[chatId || "1"];
  const isGroupChat = contact?.type === "group";

  // Initialize with dummy messages
  useState(() => {
    const dummyMessages: ChatMessage[] = isGroupChat ? [
      {
        id: 1,
        text: "Hey everyone! Excited about the upcoming pitch day!",
        sender: "them",
        timestamp: "10:30 AM",
        senderName: "Priya Sharma",
        senderAvatar: "PS",
      },
      {
        id: 2,
        text: "Same here! I've been working on my deck all week.",
        sender: "them",
        timestamp: "10:32 AM",
        senderName: "Vikram Singh",
        senderAvatar: "VS",
      },
      {
        id: 3,
        text: "Count me in! What time does it start?",
        sender: "me",
        timestamp: "10:35 AM",
      },
      {
        id: 4,
        text: "It starts at 2 PM sharp. Make sure to arrive 15 mins early!",
        sender: "them",
        timestamp: "10:38 AM",
        senderName: "Ananya Desai",
        senderAvatar: "AD",
      },
    ] : [
      {
        id: 1,
        text: "Hey! How are you doing?",
        sender: "them",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        text: "I'm doing great! Thanks for asking. How about you?",
        sender: "me",
        timestamp: "10:32 AM",
      },
      {
        id: 3,
        text: "Would love to discuss the new startup opportunity",
        sender: "them",
        timestamp: "10:35 AM",
      },
      {
        id: 4,
        text: "Absolutely! Let's schedule a call this week.",
        sender: "me",
        timestamp: "10:38 AM",
      },
    ];
    setChatMessages(dummyMessages);
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");

    // Simulate response after 1 second
    setTimeout(() => {
      const responses = [
        "That sounds interesting!",
        "I agree with you on that.",
        "Let me think about it.",
        "Great idea!",
        "When can we discuss this further?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const groupNames = ["Priya Sharma", "Vikram Singh", "Ananya Desai", "Karthik Reddy"];
      const randomName = groupNames[Math.floor(Math.random() * groupNames.length)];
      
      const responseMessage: ChatMessage = {
        id: chatMessages.length + 2,
        text: randomResponse,
        sender: "them",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        ...(isGroupChat && {
          senderName: randomName,
          senderAvatar: randomName.split(' ').map(n => n[0]).join(''),
        }),
      };
      setChatMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageMessage: ChatMessage = {
        id: chatMessages.length + 1,
        text: "",
        sender: "me",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        image: event.target?.result as string,
      };
      setChatMessages([...chatMessages, imageMessage]);
    };
    reader.readAsDataURL(file);
  };
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Max allowed size is 50MB.",
      variant: "destructive",
    });
    return;
  }

  let fileType: "image" | "video" | "document" = "document";

  if (file.type.startsWith("image/")) fileType = "image";
  else if (file.type.startsWith("video/")) fileType = "video";

  const fileURL =
    fileType === "video"
      ? URL.createObjectURL(file) + "#t=0.1"
      : URL.createObjectURL(file);

  const fileMessage: ChatMessage = {
    id: chatMessages.length + 1,
    sender: "me",
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    image: fileURL,
    fileType,
    fileName: file.name,
  };

  setChatMessages((prev) => [...prev, fileMessage]);
};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border/50 z-50">
        <div className="max-w-2xl mx-auto flex items-center px-4 h-14">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {contact?.name?.charAt(0) || "?"}
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-base font-semibold">{contact?.name || "Unknown"}</h1>
              {contact?.type === "group" && (
                <p className="text-xs text-muted-foreground">
                  {contact.members} members
                </p>
              )}
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Messages */}
       <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">

          {chatMessages.map((message, index) => {
            const showSenderInfo =
              isGroupChat &&
              message.sender === "them" &&
              (index === 0 ||
                chatMessages[index - 1].senderName !== message.senderName);

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col gap-1 max-w-[75%] ${
                    message.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Group avatar */}
                  {isGroupChat &&
                    message.sender === "them" &&
                    showSenderInfo && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {message.senderAvatar}
                        </span>
                      </div>
                    )}

                  {/* MEDIA MESSAGE */}
                  {message.fileType === "image" && (
                    <img
                      src={message.image}
                      className="rounded-xl max-w-full"
                    />
                  )}

                  {message.fileType === "video" && (
                    <video
                      src={message.image}
                      controls
                      playsInline
                      preload="metadata"
                      className="rounded-xl max-w-full"
                      onLoadedMetadata={(e) => {
                        // Fix iOS / Chrome issues
                        (e.target as HTMLVideoElement).currentTime = 0;
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}


                  {message.fileType === "document" && (
                    <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-3 text-white">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        📄
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{message.fileName}</p>
                        <p className="text-[10px] text-muted-foreground">Tap to download</p>
                      </div>
                    </div>
                  )}

                  {/* TEXT MESSAGE */}
                  {message.text && (
                    <div
                      className={`rounded-[18px] px-4 py-2.5 ${
                        message.sender === "me"
                          ? "bg-[#1FADFF] text-white"
                          : "bg-[#3B3B3B] text-white"
                      }`}
                    >
                      <div className="flex items-end justify-between gap-3">
                        <p className="text-[15px] leading-[1.4] flex-1">
                          {message.text}
                        </p>
                        <span className="text-[10px] opacity-70">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 pb-safe">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*,.pdf,.ppt,.pptx,.doc,.docx,.txt"
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="pr-10 rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="flex-shrink-0 rounded-full"
              disabled={!messageText.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
