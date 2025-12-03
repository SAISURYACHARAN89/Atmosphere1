const CompanySummaryCard = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0 mt-6 mb-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Company name</p>
            <p className="text-sm font-semibold">TechCorp Inc.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Company age</p>
            <p className="text-sm font-semibold">3 years</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Address</p>
          <p className="text-sm font-semibold">123 Innovation Drive, San Francisco, CA 94105</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Revenue status</p>
            <p className="text-sm font-semibold">Pre-revenue</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Total capital raised</p>
            <p className="text-sm font-semibold">$259,000</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Rounds</p>
            <p className="text-sm font-semibold">2</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Current investors</p>
            <p className="text-sm font-semibold">SEBI Ventures, Y Combinator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySummaryCard;