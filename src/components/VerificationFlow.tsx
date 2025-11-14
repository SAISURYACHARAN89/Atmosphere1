import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">My Portfolio</h3>
            <p className="text-xs text-muted-foreground">Verified investments</p>
          </div>

          {/* Verified Investments List */}
          <div className="space-y-2">
            {dummyInvestments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between py-2.5 px-3 border border-border/50 rounded hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{investment.company}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{investment.percentage}</span>
                    <span>•</span>
                    <span>{investment.date}</span>
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-foreground flex-shrink-0 ml-3" />
              </div>
            ))}
          </div>

          {/* Add to Portfolio Button */}
          <Button 
            onClick={() => setPortfolioView("form")}
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add to My Portfolio
          </Button>
        </div>
      );
    }

    // Investment Details Form View
    if (portfolioView === "form") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setPortfolioView("list")}
              className="h-7 w-7 p-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <h3 className="text-sm font-medium text-foreground">Investment Details</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-xs font-medium text-foreground">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={investmentData.companyName}
                onChange={(e) => setInvestmentData({...investmentData, companyName: e.target.value})}
                placeholder="Enter company name"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="investmentPercentage" className="text-xs font-medium text-foreground">
                Investment Percentage
              </Label>
              <Input
                id="investmentPercentage"
                value={investmentData.investmentPercentage}
                onChange={(e) => setInvestmentData({...investmentData, investmentPercentage: e.target.value})}
                placeholder="e.g., 15%"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="investmentAmount" className="text-xs font-medium text-foreground">
                Investment Amount
              </Label>
              <Input
                id="investmentAmount"
                value={investmentData.investmentAmount}
                onChange={(e) => setInvestmentData({...investmentData, investmentAmount: e.target.value})}
                placeholder="e.g., $50,000"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="investmentDate" className="text-xs font-medium text-foreground">
                Investment Date
              </Label>
              <Input
                id="investmentDate"
                type="date"
                value={investmentData.investmentDate}
                onChange={(e) => setInvestmentData({...investmentData, investmentDate: e.target.value})}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <Button 
            onClick={handleFormSubmit}
            size="sm"
            className="w-full h-9 text-xs font-medium"
          >
            Continue to Upload Documents
          </Button>
        </div>
      );
    }

    // Document Upload View
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setPortfolioView("form")}
            className="h-7 w-7 p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <h3 className="text-sm font-medium text-foreground">Upload Documents</h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Upload documents for {investmentData.companyName || "this investment"}
        </p>

        <div className="space-y-3">
          <div className="border border-dashed border-border rounded p-4 text-center hover:border-foreground/50 transition-colors cursor-pointer">
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="portfolio-upload"
            />
            <label htmlFor="portfolio-upload" className="cursor-pointer block">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-foreground">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file(s) selected` 
                  : "Choose files"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PDF, JPG, PNG
              </p>
            </label>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded border border-border/50">
            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-xs font-medium text-foreground">Manual Verification</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Documents verified within 6 hours
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleFinalSubmit}
          size="sm"
          className="w-full h-9 text-xs font-medium"
        >
          Submit for Verification
        </Button>
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

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
      </div>

      {/* Icon */}
      <div className="flex justify-center py-4">
        <div className="w-16 h-16 rounded-lg border border-border bg-muted/20 flex items-center justify-center">
          <Icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-1.5">
        <h3 className="text-sm font-medium text-foreground">{stepContent.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {stepContent.description}
        </p>
      </div>

      {/* Action Button */}
      <Button 
        onClick={handleNext}
        size="sm"
        className="w-full h-9 text-xs font-medium"
      >
        {stepContent.buttonText}
      </Button>
    </div>
  );
};
