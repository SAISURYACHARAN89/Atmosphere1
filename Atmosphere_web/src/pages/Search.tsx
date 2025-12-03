import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Plus, Play, Clock, BadgeCheck } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

/* ----------------------------- MOCK DATA ----------------------------- */

const personalAccounts = [
  {
    id: 101,
    name: "Surya P",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    description: "Founder • Building cool things",
    verified: true,
  },
  {
    id: 102,
    name: "Aarav Mehta",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    description: "Product Designer",
    verified: false,
  },
];

const startupAccounts = [
  {
    id: 201,
    name: "SkyDrop",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop",
    description: "India's first drone delivery company",
    verified: true,
  },
  {
    id: 202,
    name: "HealthAI",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
    description: "AI-powered diagnostics platform",
    verified: false,
  },
];

const investorAccounts = [
  {
    id: 301,
    name: "Kavya Nair",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    description: "Angel Investor • 20+ investments",
    verified: true,
  },
  {
    id: 302,
    name: "Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    description: "VC Partner",
    verified: false,
  },
];

/* Merge all 3 types into one unified list */
const allAccounts = [
  ...personalAccounts,
  ...startupAccounts,
  ...investorAccounts,
];

// Helper to generate enough items to show the grid pattern
const generateFeedContent = () => {
  const baseContent = [
    {
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      author: "Airbound.co",
      likes: "2.4K",
    },
    {
      type: "reel",
      thumbnail: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=400&h=400&fit=crop",
      author: "TechVentures",
      likes: "5.1K",
      views: "12K",
    },
    {
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
      author: "NeuralHealth",
      likes: "3.8K",
    },
    {
      type: "reel",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
      author: "CreatorMode",
      likes: "10K",
      views: "50K",
    },
    {
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      author: "ShoeGame",
      likes: "1.2K",
    },
  ];

  // Create an array of 20 items to fully visualize the pattern
  let items = [];
  for (let i = 0; i < 20; i++) {
    const base = baseContent[i % baseContent.length];
    items.push({ ...base, id: i });
  }
  return items;
};

const forYouContent = generateFeedContent();

const dummySuggestions = [
  { name: "SkyDrop", subtitle: "Drone Startup" },
  { name: "Kavya Nair", subtitle: "Angel Investor" },
  { name: "HealthAI", subtitle: "Healthcare Startup" },
  { name: "Surya P", subtitle: "Founder" },
];

type FilterType = "reels" | "posts" | "accounts";

