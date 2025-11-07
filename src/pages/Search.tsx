import { useState } from "react";
import { Search as SearchIcon, X, Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import StartupPost from "@/components/StartupPost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "AI", "Manufacturing", "ML", "B2B", "SaaS", "Fintech", "HealthTech", 
  "EV", "D2C", "Robotics", "SpaceTech", "Angel Investor", "VC", 
  "Delhi", "Bangalore", "Mumbai", "EdTech", "CleanTech", "AgriTech",
  "E-commerce", "BlockChain", "IoT", "DeepTech", "Hyderabad", "Pune"
];

const investorData = [
  {
    id: 1,
    name: "Ankit Mehra",
    image: "/placeholder.svg",
    subtitle: "Invested in 8 startups",
    tags: ["AI", "SaaS", "Fintech"]
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: "/placeholder.svg",
    subtitle: "Angel Investor • Invested in 12 startups",
    tags: ["HealthTech", "EdTech", "B2B"]
  },
  {
    id: 3,
    name: "Rahul Verma",
    image: "/placeholder.svg",
    subtitle: "VC Partner • Invested in 15 startups",
    tags: ["Fintech", "EV", "Manufacturing"]
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    image: "/placeholder.svg",
    subtitle: "Invested in 6 startups",
    tags: ["D2C", "E-commerce", "SaaS"]
  },
  {
    id: 5,
    name: "Vikram Singh",
    image: "/placeholder.svg",
    subtitle: "Angel Investor • Invested in 20 startups",
    tags: ["AI", "ML", "DeepTech"]
  },
  {
    id: 6,
    name: "Neha Gupta",
    image: "/placeholder.svg",
    subtitle: "Invested in 9 startups",
    tags: ["HealthTech", "Robotics", "IoT"]
  }
];

const startupData = [
  {
    id: 1,
    name: "SkyDrop",
    logo: "/placeholder.svg",
    tagline: "India's first drone delivery company",
    tags: ["Logistics", "DroneTech", "AI"]
  },
  {
    id: 2,
    name: "FinEase",
    logo: "/placeholder.svg",
    tagline: "Making credit accessible for all",
    tags: ["Fintech", "B2B", "SaaS"]
  },
  {
    id: 3,
    name: "HealthAI",
    logo: "/placeholder.svg",
    tagline: "AI-powered diagnostics platform",
    tags: ["HealthTech", "AI", "ML"]
  },
  {
    id: 4,
    name: "EduVerse",
    logo: "/placeholder.svg",
    tagline: "Personalized learning for every student",
    tags: ["EdTech", "SaaS", "B2C"]
  },
  {
    id: 5,
    name: "GreenCharge",
    logo: "/placeholder.svg",
    tagline: "Building EV charging infrastructure",
    tags: ["EV", "CleanTech", "Infrastructure"]
  },
  {
    id: 6,
    name: "FarmTech Solutions",
    logo: "/placeholder.svg",
    tagline: "Smart farming for modern agriculture",
    tags: ["AgriTech", "IoT", "B2B"]
  },
  {
    id: 7,
    name: "StyleBox",
    logo: "/placeholder.svg",
    tagline: "Curated fashion delivered monthly",
    tags: ["D2C", "E-commerce", "Fashion"]
  },
  {
    id: 8,
    name: "RoboAssist",
    logo: "/placeholder.svg",
    tagline: "Industrial automation made simple",
    tags: ["Robotics", "Manufacturing", "B2B"]
  }
];

