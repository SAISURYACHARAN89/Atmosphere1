import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type TradeMode = "buy" | "sell" | null;

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

const Trade = () => {
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      
      <main className="pt-14 px-4 max-w-2xl mx-auto">
        {/* Buy/Sell Buttons */}
        <div className="flex gap-3 mt-4 mb-4">
          <button
            onClick={() => setTradeMode("buy")}
            className={`flex-1 h-14 rounded-lg font-medium text-base transition-all ${
              tradeMode === "buy"
                ? "bg-success text-success-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setTradeMode("sell")}
            className={`flex-1 h-14 rounded-lg font-medium text-base transition-all ${
              tradeMode === "sell"
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            SELL
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            disabled={!tradeMode}
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
        <div className="bg-muted rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="bg-background hover:bg-foreground hover:text-background cursor-pointer transition-all"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Section Title and Filter */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-foreground">
            Sellers in – "AI, ML, DeepTech"
          </h2>
          <Button variant="secondary" size="sm" className="rounded-full h-8 px-4">
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Filter
          </Button>
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
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
