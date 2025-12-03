import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, User, UserCircle } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    localStorage.setItem("selectedRole", selectedRole || "human");
    navigate("/verification-start");
  };

  const roles = [
    {
      id: "investor",
      title: "Investor",
      description: "I'm looking to invest in startups",
      icon: User,
    },
    {
      id: "startup",
      title: "Startup",
      description: "I'm building a company",
      icon: Building2,
    },
    {
      id: "human",
      title: "Just Browsing",
      description: "I'm here to explore",
      icon: UserCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-['Pacifico'] text-foreground mb-2">
            Atmosphere
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            Tell us about yourself
          </h2>
          <p className="text-muted-foreground">
            Select your role to personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === role.id
                  ? "border-primary border-2 bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div
                  className={`p-4 rounded-full ${
                    selectedRole === role.id
                      ? "bg-primary/20"
                      : "bg-muted"
                  }`}
                >
                  <role.icon
                    className={`h-8 w-8 ${
                      selectedRole === role.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!showConfirmation ? (
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              size="lg"
              className="w-full max-w-md"
            >
              Continue
            </Button>
          </div>
        ) : (
          <Card className="p-6 max-w-md mx-auto border-2 border-primary">
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Confirm Your Selection</h3>
              <p className="text-muted-foreground">
                You selected:{" "}
                <span className="font-semibold text-foreground">
                  {roles.find((r) => r.id === selectedRole)?.title}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Is this correct? This will determine your profile type and available features.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Go Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Yes, Continue
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
