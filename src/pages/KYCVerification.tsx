import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const totalSteps = 2;

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !idDocument) {
      toast.error("Please upload your ID document");
      return;
    }
    if (currentStep === 2 && !selfie) {
      toast.error("Please upload your selfie");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("KYC submitted for verification");
      navigate("/portfolio-verification");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/setup-profile-kiwi");
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
          <h1 className="text-sm font-medium text-foreground">KYC Verification</h1>
          <p className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">ID Document</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a government-issued ID
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  className="hidden"
                  id="id-upload"
                />
                <label 
                  htmlFor="id-upload" 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-foreground/30 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {idDocument ? idDocument.name : "Choose file"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or PDF
                  </p>
                </label>
                
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>• Document must be valid</p>
                  <p>• All corners must be visible</p>
                  <p>• Text must be readable</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">Selfie Verification</h2>
                <p className="text-sm text-muted-foreground">
                  Take a clear photo of yourself
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  id="selfie-upload"
                />
                <label 
                  htmlFor="selfie-upload" 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-foreground/30 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {selfie ? selfie.name : "Take photo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG or PNG
                  </p>
                </label>
                
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>• Face must be clearly visible</p>
                  <p>• Good lighting required</p>
                  <p>• No filters or edits</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border/50">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={handleNext}
            className="w-full"
            disabled={
              (currentStep === 1 && !idDocument) || 
              (currentStep === 2 && !selfie)
            }
          >
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;