const Search = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("reels");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<typeof dummySuggestions>([]);

  /* Load History */
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  /* Debounced Live Suggestions */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        const filtered = dummySuggestions.filter((s) =>
          s.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  /* Click outside to close suggestions */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Save to history */
  const saveToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...searchHistory.filter((h) => h !== trimmed),
    ].slice(0, 10);

    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setInputValue("");
    setActiveFilter("reels");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || inputValue;
    if (!searchTerm.trim()) return;

    saveToHistory(searchTerm);
    setSearchQuery(searchTerm);
    setInputValue(searchTerm);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestionName: string) => {
    setInputValue(suggestionName);
    handleSearch(suggestionName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="pt-4 px-0 max-w-2xl mx-auto">

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="mt-2 mb-4 mx-4 relative" ref={searchContainerRef}>
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer"
            onClick={() => handleSearch()}
          />

          <Input
            ref={searchInputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search accounts, reels, posts..."
            className="pl-10 pr-10 h-12 rounded-full bg-muted border-0"
          />

          {inputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* ---------------- SUGGESTIONS / HISTORY ---------------- */}
        {showSuggestions && !searchQuery && (
          <div className="space-y-6 px-4">

            {/* History */}
            {searchHistory.length > 0 && !inputValue && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">Recent</h3>
                  <button
                    onClick={() => {
                      setSearchHistory([]);
                      localStorage.removeItem("searchHistory");
                    }}
                    className="text-sm text-primary"
                  >
                    Clear all
                  </button>
                </div>

                {searchHistory.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center gap-3 py-3 px-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  >
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1">{item}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = searchHistory.filter((h) => h !== item);
                        setSearchHistory(updated);
                        localStorage.setItem("searchHistory", JSON.stringify(updated));
                      }}
                      className="p-1 hover:bg-muted-foreground/10 rounded-full"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {inputValue && filteredSuggestions.length > 0 && (
              <div className="space-y-2">
                {filteredSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(s.name)}
                    className="flex items-center gap-3 px-2 py-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-semibold">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {inputValue && filteredSuggestions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No results found for "{inputValue}"</p>
              </div>
            )}
          </div>
        )}

        {/* ---------------- FILTER TABS ---------------- */}
        {searchQuery && (
          <div className="flex gap-4 mb-6 px-4 border-b border-border/40">
            <FilterButton label="Reels" filter="reels" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <FilterButton label="Posts" filter="posts" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <FilterButton label="Accounts" filter="accounts" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </div>
        )}

        {/* ---------------- FILTER RESULTS ---------------- */}
        {searchQuery && (
          <div className="space-y-6 px-4">

            {activeFilter === "reels" && (
              <Placeholder label="Reels search coming soon" />
            )}

            {activeFilter === "posts" && (
              <Placeholder label="Posts search coming soon" />
            )}

            {activeFilter === "accounts" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Accounts</h2>

                <div className="space-y-3">
                  {allAccounts.map((acc) => (
                    <AccountCard key={acc.id} acc={acc} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- DEFAULT FEED (UPDATED GRID) ---------------- */}
        {!searchQuery && !showSuggestions && (
          <div className="grid grid-cols-3 gap-0.1 mt-6">
            {forYouContent.map((c, index) => {
              const cycleIndex = index % 10;
              let spanClass = "aspect-square"; // Default square

              if (cycleIndex === 2) {
                // Item at index 2 (3rd item) becomes the Tall Right item
                spanClass = "row-span-2 h-full aspect-auto";
              } else if (cycleIndex === 5) {
                // Item at index 5 (6th item) becomes the Tall Left item
                spanClass = "row-span-2 h-full aspect-auto";
              }

              return (
                <FeedItem
                  key={c.id}
                  content={c}
                  navigate={navigate}
                  className={spanClass}
                />
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const FilterButton = ({ label, filter, activeFilter, setActiveFilter }: any) => {
  const isActive = activeFilter === filter;
  return (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
    >
      {label}
      {/* Animated Underline */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300 ease-in-out ${isActive ? "w-full" : "w-0"
          }`}
      />
    </button>
  );
};

const Placeholder = ({ label }: { label: string }) => (
  <div className="text-center py-16">
    <p className="text-muted-foreground">{label}</p>
  </div>
);

const AccountCard = ({ acc }: any) => (
  <div className="flex items-center justify-between py-3">

    {/* Left side: image + name + desc */}
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={acc.image}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {acc.name}
          </h3>
          {acc.verified && (
            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
          )}
        </div>

        <p className="text-xs text-muted-foreground truncate max-w-[170px]">
          {acc.description}
        </p>
      </div>
    </div>

    {/* Follow button */}
    <Button
      variant="outline"
      size="sm"
      className="h-7 px-3 text-xs flex-shrink-0"
    >
      Follow
    </Button>
  </div>
);

const FeedItem = ({ content, navigate, className }: any) => (
  <div
    className={`relative border border-border/50 overflow-hidden cursor-pointer group ${className}`}
    onClick={() => navigate("/reels", { state: { preview: "search" } })}
  >
    <img src={content.thumbnail} className="w-full h-full object-cover" />

    {content.type === "reel" && (
      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 backdrop-blur-sm">
        <Play className="w-3 h-3 text-white" />
      </div>
    )}

    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-xs font-semibold">{content.author}</p>
        <p className="text-[10px]">{content.likes} likes</p>
        {content.views && <p className="text-[10px]">{content.views} views</p>}
      </div>
    </div>
  </div>
);

export default Search;