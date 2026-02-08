import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/auth/useLogin";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    loginUser(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[350px] space-y-8">
        {/* Logo */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-['Pacifico'] text-foreground">
            Atmosphere
          </h1>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-sm p-10">
          <form onSubmit={handleLogin} className="space-y-2">
            <Input
              type="text"
              placeholder="Phone number, username, or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-xs bg-background border-border/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-xs bg-background border-border/50"
            />
            <Button
              type="submit"
              className="w-full h-8 text-sm font-semibold mt-4"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-5">
            <Separator className="flex-1" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Or
            </span>
            <Separator className="flex-1" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
            </svg>
            Log in with Facebook
          </button>

          <button className="w-full text-xs text-primary mt-4">
            Forgot password?
          </button>
        </div>

        {/* Sign Up */}
        <div className="bg-card border border-border rounded-sm p-6 text-center">
          <p className="text-sm text-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Get the app */}
        <div className="text-center space-y-4">
          <p className="text-sm text-foreground">Get the app.</p>
          <div className="flex gap-2 justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png"
              alt="Download on App Store"
              className="h-10 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png"
              alt="Get it on Google Play"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
