import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Camera, FileCheck, Loader2 } from "lucide-react";

const VerificationKYC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

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

  const uploadDocument = async (file: File, type: string) => {
    const userId = localStorage.getItem("signupUserId");
    if (!userId) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("verification-documents")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && !idDocument) {
      toast({
        title: "Missing Document",
        description: "Please upload your ID document",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && !selfie) {
      toast({
        title: "Missing Selfie",
        description: "Please upload a selfie for face verification",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    const userId = localStorage.getItem("signupUserId");

    if (!userId) {
      navigate("/login");
      return;
    }

    // Upload documents
    const idUrl = idDocument ? await uploadDocument(idDocument, "kyc_id") : null;
    const selfieUrl = selfie ? await uploadDocument(selfie, "kyc_selfie") : null;

    if (!idUrl || !selfieUrl) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Save document records
    await supabase.from("verification_documents").insert([
      { user_id: userId, document_type: "kyc_id", file_url: idUrl },
      { user_id: userId, document_type: "kyc_selfie", file_url: selfieUrl },
    ]);

    // Update verification status
    await supabase
      .from("verification_status")
      .update({
        kyc_completed: true,
        documents_uploaded: true,
        face_verification_completed: true,
        current_step: 3,
      })
      .eq("user_id", userId);

    setLoading(false);

    const selectedRole = localStorage.getItem("selectedRole");
    
    if (selectedRole === "startup") {
      navigate("/verification-startup");
    } else if (selectedRole === "investor") {
      navigate("/verification-investor");
    } else {
      navigate("/verification-complete");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <Progress value={progress} className="w-full" />

          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Upload className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-xl font-semibold">Upload ID Document</h2>
                  <p className="text-sm text-muted-foreground">
                    Please upload a clear photo of your government-issued ID
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  className="w-full"
                />
                {idDocument && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileCheck className="h-4 w-4" />
                    {idDocument.name}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Camera className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-xl font-semibold">Face Verification</h2>
                  <p className="text-sm text-muted-foreground">
                    Take a clear selfie for identity verification
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="w-full"
                />
                {selfie && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileCheck className="h-4 w-4" />
                    {selfie.name}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto">
                  <FileCheck className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">KYC Complete</h2>
                <p className="text-sm text-muted-foreground">
                  Your identity documents have been uploaded successfully
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentStep === totalSteps ? (
                "Complete"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerificationKYC;
