import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lock, Send, FileText, Users, Building2, TrendingUp, Calendar, MapPin, Globe, ChevronLeft, BadgeCheck, MoreHorizontal, MoreVertical, Heart, Crown, MessageCircle } from "lucide-react";

// Mock data - in real app this would come from API/database
const companyData: Record<string, any> = {
  "airbound-co": {
    name: "airbound.co",
    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    tagline: "Revolutionary drone delivery for urban logistics",
    isPublic: true,
    followers: 2847,
    following: 124,
    description: "Airbound.co is pioneering the future of urban logistics with our autonomous drone delivery network. We're building infrastructure to enable same-day delivery across major metropolitan areas.",
    founded: "2022",
    startupType: "Pre-revenue",
    rounds: 2,
    totalRaised: "$2M",
    investorNames: ["Y Combinator", "Sequoia", "a16z"],
    currentRound: "Series A",
    oneliner: "Autonomous drone delivery network for urban logistics.",
    location: "San Francisco, CA",
    website: "https://airbound.co",
    industry: "Logistics & Transportation",
    preRevenue: "$5M",
    postValuation: "$12M",
    fundsRaised: "$2M",
    currentInvestors: ["Y Combinator", "Sequoia", "a16z"],
    fundingGoal: "$3M Series A",
    pitchDeckPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []

  }
};

