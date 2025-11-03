import { useState } from "react";
import { Bookmark, Zap } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SellerAd {
  id: number;
  name: string;
  avatar: string;
  companyName: string;
  preMoneyValuation: string;
  postMoneyValuation: string;
  minRange: number;
  maxRange: number;
  isSponsored?: boolean;
}

const sellerAds: SellerAd[] = [
  { 
    id: 1, 
    name: "Rajesh Mukarji", 
    avatar: "",
    companyName: "Airbound Pvt Ltd",
    preMoneyValuation: "₹35,00,000",
    postMoneyValuation: "₹50,00,000",
    minRange: 15,
    maxRange: 40,
    isSponsored: true
  },
  { 
    id: 2, 
    name: "Joshua Paul", 
    avatar: "",
    companyName: "Zlyft Autonomy Pvt Ltd",
    preMoneyValuation: "₹80,00,000",
    postMoneyValuation: "₹1,20,00,000",
    minRange: 10,
    maxRange: 35
  },
  { 
    id: 3, 
    name: "Priya Sharma", 
    avatar: "",
    companyName: "TechFlow Solutions",
    preMoneyValuation: "₹60,00,000",
    postMoneyValuation: "₹90,00,000",
    minRange: 20,
    maxRange: 50
  },
  { 
    id: 4, 
    name: "Alex Chen", 
    avatar: "",
    companyName: "CloudSync Systems",
    preMoneyValuation: "₹45,00,000",
    postMoneyValuation: "₹70,00,000",
    minRange: 12,
    maxRange: 30,
    isSponsored: true
  },
  { 
    id: 5, 
    name: "Sarah Williams", 
    avatar: "",
    companyName: "GreenTech Innovations",
    preMoneyValuation: "₹55,00,000",
    postMoneyValuation: "₹85,00,000",
    minRange: 18,
    maxRange: 45
  },
  { 
    id: 6, 
    name: "Michael Rodriguez", 
    avatar: "",
    companyName: "FinNext Solutions",
    preMoneyValuation: "₹70,00,000",
    postMoneyValuation: "₹1,05,00,000",
    minRange: 25,
    maxRange: 55
  },
  { 
    id: 7, 
    name: "Aisha Patel", 
    avatar: "",
    companyName: "EduTech Pro",
    preMoneyValuation: "₹42,00,000",
    postMoneyValuation: "₹65,00,000",
    minRange: 15,
    maxRange: 38
  },
  { 
    id: 8, 
    name: "David Kim", 
    avatar: "",
    companyName: "HealthSync AI",
    preMoneyValuation: "₹95,00,000",
    postMoneyValuation: "₹1,40,00,000",
    minRange: 20,
    maxRange: 48
  },
  { 
    id: 9, 
    name: "Emma Thompson", 
    avatar: "",
    companyName: "LogiChain Systems",
    preMoneyValuation: "₹52,00,000",
    postMoneyValuation: "₹78,00,000",
    minRange: 12,
    maxRange: 35
  },
  { 
    id: 10, 
    name: "Arjun Mehta", 
    avatar: "",
    companyName: "FoodTech Ventures",
    preMoneyValuation: "₹48,00,000",
    postMoneyValuation: "₹72,00,000",
    minRange: 16,
    maxRange: 42
  },
];

const Trade = () => {
  const [savedAds, setSavedAds] = useState<number[]>([1, 3, 5]);

  const handleToggleSave = (adId: number) => {
    setSavedAds(prev => 
      prev.includes(adId) 
        ? prev.filter(id => id !== adId)
        : [...prev, adId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      
      <main className="pt-14 max-w-2xl mx-auto">
        {/* Compact Buy/Sell Buttons at Top */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <Button 
            size="sm" 
            variant="default"
            className="h-8 px-4 text-xs font-semibold"
          >
            BUY
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="h-8 px-4 text-xs font-semibold"
          >
            SELL
          </Button>
        </div>

        {/* Scrollable Sell Ads Feed */}
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-4 py-4 space-y-4">
            {sellerAds.map((ad) => (
              <div
                key={ad.id}
                className={`border rounded-xl p-5 transition-all ${
                  ad.isSponsored
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                {/* Sponsored Badge */}
                {ad.isSponsored && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      Sponsored
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className={ad.isSponsored ? "w-14 h-14 ring-2 ring-primary" : "w-12 h-12"}>
                      <AvatarImage src={ad.avatar} />
                      <AvatarFallback className="bg-muted text-foreground font-semibold">
                        {ad.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`font-semibold text-foreground ${ad.isSponsored ? 'text-base' : 'text-sm'}`}>
                        {ad.name}
                      </h3>
                      <p className={`text-muted-foreground mt-0.5 ${ad.isSponsored ? 'text-sm' : 'text-xs'}`}>
                        {ad.companyName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSave(ad.id)}
                    className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                    title={savedAds.includes(ad.id) ? "Unsave" : "Save"}
                  >
                    <Bookmark 
                      className={`w-4 h-4 ${savedAds.includes(ad.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  </button>
                </div>

                {/* Valuation Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`${ad.isSponsored ? 'bg-background/60' : 'bg-muted/50'} rounded-lg p-3`}>
                    <span className="text-xs text-muted-foreground block mb-1">Pre Money</span>
                    <p className={`font-bold text-foreground ${ad.isSponsored ? 'text-base' : 'text-sm'}`}>
                      {ad.preMoneyValuation}
                    </p>
                  </div>
                  <div className={`${ad.isSponsored ? 'bg-background/60' : 'bg-muted/50'} rounded-lg p-3`}>
                    <span className="text-xs text-muted-foreground block mb-1">Post Money</span>
                    <p className={`font-bold text-foreground ${ad.isSponsored ? 'text-base' : 'text-sm'}`}>
                      {ad.postMoneyValuation}
                    </p>
                  </div>
                </div>

                {/* Buying Range */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Buying Range</span>
                    <span className={`font-bold text-foreground ${ad.isSponsored ? 'text-sm' : 'text-xs'}`}>
                      {ad.minRange}% - {ad.maxRange}%
                    </span>
                  </div>
                  
                  <div className={`relative rounded-full overflow-hidden ${ad.isSponsored ? 'h-3' : 'h-2'} bg-background`}>
                    <div
                      className={`absolute h-full ${ad.isSponsored ? 'bg-gradient-to-r from-primary to-primary/70' : 'bg-primary'}`}
                      style={{
                        left: `${ad.minRange}%`,
                        width: `${ad.maxRange - ad.minRange}%`,
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* CTA Button for Sponsored */}
                {ad.isSponsored && (
                  <Button className="w-full mt-4 font-semibold" size="sm">
                    View Details
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
