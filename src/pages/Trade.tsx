import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp, Trash2, Edit, Bookmark, Zap, Heart } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";


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

interface ScanAd {
  id: number;
  name: string;
  avatar: string;
  type: 'Investor' | 'Startup';
  companyName: string;
  companyTagline: string;
  companyAge: string;
  revenue: string;
  fundsRaised: string;
  preMoneyValuation: string;
  postMoneyValuation: string;
  minRange: number;
  maxRange: number;
  companyPhotos: string[];
  isSponsored?: boolean;
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

const scanAds: ScanAd[] = [
  { 
    id: 1, 
    name: "Rajesh Mukarji", 
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "Investor",
    companyName: "Airbound Pvt Ltd",
    companyTagline: "Revolutionizing logistics with AI-powered drone delivery solutions",
    companyAge: "2 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹25,00,000",
    preMoneyValuation: "₹35,00,000",
    postMoneyValuation: "₹50,00,000",
    minRange: 15,
    maxRange: 40,
    companyPhotos: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=400&h=300&fit=crop"
    ],
    isSponsored: true
  },
  { 
    id: 2, 
    name: "Joshua Paul", 
    avatar: "https://i.pravatar.cc/150?img=33",
    type: "Investor",
    companyName: "Zlyft Autonomy Pvt Ltd",
    companyTagline: "Building next-gen autonomous vehicles for urban transportation",
    companyAge: "1.5 years",
    revenue: "Pre Revenue",
    fundsRaised: "₹15,00,000",
    preMoneyValuation: "₹80,00,000",
    postMoneyValuation: "₹1,20,00,000",
    minRange: 10,
    maxRange: 35,
    companyPhotos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 3, 
    name: "Priya Sharma", 
    avatar: "https://i.pravatar.cc/150?img=47",
    type: "Startup",
    companyName: "TechFlow Solutions",
    companyTagline: "Streamlining enterprise workflows with intelligent automation",
    companyAge: "3 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹40,00,000",
    preMoneyValuation: "₹60,00,000",
    postMoneyValuation: "₹90,00,000",
    minRange: 20,
    maxRange: 50,
    companyPhotos: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 4, 
    name: "Alex Chen", 
    avatar: "https://i.pravatar.cc/150?img=68",
    type: "Investor",
    companyName: "CloudSync Systems",
    companyTagline: "Seamless multi-cloud data synchronization and management platform",
    companyAge: "1 year",
    revenue: "Pre Revenue",
    fundsRaised: "₹10,00,000",
    preMoneyValuation: "₹45,00,000",
    postMoneyValuation: "₹70,00,000",
    minRange: 12,
    maxRange: 30,
    companyPhotos: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop"
    ],
    isSponsored: true
  },
  { 
    id: 5, 
    name: "Sarah Williams", 
    avatar: "https://i.pravatar.cc/150?img=25",
    type: "Startup",
    companyName: "GreenTech Innovations",
    companyTagline: "Sustainable energy solutions for a carbon-neutral future",
    companyAge: "4 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹32,00,000",
    preMoneyValuation: "₹55,00,000",
    postMoneyValuation: "₹85,00,000",
    minRange: 18,
    maxRange: 45,
    companyPhotos: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 6, 
    name: "Michael Rodriguez", 
    avatar: "https://i.pravatar.cc/150?img=52",
    type: "Investor",
    companyName: "FinNext Solutions",
    companyTagline: "Digital banking infrastructure for the next generation",
    companyAge: "2.5 years",
    revenue: "Pre Revenue",
    fundsRaised: "₹50,00,000",
    preMoneyValuation: "₹70,00,000",
    postMoneyValuation: "₹1,05,00,000",
    minRange: 25,
    maxRange: 55,
    companyPhotos: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 7, 
    name: "Aisha Patel", 
    avatar: "https://i.pravatar.cc/150?img=38",
    type: "Startup",
    companyName: "EduTech Pro",
    companyTagline: "Personalized learning experiences powered by AI",
    companyAge: "3 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹18,00,000",
    preMoneyValuation: "₹42,00,000",
    postMoneyValuation: "₹65,00,000",
    minRange: 15,
    maxRange: 38,
    companyPhotos: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 8, 
    name: "David Kim", 
    avatar: "https://i.pravatar.cc/150?img=61",
    type: "Investor",
    companyName: "HealthSync AI",
    companyTagline: "AI-driven healthcare coordination and patient management",
    companyAge: "2 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹60,00,000",
    preMoneyValuation: "₹95,00,000",
    postMoneyValuation: "₹1,40,00,000",
    minRange: 20,
    maxRange: 48,
    companyPhotos: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 9, 
    name: "Emma Thompson", 
    avatar: "https://i.pravatar.cc/150?img=29",
    type: "Startup",
    companyName: "LogiChain Systems",
    companyTagline: "Blockchain-based supply chain transparency solutions",
    companyAge: "1 year",
    revenue: "Pre Revenue",
    fundsRaised: "₹22,00,000",
    preMoneyValuation: "₹52,00,000",
    postMoneyValuation: "₹78,00,000",
    minRange: 12,
    maxRange: 35,
    companyPhotos: [
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
    ]
  },
  { 
    id: 10, 
    name: "Arjun Mehta", 
    avatar: "https://i.pravatar.cc/150?img=15",
    type: "Investor",
    companyName: "FoodTech Ventures",
    companyTagline: "Farm-to-table technology for sustainable food systems",
    companyAge: "5 years",
    revenue: "Revenue Generating",
    fundsRaised: "₹28,00,000",
    preMoneyValuation: "₹48,00,000",
    postMoneyValuation: "₹72,00,000",
    minRange: 16,
    maxRange: 42,
    companyPhotos: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop"
    ]
  },
];

