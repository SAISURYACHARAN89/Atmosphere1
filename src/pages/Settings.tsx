import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Bookmark, Activity, UserPen, LogOut, Bell, Shield, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: BarChart3,
      title: "Professional Dashboard",
      description: "View your analytics and insights",
      onClick: () => {
        const userMode = localStorage.getItem("userMode");
        if (userMode === "startup") {
          navigate("/startup-profile");
        } else {
          navigate("/profile");
        }
      }
    },
    {
      icon: Bookmark,
      title: "Saved Content",
      description: "Access your saved startups and posts",
      onClick: () => {/* Navigate to saved */}
    },
    {
      icon: Activity,
      title: "Recent Activity",
      description: "See your recent interactions and views",
      onClick: () => {/* Navigate to activity */}
    },
    {
      icon: UserPen,
      title: "Edit Profile",
      description: "Update your personal information",
      onClick: () => {/* Edit profile logic */}
    }
  ];

  const accountItems = [
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage notification preferences",
      onClick: () => {/* Notifications settings */}
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Control your privacy settings",
      onClick: () => {/* Privacy settings */}
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help or contact support",
      onClick: () => {/* Help page */}
    },
    {
      icon: Info,
      title: "About",
      description: "App version and information",
      onClick: () => {/* About page */}
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Settings & Menu</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Main Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Main</CardTitle>
              <CardDescription>Access your key features and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="mt-0.5">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </button>
                  {index < menuItems.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {accountItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="mt-0.5">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </button>
                  {index < accountItems.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="border-destructive/20">
            <CardContent className="p-4">
              <button
                onClick={() => {
                  localStorage.removeItem("userMode");
                  localStorage.removeItem("isVerified");
                  navigate("/login");
                }}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-destructive text-sm">Log Out</p>
                  <p className="text-xs text-destructive/70 mt-0.5">Sign out of your account</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* App Version */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
