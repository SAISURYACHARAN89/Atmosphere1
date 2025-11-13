import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AtSign, BarChart3, Bookmark, Activity, Settings as SettingsIcon, MessageSquare, Lock, Briefcase, Crown, HelpCircle, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [savedContentOpen, setSavedContentOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [connectEnabled, setConnectEnabled] = useState(true);

  const handleSaveName = () => {
    toast.success("Name updated successfully");
    setEditNameOpen(false);
  };

  const handleSaveUsername = () => {
    toast.success("Username updated successfully");
    setEditUsernameOpen(false);
  };

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
                onClick={() => setEditNameOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={AtSign}
                title="Edit Username"
                subtitle="Update your username"
                onClick={() => setEditUsernameOpen(true)}
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
                onClick={() => setSavedContentOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={Activity}
                title="Recent Activity"
                subtitle="See your recent interactions"
                onClick={() => setActivityOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={SettingsIcon}
                title="Content Preference"
                subtitle="Customize your feed"
                onClick={() => setPreferencesOpen(true)}
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
                onClick={() => setCommentsOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={Lock}
                title="Connect"
                subtitle="Manage direct message permissions"
                onClick={() => setConnectOpen(true)}
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
                onClick={() => setPortfolioOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={Crown}
                title="Get Premium"
                subtitle="Unlock exclusive features"
                onClick={() => setPremiumOpen(true)}
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
                onClick={() => setSupportOpen(true)}
              />
              <Separator />
              <SettingItem
                icon={Info}
                title="About"
                subtitle="Version 1.0.0"
                onClick={() => setAboutOpen(true)}
              />
            </div>
          </div>

          {/* Logout Section */}
          <div className="space-y-2">
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors active:scale-[0.98]"
              >
                <span className="font-semibold text-sm">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Name Dialog */}
      <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>Update your display name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button onClick={handleSaveName} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Username Dialog */}
      <Dialog open={editUsernameOpen} onOpenChange={setEditUsernameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Username</DialogTitle>
            <DialogDescription>Choose a unique username</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
              />
              <p className="text-xs text-muted-foreground">
                Username can only contain letters, numbers, and underscores
              </p>
            </div>
            <Button onClick={handleSaveUsername} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Content Dialog */}
      <Dialog open={savedContentOpen} onOpenChange={setSavedContentOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Content</DialogTitle>
            <DialogDescription>Your saved posts and startups</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No saved content yet</p>
              <p className="text-sm mt-1">Save posts and startups to view them here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Activity Dialog */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recent Activity</DialogTitle>
            <DialogDescription>Your recent interactions and engagements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm mt-1">Your likes, comments, and shares will appear here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Preferences Dialog */}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content Preferences</DialogTitle>
            <DialogDescription>Customize your feed and notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show startup posts</Label>
                <p className="text-sm text-muted-foreground">Display startup updates in your feed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show funding news</Label>
                <p className="text-sm text-muted-foreground">See latest funding announcements</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show job postings</Label>
                <p className="text-sm text-muted-foreground">View job opportunities in your feed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show events</Label>
                <p className="text-sm text-muted-foreground">See upcoming startup events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Settings Dialog */}
      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment Settings</DialogTitle>
            <DialogDescription>Control who can comment on your posts</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow comments</Label>
                <p className="text-sm text-muted-foreground">Enable comments on your posts</p>
              </div>
              <Switch checked={commentsEnabled} onCheckedChange={setCommentsEnabled} />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Who can comment</Label>
              <div className="space-y-2">
                <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm">Everyone</p>
                  <p className="text-xs text-muted-foreground">All users can comment</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border-2 border-primary bg-primary/5">
                  <p className="font-medium text-sm">Connections only</p>
                  <p className="text-xs text-muted-foreground">Only your connections can comment</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm">No one</p>
                  <p className="text-xs text-muted-foreground">Disable comments on all posts</p>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Settings Dialog */}
      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Settings</DialogTitle>
            <DialogDescription>Manage direct message permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow messages</Label>
                <p className="text-sm text-muted-foreground">Enable direct messages</p>
              </div>
              <Switch checked={connectEnabled} onCheckedChange={setConnectEnabled} />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Who can message you</Label>
              <div className="space-y-2">
                <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm">Everyone</p>
                  <p className="text-xs text-muted-foreground">All verified users can message you</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border-2 border-primary bg-primary/5">
                  <p className="font-medium text-sm">Connections only</p>
                  <p className="text-xs text-muted-foreground">Only your connections can message you</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm">No one</p>
                  <p className="text-xs text-muted-foreground">Block all direct messages</p>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio & KYC Dialog */}
      <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Portfolio & KYC Verification</DialogTitle>
            <DialogDescription>Update your portfolio and verify your identity</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>KYC Verification</Label>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Verify your identity to unlock premium features and build trust with investors and partners.
                </p>
                <Button variant="outline" className="mt-3">
                  Start Verification
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Dialog */}
      <Dialog open={premiumOpen} onOpenChange={setPremiumOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Get Premium
            </DialogTitle>
            <DialogDescription>Unlock exclusive features and grow faster</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Advanced Analytics</p>
                  <p className="text-xs text-muted-foreground">Track engagement and growth metrics</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Priority Support</p>
                  <p className="text-xs text-muted-foreground">Get help from our team anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Verified Badge</p>
                  <p className="text-xs text-muted-foreground">Stand out with a verified profile</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button className="w-full">Upgrade to Premium</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Support</DialogTitle>
            <DialogDescription>Get help or contact our team</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What do you need help with?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question..."
                className="min-h-[120px]"
              />
            </div>
            <Button className="w-full">Send Message</Button>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Other ways to reach us</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Email: support@startup.com</p>
                <p>Response time: Within 24 hours</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About</DialogTitle>
            <DialogDescription>App information and credits</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Info className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Startup Connect</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Mission</p>
                <p className="text-muted-foreground">
                  Connecting entrepreneurs, investors, and innovators to build the future together.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Legal</p>
                <div className="space-y-1 text-muted-foreground">
                  <button className="hover:underline">Terms of Service</button>
                  <br />
                  <button className="hover:underline">Privacy Policy</button>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              © 2025 Startup Connect. All rights reserved.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
