import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PortfolioHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-secondary"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold">Portfolio</h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>
    </header>
  );
};