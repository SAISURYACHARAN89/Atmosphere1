import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Building2, FileCheck, Loader2 } from "lucide-react";

const VerificationStartup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [fundingRaised, setFundingRaised] = useState<boolean | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");
  const [incorporationDoc, setIncorporationDoc] = useState<File | null>(null);
  const [fundingProof, setFundingProof] = useState<File | null>(null);

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
    if (!companyName || !incorporationDoc) {
      toast({
        title: "Missing Information",
        description: "Please provide company name and incorporation documents",
        variant: "destructive",
      });
      return;
    }

    if (fundingRaised && (!fundingAmount || !fundingProof)) {
      toast({
        title: "Missing Funding Information",
        description: "Please provide funding details and proof",
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

    // Upload documents
    const incorpUrl = await uploadDocument(incorporationDoc, "incorporation_docs");
    let fundingUrl = null;
    
    if (fundingRaised && fundingProof) {
      fundingUrl = await uploadDocument(fundingProof, "funding_proof");
    }

    if (!incorpUrl || (fundingRaised && !fundingUrl)) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Save startup details
    await supabase.from("startup_details").insert({
      user_id: userId,
      company_name: companyName,
      funding_raised: fundingRaised || false,
      funding_amount: fundingRaised ? parseFloat(fundingAmount) : null,
    });

    // Save documents
    const documents: {
      user_id: string;
      document_type: "incorporation_docs" | "funding_proof";
      file_url: string;
    }[] = [
      { user_id: userId, document_type: "incorporation_docs", file_url: incorpUrl },
    ];
    
    if (fundingUrl) {
      documents.push({
        user_id: userId,
        document_type: "funding_proof",
        file_url: fundingUrl,
      });
    }

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
            <Building2 className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Startup Verification</h1>
            <p className="text-sm text-muted-foreground">
              Provide your company information and documents
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            <div className="space-y-2">
              <Label>Incorporation Documents</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) =>
                  setIncorporationDoc(e.target.files?.[0] || null)
                }
              />
              {incorporationDoc && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileCheck className="h-4 w-4" />
                  {incorporationDoc.name}
                </div>
              )}
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <Label>Have you raised funding?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={fundingRaised === true ? "default" : "outline"}
                  onClick={() => setFundingRaised(true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={fundingRaised === false ? "default" : "outline"}
                  onClick={() => setFundingRaised(false)}
                  className="flex-1"
                >
                  No
                </Button>
              </div>

              {fundingRaised && (
                <>
                  <div className="space-y-2">
                    <Label>Funding Amount (USD)</Label>
                    <Input
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="100000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Funding Proof Documents</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(e) =>
                        setFundingProof(e.target.files?.[0] || null)
                      }
                    />
                    {fundingProof && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileCheck className="h-4 w-4" />
                        {fundingProof.name}
                      </div>
                    )}
                  </div>
                </>
              )}
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

export default VerificationStartup;
