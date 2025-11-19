import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, Target, Rocket, Calendar, Building2, CheckCircle2, ChevronLeft } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

const StartupProfile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Airbound";
  const userId = localStorage.getItem("userId") || "airbound";

  // Mock startup data based on selected user
  const startupData = {
    name: userName === "Airbound" ? "Airbound" : "Zlyft",
    username: userName === "Airbound" ? "@airbound" : "@zlyft",
    logo: userId === "airbound"
      ? "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop"
      : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
    tagline: userName === "Airbound" 
      ? "Revolutionizing air travel with sustainable technology"
      : "Next-gen ride-sharing platform",
    description: userName === "Airbound"
      ? "Building the next generation of electric aircraft for urban air mobility. Making sustainable air travel accessible to everyone."
      : "Creating a seamless ride-sharing experience with AI-powered route optimization and driver matching.",
    location: userName === "Airbound" ? "San Francisco, CA" : "Bangalore, India",
    founded: userName === "Airbound" ? "2023" : "2024",
    industry: userName === "Airbound" ? "Aviation Tech" : "Transportation",
    stage: userName === "Airbound" ? "Seed" : "Pre-Seed",
    stats: {
      followers: userName === "Airbound" ? 1247 : 342,
      teamSize: userName === "Airbound" ? 12 : 5,
      fundingRaised: userName === "Airbound" ? 2500000 : 0,
      valuation: userName === "Airbound" ? 15000000 : 0,
      equityLeft: userName === "Airbound" ? 75 : 100,
      investorAllocation: userName === "Airbound" ? 25 : 0
    }
  };

  const [milestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Launched Beta Platform",
      date: "2024-01-15",
      description: "Successfully launched beta version with 100+ early users",
      completed: true
    },
    {
      id: "2",
      title: "Secured Seed Funding",
      date: "2024-02-20",
      description: "Raised $2.5M in seed funding from top VCs",
      completed: true
    },
    {
      id: "3",
      title: "Hit 1K Active Users",
      date: "2024-03-10",
      description: "Reached milestone of 1,000 active monthly users",
      completed: true
    },
    {
      id: "4",
      title: "Series A Target",
      date: "2024-12-31",
      description: "Planning to raise Series A by end of 2024",
      completed: false
    }
  ]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return '$' + (num / 1000).toFixed(0) + 'K';
    }
    return '$' + num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Instagram-style Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted/80 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          
          <h2 className="font-medium text-base text-foreground">
            {startupData.username.replace('@', '')}
          </h2>
          
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-14">
        <div className="max-w-2xl mx-auto">
          {/* Instagram-style Profile Header */}
          <div className="px-4 pt-4 pb-2">
            {/* Avatar, Name, and Stats Row */}
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={startupData.logo} alt={startupData.name} />
                  <AvatarFallback className="text-xl bg-muted">
                    {startupData.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name and Stats */}
              <div className="flex-1 min-w-0">
                {/* Name with verification */}
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-base font-semibold text-foreground truncate">
                    {startupData.name}
                  </h1>
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                </div>

                {/* Stats Row - Instagram Style */}
                <div className="flex gap-6">
                  <button className="flex flex-col items-center">
                    <p className="text-base font-semibold text-foreground">
                      {startupData.stats.followers}
                    </p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </button>
                  <button className="flex flex-col items-center">
                    <p className="text-base font-semibold text-foreground">
                      {startupData.stats.teamSize}
                    </p>
                    <p className="text-xs text-muted-foreground">team size</p>
                  </button>
                  <button className="flex flex-col items-center">
                    <p className="text-base font-semibold text-foreground">
                      {formatNumber(startupData.stats.fundingRaised)}
                    </p>
                    <p className="text-xs text-muted-foreground">raised</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              {startupData.location}
            </div>

            {/* Tagline and Description */}
            <p className="text-sm font-medium text-foreground mb-1">
              {startupData.tagline}
            </p>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {startupData.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">{startupData.industry}</Badge>
              <Badge variant="secondary" className="text-xs">{startupData.stage}</Badge>
              <Badge variant="outline" className="text-xs">Founded {startupData.founded}</Badge>
            </div>
          </div>

          {/* Tabbed Content Section */}
          <div className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 px-4">
                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Industry</span>
                      <span className="text-sm font-semibold text-foreground">{startupData.industry}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t">
                      <span className="text-sm text-muted-foreground">Stage</span>
                      <span className="text-sm font-semibold text-foreground">{startupData.stage}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t">
                      <span className="text-sm text-muted-foreground">Founded</span>
                      <span className="text-sm font-semibold text-foreground">{startupData.founded}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-semibold text-foreground">{startupData.location}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Equity & Funding Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Equity & Valuation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Valuation</p>
                      <h2 className="text-2xl font-bold text-foreground">
                        {formatNumber(startupData.stats.valuation)}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Equity Left</p>
                        <p className="text-lg font-semibold text-foreground">
                          {startupData.stats.equityLeft}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Investor Allocation</p>
                        <p className="text-lg font-semibold text-foreground">
                          {startupData.stats.investorAllocation}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Raised</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatNumber(startupData.stats.fundingRaised)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Stage</p>
                        <p className="text-sm font-semibold text-foreground">{startupData.stage}</p>
                      </div>
                    </div>

                  </CardContent>
                  
                </Card>

                {/* Team Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Team Size</span>
                      <span className="text-sm font-semibold text-foreground">{startupData.stats.teamSize} members</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-4 px-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Key Milestones
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      <Rocket className="h-3 w-3 mr-1" />
                      {milestones.filter(m => m.completed).length}/{milestones.length} Complete
                    </Badge>
                  </div>

                  {milestones.map((milestone) => (
                    <Card key={milestone.id} className={milestone.completed ? "border-green-500/50" : "border-orange-500/50"}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            {milestone.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <Target className="h-5 w-5 text-orange-600 mt-0.5" />
                            )}
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">
                                {milestone.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={milestone.completed ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {milestone.completed ? "Done" : "Planned"}
                          </Badge>
                        </div>

                        <div className="mt-3 pt-3 border-t flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(milestone.date)}
                        </div>
                      </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupProfile;
