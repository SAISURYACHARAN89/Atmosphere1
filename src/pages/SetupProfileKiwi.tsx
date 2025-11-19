import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { X, ArrowLeft, MapPin } from "lucide-react";

// ------------------ DATA OPTIONS -------------------
const FOCUS_OPTIONS = [
  "AI", "SaaS", "Drones", "FinTech", "HealthTech",
  "EdTech", "E-commerce", "Blockchain", "IoT", "CleanTech"
];

const STAGE_OPTIONS = [
  "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+"
];

const PROGRESS_OPTIONS = [
  "Idea", "Prototype", "MVP", "Beta Users", "Launched Product", "Scaling"
];

const GEOGRAPHY_OPTIONS = [
  "North America", "Europe", "Asia", "South America",
  "Africa", "Australia", "Worldwide"
];

const LOCATION_SUGGESTIONS = [
  "New York, USA", "San Francisco, USA",
  "London, UK", "Berlin, Germany",
  "Singapore", "Tokyo, Japan",
  "Toronto, Canada", "Sydney, Australia"
];

// ------------------ AUTO CLOSE HOOK -------------------
const useAutoClose = (open: boolean, closeFn: () => void) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      closeFn();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open]);
};

const SetupProfileKiwi = () => {
  const navigate = useNavigate();

  const [aboutMe, setAboutMe] = useState("");
  const [location, setLocation] = useState(localStorage.getItem("setupLocation") || "");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const [investmentFocus, setInvestmentFocus] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const [geographies, setGeographies] = useState<string[]>([]);

  // -------- NEW CHECK SIZE MIN / MAX -------
  const [checkSizeMin, setCheckSizeMin] = useState("");
  const [checkSizeMax, setCheckSizeMax] = useState("");

  const [showFocusOptions, setShowFocusOptions] = useState(false);
  const [showStageOptions, setShowStageOptions] = useState(false);
  const [showProgressOptions, setShowProgressOptions] = useState(false);
  const [showGeographyOptions, setShowGeographyOptions] = useState(false);
  const [geographySearch, setGeographySearch] = useState("");
const [showGeographySearchSuggestions, setShowGeographySearchSuggestions] = useState(false);

  // ------------------ AUTO CLOSE ACTIVATION -------------------
  useAutoClose(showFocusOptions, () => setShowFocusOptions(false));
  useAutoClose(showStageOptions, () => setShowStageOptions(false));
  useAutoClose(showProgressOptions, () => setShowProgressOptions(false));
  useAutoClose(showGeographyOptions, () => setShowGeographyOptions(false));

  const filteredLocations = locationSearch
    ? LOCATION_SUGGESTIONS.filter((loc) =>
        loc.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : [];

  // ------------------ HANDLERS -------------------
  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setLocationSearch("");
    setShowLocationSuggestions(false);
  };

  const toggleFocus = (val: string) => {
    setInvestmentFocus((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
    setShowFocusOptions(false);
  };

  const toggleStage = (val: string) => {
    setStages((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
    setShowStageOptions(false);
  };

  const toggleProgress = (val: string) => {
    setProgress((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
    setShowProgressOptions(false);
  };

  const toggleGeography = (val: string) => {
    setGeographies((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
    setShowGeographyOptions(false);
  };

  const handleComplete = () => {
    if (!aboutMe || investmentFocus.length === 0 || stages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!checkSizeMin || !checkSizeMax) {
      toast({
        title: "Missing Range",
        description: "Enter both minimum and maximum check size",
        variant: "destructive",
      });
      return;
    }

    // SAVE
    localStorage.setItem("setupAboutMe", aboutMe);
    localStorage.setItem("setupLocation", location);
    localStorage.setItem("setupInvestmentFocus", JSON.stringify(investmentFocus));
    localStorage.setItem("setupStages", JSON.stringify(stages));
    localStorage.setItem("setupProgress", JSON.stringify(progress));
    localStorage.setItem("setupGeographies", JSON.stringify(geographies));
    localStorage.setItem("setupCheckSizeMin", checkSizeMin);
    localStorage.setItem("setupCheckSizeMax", checkSizeMax);

    toast({
      title: "Investment Preferences Saved",
      description: "Proceeding to KYC verification",
    });

    navigate("/getverified");
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center flex-1">
            <h2 className="text-2xl font-semibold text-foreground">Expand Your Profile</h2>
            <p className="text-sm text-muted-foreground mt-2">Step 3 of 3</p>
          </div>

          <Button variant="ghost" size="sm" onClick={handleComplete}>
            Save
          </Button>
        </div>

        <div className="space-y-5">

          {/* ABOUT ME */}
          <div className="space-y-2">
            <Label>About Myself</Label>
            <Textarea
              placeholder="Tell us more about yourself..."
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
            />
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <Label className="text-sm">Location</Label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Search location"
                value={locationSearch || location}
                onChange={(e) => {
                  setLocation("");
                  setLocationSearch(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                className="pl-10 text-sm"
              />

              {showLocationSuggestions && filteredLocations.length > 0 && (
                <div className="
                  absolute z-10 w-full mt-1 bg-background border border-border rounded-md 
                  shadow-lg max-h-48 overflow-y-auto animate-in fade-in
                ">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-accent"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* INVESTMENT FOCUS */}
          <div className="space-y-2">
            <Label>Investment Focus</Label>

            <Button
              variant="outline"
              className="w-full justify-start h-9 text-sm text-muted-foreground"
              onClick={() => setShowFocusOptions(!showFocusOptions)}
            >
              {investmentFocus.length > 0
                ? `${investmentFocus.length} selected`
                : "Select focus areas"}
            </Button>

            {showFocusOptions && (
              <div className="
                grid grid-cols-2 gap-1.5 p-2 border rounded-md bg-muted/20 
                animate-in fade-in
              ">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleFocus(opt)}
                    className={`p-2 rounded-sm text-xs font-medium ${
                      investmentFocus.includes(opt)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {investmentFocus.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {investmentFocus.map((tag) => (
                  <Badge key={tag} variant="secondary" className="h-6 gap-1 px-2 text-xs">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleFocus(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* STAGE */}
          <div className="space-y-2">
            <Label>Interested round</Label>

            <Button
              variant="outline"
              className="w-full justify-start h-9 text-sm text-muted-foreground"
              onClick={() => setShowStageOptions(!showStageOptions)}
            >
              {stages.length > 0 ? `${stages.length} selected` : "Select interested rounds"}
            </Button>

            {showStageOptions && (
              <div className="
                grid grid-cols-2 gap-1.5 p-2 border rounded-md bg-muted/20 
                animate-in fade-in
              ">
                {STAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleStage(opt)}
                    className={`p-2 rounded-sm text-xs font-medium ${
                      stages.includes(opt)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {stages.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {stages.map((tag) => (
                  <Badge key={tag} variant="secondary" className="h-6 gap-1 px-2 text-xs">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleStage(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* STARTUP PROGRESS */}
          <div className="space-y-2">
            <Label>Stage</Label>

            <Button
              variant="outline"
              className="w-full justify-start h-9 text-sm text-muted-foreground"
              onClick={() => setShowProgressOptions(!showProgressOptions)}
            >
              {progress.length > 0 ? `${progress.length} selected` : "Select stage"}
            </Button>

            {showProgressOptions && (
              <div className="
                grid grid-cols-2 gap-1.5 p-2 border rounded-md bg-muted/20 
                animate-in fade-in
              ">
                {PROGRESS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleProgress(opt)}
                    className={`p-2 rounded-sm text-xs font-medium ${
                      progress.includes(opt)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {progress.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {progress.map((tag) => (
                  <Badge key={tag} variant="secondary" className="h-6 gap-1 px-2 text-xs">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleProgress(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

{/* GEOGRAPHY (Multi-select Search Input Like Tags) */}
<div className="space-y-2">
  <Label>Investment Geography</Label>

  {/* Search Box */}
  <div className="relative">

    <Input
      type="text"
      placeholder="Search geographies"
      value={geographySearch}
      onChange={(e) => {
        setGeographySearch(e.target.value);
        setShowGeographySearchSuggestions(true);
      }}
      onFocus={() => setShowGeographySearchSuggestions(true)}
      className="text-sm"
    />

    {/* Suggestions Dropdown */}
    {showGeographySearchSuggestions && geographySearch.length > 0 && (
      <div className="
        absolute z-10 w-full mt-1 bg-background border border-border rounded-md 
        shadow-lg max-h-48 overflow-y-auto animate-in fade-in
      ">
        {GEOGRAPHY_OPTIONS.filter((g) =>
          g.toLowerCase().includes(geographySearch.toLowerCase())
        )
          .filter((g) => !geographies.includes(g)) // hide already selected
          .map((geo) => (
            <button
              key={geo}
              onClick={() => {
                setGeographies((prev) => [...prev, geo]);
                setGeographySearch(""); // clear input
                setShowGeographySearchSuggestions(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-accent"
            >
              {geo} 
            </button>
          ))}

        {GEOGRAPHY_OPTIONS.filter((g) =>
          g.toLowerCase().includes(geographySearch.toLowerCase())
        ).length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No results
          </div>
        )}
      </div>
    )}
  </div>

  {/* Selected Geographies as Tags */}
  {geographies.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {geographies.map((geo) => (
        <div
          key={geo}
          className="flex items-center gap-1 bg-primary/10 text-white px-2 py-1 rounded-md text-xs"
        >
          {geo}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() =>
              setGeographies((prev) => prev.filter((g) => g !== geo))
            }
          />
        </div>
      ))}
    </div>
  )}

  {geographies.length === 0 && (
    <p className="text-xs text-muted-foreground">If empty → Default: Worldwide</p>
  )}
</div>


          {/* CHECK SIZE — MIN & MAX */}
          <div className="space-y-2">
            <Label>Check Size (USD)</Label>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Min in $"
                value={checkSizeMin}
                onChange={(e) => setCheckSizeMin(e.target.value)}
                className="text-sm"
              />
              <Input
                type="text"
                placeholder="Max in $"
                value={checkSizeMax}
                onChange={(e) => setCheckSizeMax(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

        </div>

        <Button onClick={handleComplete} className="w-full h-12">
          Complete Setup
        </Button>

      </div>
    </div>
  );
};

export default SetupProfileKiwi;
