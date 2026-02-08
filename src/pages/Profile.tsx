import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import CreatePost from "@/components/CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  MapPin, DollarSign,
  Target,
  Activity, CheckCircle2, Plus,
  ChevronLeft
} from "lucide-react";
import { GrDocumentVerified } from "react-icons/gr";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { ZUserSchema } from "@/types/auth";
import { formatUserData } from "@/utils/formatUserData";


// -----------------------------------------------------------
// -------------------- INVESTMENT INTERFACE ------------------
// -----------------------------------------------------------
interface Investment {
  id: string;
  companyName: string;
  companyLogo: string;
  sector: string;
  investmentAmount: number;
  currentValue: number;
  shares: number;
  investmentDate: string;
  status: "active" | "exited" | "pending";
  returnPercentage: number;
  companyWebsite: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { data: profileData } = useGetProfile();
  const isNewAccount = localStorage.getItem("newAccount") === "true";
  const profileSetupComplete =
    localStorage.getItem("profileSetupComplete") === "true";

  const [showUserList, setShowUserList] = useState<
    null | "followers" | "following"
  >(null);

  const [activeSection, setActiveSection] = useState<
    "posts" | "expand" | "trades"
  >("posts");
  const [showReels, setShowReels] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // -------------------- SELECT WHICH DATA TO USE ----------------------
  const investorData =
    isNewAccount && !profileSetupComplete
      ? formatUserData(profileData || {})
      : formatUserData(profileData || {});

  // -------------------- INVESTMENTS (EXISTING KEPT SAME) --------------------
  const [investments] = useState<Investment[]>(
    isNewAccount && !profileSetupComplete
      ? []
      : [
          {
            id: "1",
            companyName: "Airbound.co",
            companyLogo:
              "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
            sector: "Logistics",
            investmentAmount: 150000,
            currentValue: 285000,
            shares: 5000,
            investmentDate: "2023-03-15",
            status: "active",
            returnPercentage: 90.0,
            companyWebsite: "https://airbound.co",
          },
          {
            id: "2",
            companyName: "NeuralHealth",
            companyLogo:
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
            sector: "HealthTech",
            investmentAmount: 250000,
            currentValue: 520000,
            shares: 8000,
            investmentDate: "2022-11-20",
            status: "active",
            returnPercentage: 108.0,
            companyWebsite: "https://neuralhealth.com",
          },
          {
            id: "3",
            companyName: "GreenCharge",
            companyLogo:
              "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
            sector: "CleanTech",
            investmentAmount: 200000,
            currentValue: 340000,
            shares: 6500,
            investmentDate: "2023-06-10",
            status: "active",
            returnPercentage: 70.0,
            companyWebsite: "https://greencharge.com",
          },
          {
            id: "4",
            companyName: "CodeMentor AI",
            companyLogo:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
            sector: "EdTech",
            investmentAmount: 100000,
            currentValue: 95000,
            shares: 3000,
            investmentDate: "2024-01-05",
            status: "active",
            returnPercentage: -5.0,
            companyWebsite: "https://codementor.ai",
          },
          {
            id: "5",
            companyName: "FoodFlow",
            companyLogo:
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
            sector: "Supply Chain",
            investmentAmount: 175000,
            currentValue: 260000,
            shares: 5500,
            investmentDate: "2023-08-22",
            status: "active",
            returnPercentage: 48.6,
            companyWebsite: "https://foodflow.com",
          },
        ]
  );

  // ---------------- FOLLOWERS / FOLLOWING ----------------
  const followersList =
    isNewAccount && !profileSetupComplete
      ? []
      : [
          {
            id: 1,
            name: "Priya Sharma",
            username: "@priya",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            isFollowing: false,
          },
          {
            id: 2,
            name: "Rahul Verma",
            username: "@rahul",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            isFollowing: true,
          },
        ];

  const followingList =
    isNewAccount && !profileSetupComplete
      ? []
      : [
          {
            id: 3,
            name: "Amit Singh",
            username: "@amit",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            isFollowing: true,
          },
          {
            id: 4,
            name: "Sara Khan",
            username: "@sara",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            isFollowing: true,
          },
        ];

  // ---------------- HELPER FUNCTIONS ----------------
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const step = Number(localStorage.getItem("profileSetupStep") || "0");
    const totalSteps = 4

