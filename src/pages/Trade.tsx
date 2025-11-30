import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp, Trash2, Edit, Bookmark, Zap, Heart, AlertCircle, TrendingUp, DollarSign, Calendar, Target, Upload, Image as ImageIcon, Video, MessageCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCropModal } from "@/components/ImageCropModal";


interface ActiveTrade {
  id: number;
  companyId: number;
  companyName: string;
  companyType: string;
  companyAge: string;
  revenueStatus: "revenue-generating" | "pre-revenue";
  description: string;
  startupUsername: string;
  sellingRangeMin: number;
  sellingRangeMax: number;
  videoUrl?: string;
  imageUrls: string[];
  views: number;
  saves: number;
  isEdited: boolean;
  isManualEntry: boolean;
}

interface ScanAd {
  id: number;
  name: string;
  avatar: string;
  industries?: string[];
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
  // isSponsored?: boolean;
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

const industryTags = [
  "AI","ML","Fintech","HealthTech","EV","SaaS","E-commerce","EdTech","AgriTech",
  "Blockchain","IoT","CleanTech","FoodTech","PropTech","InsurTech","LegalTech",
  "MarTech","RetailTech","TravelTech","Logistics","Cybersecurity","Gaming","Media","SpaceTech"
];
const scanAds: ScanAd[] = [
  
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
    ],
     industries: ["AI", "Robotics", "EV"] 
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
    ],
    industries: ["AI", "Robotics", "EV"]
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
const sectors = [
  "AI", "ML", "Blockchain", "Fintech", "DeepTech", "SaaS", "FoodTech",
  "AgriTech", "EV", "HealthTech", "EdTech", "Gaming", "AR/VR",
  "Robotics", "IoT", "Manufacturing", "Media", "Cybersecurity",
  "Real Estate", "Construction", "CleanTech", "BioTech", "Energy"
];

const portfolio = [
  { id: 1, name: "Airbound Pvt Ltd", postMoneyValuation: "₹50,00,000", preMoneyValuation: "₹35,00,000" },
  { id: 2, name: "Zlyft Autonomy Pvt Ltd", postMoneyValuation: "₹1,20,00,000", preMoneyValuation: "₹80,00,000" },
];

const Trade = () => {
  const navigate = useNavigate();
  const userMode = localStorage.getItem("userMode");
  const [activeView, setActiveView] = useState<'buy' | 'sell'>('buy');
  const [expandedBuyId, setExpandedBuyId] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<{ [key: number]: number }>({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [sellingRangeMin, setSellingRangeMin] = useState<number>(10);
  const [sellingRangeMax, setSellingRangeMax] = useState<number>(40);
  const [companyAge, setCompanyAge] = useState<string>("");
  const [revenueStatus, setRevenueStatus] = useState<"revenue-generating" | "pre-revenue">("pre-revenue");
  const [description, setDescription] = useState<string>("");
  const [startupUsername, setStartupUsername] = useState<string>("");
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
    const [selectedIndustries,setSelectedIndustries]=useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [savedSellers, setSavedSellers] = useState<number[]>([1, 3, 5]);
  const [savedScanAds, setSavedScanAds] = useState<number[]>([1, 4]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedInfoId, setExpandedInfoId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
const [companyType, setCompanyType] = useState<string[]>([]);
 
const [companyTypeOpen, setCompanyTypeOpen] = useState<boolean>(false);


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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setCropImageUrl(url);
      setIsCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    setImageUrls([...imageUrls, croppedUrl]);
    setIsCropModalOpen(false);
    setCropImageUrl("");
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
   const toggleIndustry=(industry:string)=>{
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i=>i!==industry) : [...prev,industry].slice(0,3)
    );
  };

  const handleOpenTrade = () => {
    if (expandedCompany === null) return;
    
    const company = portfolio.find(c => c.id === expandedCompany);
    if (!company) return;

    const newTrade: ActiveTrade = {
      id: Date.now(),
      companyId: company.id,
      companyType,
      companyName: company.name,
      companyAge,
      revenueStatus,
      description,
      startupUsername: startupUsername || company.name.toLowerCase().replace(/\s+/g, ''),
      sellingRangeMin,
      sellingRangeMax,
      videoUrl,
      imageUrls,
      views: 0,
      saves: 0,
      isEdited: false,
      isManualEntry,
    };

    setActiveTrades([...activeTrades, newTrade]);
    setExpandedCompany(null);
    setSellingRangeMin(10);
    setSellingRangeMax(40);
    setCompanyAge("");
    setRevenueStatus("pre-revenue");
    setDescription("");
    setStartupUsername("");
    setIsManualEntry(false);
    setVideoFile(null);
    setVideoUrl("");
    setImageFiles([]);
    setImageUrls([]);
  };

  const handleDeleteTrade = (tradeId: number) => {
    setActiveTrades(activeTrades.filter(trade => trade.id !== tradeId));
  };

  const handleUpdateTrade = (tradeId: number) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    if (trade) {
      setExpandedCompany(trade.companyId);
      setSellingRangeMin(trade.sellingRangeMin);
      setSellingRangeMax(trade.sellingRangeMax);
      setCompanyType(trade.companyType);

      setCompanyAge(trade.companyAge);
      setRevenueStatus(trade.revenueStatus);
      setDescription(trade.description);
      setStartupUsername(trade.startupUsername);
      setIsManualEntry(trade.isManualEntry);
      setVideoUrl(trade.videoUrl || "");
      setImageUrls(trade.imageUrls);
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
      
      <main className="max-w-2xl mx-auto">{/* Compact Buy/Sell Buttons at Top */}
        <div className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-background/95 backdrop-blur-sm max-w-2xl mx-auto transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-9 flex-1 text-sm font-semibold transition-all ${
              activeView === 'buy' 
                ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveView('buy')}
          >
            BUY
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-9 flex-1 text-sm font-semibold transition-all ${
              activeView === 'sell' 
                ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveView('sell')}
          >
            SELL
          </Button>
        </div>

        <div className="pt-[52px]">
          {activeView === 'sell' ? (
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
                      <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-base">
                        {company.name}
                      </span>

                      <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        1.5 years
                      </span>
                    </div>

                      {expandedCompany === company.id ? (
                        <ChevronUp className="w-5 h-5 text-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-foreground" />
                      )}
                    </button>

                    {expandedCompany === company.id && (
                      <div className="p-5 bg-card space-y-5">
                        {/* Selling Range */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground font-normal">Selling Range (%)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={sellingRangeMin}
                              onChange={(e) => setSellingRangeMin(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="Min"
                              className="h-9 text-sm"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="number"
                              value={sellingRangeMax}
                              onChange={(e) => setSellingRangeMax(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="Max"
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>

                        {/* Startup Details Entry Method */}
                        <div className="space-y-3">
                          <Label className="text-xs text-muted-foreground font-normal">Startup Details</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={!isManualEntry ? "default" : "outline"}
                              size="sm"
                              onClick={() => setIsManualEntry(false)}
                              className="flex-1 h-9 text-xs"
                            >
                              Auto Entry
                            </Button>
                            <Button
                              type="button"
                              variant={isManualEntry ? "default" : "outline"}
                              size="sm"
                              onClick={() => setIsManualEntry(true)}
                              className="flex-1 h-9 text-xs"
                            >
                              Manual Entry
                            </Button>
                          </div>

                          {!isManualEntry ? (
  // AUTO ENTRY
  <div className="space-y-3">
    <Input
      type="text"
      value={startupUsername}
      onChange={(e) => setStartupUsername(e.target.value)}
      placeholder="@username"
      className="h-9 text-sm"
    />

    {/* Add External Link */}
    <p className="text-xs font-medium text-muted-foreground">
      Add external link
    </p>

    <div className="grid grid-cols-2 gap-3">
      <Input
        type="text"
        placeholder="Heading"
        className="h-9 text-sm"
      />
      <Input
        type="text"
        placeholder="Link"
        className="h-9 text-sm"
      />
    </div>
  </div>
) : (
  // MANUAL ENTRY
  <div className="space-y-3 pt-1">

    {/* Username */}
    <Input
      type="text"
      value={startupUsername}
      onChange={(e) => setStartupUsername(e.target.value)}
      placeholder="@username (optional)"
      className="h-9 text-sm"
    />

    {/* Add External Link */}
    <p className="text-xs font-medium text-muted-foreground">
      Add external link
    </p>

    <div className="grid grid-cols-2 gap-3">
      <Input
        type="text"
        placeholder="Heading"
        className="h-9 text-sm"
      />
      <Input
        type="text"
        placeholder="Link"
        className="h-9 text-sm"
      />
    </div>
    <div>
                      <Label className="text-xs">Segment (max 3)</Label>
                      <ScrollArea className="h-20 mt-1 border rounded-md p-2 bg-background">
                        <div className="flex flex-wrap gap-1.5">
                          {industryTags.map(tag=>(
                            <button key={tag} onClick={()=>toggleIndustry(tag)}
                              disabled={!selectedIndustries.includes(tag) && selectedIndustries.length>=3}
                              className={`px-2 py-1 text-xs rounded-md ${
                                selectedIndustries.includes(tag)
                                  ? "bg-white text-black font-bold shadow-sm"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                              {tag}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

    {/* Description */}
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description..."
      className="w-full min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
    />

    {/* Revenue Status */}
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={revenueStatus === "revenue-generating" ? "default" : "outline"}
          size="sm"
          onClick={() => setRevenueStatus("revenue-generating")}
          className="flex-1 h-9 text-xs"
        >
          Revenue Generating
        </Button>
        <Button
          type="button"
          variant={revenueStatus === "pre-revenue" ? "default" : "outline"}
          size="sm"
          onClick={() => setRevenueStatus("pre-revenue")}
          className="flex-1 h-9 text-xs"
        >
          Pre Revenue
        </Button>
      </div>
    </div>

    {/* Video Upload */}
    <div>
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => videoInputRef.current?.click()}
        className="w-full h-9 text-xs gap-2"
      >
        <Video className="w-3.5 h-3.5" />
        {videoFile ? videoFile.name : "Upload Video"}
      </Button>
    </div>

    {/* Image Upload */}
    <div className="space-y-2">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => imageInputRef.current?.click()}
        className="w-full h-9 text-xs gap-2"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        Upload Images
      </Button>

      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded border border-border overflow-hidden group">
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

                          )}
                        </div>

                        <Button
                          onClick={handleOpenTrade}
                          className="w-full h-10 text-sm font-medium"
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
            {/* Active Trades Section */}
<div className="mb-8">
  <h2 className="text-lg font-semibold text-foreground mb-4">Active Trades</h2>

  {activeTrades.length > 0 ? (
    <div className="space-y-4">
      {activeTrades.map((trade) => {
        const isExpanded = expandedCompany === trade.id;
        const photoIndex = currentPhotoIndex[trade.id] || 0;

        return (
          <div
            key={trade.id}
            className="border border-border rounded-xl p-4 bg-card hover:shadow-sm transition-all cursor-pointer"
            onClick={() =>
              setExpandedCompany(isExpanded ? null : trade.id)
            }
          >
            <div className="flex items-start gap-3">
              {/* Generic Avatar */}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold text-sm">
                {trade.companyName[0]}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-foreground text-sm">
                    {trade.companyName}
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    Trade
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mt-0.5">
                  @{trade.startupUsername}
                </div>
                  <p className="text-xs text-muted-foreground mt-1">
  {trade.companyType}
</p>

                {!isExpanded && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">
                      {trade.revenueStatus === "revenue-generating"
                        ? "Revenue Generating"
                        : "Pre Revenue"}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium text-foreground">
                      {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                    </span>
                    <span className="font-medium text-foreground">
                      {/* • {trade.companyAge} */}
                      • 1.5 years
                    </span>
                  </div>
                )}
              </div>

              {/* Edit/Delete */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateTrade(trade.id);
                  }}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrade(trade.id);
                  }}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            {/* Expanded view */}
            {isExpanded && (
              <div
                className="mt-4 space-y-4 animate-accordion-down"
                onClick={(e) => e.stopPropagation()}
              >

                {/* Description */}
                {trade.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{trade.description}"
                  </p>
                )}

                {/* Media (video priority) */}
                {(trade.videoUrl || trade.imageUrls.length > 0) && (
                  <div className="relative -mx-4 px-4">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                      {trade.videoUrl ? (
                        <video
                          src={trade.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={trade.imageUrls[photoIndex]}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Image Navigation */}
                      {!trade.videoUrl &&
                        trade.imageUrls.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex((prev) => ({
                                  ...prev,
                                  [trade.id]: Math.max(
                                    0,
                                    (prev[trade.id] || 0) - 1
                                  ),
                                }));
                              }}
                              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center ${
                                photoIndex === 0
                                  ? "opacity-0 pointer-events-none"
                                  : "opacity-100"
                              }`}
                            >
                              <ChevronUp className="w-4 h-4 rotate-180" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex((prev) => ({
                                  ...prev,
                                  [trade.id]: Math.min(
                                    trade.imageUrls.length - 1,
                                    (prev[trade.id] || 0) + 1
                                  ),
                                }));
                              }}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center ${
                                photoIndex ===
                                trade.imageUrls.length - 1
                                  ? "opacity-0 pointer-events-none"
                                  : "opacity-100"
                              }`}
                            >
                              <ChevronUp className="w-4 h-4 rotate-90" />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {trade.imageUrls.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPhotoIndex((prev) => ({
                                      ...prev,
                                      [trade.id]: idx,
                                    }));
                                  }}
                                  className={`h-1.5 rounded-full transition-all ${
                                    photoIndex === idx
                                      ? "w-6 bg-primary"
                                      : "w-1.5 bg-background/60"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Revenue Status
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {trade.revenueStatus === "revenue-generating"
                        ? "Revenue Generating"
                        : "Pre Revenue"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Company Age
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {trade.companyAge}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20 col-span-2">
                    <p className="text-xs text-primary mb-1">Selling Range</p>
                    <p className="text-sm font-bold text-primary">
                      {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                    </p>
                  </div>
                </div>

                {/* Range Bar */}
                <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-primary"
                    style={{
                      left: `${trade.sellingRangeMin}%`,
                      width: `${
                        trade.sellingRangeMax - trade.sellingRangeMin
                      }%`,
                    }}
                  />
                </div>

                {/* Views & Saves */}
                <div className="flex items-center gap-6 text-sm pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Views:</span>
                    <span className="font-medium text-foreground">
                      {trade.views}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Saves:</span>
                    <span className="font-medium text-foreground">
                      {trade.saves}
                    </span>
                  </div>
                </div>

                {trade.isEdited && (
                  <p className="text-[10px] text-muted-foreground">(edited)</p>
                )}
              </div>
            )}
          </div>
        );
      })}
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
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="px-4 py-4">
              {/* Search Bar and Saved Toggle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search companies..."
                    className="pl-10 pr-10 h-11 rounded-xl bg-muted border-0"
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
                  className={`h-11 w-11 flex-shrink-0 rounded-xl transition-colors ${showSavedOnly ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                  title={showSavedOnly ? "Show all" : "Show saved"}
                >
                  <Bookmark className={`w-5 h-5 transition-all ${showSavedOnly ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Category Tags Filter - Collapsible */}
              {!showSavedOnly && (
                <div className="mb-4">
                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                      </span>
                    </div>
                    {isFilterOpen ? (
                      <ChevronUp className="w-5 h-5 text-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground" />
                    )}
                  </button>

                  {/* Collapsible Filter Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isFilterOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-muted/30 rounded-xl p-3 max-h-80 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const isSelected = selectedCategories.includes(category);
                          return (
                            <Badge
                              key={category}
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => handleCategoryClick(category)}
                              className="cursor-pointer transition-all text-xs hover:scale-105"
                            >
                              {category}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Companies - When no search/filter */}
              {!showSellers && !showSavedOnly && (
                <div className="space-y-6">
                  <h2 className="text-base font-semibold text-foreground">Suggested for You</h2>
                  {scanAds.map((ad) => {
                    const isExpanded = expandedBuyId === ad.id;
                    const photoIdx = currentPhotoIndex[ad.id] || 0;
                    return (
                      <div
                        key={ad.id}
                        className={`border border-border rounded-xl bg-card transition-all cursor-pointer ${isExpanded ? "shadow-lg" : "hover:shadow-sm"} p-0`}
                        onClick={() => setExpandedBuyId(isExpanded ? null : ad.id)}
                      >
                        {/* Collapsed Card */}
                        {!isExpanded && (
                          <div className="flex items-center px-4 py-3">
                            {/* Company Avatar */}
                            <Avatar className="w-12 h-12 mr-3">
                              <AvatarImage src={ad.avatar} />
                              <AvatarFallback className="bg-muted text-foreground font-semibold">
                                {ad.companyName[0]}
                              </AvatarFallback>
                            </Avatar>
                            {/* Company Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-base text-foreground truncate">{ad.companyName}</div>
                              <div className="text-xs text-muted-foreground">{ad.name}</div>
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{ad.companyTagline}</div>
                            </div>
                            {/* Actions */}
                            <div className="flex flex-col gap-2 ml-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSaveScanAd(ad.id);
                                }}
                                className="p-2 hover:bg-muted rounded-lg"
                              >
                                <Bookmark className={`w-4 h-4 ${savedScanAds.includes(ad.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                              </button>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 hover:bg-muted rounded-lg"
                              >
                                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        )}
                        {/* Expanded Card */}
                        {isExpanded && (
                          <div className="px-4 py-5 space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-14 h-14">
                                <AvatarImage src={ad.avatar} />
                                <AvatarFallback className="bg-muted text-foreground font-semibold">
                                  {ad.companyName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-lg text-foreground truncate">{ad.companyName}</div>
                                <div className="text-xs text-muted-foreground">{ad.name}</div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSaveScanAd(ad.id);
                                  }}
                                  className="p-2 hover:bg-muted rounded-lg"
                                >
                                  <Bookmark className={`w-4 h-4 ${savedScanAds.includes(ad.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 hover:bg-muted rounded-lg"
                                >
                                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                            {/* Description */}
                            <div className="text-sm text-muted-foreground mb-2">{ad.companyTagline}</div>
                            {/* Photo Gallery */}
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted mb-2">
                              <img
                                src={ad.companyPhotos[photoIdx]}
                                alt={ad.companyName}
                                className="w-full h-full object-cover"
                              />
                              {ad.companyPhotos.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentPhotoIndex(prev => ({
                                        ...prev,
                                        [ad.id]: Math.max(0, (prev[ad.id] || 0) - 1)
                                      }));
                                    }}
                                    className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center transition-opacity ${photoIdx === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                  >
                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentPhotoIndex(prev => ({
                                        ...prev,
                                        [ad.id]: Math.min(ad.companyPhotos.length - 1, (prev[ad.id] || 0) + 1)
                                      }));
                                    }}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center transition-opacity ${photoIdx === ad.companyPhotos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                  >
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                  </button>
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {ad.companyPhotos.map((_, index) => (
                                      <button
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentPhotoIndex(prev => ({
                                            ...prev,
                                            [ad.id]: index
                                          }));
                                        }}
                                        className={`h-1.5 rounded-full transition-all ${photoIdx === index ? 'w-6 bg-primary' : 'w-1.5 bg-background/60'}`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            {/* Minimal Stats */}
                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">Revenue</span>
                                <span className="text-sm font-semibold text-foreground">{ad.revenue}</span>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">Age</span>
                                <span className="text-sm font-semibold text-foreground">{ad.companyAge}</span>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">Range</span>
                                <span className="text-sm font-semibold text-primary">{ad.minRange}% - {ad.maxRange}%</span>
                              </div>
                            </div>
                            {/* Industries */}
                            {ad.industries && ad.industries.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {ad.industries.map((ind) => (
                                  <span
                                    key={ind}
                                    className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium"
                                  >
                                    {ind}
                                  </span>
                                ))}
                              </div>
                            )}
                            {/* Express Interest Button */}
                            <Button className="w-full h-10 font-semibold mt-3">Express Interest</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Filtered Results */}
              {showSellers && !showSavedOnly && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">
                      {selectedCategories.length > 0 ? `${selectedCategories.join(", ")}` : "All Companies"}
                    </h2>
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-lg transition-colors">
                      <SlidersHorizontal className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                  
                  {scanAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="border border-border rounded-xl p-4 bg-card hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => setExpandedBuyId(expandedBuyId === ad.id ? null : ad.id)}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/profile');
                          }}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={ad.avatar} />
                            <AvatarFallback className="bg-muted text-foreground font-semibold">
                              {ad.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/profile');
                              }}
                              className="font-semibold text-foreground hover:text-primary transition-colors text-left text-sm"
                            >
                              {ad.name}
                            </button>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                              {ad.type}
                            </Badge>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/company-profile');
                            }}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
                          >
                            {ad.companyName}
                          </button>

                          {!expandedBuyId || expandedBuyId !== ad.id ? (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{ad.revenue}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium text-foreground">{ad.minRange}%-{ad.maxRange}%</span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSaveScanAd(ad.id);
                            }}
                            className="p-2 hover:bg-background/80 rounded-lg transition-colors"
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${savedScanAds.includes(ad.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          </button>
                        </div>
                      </div>

                      {expandedBuyId === ad.id && (
                        <div className="mt-4 space-y-4 animate-accordion-down">
                          <p className="text-sm text-muted-foreground">"{ad.companyTagline}"</p>
                          
                          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={ad.companyPhotos[currentPhotoIndex[ad.id] || 0]} 
                              alt={ad.companyName}
                              className="w-full h-full object-cover"
                            />
                            
                            {ad.companyPhotos.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPhotoIndex(prev => ({
                                      ...prev,
                                      [ad.id]: Math.max(0, (prev[ad.id] || 0) - 1)
                                    }));
                                  }}
                                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center transition-opacity ${
                                    photoIdx === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                  }`}
                                >
                                  <ChevronUp className="w-4 h-4 rotate-90" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPhotoIndex(prev => ({
                                      ...prev,
                                      [ad.id]: Math.min(ad.companyPhotos.length - 1, (prev[ad.id] || 0) + 1)
                                    }));
                                  }}
                                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center transition-opacity ${
                                    photoIdx === ad.companyPhotos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                  }`}
                                >
                                  <ChevronUp className="w-4 h-4 -rotate-90" />
                                </button>
                                
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {ad.companyPhotos.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`h-1.5 rounded-full transition-all ${
                                        photoIdx === index ? 'w-6 bg-primary' : 'w-1.5 bg-background/60'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                              <p className="text-sm font-bold text-foreground">{ad.revenue}</p>
                            </div>
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1">Funds</p>
                              <p className="text-sm font-bold text-foreground">{ad.fundsRaised}</p>
                            </div>
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1">Age</p>
                              <p className="text-sm font-bold text-foreground">{ad.companyAge}</p>
                            </div>
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                              <p className="text-xs text-primary mb-1">Range</p>
                              <p className="text-sm font-bold text-primary">{ad.minRange}%-{ad.maxRange}%</p>
                            </div>
                          </div>

                          <Button className="w-full h-11 font-semibold">Express Interest</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Section */}
              {showSavedOnly && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-foreground">Saved Companies</h2>
                  {scanAds
                    .filter(ad => savedScanAds.includes(ad.id))
                    .map((ad) => (
                      <div
                        key={ad.id}
                        className="border border-border rounded-xl p-4 bg-card"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={ad.avatar} />
                            <AvatarFallback>{ad.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{ad.name}</p>
                            <p className="text-sm text-muted-foreground">{ad.companyName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{ad.minRange}%-{ad.maxRange}%</p>
                          </div>
                          <button
                            onClick={() => handleToggleSaveScanAd(ad.id)}
                            className="p-2"
                          >
                            <Bookmark className="w-4 h-4 fill-primary text-primary" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </ScrollArea>
        )}
        </div>
      </main>

      {/* Image Crop Modal */}
      <ImageCropModal
        imageUrl={cropImageUrl}
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          setCropImageUrl("");
        }}
        onCropComplete={handleCropComplete}
      />

      <BottomNav />
    </div>
  );
};

export default Trade;