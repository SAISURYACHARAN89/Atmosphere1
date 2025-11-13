import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lock, Send, FileText, Users, Building2, TrendingUp, Calendar, MapPin, Globe, ChevronLeft } from "lucide-react";

// Mock data - in real app this would come from API/database
const companyData: Record<string, any> = {
  "airbound-co": {
    name: "Airbound.co",
    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    tagline: "Revolutionary drone delivery for urban logistics",
    isPublic: true,
    followers: 2847,
    following: 124,
    description: "Airbound.co is pioneering the future of urban logistics with our autonomous drone delivery network. We're building infrastructure to enable same-day delivery across major metropolitan areas.",
    founded: "2022",
    location: "San Francisco, CA",
    website: "airbound.co",
    teamSize: "15-20",
    industry: "Logistics & Transportation",
    preValuation: "$5M",
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
  },
  "skyt-air": {
    name: "Skyt Air",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    tagline: "AI-powered air traffic management system",
    isPublic: false,
    description: "Skyt Air develops next-generation air traffic management solutions using artificial intelligence and machine learning to optimize flight paths and reduce delays.",
    founded: "2021",
    location: "Austin, TX",
    website: "skytair.com",
    teamSize: "10-15",
    industry: "Aviation & AI",
    preValuation: "$8M",
    postValuation: "$18M",
    fundsRaised: "$4M",
    currentInvestors: ["Techstars", "500 Startups"],
    fundingGoal: "$5M Series A",
    pitchDeckPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []
  },
  "neuralhealth": {
    name: "NeuralHealth",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    tagline: "AI diagnostics for early disease detection",
    isPublic: true,
    followers: 5431,
    following: 89,
    description: "NeuralHealth leverages advanced AI algorithms to detect diseases earlier than traditional methods, improving patient outcomes and reducing healthcare costs.",
    founded: "2020",
    location: "Boston, MA",
    website: "neuralhealth.ai",
    teamSize: "25-30",
    industry: "Healthcare & AI",
    preValuation: "$15M",
    postValuation: "$35M",
    fundsRaised: "$8M",
    currentInvestors: ["Founders Fund", "Khosla Ventures"],
    fundingGoal: "$6M Series B",
    pitchDeckPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []
  },
  "greencharge": {
    name: "GreenCharge",
    logo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    tagline: "Solar-powered EV charging network for highways",
    isPublic: false,
    description: "GreenCharge is building a nationwide network of solar-powered EV charging stations along major highways, making long-distance electric travel more accessible and sustainable.",
    founded: "2021",
    location: "Denver, CO",
    website: "greencharge.io",
    teamSize: "20-25",
    industry: "Clean Energy & Infrastructure",
    preValuation: "$10M",
    postValuation: "$25M",
    fundsRaised: "$5M",
    currentInvestors: ["Tesla Ventures", "Climate Fund"],
    pitchDeckPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []
  },
  "foodflow": {
    name: "FoodFlow",
    logo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
    tagline: "B2B food supply chain automation platform",
    isPublic: true,
    followers: 1923,
    following: 156,
    description: "FoodFlow revolutionizes the B2B food supply chain with our automation platform, connecting restaurants, suppliers, and distributors in one seamless ecosystem.",
    founded: "2022",
    location: "New York, NY",
    website: "foodflow.com",
    teamSize: "12-18",
    industry: "Food Tech & Supply Chain",
    preValuation: "$7M",
    postValuation: "$16M",
    fundsRaised: "$3.5M",
    currentInvestors: ["Greylock Partners", "First Round"],
    fundingGoal: "$4M Series A",
    pitchDeckPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []
  },
  "codementor-ai": {
    name: "CodeMentor AI",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
    tagline: "AI-powered coding education and mentorship",
    isPublic: false,
    description: "CodeMentor AI provides personalized coding education through AI-powered mentorship, helping developers learn faster and build better software.",
    founded: "2023",
    location: "Seattle, WA",
    website: "codementor.ai",
    teamSize: "8-12",
    industry: "EdTech & AI",
    preValuation: "$12M",
    postValuation: "$28M",
    fundsRaised: "$6M",
    currentInvestors: ["Accel", "Index Ventures"],
    fundingGoal: "$5M Series A",
    pitchDeckPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop"
    ],
    videos: [],
    reels: []
  },
  "urbanfarm": {
    name: "UrbanFarm",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=100&h=100&fit=crop",
    tagline: "Vertical farming solutions for city buildings",
    isPublic: true,
    followers: 3254,
    following: 201,
    description: "UrbanFarm transforms unused urban spaces into productive vertical farms, bringing fresh produce closer to consumers while reducing environmental impact.",
    founded: "2021",
    location: "Chicago, IL",
    website: "urbanfarm.tech",
    teamSize: "15-20",
    industry: "AgTech & Sustainability",
    preValuation: "$9M",
    postValuation: "$22M",
    fundsRaised: "$4.5M",
    currentInvestors: ["Y Combinator", "Climate Capital"],
    fundingGoal: "$4M Seed Round",
    pitchDeckPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
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
  
  const company = companyId ? companyData[companyId] : null;
  const fromPath = location.state?.from || null;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Instagram-style Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => navigate(fromPath || "/")}
            className="hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-semibold text-lg">{company.name}</h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto bg-background">
          {/* Profile Section */}
          <div className="px-4 pt-5 pb-2">
            <div className="flex items-start gap-4 mb-3">
              <Avatar className="h-20 w-20 border border-border">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback className="bg-muted text-foreground text-xl">{company.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 pt-1">
                <h2 className="font-normal text-sm mb-1">{company.name}</h2>
                
                <div className="flex gap-6 text-xs">
                  <div className="text-center">
                    <div className="font-semibold">342</div>
                    <div className="text-muted-foreground">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{company.isPublic ? company.followers?.toLocaleString() || '0' : '0'}</div>
                    <div className="text-muted-foreground">followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{company.isPublic ? company.following?.toLocaleString() || '0' : '0'}</div>
                    <div className="text-muted-foreground">following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location and Bio */}
            <div className="space-y-1 text-sm mb-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{company.location}</span>
              </div>
              <p className="text-foreground/90 leading-relaxed">{company.description}</p>
            </div>

            {/* Follow and Message Buttons */}
            <div className="flex gap-2 mb-3">
              <Button className="flex-1 h-8 text-sm font-semibold" variant="default">
                Follow
              </Button>
              <Button variant="outline" className="flex-1 h-8 text-sm font-semibold">
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
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeSection === 'posts'
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
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'expand'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Expand
              </button>
              <button
                onClick={() => setActiveSection('trades')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'trades'
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
              <div className="space-y-4">
                {/* Grid of Posts/Reels */}
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-muted rounded-sm" />
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'expand' && (
              <div className="space-y-4">
                {/* Company Details */}
                <Card className="border-border/50">
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
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{company.teamSize} employees</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4 text-primary" />
                        <a href={`https://${company.website}`} className="hover:text-primary transition-colors">{company.website}</a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Financial Overview */}
                <Card className="border-border/50">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Financial Overview</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Pre-Valuation</div>
                        <div className="font-semibold">{company.preValuation}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Post-Valuation</div>
                        <div className="font-semibold">{company.postValuation}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Funds Raised</div>
                        <div className="font-semibold">{company.fundsRaised}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Goal</div>
                        <div className="font-semibold">{company.fundingGoal}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Current Investors */}
                <Card className="border-border/50">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Current Investors</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.currentInvestors?.map((investor: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{investor}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'trades' && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No trades available</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent my-2" />

          {/* Financial Details */}
          <div className="m-6">
            <Card className="border-primary/20 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  Financial Overview
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pre-Valuation</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{company.preValuation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Post-Valuation</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{company.postValuation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Funds Raised</p>
                    <p className="text-2xl font-bold">{company.fundsRaised}</p>
                  </div>
                  {company.fundingGoal && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Funding Goal</p>
                      <p className="text-2xl font-bold">{company.fundingGoal}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Current Investors</p>
                  <div className="flex flex-wrap gap-2">
                    {company.currentInvestors.map((investor: string) => (
                      <Badge key={investor} variant="secondary" className="px-3 py-1 text-xs font-medium shadow-sm">
                        {investor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pitch Deck Access */}
          <div className="mx-6 mb-6">
            <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Pitch Deck</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {company.pitchDeckPublic ? "Public" : "Private - Invitation required"}
                    </p>
                  </div>
                </div>
                {company.pitchDeckPublic ? (
                  <Button variant="outline" size="sm" className="font-semibold">
                    View Deck
                  </Button>
                ) : (
                  <Button
                    variant={invitationSent ? "secondary" : "default"}
                    size="sm"
                    onClick={() => setInvitationSent(true)}
                    disabled={invitationSent}
                    className="font-semibold"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {invitationSent ? "Sent" : "Request"}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-2" />

          {/* Content Tabs */}
          <Tabs defaultValue="photos" className="w-full">
            <div className="sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10 border-b">
              <TabsList className="w-full h-14 grid grid-cols-3 rounded-none bg-transparent">
                <TabsTrigger value="photos" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="reels" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Reels
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="photos" className="px-0.5 mt-0.5">
              <div className="grid grid-cols-3 gap-0.5">
                {company.photos.map((photo: string, index: number) => (
                  <button 
                    key={index} 
                    className="aspect-square overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={photo}
                      alt={`${company.name} photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {company.photos.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  No photos available
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="px-0.5 mt-0.5">
              <div className="grid grid-cols-3 gap-0.5">
                {company.videos.map((video: string, index: number) => (
                  <button key={index} className="aspect-square bg-muted rounded-sm hover:opacity-90 transition-opacity" />
                ))}
              </div>
              {company.videos.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  No videos available
                </div>
              )}
            </TabsContent>

            <TabsContent value="reels" className="px-0.5 mt-0.5">
              <div className="grid grid-cols-3 gap-0.5">
                {company.reels.map((reel: string, index: number) => (
                  <button key={index} className="aspect-[9/16] bg-muted rounded-sm hover:opacity-90 transition-opacity" />
                ))}
              </div>
              {company.reels.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  No reels available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CompanyProfile;
