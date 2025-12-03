import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value)
      .maybeSingle();

    setUsernameAvailable(!existingUser);
    setCheckingUsername(false);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.length >= 3) {
      checkUsernameAvailability(value);
    } else {
      setUsernameAvailable(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!usernameAvailable) {
      toast({
        title: "Username Unavailable",
        description: "Please choose a different username",
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

    setLoading(true);

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username: username,
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

    localStorage.setItem("signupUserId", authData.user?.id || "");
    localStorage.setItem("signupEmail", email);
    localStorage.setItem("signupUsername", username);
    
    setLoading(false);
    navigate("/signup-confirm");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-20 px-4">
      <h1 className="text-4igxl font-['Pacifico'] text-foreground mb-20">
        Atmosphere
      </h1>

      <div className="w-full max-w-sm space-y-4">
        <Input
          type="email"
          placeholder="Email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12"
        />

        <div className="relative">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className="w-full h-12 pr-10"
          />
          {checkingUsername && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
          )}
          {!checkingUsername && usernameAvailable && username.length >= 3 && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12"
        />

        <Button 
          onClick={handleSignup} 
          className="w-full h-12 mt-6"
          disabled={loading || !usernameAvailable}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign up"}
        </Button>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Already have an account? <span className="text-primary">Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;