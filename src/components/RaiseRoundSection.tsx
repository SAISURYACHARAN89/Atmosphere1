import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const RaiseRoundSection = () => {
  return (
    <div className="py-4">
      <Button 
        variant="outline" 
        className="w-full border-border hover:bg-accent justify-between text-base"
      >
        <span>TRADE</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default RaiseRoundSection;