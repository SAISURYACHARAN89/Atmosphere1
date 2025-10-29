import { useState } from "react";
import { Search, X, SlidersHorizontal, ArrowLeft, ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type TradeMode = "buy" | "sell" | null;

interface ActiveTrade {
  id: number;
  companyId: number;
  companyName: string;
  preMoneyValuation: string;
  postMoneyValuation: string;
  minRange: number;
  maxRange: number;
  views: number;
  saves: number;
}

const categories = [
  "AI", "ML", "DeepTech", "Manufacturing", "Cafe", "B2B", "B2C", "B2B2C",
  "Fintech", "SaaS", "HealthTech", "AgriTech", "D2C", "Logistics", "EV",
  "EdTech", "Robotics", "IoT", "Blockchain", "E-commerce", "FoodTech",
  "PropTech", "InsurTech", "LegalTech", "CleanTech", "BioTech", "Cybersecurity",
  "AR/VR", "Gaming", "Media", "Entertainment", "Travel", "Hospitality",
  "Fashion", "Beauty", "Sports", "Fitness", "Pet Care", "Home Services",
  "Construction", "Real Estate", "Energy", "Automotive", "Aerospace",
];

const sellers = [
  { id: 1, name: "Rajesh Mukarji", avatar: "" },
  { id: 2, name: "Joshua Paul", avatar: "" },
  { id: 3, name: "Priya Sharma", avatar: "" },
  { id: 4, name: "Alex Chen", avatar: "" },
  { id: 5, name: "Sarah Williams", avatar: "" },
];

const portfolio = [
  { id: 1, name: "Airbound Pvt Ltd", postMoneyValuation: "₹50,00,000", preMoneyValuation: "₹35,00,000" },
  { id: 2, name: "Zlyft Autonomy Pvt Ltd", postMoneyValuation: "₹1,20,00,000", preMoneyValuation: "₹80,00,000" },
];

const Trade = () => {
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [minRange, setMinRange] = useState<number>(10);
  const [maxRange, setMaxRange] = useState<number>(50);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);

  const showContent = tradeMode !== null;
  const showSellers = searchValue.trim() !== "" || selectedCategories.length > 0;

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCompanyClick = (companyId: number) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  const handleOpenTrade = () => {
    if (expandedCompany === null) return;
    
    const company = portfolio.find(c => c.id === expandedCompany);
    if (!company) return;

    const newTrade: ActiveTrade = {
      id: Date.now(),
      companyId: company.id,
      companyName: company.name,
      preMoneyValuation: company.preMoneyValuation,
      postMoneyValuation: company.postMoneyValuation,
      minRange,
      maxRange,
      views: 0,
      saves: 0,
    };

    setActiveTrades([...activeTrades, newTrade]);
    setExpandedCompany(null);
    setMinRange(10);
    setMaxRange(50);
  };

  const handleDeleteTrade = (tradeId: number) => {
    setActiveTrades(activeTrades.filter(trade => trade.id !== tradeId));
  };

  const handleUpdateTrade = (tradeId: number) => {
    setEditingTradeId(tradeId);
    const trade = activeTrades.find(t => t.id === tradeId);
    if (trade) {
      setExpandedCompany(trade.companyId);
      setMinRange(trade.minRange);
      setMaxRange(trade.maxRange);
      handleDeleteTrade(tradeId);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      
      <main className="pt-14 px-4 max-w-2xl mx-auto">
        {!showContent ? (
          /* Initial Buy/Sell Selection - Hero View */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
            <h1 className="text-3xl font-bold text-foreground mb-8">What would you like to do?</h1>
            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => setTradeMode("buy")}
                className="w-full h-20 rounded-2xl font-semibold text-xl bg-success text-success-foreground hover:opacity-90 transition-all shadow-lg"
              >
                BUY
              </button>
              <button
                onClick={() => setTradeMode("sell")}
                className="w-full h-20 rounded-2xl font-semibold text-xl bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-lg"
              >
                SELL
              </button>
            </div>
          </div>
        ) : (
          /* Content after mode selection */
          <>
            {/* Back Button and Hero Heading */}
            <div className="mt-6 mb-6">
              <button
                onClick={() => {
                  setTradeMode(null);
                  setSearchValue("");
                  setSelectedCategories([]);
                  setExpandedCompany(null);
                }}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-4xl font-bold text-foreground">
                {tradeMode === "buy" ? "BUYING" : "SELLING"}
              </h1>
            </div>

            {tradeMode === "sell" ? (
              /* Selling Page - Portfolio View */
              <>
                {/* Portfolio Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Portfolio</h2>
                  <div className="space-y-4">
                    {portfolio.map((company) => (
                  <div key={company.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleCompanyClick(company.id)}
                      className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted transition-all"
                    >
                      <span className="font-semibold text-foreground">{company.name}</span>
                      {expandedCompany === company.id ? (
                        <ChevronUp className="w-5 h-5 text-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-foreground" />
                      )}
                    </button>

                    {expandedCompany === company.id && (
                      <div className="p-6 bg-muted/50 space-y-6">
                        {/* Company Details */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-foreground">{company.name}</h3>
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Pre Money: </span>
                              <span className="font-medium text-foreground">{company.preMoneyValuation}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Post Money: </span>
                              <span className="font-medium text-foreground">{company.postMoneyValuation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Range Sliders */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <Label className="text-foreground">Minimum Buying Requirement</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={minRange}
                                  onChange={(e) => setMinRange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  className="w-20 h-8 text-sm text-right"
                                />
                                <span className="text-sm font-medium text-foreground">%</span>
                              </div>
                            </div>
                            <Slider
                              value={[minRange]}
                              onValueChange={(value) => setMinRange(value[0])}
                              max={100}
                              step={0.01}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <Label className="text-foreground">Maximum Buying Requirement</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={maxRange}
                                  onChange={(e) => setMaxRange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  className="w-20 h-8 text-sm text-right"
                                />
                                <span className="text-sm font-medium text-foreground">%</span>
                              </div>
                            </div>
                            <Slider
                              value={[maxRange]}
                              onValueChange={(value) => setMaxRange(value[0])}
                              max={100}
                              step={0.01}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Range Visual */}
                        <div className="space-y-2">
                          <Label className="text-muted-foreground text-xs">Seller's Range</Label>
                          <div className="relative h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className="absolute h-full bg-primary"
                              style={{
                                left: `${minRange}%`,
                                width: `${maxRange - minRange}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Open Trade Button */}
                        <Button
                          onClick={handleOpenTrade}
                          className="w-full h-12 text-base font-semibold"
                        >
                          Open Trade
                        </Button>
                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                </div>

                {/* Active Trades Section */}
                {activeTrades.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Active Trades</h2>
                    <div className="space-y-4">
                      {activeTrades.map((trade) => (
                        <div key={trade.id} className="border border-border rounded-lg p-6 bg-card">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-muted text-foreground">
                                  You
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground">{trade.companyName}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                  <span>Pre: {trade.preMoneyValuation}</span>
                                  <span>Post: {trade.postMoneyValuation}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateTrade(trade.id)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Edit trade"
                              >
                                <Edit className="w-4 h-4 text-foreground" />
                              </button>
                              <button
                                onClick={() => handleDeleteTrade(trade.id)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Delete trade"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Range:</span>
                              <span className="font-medium text-foreground">{trade.minRange}% - {trade.maxRange}%</span>
                            </div>

                            <div className="relative h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className="absolute h-full bg-primary"
                                style={{
                                  left: `${trade.minRange}%`,
                                  width: `${trade.maxRange - trade.minRange}%`,
                                }}
                              />
                            </div>

                            <div className="flex items-center gap-6 text-sm pt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Views:</span>
                                <span className="font-medium text-foreground">{trade.views}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Saves:</span>
                                <span className="font-medium text-foreground">{trade.saves}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Buying Page - Original Flow */
              <>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="pl-10 pr-10 h-12 rounded-full bg-muted border-0"
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Category Tags */}
                <div className="bg-muted rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        onClick={() => handleCategoryClick(category)}
                        className="bg-background hover:bg-foreground hover:text-background cursor-pointer transition-all data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                        data-selected={selectedCategories.includes(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {showSellers && (
                  <>
                    {/* Section Title and Filter */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-foreground">
                        Sellers in – "{selectedCategories.length > 0 ? selectedCategories.join(", ") : "All"}"
                      </h2>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors">
                        <SlidersHorizontal className="w-5 h-5 text-foreground" />
                      </button>
                    </div>

                    {/* Seller Cards */}
                    <div className="space-y-3 pb-4">
                      {sellers.map((seller) => (
                        <div
                          key={seller.id}
                          className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-all cursor-pointer"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={seller.avatar} />
                            <AvatarFallback className="bg-muted text-foreground">
                              {seller.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{seller.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
