import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import StartupPost from "@/components/StartupPost";
// import Stories from "@/components/Stories";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";

const mockStartups = [
  {
    id: "airbound-co",
    name: "Airbound.co",
    tagline: "Revolutionary aerospace delivery platform",
    brief: "We're building the future of last-mile delivery using autonomous drones. Our AI-powered logistics network reduces delivery costs by 60% while cutting carbon emissions in urban areas.",
    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    revenueGenerating: true,
    fundsRaised: "$2M",
    currentInvestors: ["Y Combinator", "Sequoia", "a16z"],
    lookingToDilute: true,
    dilutionAmount: "$3,000,000",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "skyt-air",
    name: "Skyt Air",
    tagline: "Next-gen aviation technology solutions",
    brief: "Advanced flight management systems for commercial airlines. Our predictive maintenance AI has helped reduce aircraft downtime by 40% across 15 major carriers worldwide.",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    revenueGenerating: true,
    fundsRaised: "$4M",
    currentInvestors: ["Techstars", "500 Startups"],
    lookingToDilute: true,
    dilutionAmount: "20% for $5M",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "neuralhealth",
    name: "NeuralHealth",
    tagline: "AI-powered healthcare diagnostics",
    brief: "Our deep learning platform analyzes medical imaging with 98% accuracy, helping radiologists detect early-stage diseases. Currently deployed in 50+ hospitals across North America.",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    revenueGenerating: false,
    fundsRaised: "$8M",
    currentInvestors: ["Founders Fund", "Khosla Ventures"],
    lookingToDilute: true,
    dilutionAmount: "12% for $6M",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "greencharge",
    name: "GreenCharge",
    tagline: "Sustainable EV charging infrastructure",
    brief: "Solar-powered EV charging stations with smart grid integration. We've installed 200+ charging points and partnered with major retail chains to expand green charging accessibility.",
    logo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    revenueGenerating: true,
    fundsRaised: "$5M",
    currentInvestors: ["Tesla Ventures", "Climate Fund"],
    lookingToDilute: false,
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "foodflow",
    name: "FoodFlow",
    tagline: "Farm-to-table supply chain optimization",
    brief: "Blockchain-based traceability platform connecting farmers directly with restaurants. Reducing food waste by 35% while ensuring fair prices for growers and fresh produce for consumers.",
    logo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
    revenueGenerating: true,
    fundsRaised: "$3.5M",
    currentInvestors: ["Greylock Partners", "First Round"],
    lookingToDilute: true,
    dilutionAmount: "18% for $4M",
    images: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "codementor-ai",
    name: "CodeMentor AI",
    tagline: "AI-powered coding education platform",
    brief: "Personalized programming curriculum powered by machine learning. Our adaptive learning system has helped over 100,000 students land their first developer jobs within 6 months.",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
    revenueGenerating: false,
    fundsRaised: "$6M",
    currentInvestors: ["Accel", "Index Ventures"],
    lookingToDilute: true,
    dilutionAmount: "10% for $5M",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "urbanfarm",
    name: "UrbanFarm",
    tagline: "Vertical farming for urban environments",
    brief: "Hydroponic vertical farms in shipping containers, producing fresh greens year-round using 95% less water. We're bringing sustainable agriculture to city centers and food deserts.",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=100&h=100&fit=crop",
    revenueGenerating: true,
    fundsRaised: "$4.5M",
    currentInvestors: ["Y Combinator", "Climate Capital"],
    lookingToDilute: true,
    dilutionAmount: "15% for $4M",
    images: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const token = Cookies.get("token");

  if (!token) {
    navigate("/login");
  }
}, [navigate]);

  return (
    <div className="min-h-screen bg-background-subtle">
      {/* Top Bar */}
      <TopBar />

      {/* Main Feed Area */}
      <main className="pt-14 pb-16">
        <div className="max-w-2xl mx-auto  py-6 overflow-y-auto space-y-6">
          {/* Stories Section */}
          {/* <Stories /> */}

          {/* Suggested For You Header */}
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Suggested for you</h2>
          </div> */}

          {/* Startup Posts */}
          {mockStartups.map((startup, index) => (
            <div key={index}>
              <div className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <StartupPost company={startup} />
              </div>
              {index < mockStartups.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
