import { useState } from "react";
import { Filter, Building2, MapPin, Calendar, ExternalLink, Users, ChevronDown, X, Briefcase, Mail } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

const locations = [
  "All Locations",
  "USA",
  "UK",
  "Europe",
  "Asia",
  "Global",
  "Germany",
  "Singapore",
  "San Francisco, USA",
  "Online",
  "London",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Dubai, UAE",
  "Tokyo, Japan",
  "New York",
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
    location: "London",
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
    location: "New York",
    date: "Apr 15-16, 2025",
    type: "hybrid",
    description: "Forum addressing latest cybersecurity challenges and solutions for businesses.",
    attendees: "2200+ attendees",
    url: "#"
  }
];

interface CoFounder {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  location: string;
  lookingFor: string;
  bio: string;
  availability: string;
}

const coFoundersData: CoFounder[] = [
  {
    id: "1",
    name: "Alex Chen",
    title: "Full-Stack Developer",
    expertise: ["React", "Node.js", "AWS", "Product Development"],
    location: "San Francisco, USA",
    lookingFor: "Technical Co-founder for SaaS startup",
    bio: "10+ years building scalable web applications. Looking to join an early-stage startup as a technical co-founder.",
    availability: "Full-time"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    title: "Marketing & Growth Strategist",
    expertise: ["Digital Marketing", "Growth Hacking", "Brand Strategy", "Content"],
    location: "London, UK",
    lookingFor: "Marketing Co-founder for B2B Tech",
    bio: "Helped 3 startups achieve 10x growth. Seeking mission-driven B2B tech company.",
    availability: "Part-time"
  },
  {
    id: "3",
    name: "Raj Patel",
    title: "AI/ML Engineer",
    expertise: ["Machine Learning", "Python", "Deep Learning", "Computer Vision"],
    location: "Berlin, Germany",
    lookingFor: "Co-founder for AI/ML startup",
    bio: "PhD in AI, ex-Google. Building intelligent systems for healthcare and climate tech.",
    availability: "Full-time"
  },
  {
    id: "4",
    name: "Emma Williams",
    title: "Product Designer",
    expertise: ["UX/UI Design", "User Research", "Design Systems", "Prototyping"],
    location: "New York, USA",
    lookingFor: "Design Co-founder for Consumer App",
    bio: "Award-winning designer with passion for creating delightful user experiences.",
    availability: "Full-time"
  },
  {
    id: "5",
    name: "Michael Zhang",
    title: "Finance & Operations",
    expertise: ["Financial Planning", "Operations", "Fundraising", "Strategy"],
    location: "Singapore",
    lookingFor: "Business Co-founder for FinTech",
    bio: "Ex-investment banker turned operator. Raised $50M+ for startups.",
    availability: "Full-time"
  }
];

const Opportunities = () => {
  const [grantSector, setGrantSector] = useState<string>("All Sectors");
  const [grantType, setGrantType] = useState<string>("all");
  const [eventSector, setEventSector] = useState<string>("All Sectors");
  const [eventType, setEventType] = useState<string>("all");
  const [eventLocation, setEventLocation] = useState<string>("All Locations");
  const [teamExpertise, setTeamExpertise] = useState<string>("All");
  
  const [grantTypeOpen, setGrantTypeOpen] = useState(false);
  const [grantSectorOpen, setGrantSectorOpen] = useState(false);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventSectorOpen, setEventSectorOpen] = useState(false);
  const [eventLocationOpen, setEventLocationOpen] = useState(false);
  const [teamExpertiseOpen, setTeamExpertiseOpen] = useState(false);

  const grantTypes = ["all", "grant", "incubator", "accelerator"];
  const eventTypes = ["all", "physical", "virtual", "hybrid", "e-summit", "conference", "workshop", "networking"];
  const teamExpertiseOptions = ["All", "Technical", "Business", "Design", "Marketing", "Finance"];

  const filteredGrants = grantsData.filter(grant => {
    const sectorMatch = grantSector === "All Sectors" || grant.sector === grantSector;
    const typeMatch = grantType === "all" || grant.type === grantType;
    return sectorMatch && typeMatch;
  });

  const filteredEvents = eventsData.filter(event => {
    const sectorMatch = eventSector === "All Sectors" || event.sector === eventSector;
    const typeMatch = eventType === "all" || event.type === eventType;
    const locationMatch = eventLocation === "All Locations" || event.location.includes(eventLocation) || eventLocation.includes(event.location);
    return sectorMatch && typeMatch && locationMatch;
  });

  const filteredCoFounders = coFoundersData.filter(cofounder => {
    if (teamExpertise === "All") return true;
    return cofounder.expertise.some(exp => exp.toLowerCase().includes(teamExpertise.toLowerCase()));
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

  const FilterButton = ({ label, value, isActive }: { label: string; value: string; isActive: boolean }) => (
    <button
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:bg-muted"
      )}
    >
      {label}
      {isActive && value !== "all" && value !== "All Sectors" && value !== "All Locations" && (
        <span className="ml-1.5">✓</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-14">
      <TopBar />
      
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Three-Tab Header */}
        <Tabs defaultValue="grants" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12 bg-muted/50 rounded-2xl p-1">
            <TabsTrigger value="grants" className="text-sm font-medium rounded-xl data-[state=active]:bg-background">
              Grants
            </TabsTrigger>
            <TabsTrigger value="events" className="text-sm font-medium rounded-xl data-[state=active]:bg-background">
              Events
            </TabsTrigger>
            <TabsTrigger value="team" className="text-sm font-medium rounded-xl data-[state=active]:bg-background">
              Team
            </TabsTrigger>
          </TabsList>

          {/* GRANTS TAB */}
          <TabsContent value="grants" className="space-y-4">
            {/* Grant Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Grant Type Filter */}
              <Collapsible open={grantTypeOpen} onOpenChange={setGrantTypeOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Type: {grantType === "all" ? "All" : grantType.charAt(0).toUpperCase() + grantType.slice(1)}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", grantTypeOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                    {grantTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setGrantType(type);
                          setGrantTypeOpen(false);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          grantType === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Grant Sector Filter */}
              <Collapsible open={grantSectorOpen} onOpenChange={setGrantSectorOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Sector: {grantSector}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", grantSectorOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                    {sectors.map(sector => (
                      <button
                        key={sector}
                        onClick={() => {
                          setGrantSector(sector);
                          setGrantSectorOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                          grantSector === sector
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Clear filters if any active */}
              {(grantType !== "all" || grantSector !== "All Sectors") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGrantType("all");
                    setGrantSector("All Sectors");
                  }}
                  className="w-full gap-2"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </Button>
              )}
            </div>

            {/* Grant Results */}
            <div className="text-sm text-muted-foreground py-2">
              {filteredGrants.length} {filteredGrants.length === 1 ? 'opportunity' : 'opportunities'} found
            </div>

            <div className="space-y-4">
              {filteredGrants.map(grant => (
                <div key={grant.id} className="border border-border rounded-xl p-4 space-y-3 hover:bg-muted/30 transition-colors bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{grant.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{grant.organization}</p>
                    </div>
                    <Badge variant={getGrantTypeBadge(grant.type)}>
                      {grant.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground/80">{grant.description}</p>

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
                    <div className="font-semibold text-sm text-foreground">{grant.amount}</div>
                    <Button variant="default" size="sm" className="gap-2">
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
                </div>
              )}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            {/* Event Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Event Type Filter */}
              <Collapsible open={eventTypeOpen} onOpenChange={setEventTypeOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Type: {eventType === "all" ? "All" : eventType.charAt(0).toUpperCase() + eventType.slice(1)}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", eventTypeOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                    {eventTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setEventType(type);
                          setEventTypeOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          eventType === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Event Sector Filter */}
              <Collapsible open={eventSectorOpen} onOpenChange={setEventSectorOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Sector: {eventSector}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", eventSectorOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                    {sectors.map(sector => (
                      <button
                        key={sector}
                        onClick={() => {
                          setEventSector(sector);
                          setEventSectorOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                          eventSector === sector
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Event Location Filter */}
              <Collapsible open={eventLocationOpen} onOpenChange={setEventLocationOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Location: {eventLocation}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", eventLocationOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => {
                          setEventLocation(location);
                          setEventLocationOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                          eventLocation === location
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Clear filters if any active */}
              {(eventType !== "all" || eventSector !== "All Sectors" || eventLocation !== "All Locations") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEventType("all");
                    setEventSector("All Sectors");
                    setEventLocation("All Locations");
                  }}
                  className="w-full gap-2"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </Button>
              )}
            </div>

            {/* Event Results */}
            <div className="text-sm text-muted-foreground py-2">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>

            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="border border-border rounded-xl p-4 space-y-3 hover:bg-muted/30 transition-colors bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{event.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.organizer}</p>
                    </div>
                    <Badge variant={getEventTypeBadge(event.type)}>
                      {event.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground/80">{event.description}</p>

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
                </div>
              )}
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-4">
            {/* Team Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Expertise Filter */}
              <Collapsible open={teamExpertiseOpen} onOpenChange={setTeamExpertiseOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Expertise: {teamExpertise}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", teamExpertiseOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                    {teamExpertiseOptions.map(exp => (
                      <button
                        key={exp}
                        onClick={() => {
                          setTeamExpertise(exp);
                          setTeamExpertiseOpen(false);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          teamExpertise === exp
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Clear filters if any active */}
              {teamExpertise !== "All" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTeamExpertise("All")}
                  className="w-full gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Team Results */}
            <div className="text-sm text-muted-foreground py-2">
              {filteredCoFounders.length} {filteredCoFounders.length === 1 ? 'co-founder' : 'co-founders'} found
            </div>

            <div className="space-y-4">
              {filteredCoFounders.map(cofounder => (
                <div key={cofounder.id} className="border border-border rounded-xl p-4 space-y-3 hover:bg-muted/30 transition-colors bg-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{cofounder.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cofounder.title}</p>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {cofounder.availability}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground/80">{cofounder.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {cofounder.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cofounder.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {cofounder.lookingFor}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="default" size="sm" className="flex-1 gap-2">
                      <Mail className="w-3 h-3" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}

              {filteredCoFounders.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No co-founders found with current filters</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Opportunities;
