import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Round {
  id: number;
  amount: string;
  investor: string;
}

const FinancialProfileSection = () => {
  const { toast } = useToast();
  const [revenueType, setRevenueType] = useState<string>("");
  const [fundingType, setFundingType] = useState<"bootstrapped" | "capital-raised" | null>(null);
  const [rounds, setRounds] = useState<Round[]>([{ id: 1, amount: "", investor: "" }]);

  const addRound = () => {
    const newRoundId = rounds.length + 1;
    setRounds([...rounds, { id: newRoundId, amount: "", investor: "" }]);
  };

  const removeRound = (id: number) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter(round => round.id !== id));
    }
  };

  const updateRound = (id: number, field: 'amount' | 'investor', value: string) => {
    setRounds(rounds.map(round => 
      round.id === id ? { ...round, [field]: value } : round
    ));
  };

  const handleSave = () => {
    toast({
      title: "Financials saved",
      description: "Financial profile has been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Revenue
        </label>
        <Select onValueChange={setRevenueType}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Select revenue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
            <SelectItem value="revenue-generating">Revenue generating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button
          variant={fundingType === "bootstrapped" ? "secondary" : "outline"}
          className="flex-1 border-border"
          onClick={() => setFundingType("bootstrapped")}
        >
          Boot strapped
        </Button>
        <Button
          variant={fundingType === "capital-raised" ? "secondary" : "outline"}
          className="flex-1 border-border"
          onClick={() => setFundingType("capital-raised")}
        >
          Capital raised
        </Button>
      </div>

      {fundingType === "capital-raised" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {rounds.map((round, index) => (
            <div key={round.id} className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Round {round.id}</label>
                {rounds.length > 1 && (
                  <button
                    onClick={() => removeRound(round.id)}
                    className="p-1 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center border border-border rounded-md bg-input">
                <span className="px-3 text-muted-foreground">$</span>
                <Input 
                  type="number"
                  placeholder="200000"
                  value={round.amount}
                  onChange={(e) => updateRound(round.id, 'amount', e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <span className="px-3 text-muted-foreground">USD</span>
              </div>

              <Input 
                placeholder="Investor/Grant name"
                value={round.investor}
                onChange={(e) => updateRound(round.id, 'investor', e.target.value)}
                className="bg-input border-border"
              />
            </div>
          ))}

          <Button
            onClick={addRound}
            variant="outline"
            className="w-full border-border"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Round
          </Button>
        </div>
      )}

      <div className="pt-4">
        <Button 
          onClick={handleSave}
          variant="secondary"
          className="w-full"
        >
          Save Financials
        </Button>
      </div>
    </div>
  );
};

export default FinancialProfileSection;