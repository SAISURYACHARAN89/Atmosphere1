import { User } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

type TabType = "all" | "groups";

interface Message {
  id: number;
  name: string;
  preview: string;
}

interface Group {
  id: number;
  name: string;
  members: number;
  lastMessage: string;
}

const Messages = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

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
    {
      id: 3,
      name: "Priya Sharma",
      preview: "Looking forward to our meeting tomorrow...",
    },
    {
      id: 4,
      name: "Vikram Singh",
      preview: "The pitch deck looks great! Just a few suggestions...",
    },
    {
      id: 5,
      name: "Ananya Desai",
      preview: "Can we schedule a call this week?",
    },
    {
      id: 6,
      name: "Karthik Reddy",
      preview: "Thanks for the introduction! Would love to connect...",
    },
    {
      id: 7,
      name: "Neha Gupta",
      preview: "Your startup idea is really innovative...",
    },
  ];

  const groups: Group[] = [
    {
      id: 1,
      name: "Startup Founders Network",
      members: 156,
      lastMessage: "New funding opportunities available",
    },
    {
      id: 2,
      name: "Tech Investors Hub",
      members: 89,
      lastMessage: "Monthly meetup scheduled for next week",
    },
    {
      id: 3,
      name: "AI & ML Enthusiasts",
      members: 234,
      lastMessage: "Check out this new research paper",
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
            onClick={() => setActiveTab("groups")}
            className="flex-1 py-3 text-center relative"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "groups" ? "text-foreground" : "text-muted-foreground"
            }`}>
              Groups
            </span>
            {activeTab === "groups" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          {activeTab === "all" ? (
            // All Mail View
            <>
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
            </>
          ) : (
            // Groups View
            <div className="px-4">
              {/* Create/Join Group Button */}
              <button className="w-full mb-4 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Create or Join Group
              </button>

              {/* Groups List */}
              {groups.map((group, index) => (
                <div key={group.id}>
                  <button className="w-full py-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left rounded-lg">
                    {/* Group Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" strokeWidth={2} />
                    </div>

                    {/* Group Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        {group.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {group.members} members
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {group.lastMessage}
                      </p>
                    </div>
                  </button>

                  {/* Separator - only show if not last item */}
                  {index < groups.length - 1 && (
                    <div className="h-px bg-border my-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Messages;
