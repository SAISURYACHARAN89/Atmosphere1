import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ZCompanyProfileForm } from "@/types/portfolio";
import SelectUserInput from "./ui/SelectUserInput";

const CompanyProfileSection = ({
  formData,
  handleFormChange,
}: {
  formData: ZCompanyProfileForm;
  handleFormChange: (key: string, value: unknown) => void;
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile saved",
      description: "Company profile has been saved successfully.",
    });
  };

  const handleTeamMemberChange = (
    index: number,
    key: string,
    value: string
  ) => {
    const updated = [...formData.teamMembers];
    updated[index] = { ...updated[index], [key]: value };

    handleFormChange("teamMembers", updated);
  };

  return (
    <div className="space-y-4">
      {/* Company Name */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Company full legal name
        </label>
        <Input
          value={formData.companyProfile}
          onChange={(e) =>
            handleFormChange("companyProfile", e.target.value)
          }
          className="bg-input border-border"
        />
      </div>

      {/* About */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          About Your company
        </label>
        <Input
          placeholder="Write about Your company..."
          value={formData.about}
          onChange={(e) =>
            handleFormChange("about", e.target.value)
          }
          className="bg-input border-border"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Full address
        </label>
        <Textarea
          value={formData.location}
          onChange={(e) =>
            handleFormChange("location", e.target.value)
          }
          className="bg-input border-border min-h-[100px] resize-none"
        />
      </div>

      {/* Stage */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Stage
        </label>
        <Textarea
          value={formData.companyType}
          onChange={(e) =>
            handleFormChange("companyType", e.target.value)
          }
          className="bg-input border-border min-h-[100px] resize-none"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Website
        </label>
        <Input
          value={formData.website}
          onChange={(e) =>
            handleFormChange("website", e.target.value)
          }
          className="bg-input border-border"
        />
      </div>

      {/* Established On */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Date of establishment
        </label>
        <Input
          type="date"
          value={formData.establishedOn}
          onChange={(e) =>
            handleFormChange("establishedOn", e.target.value)
          }
          className="bg-input border-border"
        />
      </div>

      {/* Team Members */}
       <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Team Members<span className="text-xs">(Members: 1)</span>
        </label>
        <div className="flex gap-2">
          <SelectUserInput onSelect={(val)=>console.log(val)} placeholder="Search and select user" />
          <Input className="bg-input border-border" />
        </div>
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