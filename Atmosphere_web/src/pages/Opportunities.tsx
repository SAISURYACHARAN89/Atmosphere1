// Opportunities.tsx
import React, { useState } from "react";
import {
  Filter,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  ChevronDown,
  X,
  Briefcase,
  Mail,
  Plus,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  type:
  | "physical"
  | "virtual"
  | "hybrid"
  | "e-summit"
  | "conference"
  | "workshop"
  | "networking";
  description: string;
  attendees: string;
  url: string;
}

interface StartupRolePosting {
  id: string;
  startupName: string;
  startupLogo?: string;
  roleTitle: string;
  sector: string;
  location: string;
  companyType: string;
  isRemote: boolean;
  employmentType: "Full-time" | "Part-time";
  compensation: string;
  description: string;
  requirements: string;
  applicantsCount: number;
  customQuestions: string[];
}

const sectors = [
  "Verified Startup",

];
const companytype = [
  "Artificial Intelligence",
  "Blockchain",
  "HealthTech",
  "FinTech",
  "EdTech",
  "AgriTech",
  "AI Research",
  "Retail",
  "Manufacturing",
  "AI Research",
]

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
    sector: "Verified Startup",
    location: "USA",
    amount: "$50,000 - $250,000",
    deadline: "Dec 31, 2024",
    type: "grant",
    description: "Supporting innovative tech startups in AI, blockchain, and IoT sectors.",
    url: "#",
  },
  {
    id: "2",
    name: "Green Energy Accelerator",
    organization: "CleanTech Ventures",
    sector: "",
    location: "Global",
    amount: "$100,000 + Mentorship",
    deadline: "Jan 15, 2025",
    type: "accelerator",
    description: "3-month program for renewable energy startups with funding and mentorship.",
    url: "#",
  },
  {
    id: "3",
    name: "HealthTech Incubator",
    organization: "MedStart Hub",
    sector: "",
    location: "Europe",
    amount: "$75,000",
    deadline: "Nov 30, 2024",
    type: "incubator",
    description: "Supporting healthcare innovation with focus on telemedicine and digital health.",
    url: "#",
  },
  {
    id: "4",
    name: "FinTech Growth Fund",
    organization: "Finance Innovation Lab",
    sector: "Verified Startup",
    location: "Asia",
    amount: "$200,000 - $500,000",
    deadline: "Dec 15, 2024",
    type: "grant",
    description: "Funding for fintech startups revolutionizing payment systems and banking.",
    url: "#",
  },
  {
    id: "5",
    name: "EdTech Accelerator Program",
    organization: "Learn Ventures",
    sector: "",
    location: "USA",
    amount: "$150,000",
    deadline: "Jan 31, 2025",
    type: "accelerator",
    description: "12-week intensive program for education technology startups.",
    url: "#",
  },
  {
    id: "6",
    name: "AgriTech Innovation Grant",
    organization: "FarmFuture Foundation",
    sector: "",
    location: "Global",
    amount: "$80,000 - $300,000",
    deadline: "Feb 28, 2025",
    type: "grant",
    description: "Supporting sustainable agriculture and food tech innovations.",
    url: "#",
  },
  {
    id: "7",
    name: "AI Research Incubator",
    organization: "DeepMind Labs",
    sector: "Verified Startup",
    location: "UK",
    amount: "$120,000 + Resources",
    deadline: "Dec 20, 2024",
    type: "incubator",
    description: "Focus on artificial intelligence and machine learning applications.",
    url: "#",
  },
  {
    id: "8",
    name: "Retail Innovation Fund",
    organization: "Commerce Accelerators",
    sector: "",
    location: "USA",
    amount: "$90,000",
    deadline: "Jan 10, 2025",
    type: "accelerator",
    description: "Supporting e-commerce and retail technology innovations.",
    url: "#",
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
    url: "#",
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
    url: "#",
  },
];

