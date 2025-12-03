import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PortfolioHeader = () => {
  const navigate = useNavigate(); // FIXED

  return (
    <header className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14 relative">
      <button
            onClick={() => navigate('/getverified')}
            className="p-2 rounded-md hover:bg-white/6 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

      <h1 className="text-xl font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
        Portfolio
      </h1>

      {/* Spacer to keep center alignment correct */}
      <div className="w-10"></div>
    </header>
  );
};

export default PortfolioHeader;
