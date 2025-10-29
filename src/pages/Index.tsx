import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar />

      {/* Main Feed Area - Empty for now */}
      <main className="pt-14 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Feed content will go here */}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
