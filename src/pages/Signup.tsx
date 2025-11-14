import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type SignupStep = "email" | "username" | "code" | "password";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>("email");
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const progress = {
    email: 25,
    username: 50,
    code: 75,
    password: 100,
  };

  const handleEmailNext = async () => {
    if (!email || !fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and full name",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("signupEmail", email);
    localStorage.setItem("signupFullName", fullName);
    setStep("username");
  };

  const handleUsernameNext = async () => {
    if (!username) {
      toast({
        title: "Missing Username",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Invalid Username",
        description: "Username must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Check if username is available
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      toast({
        title: "Username Taken",
        description: "This username is already taken. Please choose another.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    localStorage.setItem("signupUsername", username);
    setLoading(false);

    toast({
      title: "Username Available",
      description: "Please enter any verification code to continue",
    });

    setStep("code");
  };

  const handleCodeNext = () => {
    if (!code) {
      toast({
        title: "Missing Code",
        description: "Please enter any verification code",
        variant: "destructive",
      });
      return;
    }

    // Accept any code as dummy verification
    localStorage.setItem("signupCode", code);
    toast({
      title: "Code Verified",
      description: "Verification successful",
    });
    setStep("password");
  };

  const handlePasswordNext = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Missing Password",
        description: "Please enter and confirm your password",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Create account with email and password
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username: username,
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      toast({
        title: "Signup Failed",
        description: signUpError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user?.id,
      username: username,
      full_name: fullName,
      email: email,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      toast({
        title: "Error",
        description: "Failed to create profile. Please contact support.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Store signup data for role selection
    localStorage.setItem("signupUserId", authData.user?.id || "");
    localStorage.setItem("signupComplete", "true");

    setLoading(false);

    toast({
      title: "Success",
      description: "Account created successfully!",
    });

    // Navigate to role selection
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-['Pacifico'] text-foreground mb-2">
            Atmosphere
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            Create Account
          </h2>
          <p className="text-sm text-muted-foreground">
            Step {Object.keys(progress).indexOf(step) + 1} of 4
          </p>
        </div>

        <Progress value={progress[step]} className="w-full" />

        <div className="space-y-4">
          {step === "email" && (
            <>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleEmailNext} className="w-full">
                Next
              </Button>
            </>
          )}

          {step === "username" && (
            <>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleUsernameNext} className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Next"}
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Enter the 6-digit code sent to {email}
                </p>
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="w-full text-center text-2xl tracking-widest"
                />
              </div>
              <Button onClick={handleCodeNext} className="w-full">
                Next
              </Button>
            </>
          )}

          {step === "password" && (
            <>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handlePasswordNext} className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
