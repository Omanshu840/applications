// src/components/AddEssayModal.tsx
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AddEssayModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (prompt: string) => Promise<void>;
}

export function AddEssayModal({ open, onClose, onSave }: AddEssayModalProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    try {
      setIsSaving(true);
      await onSave(prompt);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Essay Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the essay prompt..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !prompt.trim()}>
            {isSaving ? "Saving..." : "Save Prompt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}