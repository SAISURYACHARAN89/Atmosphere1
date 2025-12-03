import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const VerificationStart = () => {
  const navigate = useNavigate();
  const [selectedRole] = useState(localStorage.getItem("selectedRole") || "human");

  const handleStartVerification = async () => {
    const userId = localStorage.getItem("signupUserId");
    
    if (!userId) {
      navigate("/login");
      return;
    }

    // Create verification status
    const { error } = await supabase.from("verification_status").insert({
      user_id: userId,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error starting verification:", error);
      toast({
        title: "Error",
        description: "Failed to start verification process",
        variant: "destructive",
      });
      return;
    }

    navigate("/verification-kyc");
  };

  const handleSkip = async () => {
    const userId = localStorage.getItem("signupUserId");
    
    // Set role as human
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: "human",
    });

    // Clear signup data
    localStorage.removeItem("signupUserId");
    localStorage.removeItem("signupComplete");
    localStorage.removeItem("selectedRole");

    toast({
      title: "Account Created",
      description: "You can start exploring now!",
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Verification Process
            </h1>
            <p className="text-muted-foreground">
              {selectedRole === "investor" || selectedRole === "startup"
                ? "Get verified to unlock full platform features and gain trust from the community."
                : "Would you like to get verified? You can always do this later."}
            </p>
          </div>

          {(selectedRole === "investor" || selectedRole === "startup") && (
            <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm font-medium">Verification includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>KYC (Identity verification)</li>
                <li>Document upload</li>
                <li>Face verification</li>
                {selectedRole === "startup" && (
                  <li>Company incorporation documents</li>
                )}
                {selectedRole === "investor" && <li>Investment documents</li>}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleStartVerification} className="w-full" size="lg">
              Start Verification
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {selectedRole === "investor" || selectedRole === "startup"
              ? "Skipping will create your account as a regular user"
              : "You can start verification anytime from your settings"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VerificationStart;