const CompanyProfile = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [invitationSent, setInvitationSent] = useState(false);
  const [pitchRequested, setPitchRequested] = useState(false);

  const company = companyId ? companyData[companyId] : null;
  const fromPath = location.state?.from || null;
  const [showUserList, setShowUserList] = useState<null | "followers" | "following">(null);

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="pt-14 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Company not found</h2>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState<'posts' | 'expand' | 'trades'>('posts');
  const [showReels, setShowReels] = useState(false);
  const followersList = [
    { id: 1, name: "Ava Johnson", username: "@avaj", avatar: "https://randomuser.me/api/portraits/women/1.jpg", isFollowing: false },
    { id: 2, name: "Michael Chen", username: "@mchen", avatar: "https://randomuser.me/api/portraits/men/2.jpg", isFollowing: true },
    { id: 3, name: "Sophia Patel", username: "@spatel", avatar: "https://randomuser.me/api/portraits/women/3.jpg", isFollowing: false }
  ];

  const followingList = [
    { id: 5, name: "Liam Parker", username: "@liamp", avatar: "https://randomuser.me/api/portraits/men/4.jpg", isFollowing: true },
    { id: 6, name: "Emma Davis", username: "@emd", avatar: "https://randomuser.me/api/portraits/women/5.jpg", isFollowing: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Instagram-style Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(fromPath || "/")}
              className="hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <h1 className="font-semibold text-lg mb-1">{company.name}</h1>
          </div>

          {/* RIGHT SIDE – THREE DOTS */}
          <button className="hover:opacity-70 transition-opacity">
            <MoreHorizontal className="h-6 w-6" />
          </button>

        </div>

      </header>

      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto bg-background">
          {/* Profile Section */}
          <div className="px-4 pt-5 pb-2">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-20 w-20 border border-border">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback className="bg-muted text-foreground text-xl">{company.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-1">
                <h2 className="font-semibold text-base mb-0.5">{company.name.split('.')[0]}</h2>

                <div className="flex gap-10 text-md mb-1">
                  <div className="text-center">
                    <div className="font-semibold">342</div>
                    <div className="text-muted-foreground text-xs">posts</div>
                  </div>
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => setShowUserList("followers")}
                  >
                    <div className="font-semibold">{company.followers?.toLocaleString() || '0'}</div>
                    <div className="text-muted-foreground text-xs">followers</div>
                  </div>

                  <div
                    className="text-center cursor-pointer"
                    onClick={() => setShowUserList("following")}
                  >
                    <div className="font-semibold">{company.following?.toLocaleString() || '0'}</div>
                    <div className="text-muted-foreground text-xs">following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Badge and Location */}
            <div className="space-y-1.5 text-sm mb-5">
              <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
              
                  <span className="text-foreground">Verified startup</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{company.location}</span>
              </div>
              </div>
              <p className="text-foreground/90 leading-relaxed">{company.oneliner}</p>
            </div>

            {/* Follow and Message Buttons */}
            <div className="flex gap-2 mb-2">
              <Button
                className="flex-1 h-8 text-sm  font-semibold bg-cyan-500 hover:bg-cyan-600 text-white rounded-none"
                variant="default"
              >
                Follow
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-8 text-sm font-semibold border-border rounded-none"
              >
                Message
              </Button>
            </div>

          </div>

          {/* Tabs Section */}
          <div className="mt-3">
            <div className="grid grid-cols-3 text-center">
              <button
                onClick={() => {
                  if (activeSection === 'posts') {
                    setShowReels(!showReels);
                  } else {
                    setActiveSection('posts');
                  }
                }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeSection === 'posts'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground'
                  }`}
              >
                {activeSection === 'posts' ? (showReels ? 'Reels' : 'Posts') : 'Posts'}
                {activeSection === 'posts' && (
                  <ChevronLeft
                    className={`h-3.5 w-3.5 transition-transform ${showReels ? '-rotate-90' : 'rotate-90'}`}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveSection('expand')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === 'expand'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground'
                  }`}
              >
                Expand
              </button>
              <button
                onClick={() => setActiveSection('trades')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === 'trades'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground'
                  }`}
              >
                Trades
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-4 py-4">
            {activeSection === 'posts' && (
              <div className="-mx-4">
                {/* Grid of Posts/Reels */}
                <div className="grid grid-cols-3 gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <div key={item} className="aspect-square bg-muted relative overflow-hidden">
                      {item % 3 === 0 && (
                        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 backdrop-blur-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'expand' && (
              
              <div className="space-y-4">
                <div className="-mx-4 sm:mx-0">
                  <div className="w-full aspect-video bg-muted">
                    Video comes here
                  </div>
                </div>
              <Card className="border-border/50 flex items-center p-2 justify-around">
              <div className="flex items-center gap-2 p-2 space-y-1">
                <Heart
                  className={`!h-6 !w-6 transition-all`}
                />
                {22}
                </div>
              <div className="flex items-center gap-2 p-4 space-y-3">
                    <Crown
                      className={`!h-6 !w-6 transition-all`}
                    />
                {10}
                </div>
              <div className="flex items-center gap-2 p-4 space-y-3">
                    <MessageCircle
                      className="!h-6 !w-6 text-foreground hover:text-accent transition-colors"
                    />
                {20}
                </div>
              <div className="flex items-center gap-2 p-4 space-y-3">
                    <Send className="w-5 h-5 text-foreground hover:text-accent" />
                {8}
                </div>
              </Card>

                <Card className="border-border/50">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">What's {company.name}</h3>
                    <p className="text-sm text-foreground/90 leading-relaxed">{company.description}</p>
                  </div>
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <button
                      onClick={() => setPitchRequested(true)}
                      className={`py-1.5 px-3  text-xs font-medium transition-colors
                        ${pitchRequested
                          ? "bg-primary/20 text-green border-primary"
                          : "border border-grey text-white hover:bg-primary/10"}`}
                      disabled={pitchRequested}
                    >
                      {pitchRequested ? "Requested" : "Request Pitch Deck"}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Company Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>{company.industry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Founded {company.founded}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{company.teamSize} employees</span>
                      </div> */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4 text-primary" />
                        <a href={`https://${company.website}`} className="hover:text-primary transition-colors">{company.website}</a>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-border/50">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Team</h3>

                    <div className="flex justify-center flex-wrap gap-6">
                      {/* Example team data with profileId */}
                      {[
                        { name: "Alice Smith", profileId: "alice-smith" },
                        { name: "Bob Johnson", profileId: "bob-johnson" },
                        { name: "Carol Davis", profileId: null }, // no profile
                      ].map((member, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 w-20 cursor-pointer"
                          onClick={() => {
                            if (member.profileId) {
                              navigate(`/user/${member.profileId}`);
                            }
                          }}
                        >
                          <Avatar className="h-12 w-12 border border-border">
                            <AvatarFallback className="bg-muted text-foreground text-lg">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <span className="text-sm text-white-foreground text-center">
                            {member.name}
                          </span>
                          <span className="text-xs text-muted-foreground text-center">
                                CEO
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Financial Overview */}
                <Card className="border-border/50">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Financial Overview</h3>

                    <div className="space-y-3 text-sm">

                      {/* Startup Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Startup Type</span>
                        <span className="font-semibold">{company.startupType}</span>
                      </div>

                      {/* Rounds */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rounds Raised</span>
                        <span className="font-semibold">{company.rounds}</span>
                      </div>

                      {/* Total Raised */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Raised</span>
                        <span className="font-semibold">{company.totalRaised}</span>
                      </div>

                      {/* Total Investors */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Investors</span>
                        <span className="font-semibold">{company.investorNames.join(", ")}</span>
                      
                      </div>

                      {/* Current Round */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Round</span>
                        <span className="font-semibold">{company.currentRound}</span>
                      </div>


                      {/* Round Status */}

                      {/* Round Progress Bar */}
                      <div className="mt-2">
                        <div className="h-7  bg-card border border-border overflow-hidden">
                          <div
                            className="h-full bg-[#878787] transition-all"
                            style={{ width: "15%" }} // ← adjust dynamically if needed
                          />
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">180,000$ Filled</span>
                          <span className="text-xs text-muted-foreground">$1,200,000</span>
                        </div>
                      </div>


                    </div>

                  </div>
                </Card>


                {/* Current Investors */}

              </div>
            )}

            {activeSection === 'trades' && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No trades available</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {showUserList && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">

          {/* Top bar */}
          <div className="bg-background px-4 pt-4 pb-3 border-b flex items-center justify-between">
            <button
              onClick={() => setShowUserList(null)}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <h2 className="text-base font-semibold">
              {company.name.toLowerCase()}
            </h2>

            <div className="w-6" /> {/* spacer */}
          </div>

          {/* Tabs */}
          <div className="bg-background border-b">
            <div className="flex items-center justify-around text-sm">
              <button
                className={`py-3 flex-1 ${showUserList === "followers"
                    ? "font-semibold border-b-2 border-white"
                    : "text-muted-foreground"
                  }`}
                onClick={() => setShowUserList("followers")}
              >
                {company.followers.toLocaleString()} Followers
              </button>

              <button
                className={`py-3 flex-1 ${showUserList === "following"
                    ? "font-semibold border-b-2 border-white"
                    : "text-muted-foreground"
                  }`}
                onClick={() => setShowUserList("following")}
              >
                {company.following.toLocaleString()} Following
              </button>


            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-2 bg-background border-b">
            <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground">
              Search
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto bg-background">
            {(showUserList === "followers" ? followersList : followingList).map(
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
                      <p className="text-xs text-muted-foreground">{user.name}</p>
                    </div>
                  </div>

                  <button
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium ${user.isFollowing
                        ? "bg-muted text-white"
                        : "bg-blue-600 text-white"
                      }`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CompanyProfile;