const eventsData: Event[] = [
  {
    id: "e1",
    name: "AI & Machine Learning Summit 2024",
    organizer: "Tech Innovators Network",
    sector: "Verified Startup",
    location: "San Francisco, USA",
    date: "Dec 15-17, 2024",
    type: "physical",
    description:
      "Three-day summit featuring leading AI researchers, industry experts, and networking opportunities.",
    attendees: "2000+ attendees",
    url: "#",
  },
  {
    id: "e2",
    name: "Global Climate Tech Conference",
    organizer: "Green Future Foundation",
    sector: "",
    location: "Online",
    date: "Jan 8-10, 2025",
    type: "virtual",
    description:
      "Virtual conference connecting climate tech startups with investors and industry leaders.",
    attendees: "5000+ attendees",
    url: "#",
  },
  {
    id: "e3",
    name: "HealthTech Innovation E-Summit",
    organizer: "MedTech Global",
    sector: "",
    location: "London",
    date: "Jan 22-23, 2025",
    type: "e-summit",
    description:
      "E-summit showcasing breakthrough healthcare technologies and digital health solutions.",
    attendees: "3500+ attendees",
    url: "#",
  },
  {
    id: "e4",
    name: "FinTech Leaders Conference",
    organizer: "Financial Innovation Hub",
    sector: "Verified Startup",
    location: "Singapore",
    date: "Feb 5-6, 2025",
    type: "conference",
    description:
      "Premier conference for fintech innovators, regulators, and financial institutions.",
    attendees: "1500+ attendees",
    url: "#",
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
    url: "#",
  },
  {
    id: "e6",
    name: "AgriTech Innovation Expo",
    organizer: "Farm Future Alliance",
    sector: "AgriTech",
    location: "Amsterdam, Netherlands",
    date: "Mar 1-3, 2025",
    type: "physical",
    description:
      "Exhibition and conference featuring sustainable agriculture and food technology innovations.",
    attendees: "2500+ attendees",
    url: "#",
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
    url: "#",
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
    url: "#",
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
    url: "#",
  },
  {
    id: "e10",
    name: "Cybersecurity Leaders Forum",
    organizer: "Security First Network",
    sector: "Cybersecurity",
    location: "New York",
    date: "Apr 15-16, 2025",
    type: "hybrid",
    description:
      "Forum addressing latest cybersecurity challenges and solutions for businesses.",
    attendees: "2200+ attendees",
    url: "#",
  },
];

const startupRolePostings: StartupRolePosting[] = [
  {
    id: "1",
    startupName: "NeuralTech AI",
    roleTitle: "Co-Founder & CTO",
    sector: "Verified Startup",
    location: "San Francisco, USA",
    isRemote: true,
    employmentType: "Full-time",
    compensation: "Equity (15-20%) + Competitive Salary",
    description:
      "Building next-generation AI solutions for enterprise automation. Seeking technical leader to drive product development and scale engineering team.",
    requirements:
      "10+ years in software engineering, proven track record in AI/ML, startup experience preferred, strong leadership skills",
    applicantsCount: 24,
    companyType: "Artificial Intelligence",
    customQuestions: ["What's your experience with AI/ML?", "Tell us about your leadership style", "Why do you want to join us?"],
  },
  {
    id: "2",
    startupName: "GreenWave Energy",
    roleTitle: "Head of Marketing",
    sector: "",
    location: "Berlin, Germany",
    isRemote: false,
    employmentType: "Full-time",
    compensation: "Equity (3-5%) + €80k-100k",
    description:
      "Revolutionary renewable energy platform seeking marketing leader to drive B2B growth and brand positioning in European markets.",
    requirements:
      "5+ years B2B marketing experience, climate tech interest, growth hacking expertise, fluent English and German",
    applicantsCount: 12,
    companyType: "Renewable Energy",
    customQuestions: ["What's your marketing strategy for B2B?", "How do you measure campaign success?", "Describe a successful project."],
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
    description:
      "Digital health platform connecting patients with specialists. Looking for designer to shape product vision and create exceptional user experiences.",
    requirements:
      "Healthcare or medtech design experience, user research skills, design systems expertise, passion for improving patient care",
    applicantsCount: 8,
    companyType: "HealthTech",
    customQuestions: ["What design tools do you use?", "How do you approach user research?", "Describe your design process."],
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
    description:
      "Commercial drone delivery startup scaling operations across Asia. Need experienced operations leader to build efficient logistics systems.",
    requirements:
      "Logistics or supply chain experience, startup mindset, data-driven approach, willing to travel across Asia",
    applicantsCount: 15,
    companyType: "Robotics",
    customQuestions: ["Describe your experience in logistics.", "How do you optimize supply chain processes?", "What challenges have you overcome?"],
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
    description:
      "Next-gen payment infrastructure for emerging markets. Seeking financial leader to manage fundraising, financial strategy, and investor relations.",
    requirements:
      "Investment banking or VC background, fintech experience, proven fundraising track record, financial modeling expertise",
    applicantsCount: 32,
    companyType: "FinTech",
    customQuestions: ["What is your experience with fundraising?", "How do you approach financial modeling?", "Describe a successful financial strategy."],
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
    description:
      "AI-powered personalized learning platform for K-12 education. Looking for technical co-founder to lead engineering and product development.",
    requirements:
      "Full-stack expertise, EdTech passion, experience with AI/ML, team building skills, scalability focus",
    applicantsCount: 18,
    companyType: "EdTech",
    customQuestions: ["What is your vision for AI in education?", "How do you ensure scalability in tech products?", "Describe your experience with K-12 education systems."],
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
    description:
      "Sustainable farming technology startup seeking BD leader to establish partnerships with farms and distributors across Europe.",
    requirements:
      "Agriculture industry knowledge, strong network in agritech, partnership development experience, sustainability focus",
    applicantsCount: 7,
    companyType: "AgriTech",
    customQuestions: ["What is your experience in business development?", "How do you approach partnership building?", "Describe a successful project in AgriTech."],
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
    description:
      "Enterprise cybersecurity platform protecting critical infrastructure. Seeking security expert to lead product vision and threat research.",
    requirements:
      "Deep cybersecurity expertise, ethical hacking background, enterprise security experience, thought leadership",
    applicantsCount: 21,
    companyType: "Cybersecurity",
    customQuestions: ["What are the latest trends in cybersecurity?", "How do you handle security breaches?", "Describe your experience with threat research."],
  },
];

const grantTypes = ["all", "grant", "incubator", "accelerator"];
const eventTypes = [
  "all",
  "physical",
  "virtual",
  "hybrid",
  "e-summit",
  "conference",
  "workshop",
  "networking",
];
const remoteOptions = ["all", "remote", "on-site"];
const employmentOptions = ["all", "Full-time", "Part-time"];

/* ---------------------------
   Helper functions
   --------------------------- */
const getGrantTypeBadge = (type: string) => {
  switch (type) {
    case "grant":
      return "default";
    case "incubator":
      return "secondary";
    case "accelerator":
      return "outline";
    default:
      return "default";
  }
};

const getEventTypeBadge = (type: string) => {
  switch (type) {
    case "physical":
      return "default";
    case "virtual":
      return "secondary";
    case "hybrid":
      return "outline";
    default:
      return "default";
  }
};

/* ---------------------------
   RoleCard Component
   --------------------------- */
type RoleCardProps = {
  posting: StartupRolePosting;
  isMyAd?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
};

