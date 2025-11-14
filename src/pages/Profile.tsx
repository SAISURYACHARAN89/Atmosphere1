import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Menu, MapPin, TrendingUp, TrendingDown, DollarSign, Target, Activity, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle2, XCircle, Plus, ChevronLeft } from "lucide-react";

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
  const userName = localStorage.getItem("userName") || "John";
  const userId = localStorage.getItem("userId") || "john";
  const [activeSection, setActiveSection] = useState<'posts' | 'expand' | 'trades'>('posts');
  const [showReels, setShowReels] = useState(false);

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
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button className="p-2 hover:bg-muted/80 rounded-lg transition-colors">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          
          <h2 className="font-semibold text-base text-foreground flex items-center gap-1.5">
            {investorData.username.replace('@', '')}
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
          </h2>
          
          <button className="p-2 hover:bg-muted/80 rounded-lg transition-colors">
            <Plus className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Instagram-style Profile Header */}
          <div className="px-4 pt-4 pb-2">
            {/* Avatar, Name, and Stats Row */}
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar with Story Ring */}
              <div className="relative flex-shrink-0">
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

              {/* Name, Stats, and Menu */}
              <div className="flex-1 min-w-0">
                {/* Name with menu */}
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-sm font-normal text-foreground truncate">
                    {investorData.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/settings")}
                    className="h-8 w-8 ml-auto flex-shrink-0"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>

                {/* Stats Row - Instagram Style */}
                <div className="flex gap-6">
                  <button className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.postsSaved)}
                    </p>
                    <p className="text-xs text-muted-foreground">posts</p>
                  </button>
                  <button className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.followers)}
                    </p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </button>
                  <button className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(investorData.stats.following)}
                    </p>
                    <p className="text-xs text-muted-foreground">following</p>
                  </button>
                </div>
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

          {/* Three Section Navigation */}
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

          {/* Content Sections */}
          <div className="px-4 py-4">
            {activeSection === 'posts' && (
              <div className="space-y-4">
                {/* Grid of Posts/Reels */}
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="aspect-square bg-muted rounded-sm flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span className="text-xs text-muted-foreground">
                        {showReels ? 'Reel' : 'Post'} {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'expand' && (
              <div className="space-y-4">
                    {/* Investor Overview */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground">Investor Profile</h3>
                      
                      <Card className="border-primary/20">
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">About</h4>
                            <p className="text-sm text-foreground leading-relaxed">
                              {investorData.bio}
                            </p>
                          </div>

                          <div className="pt-2 border-t">
                            <h4 className="text-xs font-medium text-muted-foreground mb-3">Investment Focus</h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-foreground">Industries</p>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {["AI & ML", "SaaS", "FinTech", "HealthTech"].map(tag => (
                                      <span 
                                        key={tag}
                                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-foreground">Stage</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">Pre-seed, Seed, Series A</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-foreground">Geography</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">North America, Europe</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-foreground">Check Size</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">$50K - $500K (Sweet spot: $150K - $250K)</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Investment Track Record</h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-lg font-bold text-foreground">{investments.length}</p>
                                <p className="text-xs text-muted-foreground">Companies</p>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-lg font-bold text-foreground">8</p>
                                <p className="text-xs text-muted-foreground">Years Active</p>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-lg font-bold text-green-600">{totalReturnPercentage}%</p>
                                <p className="text-xs text-muted-foreground">Avg Return</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Portfolio Performance */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">Portfolio Performance</h3>
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Wallet className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                            <p className="text-xl font-bold text-foreground">
                              {formatCurrency(currentPortfolioValue)}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Total Return</p>
                            <p className="text-xl font-bold text-green-600">
                              +{formatCurrency(totalReturn)}
                            </p>
                            <p className="text-xs text-green-600 font-medium">+{totalReturnPercentage}%</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Portfolio Breakdown */}
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Portfolio Composition</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-muted-foreground">Capital Deployed</span>
                              <span className="text-xs font-semibold text-foreground">{formatCurrency(totalInvested)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-muted-foreground">Active Investments</span>
                              <span className="text-xs font-semibold text-foreground">{investments.length} companies</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-muted-foreground">Avg. Investment</span>
                              <span className="text-xs font-semibold text-foreground">
                                {formatCurrency(totalInvested / investments.length)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Portfolio Holdings */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground">Portfolio Holdings</h3>
                      
                      <div className="space-y-2">
                        {investments.map((investment, index) => (
                          <Card 
                            key={investment.id} 
                            className="hover:shadow-lg transition-all cursor-pointer border-l-4"
                            style={{
                              borderLeftColor: investment.returnPercentage >= 0 
                                ? 'rgb(22, 163, 74)' 
                                : 'rgb(220, 38, 38)'
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-12 w-12 border-2">
                                      <AvatarImage src={investment.companyLogo} alt={investment.companyName} />
                                      <AvatarFallback className="font-semibold">{investment.companyName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center border">
                                      <span className="text-xs font-bold">#{index + 1}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground text-sm mb-0.5">
                                      {investment.companyName}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{investment.sector}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge 
                                    variant={investment.returnPercentage >= 0 ? "default" : "destructive"}
                                    className="text-xs mb-1"
                                  >
                                    {investment.returnPercentage >= 0 ? '+' : ''}
                                    {investment.returnPercentage.toFixed(1)}%
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    {investment.shares.toLocaleString()} shares
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-muted/50 p-2 rounded">
                                  <p className="text-xs text-muted-foreground mb-0.5">Invested</p>
                                  <p className="text-sm font-bold text-foreground">
                                    {formatCurrency(investment.investmentAmount)}
                                  </p>
                                </div>
                                <div className="bg-muted/50 p-2 rounded">
                                  <p className="text-xs text-muted-foreground mb-0.5">Current Value</p>
                                  <p className="text-sm font-bold text-foreground">
                                    {formatCurrency(investment.currentValue)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>Since {formatDate(investment.investmentDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {investment.currentValue > investment.investmentAmount ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className={`text-sm font-bold ${
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
                    </div>
              </div>
            )}

            {activeSection === 'trades' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Active Sales
                </h3>
                
                {/* Mock Trade Items */}
                {[
                  {
                    company: "Airbound.co",
                    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
                    shares: 1000,
                    price: 57,
                    totalValue: 57000
                  },
                  {
                    company: "NeuralHealth",
                    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
                    shares: 500,
                    price: 65,
                    totalValue: 32500
                  }
                ].map((trade, index) => (
                  <Card key={index} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={trade.logo} alt={trade.company} />
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
                          <p className="text-muted-foreground mb-0.5">Price per Share</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(trade.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-0.5">Total Value</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(trade.totalValue)}
                          </p>
                        </div>
                      </div>

                      <Button className="w-full mt-3" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
