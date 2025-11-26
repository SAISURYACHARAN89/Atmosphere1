import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GetVerified = () => {
  const navigate = useNavigate();

  // Read flags from localStorage
  const [kycDone, setKycDone] = useState<boolean>(
    () => localStorage.getItem("kycCompleted") === "true"
  );
  const [portfolioDone, setPortfolioDone] = useState<boolean>(
    () => localStorage.getItem("portfolioCompleted") === "true"
  );

  // Read account type
  const accountType = localStorage.getItem("setupAccountType") || "";

  // Sync with storage updates
  useEffect(() => {
    const onStorage = () => {
      setKycDone(localStorage.getItem("kycCompleted") === "true");
      setPortfolioDone(localStorage.getItem("portfolioCompleted") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const completedCount = useMemo(
    () => (kycDone ? 1 : 0) + (portfolioDone ? 1 : 0),
    [kycDone, portfolioDone]
  );

  // --------- PORTFOLIO BUTTON NAVIGATION BASED ON ACCOUNT TYPE ----------
  const handlePortfolioClick = () => {
    if (accountType === "startup") {
      navigate("/startupportfolio");
    } else if (accountType === "investor") {
      navigate("/startupinvestor");
    } else {
      navigate("/portfolio-setup");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-white/6 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <h1 className="text-base font-semibold text-white">Get verified</h1>

          <div className="w-9" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mt-6">
            <p className="text-lg font-medium text-white/90">Start with</p>
          </div>

          {/* Cards */}
          <div className="mt-6 space-y-4">
            {/* KYC */}
            <button
              onClick={() => navigate("/kyc")}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/2 hover:bg-white/4 transition"
            >
              <div>
                <div className="text-base font-medium">KYC</div>
                <div className="text-xs text-white/70 mt-1">
                  {kycDone ? "Completed" : ""}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white" />
            </button>

            {/* PORTFOLIO (DYNAMIC ROUTE) */}
            <button
              onClick={handlePortfolioClick}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/2 hover:bg-white/4 transition"
            >
              <div>
                <div className="text-base font-medium">Portfolio</div>
                <div className="text-xs text-white/70 mt-1">
                  {portfolioDone ? "Saved" : ""}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* PROGRESS */}
          <div className="mt-8 text-center">
            <span className="text-sm text-white/70">
              {completedCount}/2 done
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetVerified;