  // ---------------------------------------------------
  // -------------------- FULL UI -----------------------
  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------- HEADER ---------------- */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>

          <div className="flex-1 flex justify-center">
            <h2 className="font-semibold text-base text-foreground flex items-center gap-1.5">
              {investorData.username.replace("@", "")}
              {!(
                isNewAccount &&
                !profileSetupComplete
              ) && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
            </h2>
          </div>

          <button
            onClick={() => setShowCreatePost(true)}
            className="p-2 hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>
              
      {/* --------------- MAIN ---------------- */}
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* ---------------- PROFILE HEADER ---------------- */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative flex-shrink-0">
                {investorData.avatar ? (
                  <>
                    <Avatar className="h-20 w-20 border-2 border-primary">
                      
                      <AvatarImage
                        src={investorData.avatar}
                        alt={investorData.name}
                      />
  
                      <AvatarFallback className="text-xl bg-muted">
                        {investorData.name[0] || investorData.username[1]}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Plus
                        className="h-4 w-4 text-primary-foreground"
                        strokeWidth={3}
                      />
                    </button>
                  </>
                ) : (
                  <Avatar className="h-20 w-20 bg-muted">
                    <AvatarFallback className="text-xl bg-muted text-muted-foreground">
                      {investorData.username[1] || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* name and stats */}
              <div className="flex-1 min-w-0">
                {/* NAME (Only after setup OR existing user) */}
                {(!isNewAccount || profileSetupComplete) && (
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-sm font-normal text-foreground truncate">
                      {investorData.name}
                    </h1>
                  </div>
                )}

                <div className="flex gap-6">
                  <button className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.posts)}
                    </p>
                    <p className="text-xs text-muted-foreground">posts</p>
                  </button>

                  <button
                    className="flex flex-col items-center"
                    onClick={() => setShowUserList("followers")}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.followers || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </button>

                  <button
                    className="flex flex-col items-center"
                    onClick={() => setShowUserList("following")}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.following || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">following</p>
                  </button>
                </div>
              </div>
            </div>

            {/* LOCATION ( only visible after profile setup OR existing ) */}
            {(!isNewAccount || profileSetupComplete) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                {investorData.location}
              </div>
            )}

            {/* BIO ( only visible after profile setup OR existing ) */}
            {(!isNewAccount || profileSetupComplete) && (
              <p className="text-sm text-foreground leading-relaxed mb-2">
                {investorData.bio}
              </p>
            )}

            {/* EDIT PROFILE BUTTON (always show) */}
            <Button
              onClick={() => navigate("/setup-profile-apple")}
              className="w-full mt-3"
              variant="outline"
            >
              {`Setup Profile (${step}/${totalSteps})`}
            </Button>


            {/* Message for new users */}
            
          </div>

