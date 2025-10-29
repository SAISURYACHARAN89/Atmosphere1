import { User } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

type TabType = "all" | "investors" | "startups";

interface Message {
  id: number;
  name: string;
  preview: string;
}

const Messages = () => {
  const [activeTab, setActiveTab] = useState<TabType>("startups");

  const messages: Message[] = [
    {
      id: 1,
      name: "Aditya chowdary",
      preview: "Hey mr rajesh, would love to talk to you about...",
    },
    {
      id: 2,
      name: "Ramesh paul",
      preview: "Hey mr rajesh, would love to talk to you about...",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      {/* Tabs */}
      <div className="fixed top-14 left-0 right-0 bg-background border-b border-border z-40">
        <div className="max-w-2xl mx-auto flex items-center px-4">
          <button
            onClick={() => setActiveTab("all")}
            className="flex-1 py-3 text-center relative"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "all" ? "text-foreground" : "text-muted-foreground"
            }`}>
              All mail
            </span>
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("investors")}
            className="flex-1 py-3 text-center relative"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "investors" ? "text-foreground" : "text-muted-foreground"
            }`}>
              Investors
            </span>
            {activeTab === "investors" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("startups")}
            className="flex-1 py-3 text-center relative"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "startups" ? "text-foreground" : "text-muted-foreground"
            }`}>
              Startups
            </span>
            {activeTab === "startups" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Messages List */}
      <main className="pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <div key={message.id}>
              <button className="w-full px-4 py-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-success/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-success" strokeWidth={2} />
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {message.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.preview}
                  </p>
                </div>
              </button>

              {/* Separator - only show if not last item */}
              {index < messages.length - 1 && (
                <div className="mx-4">
                  <div className="h-px bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Messages;
