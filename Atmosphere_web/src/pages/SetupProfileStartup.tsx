import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronDown, MapPin } from "lucide-react";

// Location Suggestions
const LOCATION_SUGGESTIONS = [
  "New York, USA",
  "San Francisco, USA",
  "London, UK",
  "Berlin, Germany",
  "Singapore",
  "Tokyo, Japan",
  "Toronto, Canada",
  "Sydney, Australia",
];

// Company Types
const COMPANY_TYPES = [
  "Product Startup",
  "Service Startup",
  "SaaS Company",
  "Drone Startup",
  "AI/ML Startup",
  "E-Commerce",
  "Hardware Company",
  "Marketplace",
  "FinTech Startup",
  "HealthTech Startup",
];

// Role Options
const ROLE_OPTIONS = [
  "Founder",
  "Co-Founder",
  "CEO",
  "CTO",
  "COO",
  "CMO",
  "Engineer",
  "Designer",
  "Team",
];

// Auto Close Hook (3 seconds)
const useAutoClose = (isOpen, closeFn) => {
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => closeFn(), 3000);
    return () => clearTimeout(t);
  }, [isOpen]);
};

const SetupProfileStartup = () => {
  const navigate = useNavigate();

  const [legalName, setLegalName] = useState("");
  const [about, setAbout] = useState("");

  // LOCATION
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const filteredLocations = locationSearch
    ? LOCATION_SUGGESTIONS.filter((loc) =>
        loc.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : [];

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setLocationSearch("");
    setShowLocationSuggestions(false);
  };

  // COMPANY TYPE DROPDOWN
  const [companyType, setCompanyType] = useState("");
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  useAutoClose(companyDropdownOpen, () => setCompanyDropdownOpen(false));

  // DATE PICKER
  const [establishedOn, setEstablishedOn] = useState("");

  // TEAM
  const [team, setTeam] = useState([{ username: "", role: "", open: false }]);

  const handleAddMember = () => {
    setTeam([...team, { username: "", role: "", open: false }]);
  };

  const toggleRoleDropdown = (index) => {
    const updated = [...team];
    updated[index].open = !updated[index].open;
    setTeam(updated);
  };

  const selectRole = (index, value) => {
    const updated = [...team];
    updated[index].role = value;
    updated[index].open = false;
    setTeam(updated);
  };

  // Auto close team role dropdowns
  team.forEach((m, i) => {
    useAutoClose(m.open, () => {
      const updated = [...team];
      updated[i].open = false;
      setTeam(updated);
    });
  });

  const handleSave = () => {
    navigate("/getverified");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <h2 className="text-xl font-semibold text-foreground">Expand</h2>

          <Button variant="ghost" size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>

        {/* COMPANY LEGAL NAME */}
        <div className="space-y-2">
          <Label className="text-sm">Company Legal Name</Label>
          <Input
            placeholder="Enter full legal name"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* ABOUT */}
        <div className="space-y-2">
          <Label>About your company</Label>
          <Textarea
            placeholder="Write about your company..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="min-h-[140px] resize-none text-sm"
          />
        </div>

        {/* LOCATION FIELD */}
        <div className="space-y-2">
          <Label className="text-sm">Location</Label>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 text-muted-foreground" />

            <Input
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
              <div className="absolute z-20 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto animate-in fade-in duration-150">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COMPANY TYPE CUSTOM DROPDOWN */}
        {/* COMPANY TYPE CUSTOM DROPDOWN */}
<div className="space-y-2 relative">
  <Label className="text-sm">Company Type</Label>

  <button
    onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
    className="w-full p-2.5 rounded-md border text-sm flex justify-between items-center bg-background"
  >
    {companyType || "Select company type"}
    <ChevronDown className="h-4 w-4 text-muted-foreground" />
  </button>

  {companyDropdownOpen && (
    <div
      className="
        absolute left-0 right-0 mt-1 
        bg-background border border-border rounded-lg shadow-lg 
        z-50 
        max-h-40 overflow-y-auto
        animate-in fade-in duration-150
      "
    >
      {COMPANY_TYPES.map((item) => (
        <button
          key={item}
          onClick={() => {
            setCompanyType(item);
            setCompanyDropdownOpen(false);
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
        >
          {item}
        </button>
      ))}
    </div>
  )}

  {companyType && (
    <p className="text-xs text-muted-foreground mt-1">
      Selected: <span className="font-medium">{companyType}</span>
    </p>
  )}
</div>

        {/* DATE PICKER */}
        <div className="space-y-2">
          <Label className="text-sm">Company Established On</Label>
          <Input
            type="date"
            value={establishedOn}
            onChange={(e) => setEstablishedOn(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* TEAM SECTION */}
        <div className="space-y-2">
          <Label className="text-sm">Team</Label>

          {team.map((member, index) => (
            <div key={index} className="flex items-center gap-3 relative">
              <Input
                placeholder="@username"
                value={member.username}
                onChange={(e) =>
                  handleMemberChange(index, "username", e.target.value)
                }
                className="text-sm flex-1"
              />

              {/* ROLE DROPDOWN */}
                <button
                onClick={() => toggleRoleDropdown(index)}
                className="flex-1 p-2 rounded-md border text-sm bg-background flex justify-between items-center"
                >
                {member.role || "Role"}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {member.open && (
                <div
                    className="
                    absolute right-0 mt-12 w-[48%]
                    bg-background border border-border rounded-lg shadow-lg
                    max-h-40 overflow-y-auto
                    z-40 animate-in fade-in duration-150
                    "
                >
                    {ROLE_OPTIONS.map((role) => (
                    <button
                        key={role}
                        onClick={() => selectRole(index, role)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                    >
                        {role}
                    </button>
                    ))}
                </div>
                )}
            </div>
          ))}

          {/* ADD MEMBER BUTTON */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleAddMember}
              className="w-9 h-9 rounded-full bg-muted text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <Button onClick={handleSave} className="w-full h-12 mt-6">
          Continue
        </Button>

      </div>
    </div>
  );
};

export default SetupProfileStartup;
