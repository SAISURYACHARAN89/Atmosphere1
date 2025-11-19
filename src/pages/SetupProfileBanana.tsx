
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

const SetupProfileBanana = () => {
  const navigate = useNavigate();
  const [investorEmail, setInvestorEmail] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const handleConfirmEmail = () => {
    if (!investorEmail) {
      toast({
        title: "Missing Email",
        description: "Please enter your investor email",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(investorEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setShowCodeInput(true);
    toast({
      title: "Code Sent",
      description: "Please check your email for the verification code",
    });
  };

  const handleVerifyCode = () => {
    if (!code) {
      toast({
        title: "Missing Code",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setEmailVerified(true);
    toast({
      title: "Email Verified",
      description: "Your email has been verified successfully",
    });
  };

  const handleNext = () => {
    if (!emailVerified) {
      toast({
        title: "Verify Email",
        description: "Please verify your email before continuing",
        variant: "destructive",
      });
      return;
    }

    if (!location || !bio) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("setupInvestorEmail", investorEmail);
    localStorage.setItem("setupLocation", location);
    localStorage.setItem("setupBio", bio);

    navigate("/setup-profile-kiwi");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Investor Details</h2>
          <p className="text-sm text-muted-foreground mt-2">Step 2 of 3</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Investor Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your investor email"
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                disabled={emailVerified}
                className={emailVerified ? "pr-10" : ""}
              />
              {emailVerified && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            {!emailVerified && !showCodeInput && (
              <Button
                onClick={handleConfirmEmail}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Confirm Email
              </Button>
            )}
          </div>

          {showCodeInput && !emailVerified && (
            <div className="space-y-2 animate-in slide-in-from-top">
              <Label>Verification Code</Label>
              <Input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
              <Button
                onClick={handleVerifyCode}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Verify Code
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick Bio</Label>
            <Textarea
              placeholder="Tell us a bit about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <Button onClick={handleNext} className="w-full h-12">
          Next
        </Button>
      </div>
    </div>
  );
};

export default SetupProfileBanana;
