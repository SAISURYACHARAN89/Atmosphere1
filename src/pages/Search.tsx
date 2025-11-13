import { useState, useEffect } from "react";
import { Search as SearchIcon, X, Plus, Play, Clock } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "AI", "Manufacturing", "ML", "B2B", "SaaS", "Fintech", "HealthTech", 
  "EV", "D2C", "Robotics", "SpaceTech", "Angel Investor", "VC", 
  "Delhi", "Bangalore", "Mumbai", "EdTech", "CleanTech", "AgriTech",
  "E-commerce", "BlockChain", "IoT", "DeepTech", "Hyderabad", "Pune"
];

const dummySuggestions = [
  { name: "Ankit Mehra", type: "investor", subtitle: "Angel Investor" },
  { name: "Priya Sharma", type: "investor", subtitle: "VC Partner" },
  { name: "Rahul Verma", type: "founder", subtitle: "CEO at TechCorp" },
  { name: "Sneha Kapoor", type: "investor", subtitle: "Invested in 15 startups" },
  { name: "Vikram Singh", type: "founder", subtitle: "Founder, HealthAI" },
  { name: "Neha Gupta", type: "investor", subtitle: "Angel Investor" },
  { name: "Arjun Malhotra", type: "founder", subtitle: "CEO at GreenTech" },
  { name: "Anjali Reddy", type: "investor", subtitle: "VC Partner at XYZ Ventures" },
  { name: "Rohan Joshi", type: "founder", subtitle: "Founder, EduVerse" },
  { name: "Kavya Nair", type: "investor", subtitle: "Invested in 20 startups" }
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

const forYouContent = [
  {
    id: 1,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    author: "Airbound.co",
    likes: "2.4K"
  },
  {
    id: 2,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=400&h=400&fit=crop",
    author: "TechVentures",
    likes: "5.1K",
    views: "12K"
  },
  {
    id: 3,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    author: "NeuralHealth",
    likes: "3.8K"
  },
  {
    id: 4,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    author: "GreenCharge",
    likes: "4.2K",
    views: "18K"
  },
  {
    id: 5,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop",
    author: "CodeMentor AI",
    likes: "1.9K"
  },
  {
    id: 6,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=400&fit=crop",
    author: "UrbanFarm",
    likes: "6.3K",
    views: "25K"
  },
  {
    id: 7,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=400&fit=crop",
    author: "SkyTech",
    likes: "2.1K"
  },
  {
    id: 8,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop",
    author: "HealthAI",
    likes: "7.5K",
    views: "32K"
  },
  {
    id: 9,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
    author: "FoodFlow",
    likes: "3.2K"
  },
  {
    id: 10,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1617704548623-340376564e68?w=400&h=400&fit=crop",
    author: "CleanTech",
    likes: "5.8K",
    views: "21K"
  },
  {
    id: 11,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop",
    author: "AgriTech",
    likes: "2.7K"
  },
  {
    id: 12,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
    author: "DevTools",
    likes: "4.9K",
    views: "15K"
  }
];

type FilterType = "investors" | "startups" | "posts" | "reels";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("reels");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof dummySuggestions>([]);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = dummySuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue]);

  const saveToHistory = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const updatedHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, 10); // Keep only last 10 searches

    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setInputValue("");
    setActiveFilter("reels");
    setShowHistory(false);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      saveToHistory(inputValue);
      setSearchQuery(inputValue);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    setShowHistory(false);
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
    saveToHistory(name);
    setSearchQuery(name);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const removeHistoryItem = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      <main className="pt-4 px-4 max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="mt-2 mb-4 relative">
          <div className="relative">
            <SearchIcon 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer"
              onClick={handleSearch}
            />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder="Search investors, startups, founders…"
              className="pl-10 pr-10 h-12 rounded-full bg-muted border-0"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

        </div>

        {/* Search History & Suggestions - Full Screen */}
        {showHistory && (
          <div className="space-y-6">
            {/* Search History Section */}
            {searchHistory.length > 0 && !inputValue && (
              <div className="bg-background">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">Recent</h3>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((query, index) => (
                    <div
                      key={index}
                      onClick={() => handleHistoryClick(query)}
                      className="flex items-center gap-3 px-2 py-3 hover:bg-muted rounded-lg cursor-pointer group"
                    >
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-sm text-foreground">{query}</span>
                      <button
                        onClick={(e) => removeHistoryItem(query, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Suggestions as User Types */}
            {inputValue && filteredSuggestions.length > 0 && (
              <div className="bg-background">
                <div className="space-y-1">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      className="flex items-center gap-3 px-2 py-3 hover:bg-muted rounded-lg cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">
                          {suggestion.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.subtitle}</p>
                      </div>
                      <SearchIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {inputValue && filteredSuggestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{inputValue}"</p>
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs - Only visible when searching */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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
            <button
              onClick={() => setActiveFilter("posts")}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === "posts"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Posts
            </button>
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
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-6">
            {/* Reels Section */}
            {activeFilter === "reels" && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Reels search coming soon
                </p>
              </div>
            )}

            {/* Posts Section */}
            {activeFilter === "posts" && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Posts search coming soon
                </p>
              </div>
            )}

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

          </div>
        )}

        {/* For You Feed - Default View */}
        {!searchQuery && !showHistory && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {forYouContent.map((content) => (
                <div 
                  key={content.id} 
                  className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
                >
                  <img 
                    src={content.thumbnail} 
                    alt={content.author}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video indicator for reels */}
                  {content.type === "reel" && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                  
                  {/* Overlay with info on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center px-2">
                      <p className="text-xs font-semibold mb-1 truncate">{content.author}</p>
                      <p className="text-[10px]">{content.likes} likes</p>
                      {content.type === "reel" && (
                        <p className="text-[10px]">{content.views} views</p>
                      )}
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
