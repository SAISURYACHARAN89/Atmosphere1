import { useState } from "react";
import { Filter, Building2, MapPin, Calendar, ExternalLink, Users, ChevronDown, X, Briefcase, Mail, Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface StartupRolePosting {
  id: string;
  startupName: string;
  startupLogo?: string;
  roleTitle: string;
  sector: string;
  location: string;
  isRemote: boolean;
  employmentType: "Full-time" | "Part-time";
  compensation: string;
  description: string;
  requirements: string;
  applicantsCount: number;
}

const startupRolePostings: StartupRolePosting[] = [
  {
    id: "1",
    startupName: "NeuralTech AI",
    roleTitle: "Co-Founder & CTO",
    sector: "Artificial Intelligence",
    location: "San Francisco, USA",
    isRemote: true,
    employmentType: "Full-time",
    compensation: "Equity (15-20%) + Competitive Salary",
    description: "Building next-generation AI solutions for enterprise automation. Seeking technical leader to drive product development and scale engineering team.",
    requirements: "10+ years in software engineering, proven track record in AI/ML, startup experience preferred, strong leadership skills",
    applicantsCount: 24
  },
  {
    id: "2",
    startupName: "GreenWave Energy",
    roleTitle: "Head of Marketing",
    sector: "Green Energy",
    location: "Berlin, Germany",
    isRemote: false,
    employmentType: "Full-time",
    compensation: "Equity (3-5%) + €80k-100k",
    description: "Revolutionary renewable energy platform seeking marketing leader to drive B2B growth and brand positioning in European markets.",
    requirements: "5+ years B2B marketing experience, climate tech interest, growth hacking expertise, fluent English and German",
    applicantsCount: 12
  },
  {
    id: "3",
    startupName: "HealthSync",
    roleTitle: "Product Designer (Co-Founder Level)",
    sector: "Healthcare",
    location: "London, UK",
    isRemote: true,
    employmentType: "Part-time",
    compensation: "Equity (8-12%) + Part-time Salary",
    description: "Digital health platform connecting patients with specialists. Looking for designer to shape product vision and create exceptional user experiences.",
    requirements: "Healthcare or medtech design experience, user research skills, design systems expertise, passion for improving patient care",
    applicantsCount: 8
  },
  {
    id: "4",
    startupName: "DroneFleet Pro",
    roleTitle: "Operations Lead",
    sector: "Robotics",
    location: "Singapore",
    isRemote: false,
    employmentType: "Full-time",
    compensation: "Equity (5-8%) + SGD 90k-120k",
    description: "Commercial drone delivery startup scaling operations across Asia. Need experienced operations leader to build efficient logistics systems.",
    requirements: "Logistics or supply chain experience, startup mindset, data-driven approach, willing to travel across Asia",
    applicantsCount: 15
  },
  {
    id: "5",
    startupName: "FinFlow",
    roleTitle: "Co-Founder & CFO",
    sector: "FinTech",
    location: "New York, USA",
    isRemote: true,
    employmentType: "Full-time",
    compensation: "Equity (18-25%) + Base Salary",
    description: "Next-gen payment infrastructure for emerging markets. Seeking financial leader to manage fundraising, financial strategy, and investor relations.",
    requirements: "Investment banking or VC background, fintech experience, proven fundraising track record, financial modeling expertise",
    applicantsCount: 32
  },
  {
    id: "6",
    startupName: "EduLearn",
    roleTitle: "Chief Technology Officer",
    sector: "EdTech",
    location: "Austin, USA",
    isRemote: true,
    employmentType: "Full-time",
    compensation: "Equity (10-15%) + $140k-180k",
    description: "AI-powered personalized learning platform for K-12 education. Looking for technical co-founder to lead engineering and product development.",
    requirements: "Full-stack expertise, EdTech passion, experience with AI/ML, team building skills, scalability focus",
    applicantsCount: 18
  },
  {
    id: "7",
    startupName: "AgriGrow",
    roleTitle: "Business Development Lead",
    sector: "AgriTech",
    location: "Amsterdam, Netherlands",
    isRemote: false,
    employmentType: "Part-time",
    compensation: "Equity (4-6%) + Part-time Salary",
    description: "Sustainable farming technology startup seeking BD leader to establish partnerships with farms and distributors across Europe.",
    requirements: "Agriculture industry knowledge, strong network in agritech, partnership development experience, sustainability focus",
    applicantsCount: 7
  },
  {
    id: "8",
    startupName: "CyberShield",
    roleTitle: "Co-Founder & Chief Security Officer",
    sector: "Cybersecurity",
    location: "Tel Aviv, Israel",
    isRemote: true,
    employmentType: "Full-time",
    compensation: "Equity (20-25%) + Competitive Package",
    description: "Enterprise cybersecurity platform protecting critical infrastructure. Seeking security expert to lead product vision and threat research.",
    requirements: "Deep cybersecurity expertise, ethical hacking background, enterprise security experience, thought leadership",
    applicantsCount: 21
  }
];

const Opportunities = () => {
  const [grantSector, setGrantSector] = useState<string>("All Sectors");
  const [grantType, setGrantType] = useState<string>("all");
  const [eventSector, setEventSector] = useState<string>("All Sectors");
  const [eventType, setEventType] = useState<string>("all");
  const [eventLocation, setEventLocation] = useState<string>("All Locations");
  const [teamSector, setTeamSector] = useState<string>("All Sectors");
  const [teamLocation, setTeamLocation] = useState<string>("All Locations");
  const [teamRemote, setTeamRemote] = useState<string>("all");
  const [teamEmploymentType, setTeamEmploymentType] = useState<string>("all");
  
  const [grantTypeOpen, setGrantTypeOpen] = useState(false);
  const [grantSectorOpen, setGrantSectorOpen] = useState(false);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventSectorOpen, setEventSectorOpen] = useState(false);
  const [eventLocationOpen, setEventLocationOpen] = useState(false);
  const [teamSectorOpen, setTeamSectorOpen] = useState(false);
  const [teamLocationOpen, setTeamLocationOpen] = useState(false);
  const [teamRemoteOpen, setTeamRemoteOpen] = useState(false);
  const [teamEmploymentOpen, setTeamEmploymentOpen] = useState(false);

  // User created job postings
  const [userPostings, setUserPostings] = useState<StartupRolePosting[]>([]);
  const [createAdOpen, setCreateAdOpen] = useState(false);
  const [newPosting, setNewPosting] = useState({
    startupName: "",
    roleTitle: "",
    sector: "Artificial Intelligence",
    location: "",
    isRemote: false,
    employmentType: "Full-time" as "Full-time" | "Part-time",
    compensation: "",
    description: "",
    requirements: "",
  });

  const grantTypes = ["all", "grant", "incubator", "accelerator"];
  const eventTypes = ["all", "physical", "virtual", "hybrid", "e-summit", "conference", "workshop", "networking"];
  const remoteOptions = ["all", "remote", "on-site"];
  const employmentOptions = ["all", "Full-time", "Part-time"];

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

  const handleCreatePosting = () => {
    const posting: StartupRolePosting = {
      id: `user-${Date.now()}`,
      startupName: newPosting.startupName,
      roleTitle: newPosting.roleTitle,
      sector: newPosting.sector,
      location: newPosting.location,
      isRemote: newPosting.isRemote,
      employmentType: newPosting.employmentType,
      compensation: newPosting.compensation,
      description: newPosting.description,
      requirements: newPosting.requirements,
      applicantsCount: 0,
    };
    setUserPostings([posting, ...userPostings]);
    setCreateAdOpen(false);
    setNewPosting({
      startupName: "",
      roleTitle: "",
      sector: "Artificial Intelligence",
      location: "",
      isRemote: false,
      employmentType: "Full-time",
      compensation: "",
      description: "",
      requirements: "",
    });
  };

  const allRolePostings = [...userPostings, ...startupRolePostings];

  const filteredRolePostings = allRolePostings.filter(posting => {
    const sectorMatch = teamSector === "All Sectors" || posting.sector === teamSector;
    const locationMatch = teamLocation === "All Locations" || posting.location.includes(teamLocation) || teamLocation === "Global";
    const remoteMatch = teamRemote === "all" || 
      (teamRemote === "remote" && posting.isRemote) || 
      (teamRemote === "on-site" && !posting.isRemote);
    const employmentMatch = teamEmploymentType === "all" || posting.employmentType === teamEmploymentType;
    return sectorMatch && locationMatch && remoteMatch && employmentMatch;
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
    <div className="min-h-screen bg-background pb-20">
      
      {/* Main Content */}
      <div className="max-w-2xl md:max-w-7xl mx-auto px-4">{/* Three-Tab Header */}
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

            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
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

            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
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
            {/* Create Ad Button */}
            <Dialog open={createAdOpen} onOpenChange={setCreateAdOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Create Job Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Job Posting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="startupName">Startup Name</Label>
                    <Input
                      id="startupName"
                      value={newPosting.startupName}
                      onChange={(e) => setNewPosting({...newPosting, startupName: e.target.value})}
                      placeholder="Enter your startup name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleTitle">Role Title</Label>
                    <Input
                      id="roleTitle"
                      value={newPosting.roleTitle}
                      onChange={(e) => setNewPosting({...newPosting, roleTitle: e.target.value})}
                      placeholder="e.g., Co-Founder & CTO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={newPosting.sector} onValueChange={(value) => setNewPosting({...newPosting, sector: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.filter(s => s !== "All Sectors").map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newPosting.location}
                      onChange={(e) => setNewPosting({...newPosting, location: e.target.value})}
                      placeholder="e.g., San Francisco, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select value={newPosting.employmentType} onValueChange={(value: "Full-time" | "Part-time") => setNewPosting({...newPosting, employmentType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRemote"
                      checked={newPosting.isRemote}
                      onChange={(e) => setNewPosting({...newPosting, isRemote: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="isRemote">Remote Position</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compensation">Compensation</Label>
                    <Input
                      id="compensation"
                      value={newPosting.compensation}
                      onChange={(e) => setNewPosting({...newPosting, compensation: e.target.value})}
                      placeholder="e.g., Equity (15-20%) + Competitive Salary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPosting.description}
                      onChange={(e) => setNewPosting({...newPosting, description: e.target.value})}
                      placeholder="Describe the role and your startup"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={newPosting.requirements}
                      onChange={(e) => setNewPosting({...newPosting, requirements: e.target.value})}
                      placeholder="What are you looking for?"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreatePosting} className="w-full">
                    Create Posting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Team Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              
              {/* Sector Filter */}
              <Collapsible open={teamSectorOpen} onOpenChange={setTeamSectorOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Sector: {teamSector}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", teamSectorOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                    {sectors.map(sector => (
                      <button
                        key={sector}
                        onClick={() => {
                          setTeamSector(sector);
                          setTeamSectorOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                          teamSector === sector
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

              {/* Location Filter */}
              <Collapsible open={teamLocationOpen} onOpenChange={setTeamLocationOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Location: {teamLocation}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", teamLocationOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => {
                          setTeamLocation(location);
                          setTeamLocationOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                          teamLocation === location
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

              {/* Remote/On-site Filter */}
              <Collapsible open={teamRemoteOpen} onOpenChange={setTeamRemoteOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Work Mode: {teamRemote === "all" ? "All" : teamRemote === "remote" ? "Remote" : "On-site"}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", teamRemoteOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                    {remoteOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setTeamRemote(option);
                          setTeamRemoteOpen(false);
                        }}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                          teamRemote === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {option === "all" ? "All" : option === "remote" ? "Remote" : "On-site"}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Employment Type Filter */}
              <Collapsible open={teamEmploymentOpen} onOpenChange={setTeamEmploymentOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Type: {teamEmploymentType === "all" ? "All" : teamEmploymentType}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", teamEmploymentOpen && "rotate-180")} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                    {employmentOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setTeamEmploymentType(option);
                          setTeamEmploymentOpen(false);
                        }}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          teamEmploymentType === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted border border-border"
                        )}
                      >
                        {option === "all" ? "All" : option}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Clear filters if any active */}
              {(teamSector !== "All Sectors" || teamLocation !== "All Locations" || teamRemote !== "all" || teamEmploymentType !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTeamSector("All Sectors");
                    setTeamLocation("All Locations");
                    setTeamRemote("all");
                    setTeamEmploymentType("all");
                  }}
                  className="w-full gap-2"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </Button>
              )}
            </div>

            {/* Team Results */}
            <div className="text-sm text-muted-foreground py-2">
              {filteredRolePostings.length} {filteredRolePostings.length === 1 ? 'position' : 'positions'} available
            </div>

            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              {filteredRolePostings.map(posting => {
                const isMyAd = posting.id.startsWith('user-');
                return (
                  <div key={posting.id} className="border border-border rounded-xl p-5 space-y-4 hover:shadow-lg transition-all bg-card">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground text-lg">{posting.startupName}</h3>
                            {isMyAd && (
                              <Badge variant="secondary" className="text-xs">my ad</Badge>
                            )}
                          </div>
                          <p className="text-base text-foreground/90 font-semibold mt-1">{posting.roleTitle}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="whitespace-nowrap font-medium">
                        {posting.employmentType}
                      </Badge>
                    </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/80 leading-relaxed">{posting.description}</p>

                  {/* Requirements */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Looking for:</p>
                    <p className="text-sm text-foreground/90">{posting.requirements}</p>
                  </div>

                  {/* Compensation */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-primary">Compensation:</span>
                    <span className="text-foreground/90">{posting.compensation}</span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{posting.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{posting.isRemote ? "Remote" : "On-site"}</span>
                    </div>
                  </div>

                  {/* Sector Badge */}
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      {posting.sector}
                    </Badge>
                  </div>

                  {/* Applicants Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{posting.applicantsCount} applicants</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button size="sm" className="flex-1 gap-2 font-medium">
                      Apply for Role
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Profile
                    </Button>
                  </div>
                </div>
                );
              })}

              {filteredRolePostings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No positions found with current filters</p>
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
