import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SignupConfirm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code) {
      toast({
        title: "Missing Code",
        description: "Please enter the confirmation code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("signupUserId");
    const username = localStorage.getItem("signupUsername");
    const email = localStorage.getItem("signupEmail");

    if (!userId || !username || !email) {
      toast({
        title: "Error",
        description: "Signup session expired. Please start again.",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username: username,
      email: email,
      full_name: "",
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    localStorage.setItem("newAccount", "true");
    setLoading(false);

    toast({
      title: "Success",
      description: "Account created successfully!",
    });

    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Enter confirmation code
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a code to your email
          </p>
        </div>

        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-12 text-center text-lg tracking-widest"
          maxLength={6}
        />

        <Button 
          onClick={handleConfirm} 
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default SignupConfirm;