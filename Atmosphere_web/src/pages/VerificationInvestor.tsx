import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, FileCheck, Loader2 } from "lucide-react";

const VerificationInvestor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [investmentDocs, setInvestmentDocs] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInvestmentDocs(Array.from(e.target.files));
    }
  };

  const uploadDocument = async (file: File, type: string) => {
    const userId = localStorage.getItem("signupUserId");
    if (!userId) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("verification-documents")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleComplete = async () => {
    if (investmentDocs.length === 0) {
      toast({
        title: "Missing Documents",
        description: "Please upload at least one investment document",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("signupUserId");

    if (!userId) {
      navigate("/login");
      return;
    }

    // Upload all documents
    const uploadPromises = investmentDocs.map((file) =>
      uploadDocument(file, "investment_docs")
    );
    const urls = await Promise.all(uploadPromises);

    if (urls.some((url) => !url)) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload some documents. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Save investor details
    await supabase.from("investor_details").insert({
      user_id: userId,
      investment_count: investmentDocs.length,
    });

    // Save documents
    const documents = urls.map((url) => ({
      user_id: userId,
      document_type: "investment_docs" as const,
      file_url: url!,
    }));

    await supabase.from("verification_documents").insert(documents);

    // Update verification status
    await supabase
      .from("verification_status")
      .update({
        status: "pending_review",
      })
      .eq("user_id", userId);

    setLoading(false);
    navigate("/verification-complete");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              Investor Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload documents showing your investments in startups
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Investment Documents</Label>
              <p className="text-xs text-muted-foreground">
                You can upload multiple documents (agreements, term sheets, proof
                of investment, etc.)
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                multiple
                onChange={handleFileChange}
              />
              {investmentDocs.length > 0 && (
                <div className="space-y-2 mt-4">
                  {investmentDocs.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-green-600"
                    >
                      <FileCheck className="h-4 w-4" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your investment documents will be reviewed
                by our team. This typically takes 2-3 business days. You'll be
                notified once your account is verified.
              </p>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerificationInvestor;