const forYouPosts = [
  {
    id: "airbound-co",
    name: "Airbound.co",
    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    tagline: "Revolutionary drone delivery for urban logistics",
    preValuation: "$5M",
    postValuation: "$12M",
    fundsRaised: "$2M",
    currentInvestors: ["Y Combinator", "Sequoia", "a16z"],
    lookingToDilute: true,
    dilutionAmount: "15% for $3M",
    fundingGoal: "$3M Series A",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=600&fit=crop"
    ],
    postedTime: "2 hr"
  },
  {
    id: "neuralhealth",
    name: "NeuralHealth",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    tagline: "AI diagnostics for early disease detection",
    preValuation: "$15M",
    postValuation: "$35M",
    fundsRaised: "$8M",
    currentInvestors: ["Founders Fund", "Khosla Ventures"],
    lookingToDilute: true,
    dilutionAmount: "12% for $6M",
    fundingGoal: "$6M Series B",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop"
    ],
    postedTime: "5 hr"
  },
  {
    id: "greencharge",
    name: "GreenCharge",
    logo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    tagline: "Solar-powered EV charging network for highways",
    preValuation: "$10M",
    postValuation: "$25M",
    fundsRaised: "$5M",
    currentInvestors: ["Tesla Ventures", "Climate Fund"],
    lookingToDilute: false,
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&h=600&fit=crop"
    ],
    postedTime: "8 hr"
  },
  {
    id: "codementor-ai",
    name: "CodeMentor AI",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
    tagline: "AI-powered coding education and mentorship",
    preValuation: "$12M",
    postValuation: "$28M",
    fundsRaised: "$6M",
    currentInvestors: ["Accel", "Index Ventures"],
    lookingToDilute: true,
    dilutionAmount: "10% for $5M",
    fundingGoal: "$5M Series A",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop"
    ],
    postedTime: "12 hr"
  },
  {
    id: "urbanfarm",
    name: "UrbanFarm",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=100&h=100&fit=crop",
    tagline: "Vertical farming solutions for city buildings",
    preValuation: "$9M",
    postValuation: "$22M",
    fundsRaised: "$4.5M",
    currentInvestors: ["Y Combinator", "Climate Capital"],
    lookingToDilute: true,
    dilutionAmount: "15% for $4M",
    fundingGoal: "$4M Seed Round",
    images: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    postedTime: "1 day"
  }
];

type FilterType = "investors" | "startups" | "reels";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("investors");

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      <main className="pt-14 px-4 max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="mt-6 mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investors, startups, founders…"
              className="pl-10 pr-10 h-12 rounded-full bg-muted border-0"
            />
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tags */}
        <div className="bg-muted rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <Badge
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleCategory(category)}
                  className="cursor-pointer transition-all"
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        {(searchQuery || selectedCategories.length > 0) && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter("investors")}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === "investors"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Investors
            </button>
            <button
              onClick={() => setActiveFilter("startups")}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === "startups"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Startups
            </button>
            <button
              onClick={() => setActiveFilter("reels")}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === "reels"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Reels
            </button>
          </div>
        )}

        {/* Search Results */}
        {(searchQuery || selectedCategories.length > 0) && (
          <div className="space-y-6">
            {/* Investors Section */}
            {activeFilter === "investors" && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Investors</h2>
              <div className="space-y-3">
                {investorData.map((investor) => (
                  <div 
                    key={investor.id}
                    className="border border-border rounded-lg p-6 bg-card hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                        <img 
                          src={investor.image} 
                          alt={investor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{investor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2.5">{investor.subtitle}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {investor.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <button className="flex-shrink-0 w-8 h-8 rounded-full border border-foreground flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Startups Section */}
            {activeFilter === "startups" && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Startups</h2>
              <div className="space-y-3">
                {startupData.map((startup) => (
                  <div 
                    key={startup.id}
                    className="border border-border rounded-lg p-6 bg-card hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img 
                          src={startup.logo} 
                          alt={startup.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{startup.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2.5">{startup.tagline}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {startup.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-shrink-0 h-8 px-3 text-xs"
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Reels Section */}
            {activeFilter === "reels" && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Reels feature coming soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* For You Feed - Default View */}
        {!searchQuery && selectedCategories.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">For You</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {forYouPosts.map((startup) => (
                <div 
                  key={startup.id} 
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img 
                      src={startup.images[0]} 
                      alt={startup.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <img 
                        src={startup.logo} 
                        alt={startup.name}
                        className="w-5 h-5 rounded object-cover"
                      />
                      <h3 className="text-xs font-semibold text-foreground truncate">
                        {startup.name}
                      </h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">
                      {startup.tagline}
                    </p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{startup.postedTime}</span>
                      <span className="font-semibold text-foreground">{startup.preValuation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