const sellers = [
  { 
    id: 1, 
    name: "Rajesh Mukarji", 
    avatar: "https://i.pravatar.cc/150?img=12",
    companyName: "Airbound Pvt Ltd",
    companyTagline: "Revolutionizing logistics with AI-powered drone delivery solutions",
    revenue: "Revenue Generating",
    fundsRaised: "₹25,00,000",
    preMoneyValuation: "₹35,00,000",
    postMoneyValuation: "₹50,00,000",
    minRange: 15,
    maxRange: 40
  },
  { 
    id: 2, 
    name: "Joshua Paul", 
    avatar: "https://i.pravatar.cc/150?img=33",
    companyName: "Zlyft Autonomy Pvt Ltd",
    companyTagline: "Building next-gen autonomous vehicles for urban transportation",
    revenue: "Pre Revenue",
    fundsRaised: "₹15,00,000",
    preMoneyValuation: "₹80,00,000",
    postMoneyValuation: "₹1,20,00,000",
    minRange: 10,
    maxRange: 35
  },
  { 
    id: 3, 
    name: "Priya Sharma", 
    avatar: "https://i.pravatar.cc/150?img=47",
    companyName: "TechFlow Solutions",
    companyTagline: "Streamlining enterprise workflows with intelligent automation",
    revenue: "Revenue Generating",
    fundsRaised: "₹40,00,000",
    preMoneyValuation: "₹60,00,000",
    postMoneyValuation: "₹90,00,000",
    minRange: 20,
    maxRange: 50
  },
  { 
    id: 4, 
    name: "Alex Chen", 
    avatar: "https://i.pravatar.cc/150?img=68",
    companyName: "CloudSync Systems",
    companyTagline: "Seamless multi-cloud data synchronization and management platform",
    revenue: "Pre Revenue",
    fundsRaised: "₹10,00,000",
    preMoneyValuation: "₹45,00,000",
    postMoneyValuation: "₹70,00,000",
    minRange: 12,
    maxRange: 30
  },
  { 
    id: 5, 
    name: "Sarah Williams", 
    avatar: "https://i.pravatar.cc/150?img=25",
    companyName: "GreenTech Innovations",
    companyTagline: "Sustainable energy solutions for a carbon-neutral future",
    revenue: "Revenue Generating",
    fundsRaised: "₹32,00,000",
    preMoneyValuation: "₹55,00,000",
    postMoneyValuation: "₹85,00,000",
    minRange: 18,
    maxRange: 45
  },
];

const portfolio = [
  { id: 1, name: "Airbound Pvt Ltd", postMoneyValuation: "₹50,00,000", preMoneyValuation: "₹35,00,000" },
  { id: 2, name: "Zlyft Autonomy Pvt Ltd", postMoneyValuation: "₹1,20,00,000", preMoneyValuation: "₹80,00,000" },
];

