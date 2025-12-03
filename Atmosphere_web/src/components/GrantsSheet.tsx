import { useState } from "react";
import { Filter, Building2, MapPin, Calendar, ExternalLink, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

interface Event {
  id: string;
  name: string;
  organizer: string;
  sector: string;
  location: string;
  date: string;
  type: "physical" | "virtual" | "hybrid" | "e-summit" | "conference" | "workshop" | "networking";
  description: string;
  attendees: string;
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

const eventsData: Event[] = [
  {
    id: "e1",
    name: "AI & Machine Learning Summit 2024",
    organizer: "Tech Innovators Network",
    sector: "Artificial Intelligence",
    location: "San Francisco, USA",
    date: "Dec 15-17, 2024",
    type: "physical",
    description: "Three-day summit featuring leading AI researchers, industry experts, and networking opportunities.",
    attendees: "2000+ attendees",
    url: "#"
  },
  {
    id: "e2",
    name: "Global Climate Tech Conference",
    organizer: "Green Future Foundation",
    sector: "Green Energy",
    location: "Online",
    date: "Jan 8-10, 2025",
    type: "virtual",
    description: "Virtual conference connecting climate tech startups with investors and industry leaders.",
    attendees: "5000+ attendees",
    url: "#"
  },
  {
    id: "e3",
    name: "HealthTech Innovation E-Summit",
    organizer: "MedTech Global",
    sector: "Healthcare",
    location: "Hybrid - London & Online",
    date: "Jan 22-23, 2025",
    type: "e-summit",
    description: "E-summit showcasing breakthrough healthcare technologies and digital health solutions.",
    attendees: "3500+ attendees",
    url: "#"
  },
  {
    id: "e4",
    name: "FinTech Leaders Conference",
    organizer: "Financial Innovation Hub",
    sector: "FinTech",
    location: "Singapore",
    date: "Feb 5-6, 2025",
    type: "conference",
    description: "Premier conference for fintech innovators, regulators, and financial institutions.",
    attendees: "1500+ attendees",
    url: "#"
  },
  {
    id: "e5",
    name: "EdTech Workshop Series",
    organizer: "Education First",
    sector: "EdTech",
    location: "Berlin, Germany",
    date: "Feb 12-14, 2025",
    type: "workshop",
    description: "Interactive workshops on implementing educational technology in institutions.",
    attendees: "500+ attendees",
    url: "#"
  },
  {
    id: "e6",
    name: "AgriTech Innovation Expo",
    organizer: "Farm Future Alliance",
    sector: "AgriTech",
    location: "Amsterdam, Netherlands",
    date: "Mar 1-3, 2025",
    type: "physical",
    description: "Exhibition and conference featuring sustainable agriculture and food technology innovations.",
    attendees: "2500+ attendees",
    url: "#"
  },
  {
    id: "e7",
    name: "Blockchain & Web3 Networking Meet",
    organizer: "Crypto Innovators",
    sector: "Blockchain",
    location: "Dubai, UAE",
    date: "Mar 10, 2025",
    type: "networking",
    description: "Exclusive networking event for blockchain entrepreneurs and investors.",
    attendees: "800+ attendees",
    url: "#"
  },
  {
    id: "e8",
    name: "Manufacturing 4.0 Conference",
    organizer: "Industrial Tech Forum",
    sector: "Manufacturing",
    location: "Tokyo, Japan",
    date: "Mar 18-20, 2025",
    type: "conference",
    description: "Conference on advanced manufacturing, robotics, and Industry 4.0 technologies.",
    attendees: "1800+ attendees",
    url: "#"
  },
  {
    id: "e9",
    name: "E-Commerce Growth Summit",
    organizer: "Digital Commerce Alliance",
    sector: "E-commerce",
    location: "Online",
    date: "Apr 5-6, 2025",
    type: "virtual",
    description: "Virtual summit covering e-commerce strategies, trends, and growth tactics.",
    attendees: "4000+ attendees",
    url: "#"
  },
  {
    id: "e10",
    name: "Cybersecurity Leaders Forum",
    organizer: "Security First Network",
    sector: "Cybersecurity",
    location: "Hybrid - New York & Online",
    date: "Apr 15-16, 2025",
    type: "hybrid",
    description: "Forum addressing latest cybersecurity challenges and solutions for businesses.",
    attendees: "2200+ attendees",
    url: "#"
  }
];

interface GrantsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GrantsSheet = ({ open, onOpenChange }: GrantsSheetProps) => {
  const [grantSector, setGrantSector] = useState<string>("All Sectors");
  const [grantType, setGrantType] = useState<string>("all");
  const [eventSector, setEventSector] = useState<string>("All Sectors");
  const [eventType, setEventType] = useState<string>("all");

  const grantTypes = ["all", "grant", "incubator", "accelerator"];
  const eventTypes = ["all", "physical", "virtual", "hybrid", "e-summit", "conference", "workshop", "networking"];

  const filteredGrants = grantsData.filter(grant => {
    const sectorMatch = grantSector === "All Sectors" || grant.sector === grantSector;
    const typeMatch = grantType === "all" || grant.type === grantType;
    return sectorMatch && typeMatch;
  });

  const filteredEvents = eventsData.filter(event => {
    const sectorMatch = eventSector === "All Sectors" || event.sector === eventSector;
    const typeMatch = eventType === "all" || event.type === eventType;
    return sectorMatch && typeMatch;
  });

  const getGrantTypeBadge = (type: string) => {
    switch (type) {
      case "grant": return "default";
      case "incubator": return "secondary";
      case "accelerator": return "outline";
      default: return "default";
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "physical": return "default";
      case "virtual": return "secondary";
      case "hybrid": return "outline";
      default: return "default";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Opportunities Hub
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="grants" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grants" className="gap-2">
              <Building2 className="w-4 h-4" />
              Grants
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Users className="w-4 h-4" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* GRANTS TAB */}
          <TabsContent value="grants" className="space-y-4">
            {/* Grant Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Grant Type Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Type</label>
                <div className="flex flex-wrap gap-2">
                  {grantTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setGrantType(type)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        grantType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grant Sector Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Sector</label>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {sectors.map(sector => (
                      <button
                        key={sector}
                        onClick={() => setGrantSector(sector)}
                        className={cn(
                          "px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                          grantSector === sector
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

            {/* Grant Results */}
            <div className="text-sm text-muted-foreground">
              {filteredGrants.length} {filteredGrants.length === 1 ? 'opportunity' : 'opportunities'} found
            </div>

            <div className="space-y-4">
              {filteredGrants.map(grant => (
                <div key={grant.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{grant.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{grant.organization}</p>
                    </div>
                    <Badge variant={getGrantTypeBadge(grant.type)}>
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
                  <p>No grants found with current filters</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setGrantSector("All Sectors");
                      setGrantType("all");
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            {/* Event Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Event Type Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Type</label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setEventType(type)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        eventType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Sector Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Sector</label>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {sectors.map(sector => (
                      <button
                        key={sector}
                        onClick={() => setEventSector(sector)}
                        className={cn(
                          "px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                          eventSector === sector
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

            {/* Event Results */}
            <div className="text-sm text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>

            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.organizer}</p>
                    </div>
                    <Badge variant={getEventTypeBadge(event.type)}>
                      {event.type}
                    </Badge>
                  </div>

                  <p className="text-sm">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.attendees}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <Button variant="default" size="sm" className="gap-2">
                      Register
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events found with current filters</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setEventSector("All Sectors");
                      setEventType("all");
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

      </SheetContent>
    </Sheet>
  );
};

export default GrantsSheet;
