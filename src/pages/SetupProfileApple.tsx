import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Camera, ArrowLeft, Check, ChevronLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { updateProfile, uploadProfilePicture } from "@/lib/api/user";
import { useUploadProfilePic } from "@/hooks/profile/useUploadProfilePic";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";

const SetupProfileApple = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAppStore();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [quickBio, setQuickBio] = useState("");
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

  const {
    mutateAsync: uploadAvatar,
  } = useUploadProfilePic();

    const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
  } = useUpdateProfile();

  const [accountType, setAccountType] = useState<
    "investor" | "startup" | "personal" | null
  >(null);
  const [email, setEmail] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPendingAvatarFile(file);
    }
  };

  const handleConfirmEmail = () => {
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

  const handleNext = async () => {
    if (!fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!accountType) {
      toast({
        title: "Select Account Type",
        description: "Please select an account type",
        variant: "destructive",
      });
      return;
    }

    if (!emailVerified) {
      toast({
        title: "Verify Email",
        description: "Please verify your email before continuing",
        variant: "destructive",
      });
      return;
    }

    if (!acceptDisclaimer) {
      toast({
        title: "Accept Disclaimer",
        description: "Please accept the disclaimer to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      let progilePictureUrl = user?.avatarUrl || null;
      if (profilePhoto !== user?.avatarUrl && pendingAvatarFile) {
        const formData = new FormData();
        formData.append("image", pendingAvatarFile, pendingAvatarFile.name);

        const res = await uploadAvatar(formData);
        const finalAvatarUrl = res.url;
        progilePictureUrl = finalAvatarUrl;
      }
      const updatedUser = await updateProfile({
        userData: {
          fullName,
          username,
          accountType,
          bio: quickBio,
          avatarUrl: progilePictureUrl,
          onboardingStep: 2,
        },
      });
      setUser(updatedUser.user);
      // navigation logic unchanged
      if (accountType === "investor") {
        navigate("/setup-profile-kiwi");
      } else if (accountType === "startup") {
        navigate("/setup-profile-startup");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const {
      username,
      fullName: userFullName,
      email,
      bio,
      accountType: roles,
      verified,
    } = user || {};
    setUsername(username || "");
    setFullName(userFullName || "");
    setQuickBio(bio || "");
    setProfilePhoto(user?.avatarUrl || null);
    setEmail(email || "");
    const primaryRole = roles?.[0] || "personal";
    setAccountType(primaryRole as "startup" | "investor" | "personal");
    setEmailVerified(verified || false);
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h2 className="text-2xl font-semibold text-foreground">Setup Profile</h2>
            <p className="text-sm text-muted-foreground mt-2">Step 1 of 3</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNext} disabled={isUpdatingProfile}>
            Save
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <Label className="text-sm text-muted-foreground mb-3">Profile Photo</Label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="profile-photo"
              />
              <label
                htmlFor="profile-photo"
                className="w-32 h-32 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              // disabled
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick Bio</Label>
            <Textarea
              placeholder="Tell us about yourself"
              value={quickBio}
              onChange={(e) => setQuickBio(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

  <div className="space-y-2">
  <Label className="text-sm">Account Type</Label>

  {/* Trigger */}
  <div
    className="w-full p-2.5 rounded-md border border-border bg-background text-sm font-medium cursor-pointer flex items-center justify-between"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
    <span>
      {accountType
        ? accountType === "personal"
          ? "Personal Account"
          : accountType.charAt(0).toUpperCase() + accountType.slice(1)
        : "Select Account Type"}
    </span>

    {/* <ChevronLeft
      className={`h-4 w-4 rotate-90 transition-transform ${
        dropdownOpen ? "rotate-180" : ""
      } text-muted-foreground`}
    /> */}
  </div>

  {/* Dropdown Sheet */}
  {dropdownOpen && (
    <div className="
      absolute left-0 right-0 mt-1 
      bg-background border border-border rounded-lg shadow-lg 
      z-50 
      max-w-md mx-auto
      animate-in fade-in duration-150
    ">
      {/* Item */}
      <button
        onClick={() => {
          setAccountType("investor");
          setDropdownOpen(false);
        }}
        className="w-full px-4 py-3 text-left text-sm hover:bg-accent"
      >
        Investor
      </button>

      <button
        onClick={() => {
          setAccountType("startup");
          setDropdownOpen(false);
        }}
        className="w-full px-4 py-3 text-left text-sm hover:bg-accent"
      >
        Startup
      </button>

      <button
        onClick={() => {
          setAccountType("personal");
          setDropdownOpen(false);
        }}
        className="w-full px-4 py-3 text-left text-sm hover:bg-accent"
      >
        Personal Account
      </button>
    </div>
  )}

  {/* Selected Display */}
  {accountType && (
    <p className="text-xs text-muted-foreground mt-1">
      Selected:{" "}
      <span className="font-medium capitalize">
        {accountType === "personal" ? "Personal Account" : accountType}
      </span>
    </p>
  )}
</div>

          {accountType && (
            <div className="space-y-4 animate-in slide-in-from-top">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    // disabled
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    // className={emailVerified ? "pr-10 bg-muted" : "bg-muted"}
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
            </div>
          )}

          {accountType && emailVerified && (
            <div className="p-3 bg-muted/30 rounded-md space-y-2.5 animate-in slide-in-from-top">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="font-semibold">Important:</strong> You won't be able to change your account type after this step.
              </p>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="disclaimer"
                  checked={acceptDisclaimer}
                  onCheckedChange={(checked) => setAcceptDisclaimer(checked as boolean)}
                />
                <label
                  htmlFor="disclaimer"
                  className="text-xs text-foreground leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and accept this disclaimer
                </label>
              </div>
            </div>
          )}
        </div>

        {accountType && emailVerified && acceptDisclaimer && (
          <Button onClick={handleNext} className="w-full h-12">
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default SetupProfileApple;