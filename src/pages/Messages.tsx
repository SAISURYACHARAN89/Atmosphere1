import { User, Search, MessageCircle } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

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
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          {/* Profile Icon */}
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
            <User className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          </button>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hover:opacity-70">
              <Search className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>

            {/* Messages with notification badge */}
            <button className="relative hover:opacity-70">
              <MessageCircle className="w-6 h-6 text-accent fill-accent" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="fixed top-14 left-0 right-0 bg-background border-b border-border z-40">
        <div className="max-w-2xl mx-auto flex items-center px-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              activeTab === "all" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            All mail
          </button>
          <button
            onClick={() => setActiveTab("investors")}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              activeTab === "investors" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setActiveTab("startups")}
            className={`flex-1 py-3 text-center font-semibold rounded-full transition-colors ${
              activeTab === "startups"
                ? "text-foreground bg-muted"
                : "text-muted-foreground"
            }`}
          >
            Startups
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
