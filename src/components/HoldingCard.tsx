import { Building2 } from "lucide-react";

interface HoldingCardProps {
  companyName: string;
  companyLogo?: string;
  investmentDate: string;
  investedAmount: number;
}

export const HoldingCard = ({
  companyName,
  companyLogo,
  investmentDate,
  investedAmount,
}: HoldingCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-medium text-sm">{companyName}</h3>
          <span className="text-xs text-muted-foreground">{investmentDate}</span>
        </div>
        <span className="font-medium text-sm">${investedAmount.toLocaleString()}</span>
      </div>
    </div>
  );
};