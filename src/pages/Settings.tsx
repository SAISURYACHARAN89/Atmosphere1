import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AtSign, BarChart3, Bookmark, Activity, Settings as SettingsIcon, MessageSquare, Lock, Briefcase, Crown, HelpCircle, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const navigate = useNavigate();

  const SettingItem = ({ icon: Icon, title, subtitle, onClick, showArrow = true }: any) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors active:scale-[0.98]"
    >
      <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground text-sm">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 px-4">
        <div className="max-w-2xl mx-auto space-y-6 pt-6">
          {/* Profile Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Profile</h2>
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <SettingItem
                icon={User}
                title="Edit Name"
                subtitle="Change your display name"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={AtSign}
                title="Edit Username"
                subtitle="Update your username"
                onClick={() => {}}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Content</h2>
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <SettingItem
                icon={BarChart3}
                title="Professional Dashboard"
                subtitle="View analytics and insights"
                onClick={() => navigate("/profile")}
              />
              <Separator />
              <SettingItem
                icon={Bookmark}
                title="Saved Content"
                subtitle="Access your saved posts and startups"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={Activity}
                title="Recent Activity"
                subtitle="See your recent interactions"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={SettingsIcon}
                title="Content Preference"
                subtitle="Customize your feed"
                onClick={() => {}}
              />
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Privacy</h2>
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <SettingItem
                icon={MessageSquare}
                title="Comments"
                subtitle="Control who can comment on your posts"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={Lock}
                title="Connect"
                subtitle="Manage direct message permissions"
                onClick={() => {}}
              />
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Account</h2>
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <SettingItem
                icon={Briefcase}
                title="Portfolio & KYC"
                subtitle="Update portfolio or verify identity"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={Crown}
                title="Get Premium"
                subtitle="Unlock exclusive features"
                onClick={() => {}}
              />
            </div>
          </div>

          {/* Help Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Help</h2>
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <SettingItem
                icon={HelpCircle}
                title="Support"
                subtitle="Get help or contact us"
                onClick={() => {}}
              />
              <Separator />
              <SettingItem
                icon={Info}
                title="About"
                subtitle="Version 1.0.0"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
