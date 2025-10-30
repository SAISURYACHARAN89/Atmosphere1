import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import StartupPost from "@/components/StartupPost";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockStartups = [
  {
    name: "Airbound.co",
    logo: "/placeholder.svg",
    tagline: "Revolutionary drone delivery for urban logistics",
    preValuation: "$5M",
    postValuation: "$12M",
    fundsRaised: "$2M",
    currentInvestors: ["Y Combinator", "Sequoia", "a16z"],
    lookingToDilute: true,
    dilutionAmount: "15% for $3M",
    fundingGoal: "$3M Series A",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    postedTime: "2 hr"
  },
  {
    name: "Skyt Air",
    logo: "/placeholder.svg",
    tagline: "AI-powered air traffic management system",
    preValuation: "$8M",
    postValuation: "$18M",
    fundsRaised: "$4M",
    currentInvestors: ["Techstars", "500 Startups"],
    lookingToDilute: true,
    dilutionAmount: "20% for $5M",
    fundingGoal: "$5M Series A",
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    postedTime: "4 hr"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar />

      {/* Main Feed Area */}
      <main className="pt-14 pb-16 min-h-screen">
        <ScrollArea className="h-screen">
          <div className="max-w-2xl mx-auto px-4 py-4">
            {mockStartups.map((startup, index) => (
              <StartupPost key={index} company={startup} />
            ))}
          </div>
        </ScrollArea>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
