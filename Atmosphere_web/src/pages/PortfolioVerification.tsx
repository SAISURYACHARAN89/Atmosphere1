import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PortfolioVerification = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"form" | "upload">("form");
  const [investmentData, setInvestmentData] = useState({
    companyName: "",
    ownership: "",
    amount: "",
    date: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFormNext = () => {
    if (!investmentData.companyName || !investmentData.ownership || !investmentData.amount || !investmentData.date) {
      toast.error("Please fill all fields");
      return;
    }
    setView("upload");
  };

  const handleFinalSubmit = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }
    localStorage.setItem("profileSetupComplete", "true");
    toast.success("Investment submitted for verification");
    navigate("/profile");
  };

  const handleBack = () => {
    if (view === "upload") {
      setView("form");
    } else {
      navigate("/kyc-verification");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-sm font-medium text-foreground">
            {view === "form" ? "Investment Details" : "Upload Proof"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Add at least one investment
          </p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {view === "form" && (
            <>
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">Investment Information</h2>
                <p className="text-sm text-muted-foreground">
                  Provide details about your investment
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm">Company Name</Label>
                  <Input
                    id="company"
                    value={investmentData.companyName}
                    onChange={(e) => setInvestmentData({...investmentData, companyName: e.target.value})}
                    placeholder="Enter company name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership" className="text-sm">Ownership %</Label>
                  <Input
                    id="ownership"
                    type="number"
                    value={investmentData.ownership}
                    onChange={(e) => setInvestmentData({...investmentData, ownership: e.target.value})}
                    placeholder="e.g., 5"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm">Investment Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={investmentData.amount}
                    onChange={(e) => setInvestmentData({...investmentData, amount: e.target.value})}
                    placeholder="e.g., 50000"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm">Investment Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={investmentData.date}
                    onChange={(e) => setInvestmentData({...investmentData, date: e.target.value})}
                    className="h-11"
                  />
                </div>
              </div>
            </>
          )}

          {view === "upload" && (
            <>
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">Supporting Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Upload proof of your investment
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="doc-upload"
                />
                <label 
                  htmlFor="doc-upload" 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-foreground/30 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Choose files"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or PDF
                  </p>
                </label>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>• Investment agreement or contract</p>
                  <p>• Bank transfer proof</p>
                  <p>• Cap table or equity certificate</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    Documents will be manually verified within 24-48 hours. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border/50">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={view === "form" ? handleFormNext : handleFinalSubmit}
            className="w-full"
          >
            {view === "form" ? "Next" : "Submit for Verification"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioVerification;