import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, User, CheckCircle, XCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<"investor" | "startup" | null>(null);

  const handleLogin = (mode: "investor" | "startup", verified: boolean) => {
    localStorage.setItem("userMode", mode);
    localStorage.setItem("isVerified", verified.toString());
    
    if (mode === "investor") {
      navigate("/profile");
    } else {
      navigate("/startup-profile");
    }
  };

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground">Select your account type</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setSelectedMode("investor")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <span>Investor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse startups, manage investments, and track your portfolio
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setSelectedMode("startup")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <span>Startup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Showcase your company, connect with investors, and raise funds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {selectedMode === "investor" ? "Investor" : "Startup"} Login
          </h1>
          <p className="text-muted-foreground">Select your verification status</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card 
            className="cursor-pointer hover:border-green-500 transition-all hover:shadow-lg"
            onClick={() => handleLogin(selectedMode, true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Verified Account</span>
                </div>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full access to all features and verified badge on your profile
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-orange-500 transition-all hover:shadow-lg"
            onClick={() => handleLogin(selectedMode, false)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-orange-600" />
                  <span>Unverified Account</span>
                </div>
                <Badge variant="secondary">Limited</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Basic access with option to verify later
              </p>
            </CardContent>
          </Card>
        </div>

        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => setSelectedMode(null)}
        >
          Back to mode selection
        </Button>
      </div>
    </div>
  );
};

export default Login;
