import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText, Camera, User, Upload, Clock, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerificationFlowProps {
  type: "kyc" | "portfolio" | "company";
  onComplete: () => void;
}

export const VerificationFlow = ({ type, onComplete }: VerificationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [portfolioView, setPortfolioView] = useState<"list" | "form" | "upload">("list");
  const [investmentData, setInvestmentData] = useState({
    companyName: "",
    investmentPercentage: "",
    investmentAmount: "",
    investmentDate: ""
  });
  const totalSteps = type === "portfolio" ? 1 : 3;

  // Dummy portfolio data
  const dummyInvestments = [
    { company: "TechStart Inc.", percentage: "15%", date: "Jan 15, 2024" },
    { company: "GreenEnergy Co.", percentage: "8%", date: "Feb 22, 2024" },
    { company: "HealthTech Labs", percentage: "12%", date: "Mar 10, 2024" }
  ];

  // Portfolio verification - multi-view
  if (type === "portfolio") {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles(Array.from(e.target.files));
      }
    };

    const handleFormSubmit = () => {
      setPortfolioView("upload");
    };

    const handleFinalSubmit = () => {
      toast.success("Documents submitted for verification");
      setPortfolioView("list");
      setInvestmentData({
        companyName: "",
        investmentPercentage: "",
        investmentAmount: "",
        investmentDate: ""
      });
      setSelectedFiles([]);
      onComplete();
    };

    // Portfolio List View
    if (portfolioView === "list") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 space-y-6 bg-card border-border">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">My Portfolio</h2>
              <p className="text-sm text-muted-foreground">Verified investments</p>
            </div>

            {/* Verified Investments List */}
            <div className="space-y-3">
              {dummyInvestments.map((investment, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{investment.company}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{investment.percentage}</span>
                        <span>•</span>
                        <span>{investment.date}</span>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-foreground flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Portfolio Button */}
            <Button 
              onClick={() => setPortfolioView("form")}
              className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add to My Portfolio
            </Button>
          </Card>
        </div>
      );
    }

    // Investment Details Form View
    if (portfolioView === "form") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 space-y-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setPortfolioView("list")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Investment Details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-foreground">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={investmentData.companyName}
                  onChange={(e) => setInvestmentData({...investmentData, companyName: e.target.value})}
                  placeholder="Enter company name"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentPercentage" className="text-sm font-medium text-foreground">
                  Investment Percentage
                </Label>
                <Input
                  id="investmentPercentage"
                  value={investmentData.investmentPercentage}
                  onChange={(e) => setInvestmentData({...investmentData, investmentPercentage: e.target.value})}
                  placeholder="e.g., 15%"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentAmount" className="text-sm font-medium text-foreground">
                  Investment Amount
                </Label>
                <Input
                  id="investmentAmount"
                  value={investmentData.investmentAmount}
                  onChange={(e) => setInvestmentData({...investmentData, investmentAmount: e.target.value})}
                  placeholder="e.g., $50,000"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentDate" className="text-sm font-medium text-foreground">
                  Investment Date
                </Label>
                <Input
                  id="investmentDate"
                  type="date"
                  value={investmentData.investmentDate}
                  onChange={(e) => setInvestmentData({...investmentData, investmentDate: e.target.value})}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <Button 
              onClick={handleFormSubmit}
              className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
            >
              Continue to Upload Documents
            </Button>
          </Card>
        </div>
      );
    }

    // Document Upload View
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-8 bg-card border-border">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setPortfolioView("form")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-2xl border-2 border-border bg-muted/30 flex items-center justify-center">
              <Upload className="h-16 w-16 text-foreground" strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload investment documents for {investmentData.companyName || "this investment"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-foreground/50 transition-colors cursor-pointer">
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="portfolio-upload"
              />
              <label htmlFor="portfolio-upload" className="cursor-pointer">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} document(s) selected` 
                    : "Choose investment documents"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, or PNG
                </p>
              </label>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <Clock className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Manual Verification</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Documents will be verified within 6 hours
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleFinalSubmit}
            className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
          >
            Submit for Verification
          </Button>
        </Card>
      </div>
    );
  }

  // KYC and Company verification - multi-step
  const getStepContent = () => {
    if (type === "kyc") {
      switch (currentStep) {
        case 1:
          return {
            icon: FileText,
            title: "First, let's get to know you",
            description: "Please prepare one of the following documents\nPassport | ID | Resident Card",
            buttonText: "Choose document",
            note: "Most people finish this step under 3 minutes"
          };
        case 2:
          return {
            icon: Camera,
            title: "Upload your ID's back side",
            description: "The card you have sent us has basic, essential information on it's back side.\n\nPlease flip the card and take a photo.",
            buttonText: "Take Photo"
          };
        case 3:
          return {
            icon: User,
            title: "Take a selfie",
            description: "The image should be clear and have your face fully inside the frame.",
            buttonText: "Take a Selfie"
          };
        default:
          return null;
      }
    } else {
      // Company verification
      switch (currentStep) {
        case 1:
          return {
            icon: FileText,
            title: "Company Verification",
            description: "Please prepare your company incorporation documents",
            buttonText: "Choose document",
            note: "This verification helps establish credibility"
          };
        case 2:
          return {
            icon: FileText,
            title: "Additional Documents",
            description: "Upload additional company documents or funding proof",
            buttonText: "Upload Documents"
          };
        case 3:
          return {
            icon: CheckCircle2,
            title: "Review & Submit",
            description: "Please review your information and submit for verification.",
            buttonText: "Submit for Review"
          };
        default:
          return null;
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Verification submitted successfully");
      onComplete();
    }
  };

  const stepContent = getStepContent();
  if (!stepContent) return null;

  const Icon = stepContent.icon;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8 bg-card border-border">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Identity doc</span>
            <span className={currentStep >= 2 ? "text-foreground" : ""}>
              {type === "kyc" ? "ID back" : "Documents"}
            </span>
            <span className={currentStep >= 3 ? "text-foreground" : ""}>
              {type === "kyc" ? "Selfie" : "Submit"}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-2xl border-2 border-primary/20 bg-muted/30 flex items-center justify-center">
            <Icon className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{stepContent.title}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {stepContent.description}
          </p>
          {stepContent.note && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
              </span>
              {stepContent.note}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleNext}
          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
        >
          {stepContent.buttonText}
        </Button>
      </Card>
    </div>
  );
};
