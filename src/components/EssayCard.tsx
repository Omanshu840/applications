// src/components/EssayCard.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Download,
    Upload,
    Save,
    Clock,
    FileText,
    HelpCircle,
    Loader2,
    Edit,
    ScrollText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { CollegeEssay } from "@/types";

interface EssayCardProps {
    essay: CollegeEssay;
    onSave: (updated: CollegeEssay) => void;
}

export function EssayCard({ essay, onSave }: EssayCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(essay.response_markdown);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updated = {
                ...essay,
                response_markdown: draft,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("college_essays")
                .update(updated)
                .eq("id", essay.id);

            if (error) throw error;

            onSave(updated);
            setIsEditing(false);
            toast.success("Essay saved");
        } catch (error) {
            console.error("Failed to save essay", error);
            toast.error("Failed to save essay");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${essay.id}-${Date.now()}.${fileExt}`;
            const filePath = `essays/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("college-essays")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from("college-essays").getPublicUrl(filePath);

            const updated = {
                ...essay,
                uploaded_draft_url: publicUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("college_essays")
                .update(updated)
                .eq("id", essay.id);

            if (error) throw error;

            onSave(updated);
            toast.success("Draft uploaded");
        } catch (error) {
            console.error("Failed to upload draft", error);
            toast.error("Failed to upload draft");
        }
    };

    return (
        <div className="border rounded-xl p-6 space-y-6 bg-card shadow-sm hover:shadow-md transition-shadow">
            {/* Prompt Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <ScrollText className="h-5 w-5 text-primary" />
                        Essay Prompt
                    </h3>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-primary hover:bg-primary/10"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </div>
                <div className="bg-muted p-4 rounded-lg border">
                    <p className="text-foreground">{essay.prompt}</p>
                </div>
            </div>

            {/* Response Section */}
            <div className="space-y-4">
                <Label className="text-base font-medium">Your Response</Label>

                {isEditing ? (
                    <>
                        <Textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="min-h-[250px] font-mono text-sm"
                            placeholder="Write your response here (Markdown supported)..."
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            </div>
                            <a
                                href="https://www.markdownguide.org/basic-syntax/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Markdown Guide
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-4 min-h-[200px] bg-muted/50">
                        {draft ? (
                            <ReactMarkdown>{draft}</ReactMarkdown>
                        ) : (
                            <div className="text-muted-foreground italic flex flex-col items-center justify-center h-full py-8">
                                <FileText className="h-8 w-8 mb-2" />
                                No response yet
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Draft
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </Button>

                    {essay.uploaded_draft_url && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={essay.uploaded_draft_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                View Draft
                            </a>
                        </Button>
                    )}
                </div>

                {essay.updated_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                            Last updated:{" "}
                            {format(
                                new Date(essay.updated_at),
                                "MMM d, yyyy 'at' h:mm a"
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Word Count */}
            {draft && (
                <div className="text-xs text-muted-foreground text-right">
                    {draft.split(/\s+/).filter(Boolean).length} words
                </div>
            )}
        </div>
    );
}
