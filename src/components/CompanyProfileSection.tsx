import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CompanyProfileSection = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile saved",
      description: "Company profile has been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Company full legal name
        </label>
        <Input 
          placeholder="" 
          className="bg-input border-border"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Date of establishment
        </label>
        <Input 
          type="date" 
          className="bg-input border-border"
        />
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Full address
        </label>
        <Textarea 
          placeholder="" 
          className="bg-input border-border min-h-[100px] resize-none"
        />
      </div>

      <div className="pt-2">
        <Button 
          onClick={handleSave}
          variant="secondary"
          className="w-full"
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default CompanyProfileSection;