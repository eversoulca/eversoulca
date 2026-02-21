import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Plus, User, Users, PawPrint, Upload } from "lucide-react";
import { Persona } from "./PersonaCard";

interface CreatePersonaDialogProps {
  onCreatePersona: (persona: Omit<Persona, "id" | "createdAt">) => void;
}

export function CreatePersonaDialog({ onCreatePersona }: CreatePersonaDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"self" | "family" | "pet">("family");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [memories, setMemories] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreatePersona({
      name,
      type: selectedType,
      description,
      personality,
      memories,
      imageUrl,
    });

    // Reset form
    setName("");
    setDescription("");
    setPersonality("");
    setMemories("");
    setImageUrl("");
    setFiles([]);
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      // Create preview URL for the first image
      if (newFiles.length > 0 && newFiles[0].type.startsWith("image/")) {
        const url = URL.createObjectURL(newFiles[0]);
        setImageUrl(url);
      }
    }
  };

  const typeOptions = [
    { value: "self", label: "Yourself", icon: User, description: "Create a digital version of yourself" },
    { value: "family", label: "Family Member", icon: Users, description: "Immortalize a loved one" },
    { value: "pet", label: "Pet", icon: PawPrint, description: "Remember your furry friend" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create Digital Companion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Digital Companion</DialogTitle>
          <DialogDescription>
            Immortalize yourself, a loved one, or a pet by creating a digital persona you can chat with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Who are you immortalizing?</Label>
            <div className="grid grid-cols-3 gap-3">
              {typeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedType(option.value as any)}
                    className={`p-4 bg-background border-2 rounded-lg text-center transition-all ${
                      selectedType === option.value
                        ? "border-primary"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedType === "pet" ? "e.g., Max, Luna" : "e.g., John Smith, Mom"}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Brief Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description that captures their essence..."
              rows={2}
            />
          </div>

          {/* Personality */}
          <div className="space-y-2">
            <Label htmlFor="personality">Personality Traits</Label>
            <Textarea
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Describe their personality, quirks, sense of humor, way of speaking..."
              rows={3}
            />
          </div>

          {/* Memories */}
          <div className="space-y-2">
            <Label htmlFor="memories">Key Memories & Stories</Label>
            <Textarea
              id="memories"
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              placeholder="Share important memories, stories, favorite sayings, or experiences..."
              rows={4}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="files">Upload Photos & Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="files"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="files" className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <div className="text-sm text-gray-600">
                  Click to upload photos, videos, or documents
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {files.length > 0 ? `${files.length} file(s) selected` : "JPG, PNG, PDF, DOC"}
                </div>
              </label>
            </div>
            {files.length > 0 && (
              <div className="text-xs text-gray-600 mt-2">
                {files.map((file, i) => (
                  <div key={i}>• {file.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Cost */}
          <div className="space-y-2 justify-self-start">
            <Label htmlFor="cost">Cost: 20 Immortality Tokens</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Companion
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
