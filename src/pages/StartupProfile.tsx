import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Menu, MapPin, TrendingUp, Users, DollarSign, Target, Rocket, Calendar, Building2, CheckCircle2 } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

const StartupProfile = () => {
  const navigate = useNavigate();
  const isVerified = localStorage.getItem("isVerified") === "true";

  // Mock startup data
  const startupData = {
    name: "TechVenture AI",
    username: "@techventureai",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop",
    tagline: "AI-powered business intelligence for modern enterprises",
    description: "Building the next generation of AI tools to help businesses make data-driven decisions faster and more accurately.",
    location: "San Francisco, CA",
    founded: "2023",
    industry: "AI & ML",
    stage: "Seed",
    stats: {
      followers: 1247,
      teamSize: 12,
      fundingRaised: 2500000,
      valuation: 15000000
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
      <TopBar />
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Professional Header Section */}
          <div className="bg-card border-b">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={startupData.logo} alt={startupData.name} />
                    <AvatarFallback className="text-xl bg-muted">
                      {startupData.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl font-semibold text-foreground">
                        {startupData.name}
                      </h1>
                      {isVerified && (
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {startupData.username}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {startupData.location}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm font-medium text-foreground mb-2">
                {startupData.tagline}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {startupData.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{startupData.industry}</Badge>
                <Badge variant="secondary">{startupData.stage}</Badge>
                <Badge variant="outline">Founded {startupData.founded}</Badge>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 border-t">
              <button className="p-4 text-center hover:bg-muted/50 transition-colors">
                <p className="text-lg font-semibold text-foreground">
                  {startupData.stats.followers}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {startupData.stats.teamSize}
                </p>
                <p className="text-xs text-muted-foreground">Team Size</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(startupData.stats.fundingRaised)}
                </p>
                <p className="text-xs text-muted-foreground">Raised</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(startupData.stats.valuation)}
                </p>
                <p className="text-xs text-muted-foreground">Valuation</p>
              </button>
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

                {/* Funding Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Funding Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Valuation</p>
                      <h2 className="text-2xl font-bold text-foreground">
                        {formatNumber(startupData.stats.valuation)}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
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

      <BottomNav />
    </div>
  );
};

export default StartupProfile;
