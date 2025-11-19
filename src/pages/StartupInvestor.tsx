import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { HoldingCard } from "@/components/HoldingCard";
import { AddInvestmentForm } from "@/components/AddInvestmentForm";
import { toast } from "sonner";

const mockHoldings = [
  {
    id: 1,
    companyName: "TechCorp Inc.",
    investmentDate: "Jan 15, 2024",
    investedAmount: 50000,
  },
  {
    id: 2,
    companyName: "GrowthVentures LLC",
    investmentDate: "Dec 3, 2023",
    investedAmount: 75000,
  },
  {
    id: 3,
    companyName: "Innovation Labs",
    investmentDate: "Nov 22, 2023",
    investedAmount: 100000,
  },
];

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [verifyingHolding, setVerifyingHolding] = useState<{
    companyName: string;
    investmentDate: string;
    investedAmount: number;
  } | null>(null);

  const handleVerify = (data: { companyName: string; investmentDate: string; investedAmount: number }) => {
    setVerifyingHolding(data);
    
    // Simulate verification process
    setTimeout(() => {
      setVerifyingHolding(null);
      toast.success("Investment verified and added to your portfolio");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-2xl">
        <PortfolioHeader />
        
        <main className="px-4 py-6">
          <h2 className="text-base font-medium mb-4">Holdings</h2>

          <div className="space-y-3">
            {mockHoldings.map((holding) => (
              <HoldingCard
                key={holding.id}
                companyName={holding.companyName}
                investmentDate={holding.investmentDate}
                investedAmount={holding.investedAmount}
              />
            ))}
            
            {verifyingHolding && (
              <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium text-sm">{verifyingHolding.companyName}</h3>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Verifying...</span>
                    </div>
                  </div>
                  <span className="font-medium text-sm">${verifyingHolding.investedAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add holdings
          </Button>

          {showAddForm && (
            <div className="mt-3">
              <AddInvestmentForm 
                onClose={() => setShowAddForm(false)} 
                onVerify={handleVerify}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;