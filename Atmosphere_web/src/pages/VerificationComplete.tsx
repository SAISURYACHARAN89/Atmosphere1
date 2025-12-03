import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VerificationComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishSetup = async () => {
      const userId = localStorage.getItem("signupUserId");
      const selectedRole = localStorage.getItem("selectedRole");

      if (userId && selectedRole) {
        // Add user role
        await supabase.from("user_roles").insert({
          user_id: userId,
          role: selectedRole as "investor" | "startup" | "human",
        });

        // Clear signup data
        localStorage.removeItem("signupUserId");
        localStorage.removeItem("signupComplete");
        localStorage.removeItem("selectedRole");
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupFullName");
        localStorage.removeItem("signupUsername");
        localStorage.removeItem("signupCode");
      }
    };

    finishSetup();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Verification Submitted!
            </h1>
            <p className="text-muted-foreground">
              Your documents have been submitted for review. Our team will verify
              your information within 2-3 business days.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
            <p className="text-sm font-medium">What happens next?</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Our team will review your documents</li>
              <li>You'll receive an email notification</li>
              <li>Once verified, you'll get a verified badge</li>
              <li>You can start using the platform immediately</li>
            </ul>
          </div>

          <Button onClick={() => navigate("/")} className="w-full" size="lg">
            Go to Home
          </Button>

          <p className="text-xs text-muted-foreground">
            You can check your verification status in your profile settings
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VerificationComplete;