          {/* ---------------- TABS ---------------- */}
          <div className="mt-3">
            <div className="grid grid-cols-3 text-center">
              <button
                onClick={() => {
                  if (activeSection === "posts") {
                    setShowReels(!showReels);
                  } else {
                    setActiveSection("posts");
                  }
                }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeSection === "posts"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {activeSection === "posts"
                  ? showReels
                    ? "Reels"
                    : "Posts"
                  : "Posts"}
                {activeSection === "posts" && (
                  <ChevronLeft
                    className={`h-3.5 w-3.5 transition-transform ${
                      showReels ? "-rotate-90" : "rotate-90"
                    }`}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveSection("expand")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === "expand"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                Expand
              </button>

              <button
                onClick={() => setActiveSection("trades")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === "trades"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                Trades
              </button>
            </div>
          </div>

          {/* ---------------- CONTENT ---------------- */}
          <div className="px-4 py-4">
            {/* ---------- POSTS SECTION ---------- */}
            {activeSection === "posts" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  {(isNewAccount && !profileSetupComplete
                    ? [1, 2, 3, 4, 5, 6]
                    : [1, 2, 3, 4, 5, 6]
                  ).map((item) => (
                    <div
                      key={item}
                      className="aspect-square bg-muted rounded-sm flex items-center justify-center"
                    >
                      {!isNewAccount || profileSetupComplete ? (
                        <span className="text-xs text-muted-foreground">
                          Post {item}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- EXPAND ---------- */}
            {activeSection === "expand" && (
              <div className="space-y-4">
                {/* About */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Investor Profile
                  </h3>

                  <Card className="border-primary/20">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          About
                        </h4>
                        <p className="text-sm text-foreground leading-relaxed">
                          {investorData.bio}
                        </p>
                      </div>

                      {/* Investment Focus */}
                      <div className="pt-2 border-t">
                        <h4 className="text-xs font-medium text-muted-foreground mb-3">
                          Investment Focus
                        </h4>

                        {isNewAccount && !profileSetupComplete ? (
                          <p className="text-xs text-muted-foreground">
                            No investment data yet
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Target className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Industries
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {["AI & ML", "SaaS", "FinTech", "HealthTech"].map(
                                    (tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium"
                                      >
                                        {tag}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Activity className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Stage
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Early Stage
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Activity className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Interested rounds
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Pre-seed, Seed, Series A
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Investable Geography
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  North America, Europe
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Check Size
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  $50K - $500K
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <GrDocumentVerified className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  Verified Investments
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  4
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Holdings */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Holdings
                  </h3>

                  {investments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No holdings yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {investments.map((inv) => (
                        <Card
                          key={inv.id}
                          className="border border-border rounded-xl bg-background hover:bg-muted/40 transition cursor-pointer"
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-lg border">
                              <AvatarImage src={inv.companyLogo} />
                              <AvatarFallback>{inv.companyName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-foreground truncate">{inv.companyName}</div>
                              <div className="text-xs text-muted-foreground">{inv.sector}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-3 py-1 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(inv.companyWebsite, "_blank");
                              }}
                            >
                              View
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------- TRADES --------------- */}
            {activeSection === "trades" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Active Sales
                </h3>

                {isNewAccount && !profileSetupComplete ? (
                  <p className="text-sm text-muted-foreground">No active trades</p>
                ) : (
                  [
                    {
                      company: "Airbound.co",
                      logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
                      shares: 1000,
                      price: 57,
                      totalValue: 57000,
                    },
                    {
                      company: "NeuralHealth",
                      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
                      shares: 500,
                      price: 65,
                      totalValue: 32500,
                    },
                  ].map((trade, index) => (
                    <Card
                      key={index}
                      className="hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={trade.logo} />
                              <AvatarFallback>{trade.company[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">
                                {trade.company}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {trade.shares.toLocaleString()} shares
                              </p>
                            </div>
                          </div>
                          <Badge className="text-xs">For Sale</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-0.5">
                              Price per Share
                            </p>
                            <p className="font-semibold text-foreground">
                              ${trade.price}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-0.5">
                              Total Value
                            </p>
                            <p className="font-semibold text-foreground">
                              ${trade.totalValue}
                            </p>
                          </div>
                        </div>

                        <Button className="w-full mt-3" size="sm">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ----------------- FOLLOWERS / FOLLOWING MODAL ----------------- */}
      {showUserList && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
          <div className="bg-background px-4 pt-4 pb-3 border-b flex items-center justify-between">
            <button onClick={() => setShowUserList(null)} className="p-2 -ml-2">
              <ChevronLeft className="h-6 w-6" />
            </button>

            <h2 className="text-base font-semibold">
              {investorData.name || investorData.username.replace("@", "")}
            </h2>

            <div className="w-6" />
          </div>

          {/* Tabs */}
          <div className="bg-background border-b">
            <div className="flex items-center justify-around text-sm">
              <button
                className={`py-3 flex-1 ${
                  showUserList === "followers"
                    ? "font-semibold border-b-2 border-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setShowUserList("followers")}
              >
                {investorData.stats.followers} Followers
              </button>

              <button
                className={`py-3 flex-1 ${
                  showUserList === "following"
                    ? "font-semibold border-b-2 border-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setShowUserList("following")}
              >
                {investorData.stats.following} Following
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2 bg-background border-b">
            <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground">
              Search
            </div>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto bg-background">
            {(showUserList === "followers" ? followersList : followingList)
              .length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-4">
                No users yet
              </p>
            ) : (
              (showUserList === "followers" ? followersList : followingList).map(
                (user) => (
                  <div
                    key={user.id}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    <button
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                        user.isFollowing
                          ? "bg-muted text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      <BottomNav />

      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}
    </div>
  );
};

export default Profile;