const RoleCard: React.FC<RoleCardProps> = ({ posting, isMyAd = false, expanded = false, onExpand }) => {
  const [showApplyBox, setShowApplyBox] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [applied, setApplied] = useState(false);
  const [count, setCount] = useState(posting.applicantsCount);
  const [questionAnswers, setQuestionAnswers] = useState<string[]>(
    posting.customQuestions.map(() => "")
  );

  const handleSubmit = () => {
    const hasQuestions = posting.customQuestions.some((q) => q.trim() !== "");
    const answered = questionAnswers.every((ans, i) =>
      posting.customQuestions[i] ? ans.trim() !== "" : true
    );

    if (hasQuestions && !answered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setApplied(true);
    setCount((prev) => prev + 1);
  };

  const tags = ["AI", "B2B", "SaaS", "Startup"];

  return (
    <div className="bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-foreground truncate">{posting.startupName}</p>
            {isMyAd && <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 flex-shrink-0">My Ad</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{posting.companyType}</p>
        </div>
      </div>

      {/* Role & Details */}
      <div className="mb-3 space-y-2">
        <p className="font-semibold text-sm text-foreground line-clamp-2">{posting.roleTitle}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{posting.location}</span>
          </div>
          <span className={posting.isRemote ? "text-primary" : ""}>{posting.isRemote ? "Remote" : "On-site"}</span>
        </div>
      </div>

      {/* Description with More/Less */}
      <div className="mb-3">
        <p className={`text-xs text-muted-foreground ${showFullDescription ? "" : "line-clamp-2"}`}>
          {posting.description}
        </p>
        {posting.description.length > 100 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs text-primary hover:text-primary/80 mt-1 font-medium"
          >
            {showFullDescription ? "Less" : "More"}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag, idx) => (
          <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0.5">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={onExpand}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          <span>{count} applicants</span>
        </button>
        <div className="text-xs font-medium text-foreground">
          {posting.employmentType} • {posting.isRemote ? "Remote" : "On-site"}
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {!applied ? (
            <>
              {/* Questions */}
              <div className="space-y-3">
                {posting.customQuestions.map((q, i) => (
                  <div key={i} className="space-y-1.5">
                    <Label className="text-xs font-medium">{q}</Label>
                    <Textarea
                      value={questionAnswers[i]}
                      onChange={(e) => {
                        const updated = [...questionAnswers];
                        updated[i] = e.target.value;
                        setQuestionAnswers(updated);
                      }}
                      placeholder="Your answer..."
                      className="text-xs h-20 resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-xs font-medium">Attach Resume (Optional)</Label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                  className="text-xs w-full mt-1"
                />
                {uploadedFile && <p className="text-[10px] text-muted-foreground mt-1">{uploadedFile.name}</p>}
              </div>

              {/* Send Button */}
              <Button
                size="sm"
                onClick={handleSubmit}
                className="w-full h-8 text-xs"
              >
                Send Application
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-green-600 font-medium">✓ Application Sent Successfully</p>
              <p className="text-[10px] text-muted-foreground mt-1">You can track your application in My Jobs</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------------------
   Main Opportunities component
   --------------------------- */
const Opportunities: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState("team");
  
  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [expandedPostingId, setExpandedPostingId] = useState<string | null>(null);

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
    customQuestions: ["", "", ""],
  });

  const filteredGrants = grantsData.filter((grant) => {
    const sectorMatch = grantSector === "All Sectors" || grant.sector === grantSector;
    const typeMatch = grantType === "all" || grant.type === grantType;
    return sectorMatch && typeMatch;
  });

  const filteredEvents = eventsData.filter((event) => {
    const sectorMatch = eventSector === "All Sectors" || event.sector === eventSector;
    const typeMatch = eventType === "all" || event.type === eventType;
    const locationMatch =
      eventLocation === "All Locations" ||
      event.location.includes(eventLocation) ||
      eventLocation.includes(event.location);
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
      customQuestions: newPosting.customQuestions.filter(q => q.trim() !== ""),
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
      customQuestions: ["", "", ""],
    });
  };

  const allRolePostings = [...userPostings, ...startupRolePostings];

  const filteredRolePostings = allRolePostings.filter((posting) => {
    const sectorMatch = teamSector === "All Sectors" || posting.sector === teamSector;
    const locationMatch =
      teamLocation === "All Locations" ||
      posting.location.includes(teamLocation) ||
      teamLocation === "Global";
    const remoteMatch =
      teamRemote === "all" ||
      (teamRemote === "remote" && posting.isRemote) ||
      (teamRemote === "on-site" && !posting.isRemote);
    const employmentMatch = teamEmploymentType === "all" || posting.employmentType === teamEmploymentType;
    return sectorMatch && locationMatch && remoteMatch && employmentMatch;
  });
  

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl md:max-w-5xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">


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
            {/* <TabsTrigger value="myteams" className="text-sm font-medium rounded-xl data-[state=active]:bg-background">My Teams</TabsTrigger> */}

          </TabsList>
          <TabsContent value="myteams" className="space-y-4">
            <div className="text-sm text-muted-foreground py-2">
              {userPostings.length} {userPostings.length === 1 ? "position" : "positions"} posted by you
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {userPostings.map((posting) => (
                <RoleCard key={posting.id} posting={posting} isMyAd={true} />
              ))}
            </div>

            {userPostings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>You haven't posted any team roles yet</p>
              </div>
            )}
          </TabsContent>

          {/* GRANTS TAB */}
          <TabsContent value="grants" className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total grants: {filteredGrants.length}
              </div>
              <Dialog open={grantTypeOpen || grantSectorOpen} onOpenChange={(open) => {
                if (!open) {
                  setGrantTypeOpen(false);
                  setGrantSectorOpen(false);
                } else {
                  setGrantTypeOpen(true);
                }
              }}>
                <DialogTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[300px] w-72 p-0">
                  <div className="space-y-0">
                    <Collapsible open={grantTypeOpen} onOpenChange={setGrantTypeOpen} defaultOpen>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Type</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", grantTypeOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {grantTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setGrantType(type)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                grantType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={grantSectorOpen} onOpenChange={setGrantSectorOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Sector</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", grantSectorOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {sectors.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => setGrantSector(sector)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                grantSector === sector ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Grants List */}
            <div className="space-y-3">
              {filteredGrants.map((grant) => (
                <div key={grant.id} className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{grant.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{grant.organization}</p>
                    </div>
                    <Badge variant={getGrantTypeBadge(grant.type)} className="text-[10px] px-2 py-0.5 flex-shrink-0">{grant.type}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{grant.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{grant.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{grant.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-foreground">{grant.amount}</div>
                    <Button variant="default" size="sm" className="h-7 text-xs gap-1">
                      Apply
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredGrants.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No grants found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total events: {filteredEvents.length}
              </div>
              <Dialog open={eventTypeOpen || eventSectorOpen || eventLocationOpen} onOpenChange={(open) => {
                if (!open) {
                  setEventTypeOpen(false);
                  setEventSectorOpen(false);
                  setEventLocationOpen(false);
                } else {
                  setEventTypeOpen(true);
                }
              }}>
                <DialogTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[350px] w-72 p-0">
                  <div className="space-y-0">
                    <Collapsible open={eventTypeOpen} onOpenChange={setEventTypeOpen} defaultOpen>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Type</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", eventTypeOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {eventTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setEventType(type)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={eventSectorOpen} onOpenChange={setEventSectorOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Sector</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", eventSectorOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {sectors.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => setEventSector(sector)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventSector === sector ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={eventLocationOpen} onOpenChange={setEventLocationOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Location</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", eventLocationOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => setEventLocation(location)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventLocation === location ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{event.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.organizer}</p>
                    </div>
                    <Badge variant={getEventTypeBadge(event.type)} className="text-[10px] px-2 py-0.5 flex-shrink-0">{event.type}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button variant="default" size="sm" className="h-7 text-xs gap-1">
                      Register
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-4">
            <Dialog open={createAdOpen} onOpenChange={setCreateAdOpen}>
              <div className="flex items-center gap-3">
                <DialogTrigger asChild>
                  <Button className="flex-1 gap-2">
                    <Plus className="w-4 h-4" />
                    Create Job Ad
                  </Button>
                </DialogTrigger>

                {/* NEW BUTTON — switches to My Teams tab */}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveTab("myteams")}
                >
                  My Teams
                </Button>
              </div>
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
                      onChange={(e) => setNewPosting({ ...newPosting, startupName: e.target.value })}
                      placeholder="Enter your startup name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleTitle">Role Title</Label>
                    <Input
                      id="roleTitle"
                      value={newPosting.roleTitle}
                      onChange={(e) => setNewPosting({ ...newPosting, roleTitle: e.target.value })}
                      placeholder="e.g., Co-Founder & CTO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={newPosting.sector} onValueChange={(value) => setNewPosting({ ...newPosting, sector: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.filter((s) => s !== "All Sectors").map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newPosting.location}
                      onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                      placeholder="e.g., San Francisco, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      value={newPosting.employmentType}
                      onValueChange={(value: "Full-time" | "Part-time") => setNewPosting({ ...newPosting, employmentType: value })}
                    >
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
                      onChange={(e) => setNewPosting({ ...newPosting, isRemote: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isRemote">Remote Position</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compensation">Compensation</Label>
                    <Input
                      id="compensation"
                      value={newPosting.compensation}
                      onChange={(e) => setNewPosting({ ...newPosting, compensation: e.target.value })}
                      placeholder="e.g., Equity (15-20%) + Competitive Salary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPosting.description}
                      onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
                      placeholder="Describe the role and your startup"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={newPosting.requirements}
                      onChange={(e) => setNewPosting({ ...newPosting, requirements: e.target.value })}
                      placeholder="What are you looking for?"
                      rows={3}
                    />
                  </div>

                  {/* Custom Questions Section */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Label className="text-sm font-medium">Custom Questions (Optional, max 3)</Label>
                    <p className="text-xs text-muted-foreground">
                      Add up to 3 questions for applicants to answer
                    </p>

                    {[0, 1, 2].map((index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`question-${index}`} className="text-xs">
                          Question {index + 1}
                        </Label>
                        <Input
                          id={`question-${index}`}
                          value={newPosting.customQuestions[index]}
                          onChange={(e) => {
                            const newQuestions = [...newPosting.customQuestions];
                            newQuestions[index] = e.target.value;
                            setNewPosting({ ...newPosting, customQuestions: newQuestions });
                          }}
                          placeholder={`Enter question ${index + 1} (optional)`}
                        />
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleCreatePosting} className="w-full">
                    Create Posting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {/* FILTER TRIGGER */}
              

              {/* FILTER SHEET */}
              <Dialog open={showTeamFilters} onOpenChange={setShowTeamFilters}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl bg-card border-border p-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3 pt-3">

                    {/* SECTOR */}
                    <Collapsible open={teamSectorOpen} onOpenChange={setTeamSectorOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Sector: {teamSector}</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", teamSectorOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                          {sectors.map((sector) => (
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

                    {/* LOCATION */}
                    <Collapsible open={teamLocationOpen} onOpenChange={setTeamLocationOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Location: {teamLocation}</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", teamLocationOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                          {locations.map((location) => (
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

                    {/* WORK MODE */}
                    <Collapsible open={teamRemoteOpen} onOpenChange={setTeamRemoteOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Work Mode: {teamRemote === "all" ? "All" : teamRemote === "remote" ? "Remote" : "On-site"}
                          </span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", teamRemoteOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                          {remoteOptions.map((option) => (
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

                    {/* EMPLOYMENT TYPE */}
                    <Collapsible open={teamEmploymentOpen} onOpenChange={setTeamEmploymentOpen}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Type: {teamEmploymentType === "all" ? "All" : teamEmploymentType}
                          </span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform", teamEmploymentOpen && "rotate-180")} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                          {employmentOptions.map((option) => (
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

                    {/* CLEAR FILTERS */}
                    {(teamSector !== "All Sectors" ||
                      teamLocation !== "All Locations" ||
                      teamRemote !== "all" ||
                      teamEmploymentType !== "all") && (
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
                </DialogContent>
              </Dialog>

            </div>

            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground py-2">
              {filteredRolePostings.length } {filteredRolePostings.length === 1 ? "position" : "positions"} available
              <div
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => setShowTeamFilters(true)}
              >
                <Filter className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {filteredRolePostings.map((posting) => {
                const isMyAd = posting.id.startsWith("user-");
                const isExpanded = expandedPostingId === posting.id;
                return (
                  <RoleCard
                    key={posting.id}
                    posting={posting}
                    isMyAd={isMyAd}
                    expanded={isExpanded}
                    onExpand={() => setExpandedPostingId(isExpanded ? null : posting.id)}
                  />
                );
              })}
            </div>

            {filteredRolePostings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No positions found with current filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Opportunities;