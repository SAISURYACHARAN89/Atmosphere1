import { ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableSection = ({ title, children, isExpanded, onToggle }: ExpandableSectionProps) => {

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-4 text-left"
      >
        <h2 className="text-base font-semibold tracking-wide">{title}</h2>
        {isExpanded ? (
          <Minus className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Plus className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;