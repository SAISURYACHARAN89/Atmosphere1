import { useState } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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

const Assets = () => {
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

  const sectorAllocation = investments.reduce((acc, inv) => {
    acc[inv.sector] = (acc[inv.sector] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const topSectors = Object.entries(sectorAllocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Portfolio Summary Header */}
          <div className="bg-card border-b p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
              <h1 className="text-3xl font-bold text-foreground">
                {formatCurrency(currentPortfolioValue)}
              </h1>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Return</p>
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
                <p className="text-xs text-muted-foreground mb-1">Return %</p>
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
          </div>

          {/* Tabs Navigation */}
          <div className="mt-6">
            <Tabs defaultValue="holdings" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Holdings Tab */}
              <TabsContent value="holdings" className="space-y-3 px-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">
                    Active Investments ({investments.length})
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>

                {investments.map((investment) => (
                  <Card key={investment.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={investment.companyLogo} alt={investment.companyName} />
                            <AvatarFallback>{investment.companyName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">
                              {investment.companyName}
                            </h3>
                            <p className="text-xs text-muted-foreground">{investment.sector}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={investment.returnPercentage >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {investment.returnPercentage >= 0 ? '+' : ''}
                          {investment.returnPercentage.toFixed(1)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground mb-1">Invested</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(investment.investmentAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Current Value</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(investment.currentValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Shares</p>
                          <p className="font-semibold text-foreground">
                            {investment.shares.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
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
              </TabsContent>

              {/* Allocation Tab */}
              <TabsContent value="allocation" className="space-y-4 px-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-primary" />
                      Sector Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topSectors.map(([sector, value]) => {
                      const percentage = ((value / currentPortfolioValue) * 100).toFixed(1);
                      return (
                        <div key={sector} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{sector}</span>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(value)}
                              </p>
                              <p className="text-xs text-muted-foreground">{percentage}%</p>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Investment Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Number of Investments</span>
                      <span className="text-sm font-semibold text-foreground">
                        {investments.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Average Investment</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(totalInvested / investments.length)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Largest Position</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(Math.max(...investments.map(i => i.currentValue)))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4 px-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investments
                      .sort((a, b) => b.returnPercentage - a.returnPercentage)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={investment.companyLogo} alt={investment.companyName} />
                              <AvatarFallback>{investment.companyName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {investment.companyName}
                              </p>
                              <p className="text-xs text-muted-foreground">{investment.sector}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">
                              +{investment.returnPercentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(investment.currentValue - investment.investmentAmount)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Total Capital Deployed</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(totalInvested)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Unrealized Gains</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(totalReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Portfolio IRR</span>
                      <span className="text-sm font-semibold text-foreground">42.3%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Average Hold Period</span>
                      <span className="text-sm font-semibold text-foreground">14 months</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Assets;