const Trade = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'scan' | 'buy' | 'sell'>('scan');
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [minRange, setMinRange] = useState<number>(10);
  const [maxRange, setMaxRange] = useState<number>(50);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [savedSellers, setSavedSellers] = useState<number[]>([1, 3, 5]);
  const [savedScanAds, setSavedScanAds] = useState<number[]>([1, 4]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedInfoId, setExpandedInfoId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleToggleSaveScanAd = (adId: number) => {
    setSavedScanAds(prev => 
      prev.includes(adId) 
        ? prev.filter(id => id !== adId)
        : [...prev, adId]
    );
  };

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
    const trade = activeTrades.find(t => t.id === tradeId);
    if (trade) {
      setExpandedCompany(trade.companyId);
      setMinRange(trade.minRange);
      setMaxRange(trade.maxRange);
      handleDeleteTrade(tradeId);
    }
  };

  const handleToggleSaveSeller = (sellerId: number) => {
    setSavedSellers(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      
      <main className="pt-14 max-w-2xl mx-auto">
        {/* Compact Buy/Scan/Sell Buttons at Top */}
        <div className={`fixed top-14 left-0 right-0 z-40 flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm max-w-2xl mx-auto transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-8 flex-1 text-xs font-semibold transition-all ${
              activeView === 'buy' 
                ? 'bg-primary/10 border-primary/50 hover:bg-primary/15' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveView('buy')}
          >
            BUY
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-8 flex-1 text-xs font-semibold transition-all ${
              activeView === 'scan' 
                ? 'bg-primary/10 border-primary/50 hover:bg-primary/15' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveView('scan')}
          >
            SCAN
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-8 flex-1 text-xs font-semibold transition-all ${
              activeView === 'sell' 
                ? 'bg-primary/10 border-primary/50 hover:bg-primary/15' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveView('sell')}
          >
            SELL
          </Button>
        </div>

        <div className="pt-[52px]">
        {activeView === 'scan' ? (
          /* Scan View - All Ads with Sponsored */
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="px-4 py-4 space-y-4">
              {scanAds.map((ad) => (
                <div
                  key={ad.id}
                  className={`border rounded-xl p-4 transition-all cursor-pointer ${
                    ad.isSponsored
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20'
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => setExpandedInfoId(expandedInfoId === ad.id ? null : ad.id)}
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

                  {/* Main Content */}
                  <div className="flex items-start gap-3">
                    {/* Profile Pic - Clickable */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/profile');
                      }}
                    >
                      <Avatar className={ad.isSponsored ? "w-14 h-14 ring-2 ring-primary" : "w-12 h-12"}>
                        <AvatarImage src={ad.avatar} />
                        <AvatarFallback className="bg-muted text-foreground font-semibold">
                          {ad.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </button>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      {/* Name with Type Badge - Clickable */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/profile');
                          }}
                          className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                        >
                          {ad.name}
                        </button>
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] px-1.5 py-0 h-4 font-medium"
                        >
                          {ad.type}
                        </Badge>
                      </div>

                      {/* Company Name - Clickable */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/company-profile');
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
                      >
                        {ad.companyName}
                      </button>

                      {/* Revenue, Funds Raised, and Age - Only when NOT expanded */}
                      {!expandedInfoId || expandedInfoId !== ad.id ? (
                        <>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">Revenue: </span>
                              <span className="font-medium text-foreground">{ad.revenue}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Funds: </span>
                              <span className="font-medium text-foreground">{ad.fundsRaised}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age: </span>
                              <span className="font-medium text-foreground">{ad.companyAge}</span>
                            </div>
                          </div>

                          {/* Buying Range - Text Only */}
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Range: </span>
                            <span className="font-semibold text-foreground">{ad.minRange}% - {ad.maxRange}%</span>
                          </div>
                        </>
                      ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSaveScanAd(ad.id);
                        }}
                        className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                        title={savedScanAds.includes(ad.id) ? "Unsave" : "Save"}
                      >
                        <Bookmark 
                          className={`w-4 h-4 ${savedScanAds.includes(ad.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                        title="Show interest"
                      >
                        <Heart className="w-4 h-4 text-muted-foreground hover:fill-primary hover:text-primary transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section - Full Width */}
                  {expandedInfoId === ad.id && (
                    <div className="mt-4 animate-accordion-down">
                      {/* Tagline */}
                      <div className="mb-4 px-1">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{ad.companyTagline}"
                        </p>
                      </div>

                      {/* Company Photos - Full Width */}
                      <div className="-mx-4 mb-4 px-2">
                        <div className="grid grid-cols-3 gap-1.5">
                          {ad.companyPhotos.map((photo, index) => (
                            <div 
                              key={index}
                              className="relative overflow-hidden rounded-lg aspect-[4/3] group"
                            >
                              <img 
                                src={photo} 
                                alt={`${ad.companyName} ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 px-1">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                          <div className="font-semibold text-sm text-foreground">{ad.revenue}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Funds Raised</div>
                          <div className="font-semibold text-sm text-foreground">{ad.fundsRaised}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Company Age</div>
                          <div className="font-semibold text-sm text-foreground">{ad.companyAge}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Buying Range</div>
                          <div className="font-semibold text-sm text-foreground">{ad.minRange}% - {ad.maxRange}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : activeView === 'sell' ? (
          /* Selling Page - Portfolio View */
          <div className="px-4 py-6">
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
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Active Trades</h2>
              {activeTrades.length > 0 ? (
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active trades yet
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Buying Page */
          <div className="px-4 py-6">
            {/* Search Bar and Saved Toggle */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`h-12 w-12 flex-shrink-0 rounded-full transition-colors ${showSavedOnly ? 'bg-foreground hover:bg-foreground/90' : 'hover:bg-muted'}`}
                title={showSavedOnly ? "Show all sellers" : "Show saved sellers"}
              >
                <Bookmark className={`w-5 h-5 transition-all ${showSavedOnly ? 'fill-background text-background' : 'text-foreground'}`} />
              </Button>
            </div>

            {/* Category Tags */}
            {!showSavedOnly && (
              <div className="bg-muted rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <Badge
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleCategoryClick(category)}
                        className="cursor-pointer transition-all"
                      >
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Saved Sellers Section */}
            {showSavedOnly && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Saved Sellers
                  </h2>
                </div>
                <div className="space-y-4">
                  {sellers
                    .filter(seller => savedSellers.includes(seller.id))
                    .map((seller) => (
                    <div
                      key={seller.id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Profile Pic - Clickable */}
                        <button onClick={() => navigate('/profile')}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={seller.avatar} />
                            <AvatarFallback className="bg-muted text-foreground">
                              {seller.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </button>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {/* Name - Clickable */}
                          <button 
                            onClick={() => navigate('/profile')}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                          >
                            {seller.name}
                          </button>

                          {/* Company Name - Clickable */}
                          <button 
                            onClick={() => navigate('/company-profile')}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
                          >
                            {seller.companyName}
                          </button>

                          {/* Revenue and Funds Raised */}
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">Revenue: </span>
                              <span className="font-medium text-foreground">{seller.revenue}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Funds: </span>
                              <span className="font-medium text-foreground">{seller.fundsRaised}</span>
                            </div>
                          </div>

                          {/* Buying Range - Text Only */}
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Range: </span>
                            <span className="font-semibold text-foreground">{seller.minRange}% - {seller.maxRange}%</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleToggleSaveSeller(seller.id)}
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            title={savedSellers.includes(seller.id) ? "Unsave" : "Save"}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${savedSellers.includes(seller.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          </button>
                          <button
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            title="Show interest"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground hover:fill-primary hover:text-primary transition-all" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Sellers Section */}
            {showSellers && !showSavedOnly && (
              <div className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Sellers in – "{selectedCategories.length > 0 ? selectedCategories.join(", ") : "All"}"
                  </h2>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors">
                    <SlidersHorizontal className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <div className="space-y-4">
                  {sellers.map((seller) => (
                    <div
                      key={seller.id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Profile Pic - Clickable */}
                        <button onClick={() => navigate('/profile')}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={seller.avatar} />
                            <AvatarFallback className="bg-muted text-foreground">
                              {seller.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </button>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {/* Name - Clickable */}
                          <button 
                            onClick={() => navigate('/profile')}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                          >
                            {seller.name}
                          </button>

                          {/* Company Name - Clickable */}
                          <button 
                            onClick={() => navigate('/company-profile')}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
                          >
                            {seller.companyName}
                          </button>

                          {/* Revenue and Funds Raised */}
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">Revenue: </span>
                              <span className="font-medium text-foreground">{seller.revenue}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Funds: </span>
                              <span className="font-medium text-foreground">{seller.fundsRaised}</span>
                            </div>
                          </div>

                          {/* Buying Range - Text Only */}
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Range: </span>
                            <span className="font-semibold text-foreground">{seller.minRange}% - {seller.maxRange}%</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleToggleSaveSeller(seller.id)}
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            title={savedSellers.includes(seller.id) ? "Unsave" : "Save"}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${savedSellers.includes(seller.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          </button>
                          <button
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            title="Show interest"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground hover:fill-primary hover:text-primary transition-all" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
