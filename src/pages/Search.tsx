import { useState, useEffect } from "react";
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

const forYouContent = [
  {
    id: 1,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    author: "Airbound.co",
    likes: "2.4K",
  },
  {
    id: 2,
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=400&h=400&fit=crop",
    author: "TechVentures",
    likes: "5.1K",
    views: "12K",
  },
  {
    id: 3,
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    author: "NeuralHealth",
    likes: "3.8K",
  },
];

const dummySuggestions = [
  { name: "SkyDrop", subtitle: "Drone Startup" },
  { name: "Kavya Nair", subtitle: "Angel Investor" },
  { name: "HealthAI", subtitle: "Healthcare Startup" },
  { name: "Surya P", subtitle: "Founder" },
];

type FilterType = "reels" | "posts" | "accounts";

const Search = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("reels");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<typeof dummySuggestions>([]);

  /* Load History */
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  /* Live Suggestions */
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = dummySuggestions.filter((s) =>
        s.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue]);

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
    setShowHistory(false);
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    saveToHistory(inputValue);
    setSearchQuery(inputValue);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="pt-4 px-4 max-w-2xl mx-auto">

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="mt-2 mb-4 relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer"
            onClick={handleSearch}
          />

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Search accounts, reels, posts..."
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

        {/* ---------------- SUGGESTIONS / HISTORY ---------------- */}
        {showHistory && (
          <div className="space-y-6">

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
                    onClick={() => {
                      setInputValue(item);
                      setSearchQuery(item);
                      setShowHistory(false);
                    }}
                    className="flex items-center gap-3 py-3 px-2 hover:bg-muted rounded-lg cursor-pointer"
                  >
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{item}</span>
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
                    onClick={() => {
                      setInputValue(s.name);
                      setSearchQuery(s.name);
                      saveToHistory(s.name);
                    }}
                    className="flex items-center gap-3 px-2 py-3 hover:bg-muted rounded-lg cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
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
          </div>
        )}

        {/* ---------------- FILTER TABS ---------------- */}
        {searchQuery && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <FilterButton label="Reels" filter="reels" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <FilterButton label="Posts" filter="posts" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <FilterButton label="Accounts" filter="accounts" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </div>
        )}

        {/* ---------------- FILTER RESULTS ---------------- */}
        {searchQuery && (
          <div className="space-y-6">

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

        {/* ---------------- DEFAULT FEED ---------------- */}
        {!searchQuery && !showHistory && (
          <div className="grid grid-cols-3 gap-2 mt-6">
            {forYouContent.map((c) => (
              <FeedItem key={c.id} content={c} navigate={navigate} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const FilterButton = ({ label, filter, activeFilter, setActiveFilter }: any) => (
  <button
    onClick={() => setActiveFilter(filter)}
    className={`px-6 py-2 rounded-full text-sm font-medium ${
      activeFilter === filter
        ? "bg-foreground text-background"
        : "bg-muted text-foreground"
    }`}
  >
    {label}
  </button>
);

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

const FeedItem = ({ content, navigate }: any) => (
  <div
    className="relative aspect-square border border-border rounded-lg overflow-hidden cursor-pointer group"
    onClick={() => navigate("/reels", { state: { preview: "search" } })}
  >
    <img src={content.thumbnail} className="w-full h-full object-cover" />

    {content.type === "reel" && (
      <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
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
