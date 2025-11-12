import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Menu, MapPin, TrendingUp, TrendingDown, DollarSign, Target, Activity, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle2, XCircle, Plus } from "lucide-react";

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
}

const Profile = () => {
  const navigate = useNavigate();
  const isVerified = localStorage.getItem("isVerified") === "true";
  const userName = localStorage.getItem("userName") || "John";
  const userId = localStorage.getItem("userId") || "john";

  // Mock investor data
  const investorData = {
    name: "John Anderson",
    username: "@johnanderson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Angel investor | Early stage startup enthusiast | Focus on AI & SaaS",
    location: "San Francisco, CA",
    stats: {
      followers: 2847,
      following: 342,
      postsSaved: 156,
      profileViews: 1893
    }
  };

  // Investment portfolio data
  const [investments] = useState<Investment[]>([
    {
      id: "1",
      companyName: "Airbound.co",
      companyLogo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
      sector: "Logistics",
      investmentAmount: 150000,
      currentValue: 285000,
      shares: 5000,
      investmentDate: "2023-03-15",
      status: "active",
      returnPercentage: 90.0
    },
    {
      id: "2",
      companyName: "NeuralHealth",
      companyLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
      sector: "HealthTech",
      investmentAmount: 250000,
      currentValue: 520000,
      shares: 8000,
      investmentDate: "2022-11-20",
      status: "active",
      returnPercentage: 108.0
    },
    {
      id: "3",
      companyName: "GreenCharge",
      companyLogo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
      sector: "CleanTech",
      investmentAmount: 200000,
      currentValue: 340000,
      shares: 6500,
      investmentDate: "2023-06-10",
      status: "active",
      returnPercentage: 70.0
    },
    {
      id: "4",
      companyName: "CodeMentor AI",
      companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
      sector: "EdTech",
      investmentAmount: 100000,
      currentValue: 95000,
      shares: 3000,
      investmentDate: "2024-01-05",
      status: "active",
      returnPercentage: -5.0
    },
    {
      id: "5",
      companyName: "FoodFlow",
      companyLogo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
      sector: "Supply Chain",
      investmentAmount: 175000,
      currentValue: 260000,
      shares: 5500,
      investmentDate: "2023-08-22",
      status: "active",
      returnPercentage: 48.6
    }
  ]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const currentPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = currentPortfolioValue - totalInvested;
  const totalReturnPercentage = ((totalReturn / totalInvested) * 100).toFixed(1);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
        <div className="max-w-2xl mx-auto flex items-center justify-center px-4 h-14">
          <h2 className="font-medium text-base text-foreground">
            {investorData.username.replace('@', '')}
          </h2>
        </div>
      </header>
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Instagram-style Profile Header */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar with Story Ring */}
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={investorData.avatar} alt={investorData.name} />
                  <AvatarFallback className="text-xl bg-muted">
                    {investorData.name[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Plus className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </button>
              </div>

              {/* Stats in a row */}
              <div className="flex-1 flex justify-around items-center pt-2">
                <button className="flex flex-col items-center">
                  <p className="text-base font-semibold text-foreground">
                    {formatNumber(investorData.stats.postsSaved)}
                  </p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </button>
                <button className="flex flex-col items-center">
                  <p className="text-base font-semibold text-foreground">
                    {formatNumber(investorData.stats.followers)}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </button>
                <button className="flex flex-col items-center">
                  <p className="text-base font-semibold text-foreground">
                    {formatNumber(investorData.stats.following)}
                  </p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </button>
              </div>

              {/* Action Icons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                  className="h-8 w-8"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Name with Verification */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">
                  {investorData.name}
                </h1>
                {isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              {investorData.location}
            </div>

            {/* Bio */}
            <p className="text-sm text-foreground leading-relaxed">
              {investorData.bio}
            </p>
          </div>

          {/* Tabbed Content Section */}
          <div className="mt-4">
            {!isVerified ? (
              <Card className="mx-4">
                <CardContent className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Portfolio Not Visible
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Verify your account to showcase your portfolio to others
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="criteria">Criteria</TabsTrigger>
                </TabsList>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-3 px-4">
                {/* Portfolio Summary Header */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      Portfolio Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Portfolio Value</p>
                      <h2 className="text-xl font-bold text-foreground">
                        {formatCurrency(currentPortfolioValue)}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Invested</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(totalInvested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Return</p>
                        <div className="flex items-center gap-1">
                          {totalReturn >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <p className={`text-sm font-semibold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(totalReturn))}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">%</p>
                        <div className="flex items-center gap-1">
                          {parseFloat(totalReturnPercentage) >= 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <p className={`text-sm font-semibold ${parseFloat(totalReturnPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalReturnPercentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Investments */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-foreground">
                      Active Investments ({investments.length})
                    </h3>
                    <Badge variant="outline" className="text-xs h-5">
                      <Activity className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>

                  {investments.map((investment) => (
                    <Card key={investment.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={investment.companyLogo} alt={investment.companyName} />
                              <AvatarFallback>{investment.companyName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-foreground text-xs">
                                {investment.companyName}
                              </h4>
                              <p className="text-xs text-muted-foreground">{investment.sector}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={investment.returnPercentage >= 0 ? "default" : "destructive"}
                            className="text-xs h-5"
                          >
                            {investment.returnPercentage >= 0 ? '+' : ''}
                            {investment.returnPercentage.toFixed(1)}%
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-0.5 text-xs">Invested</p>
                            <p className="font-semibold text-foreground text-xs">
                              {formatCurrency(investment.investmentAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-0.5 text-xs">Current</p>
                            <p className="font-semibold text-foreground text-xs">
                              {formatCurrency(investment.currentValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-0.5 text-xs">Shares</p>
                            <p className="font-semibold text-foreground text-xs">
                              {investment.shares.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(investment.investmentDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            {investment.currentValue > investment.investmentAmount ? (
                              <ArrowUpRight className="h-3 w-3 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs font-semibold ${
                              investment.currentValue > investment.investmentAmount 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {formatCurrency(Math.abs(investment.currentValue - investment.investmentAmount))}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Criteria Tab */}
              <TabsContent value="criteria" className="space-y-3 px-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Investment Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">
                        Preferred Industries
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["AI & ML", "SaaS", "FinTech", "HealthTech"].map(tag => (
                          <span 
                            key={tag}
                            className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-1">
                      <p className="text-xs font-medium text-foreground mb-1">Stage Preference</p>
                      <p className="text-xs text-muted-foreground">Pre-seed, Seed, Series A</p>
                    </div>

                    <div className="pt-1">
                      <p className="text-xs font-medium text-foreground mb-1">Geographic Focus</p>
                      <p className="text-xs text-muted-foreground">North America, Europe</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Investment Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-2">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-xs text-muted-foreground">Typical Check Size</span>
                      <span className="text-xs font-semibold text-foreground">$50K - $500K</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-t">
                      <span className="text-xs text-muted-foreground">Sweet Spot</span>
                      <span className="text-xs font-semibold text-foreground">$150K - $250K</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
