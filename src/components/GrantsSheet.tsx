import { useState } from "react";
import { X, Filter, Building2, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Grant {
  id: string;
  name: string;
  organization: string;
  sector: string;
  location: string;
  amount: string;
  deadline: string;
  type: "grant" | "incubator" | "accelerator";
  description: string;
  url: string;
}

const sectors = [
  "All Sectors",
  "Artificial Intelligence",
  "Machine Learning",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "IoT",
  "Healthcare",
  "Biotechnology",
  "Medical Devices",
  "Green Energy",
  "Renewable Energy",
  "Clean Tech",
  "Manufacturing",
  "Robotics",
  "Automation",
  "Finance",
  "FinTech",
  "InsurTech",
  "Education",
  "EdTech",
  "E-Learning",
  "Agriculture",
  "AgriTech",
  "FoodTech",
  "Retail",
  "E-commerce",
  "SaaS",
  "Space Tech",
  "Mobility",
  "Transportation",
  "Real Estate",
  "PropTech",
  "Entertainment",
  "Gaming",
  "Media",
];

const grantsData: Grant[] = [
  {
    id: "1",
    name: "Tech Innovation Grant 2024",
    organization: "National Science Foundation",
    sector: "Artificial Intelligence",
    location: "USA",
    amount: "$50,000 - $250,000",
    deadline: "Dec 31, 2024",
    type: "grant",
    description: "Supporting innovative tech startups in AI, blockchain, and IoT sectors.",
    url: "#"
  },
  {
    id: "2",
    name: "Green Energy Accelerator",
    organization: "CleanTech Ventures",
    sector: "Green Energy",
    location: "Global",
    amount: "$100,000 + Mentorship",
    deadline: "Jan 15, 2025",
    type: "accelerator",
    description: "3-month program for renewable energy startups with funding and mentorship.",
    url: "#"
  },
  {
    id: "3",
    name: "HealthTech Incubator",
    organization: "MedStart Hub",
    sector: "Healthcare",
    location: "Europe",
    amount: "$75,000",
    deadline: "Nov 30, 2024",
    type: "incubator",
    description: "Supporting healthcare innovation with focus on telemedicine and digital health.",
    url: "#"
  },
  {
    id: "4",
    name: "FinTech Growth Fund",
    organization: "Finance Innovation Lab",
    sector: "FinTech",
    location: "Asia",
    amount: "$200,000 - $500,000",
    deadline: "Dec 15, 2024",
    type: "grant",
    description: "Funding for fintech startups revolutionizing payment systems and banking.",
    url: "#"
  },
  {
    id: "5",
    name: "EdTech Accelerator Program",
    organization: "Learn Ventures",
    sector: "EdTech",
    location: "USA",
    amount: "$150,000",
    deadline: "Jan 31, 2025",
    type: "accelerator",
    description: "12-week intensive program for education technology startups.",
    url: "#"
  },
  {
    id: "6",
    name: "AgriTech Innovation Grant",
    organization: "FarmFuture Foundation",
    sector: "AgriTech",
    location: "Global",
    amount: "$80,000 - $300,000",
    deadline: "Feb 28, 2025",
    type: "grant",
    description: "Supporting sustainable agriculture and food tech innovations.",
    url: "#"
  },
  {
    id: "7",
    name: "AI Research Incubator",
    organization: "DeepMind Labs",
    sector: "Machine Learning",
    location: "UK",
    amount: "$120,000 + Resources",
    deadline: "Dec 20, 2024",
    type: "incubator",
    description: "Focus on artificial intelligence and machine learning applications.",
    url: "#"
  },
  {
    id: "8",
    name: "Retail Innovation Fund",
    organization: "Commerce Accelerators",
    sector: "E-commerce",
    location: "USA",
    amount: "$90,000",
    deadline: "Jan 10, 2025",
    type: "accelerator",
    description: "Supporting e-commerce and retail technology innovations.",
    url: "#"
  },
  {
    id: "9",
    name: "Manufacturing Excellence Grant",
    organization: "Industrial Innovation Fund",
    sector: "Manufacturing",
    location: "Germany",
    amount: "$180,000",
    deadline: "Jan 20, 2025",
    type: "grant",
    description: "Supporting advanced manufacturing and Industry 4.0 innovations.",
    url: "#"
  },
  {
    id: "10",
    name: "Blockchain Innovation Hub",
    organization: "Crypto Ventures",
    sector: "Blockchain",
    location: "Singapore",
    amount: "$200,000 + Equity",
    deadline: "Feb 10, 2025",
    type: "incubator",
    description: "6-month program for blockchain and Web3 startups.",
    url: "#"
  }
];

interface GrantsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GrantsSheet = ({ open, onOpenChange }: GrantsSheetProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = ["all", "grant", "incubator", "accelerator"];

  const filteredGrants = grantsData.filter(grant => {
    const sectorMatch = selectedSector === "All Sectors" || grant.sector === selectedSector;
    const typeMatch = selectedType === "all" || grant.type === selectedType;
    return sectorMatch && typeMatch;
  });

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "grant": return "default";
      case "incubator": return "secondary";
      case "accelerator": return "outline";
      default: return "default";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Grants & Programs
          </SheetTitle>
        </SheetHeader>

        {/* Filters */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Type</label>
            <div className="flex gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Filter - Scrollable */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Sector</label>
            <ScrollArea className="h-[200px] border rounded-md p-3">
              <div className="grid grid-cols-2 gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={cn(
                      "px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                      selectedSector === sector
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-muted-foreground">
          {filteredGrants.length} {filteredGrants.length === 1 ? 'opportunity' : 'opportunities'} found
        </div>

        {/* Grants List */}
        <div className="mt-4 space-y-4">
          {filteredGrants.map(grant => (
            <div key={grant.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold">{grant.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{grant.organization}</p>
                </div>
                <Badge variant={getTypeBadgeVariant(grant.type)}>
                  {grant.type}
                </Badge>
              </div>

              <p className="text-sm">{grant.description}</p>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {grant.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {grant.deadline}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="font-semibold text-sm">{grant.amount}</div>
                <Button variant="outline" size="sm" className="gap-2">
                  Apply Now
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}

          {filteredGrants.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No opportunities found with current filters</p>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => {
                  setSelectedSector("All Sectors");
                  setSelectedType("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GrantsSheet;
