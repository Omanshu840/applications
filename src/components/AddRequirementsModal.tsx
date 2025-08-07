// src/components/AddRequirementsModal.tsx
import { useState } from "react";
import { type CollegeRequirements } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AddRequirementsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (requirements: CollegeRequirements) => void;
  initialRequirements: CollegeRequirements;
}

export function AddRequirementsModal({
  open,
  onClose,
  onSave,
  initialRequirements,
}: AddRequirementsModalProps) {
  const [requirements, setRequirements] = useState<CollegeRequirements>(
    initialRequirements
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof CollegeRequirements, value: any) => {
    setRequirements((prev) => (prev ? { ...prev, [field]: value } : { [field]: value } as CollegeRequirements));
  };

  const handleSubmit = () => {
    onSave(requirements);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Application Requirements</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Standard Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="test-scores-required"
                  checked={requirements?.test_scores_required}
                  onCheckedChange={(checked) =>
                    handleChange("test_scores_required", checked)
                  }
                />
                <Label htmlFor="test-scores-required">
                  Test Scores Required
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transcripts-required"
                  checked={requirements?.transcripts_required}
                  onCheckedChange={(checked) =>
                    handleChange("transcripts_required", checked)
                  }
                />
                <Label htmlFor="transcripts-required">
                  Transcripts Required
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lor-required"
                  checked={(requirements?.lor_required && requirements?.lor_required > 0) ? true : false}
                  onCheckedChange={(checked) =>
                    handleChange(
                      "lor_required",
                      checked ? 2 : 0 // Default to 2 letters if checked
                    )
                  }
                />
                <Label htmlFor="lor-required">
                  Letters of Recommendation Required
                </Label>
              </div>

              {requirements?.lor_required && requirements?.lor_required > 0 && (
                <div className="pl-8 space-y-2">
                  <Label htmlFor="lor-count">Number of Letters</Label>
                  <Input
                    id="lor-count"
                    type="number"
                    min="1"
                    max="5"
                    value={requirements.lor_required}
                    onChange={(e) =>
                      handleChange("lor_required", parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-requirements">
              Additional Requirements
            </Label>
            <Input
              id="additional-requirements"
              value={requirements?.additional_requirements || ""}
              onChange={(e) =>
                handleChange("additional_requirements", e.target.value)
              }
              placeholder="Any special requirements or notes"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Requirements</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}