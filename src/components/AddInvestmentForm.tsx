import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddInvestmentFormProps {
  onClose: () => void;
  onVerify: (data: { companyName: string; investmentDate: string; investedAmount: number }) => void;
}

export const AddInvestmentForm = ({ onClose, onVerify }: AddInvestmentFormProps) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyId: "",
    investmentDate: "",
    amount: "",
  });
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.companyId || !formData.investmentDate || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Format the date to match existing holdings
    const dateObj = new Date(formData.investmentDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    onVerify({
      companyName: formData.companyName,
      investmentDate: formattedDate,
      investedAmount: parseFloat(formData.amount),
    });
    onClose();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-xs text-muted-foreground">
            Company Full Legal Name
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="bg-background border-input"
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyId" className="text-xs text-muted-foreground">
            Company ID
          </Label>
          <Input
            id="companyId"
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            className="bg-background border-input"
            placeholder="Enter company ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentDate" className="text-xs text-muted-foreground">
            Date of Investment
          </Label>
          <Input
            id="investmentDate"
            type="date"
            value={formData.investmentDate}
            onChange={(e) => setFormData({ ...formData, investmentDate: e.target.value })}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs text-muted-foreground">
            Amount Invested (USD)
          </Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-background border-input"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Upload Documents</Label>
          <div className="relative">
            <Input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx"
            />
            <div className="bg-background border border-input rounded-md p-3 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors">
              <span className="text-sm text-muted-foreground">
                {fileName || "Choose file"}
              </span>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            <Check className="h-4 w-4 mr-2" />
            Verify
          </Button>
        </div>
      </form>
    </div>
  );
};