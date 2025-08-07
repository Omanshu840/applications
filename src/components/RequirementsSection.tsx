// src/components/RequirementsSection.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type CollegeRequirements } from "@/types";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRequirementsModal } from "@/components/AddRequirementsModal";

const getDefaultRequirements = (): CollegeRequirements => ({
    test_scores_required: false,
    test_scores_submitted: false,
    lor_required: 0,
    lor_submitted: 0,
    transcripts_required: false,
    transcripts_submitted: false,
    additional_requirements: "",
});

interface RequirementsSectionProps {
    collegeId: string;
    requirements: CollegeRequirements | null;
    onUpdate: (updated: CollegeRequirements) => void;
}

export function RequirementsSection({
    collegeId,
    requirements,
    onUpdate,
}: RequirementsSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = async (
        field: keyof CollegeRequirements,
        value: boolean | number
    ) => {
        try {
            setIsUpdating(true);
            const base = requirements ?? getDefaultRequirements();
            const updated: CollegeRequirements = { ...base, [field]: value };

            const { error } = await supabase
                .from("college_applications_requirements")
                .upsert({ ...updated, college_id: collegeId });

            if (error) throw error;

            onUpdate(updated);
            toast.success("Requirements updated");
        } catch (error) {
            console.error("Failed to update requirements", error);
            toast.error("Failed to update requirements");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSaveRequirements = async (
        newRequirements: CollegeRequirements
    ) => {
        try {
            setIsUpdating(true);
            const { error } = await supabase
                .from("college_applications_requirements")
                .upsert({ ...newRequirements, college_id: collegeId });

            if (error) throw error;

            onUpdate(newRequirements);
            toast.success("Requirements saved");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save requirements", error);
            toast.error("Failed to save requirements");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!requirements || Object.keys(requirements).length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Application Checklist
                    </h2>
                </div>
                <div className="rounded-lg border p-8 text-center">
                    <p className="text-muted-foreground">
                        No requirements set for this college yet
                    </p>
                    <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Configure Requirements
                    </Button>
                </div>
                <AddRequirementsModal
                    open={isEditing}
                    onClose={() => setIsEditing(false)}
                    onSave={handleSaveRequirements}
                    initialRequirements={getDefaultRequirements()}
                />
            </div>
        );
    }

    const completedCount = [
        requirements.test_scores_submitted,
        requirements.lor_submitted === requirements.lor_required,
        requirements.transcripts_submitted,
    ].filter(Boolean).length;

    const totalCount = [
        requirements.test_scores_required,
        requirements.lor_required > 0,
        requirements.transcripts_required,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold">
                        Application Checklist
                    </h2>
                    {totalCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {completedCount} of {totalCount} completed
                            </span>
                            <div className="h-2 w-20 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: `${
                                            (completedCount / totalCount) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </div>

            {totalCount === 0 ? (
                <div className="rounded-lg border p-6 text-center">
                    <p className="text-muted-foreground">
                        No requirements configured yet
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requirements.test_scores_required && (
                        <RequirementItem
                            label="Test Scores"
                            checked={requirements.test_scores_submitted}
                            onCheckedChange={(checked) =>
                                handleChange("test_scores_submitted", checked)
                            }
                            disabled={isUpdating}
                        />
                    )}

                    {requirements.lor_required > 0 && (
                        <div
                            className={`p-4 rounded-lg border ${
                                requirements.lor_submitted ===
                                requirements.lor_required
                                    ? "bg-success/10 border-success"
                                    : "bg-background border-border"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                                            requirements.lor_submitted ===
                                            requirements.lor_required
                                                ? "border-success bg-success text-success-foreground"
                                                : "border-muted-foreground/30"
                                        }`}
                                    >
                                        {requirements.lor_submitted ===
                                        requirements.lor_required ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <span className="text-xs font-medium">
                                                {requirements.lor_submitted}/
                                                {requirements.lor_required}
                                            </span>
                                        )}
                                    </div>
                                    <Label className="font-medium">
                                        Recommendation Letters
                                    </Label>
                                </div>
                                {requirements.lor_submitted ===
                                requirements.lor_required ? (
                                    <Badge variant="secondary">Completed</Badge>
                                ) : (
                                    <Badge variant="outline">
                                        {requirements.lor_submitted}/
                                        {requirements.lor_required} done
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {Array.from({
                                    length: requirements.lor_required,
                                }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 flex-1 rounded-full ${
                                            i < requirements.lor_submitted
                                                ? "bg-success"
                                                : "bg-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {requirements.transcripts_required && (
                        <RequirementItem
                            label="Official Transcripts"
                            checked={requirements.transcripts_submitted}
                            onCheckedChange={(checked) =>
                                handleChange("transcripts_submitted", checked)
                            }
                            disabled={isUpdating}
                        />
                    )}

                    {requirements.additional_requirements && (
                        <div className="p-4 rounded-lg border bg-info/10 border-info">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
                                <div>
                                    <Label className="font-medium text-info-foreground">
                                        Additional Requirements
                                    </Label>
                                    <p className="text-sm text-info-foreground mt-1">
                                        {requirements.additional_requirements}
                                    </p>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-info h-8 px-0 mt-2"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <AddRequirementsModal
                open={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSaveRequirements}
                initialRequirements={requirements}
            />
        </div>
    );
}

interface RequirementItemProps {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

function RequirementItem({
    label,
    checked,
    onCheckedChange,
    disabled,
}: RequirementItemProps) {
    return (
        <div
            className={`p-4 rounded-lg border transition-all ${
                checked
                    ? "bg-success/10 border-success"
                    : "bg-background border-border"
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={label.toLowerCase().replace(/\s+/g, "-")}
                        checked={checked}
                        onCheckedChange={(checked) =>
                            onCheckedChange(checked as boolean)
                        }
                        disabled={disabled}
                        className={`h-5 w-5 ${
                            checked
                                ? "border-success bg-success text-success-foreground"
                                : ""
                        }`}
                    />
                    <Label
                        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
                        className="font-medium"
                    >
                        {label}
                    </Label>
                </div>
                {checked ? (
                    <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                    </Badge>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground h-8 px-3"
                        onClick={() => onCheckedChange(true)}
                    >
                        Mark as Done
                    </Button>
                )}
            </div>
        </div>
    );
}
