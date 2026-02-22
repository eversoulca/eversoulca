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
import { Plus, User, Users, PawPrint, Upload, Trash2, Lock } from "lucide-react";
import { Persona } from "./PersonaCard";

interface CreatePersonaDialogProps {
  onCreatePersona: (persona: Omit<Persona, "id" | "createdAt">) => void;
}

const PET_PERSONALITY_TRAITS = [
  "Playful",
  "Shy",
  "Curious",
  "Calm",
  "Lively",
  "Affectionate",
  "Energetic",
  "Gentle",
  "Independent",
  "Loyal",
  "Mischievous",
  "Friendly",
];

export function CreatePersonaDialog({ onCreatePersona }: CreatePersonaDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"self" | "family" | "pet">("pet");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPersonalityTrait, setSelectedPersonalityTrait] = useState("");
  const [currentMemory, setCurrentMemory] = useState("");
  const [memoryList, setMemoryList] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMemory.trim()) {
      setMemoryList([...memoryList, currentMemory.trim()]);
      setCurrentMemory("");
    }
  };

  const handleDeleteMemory = (index: number) => {
    setMemoryList(memoryList.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("audio/")) {
        setVoiceFile(file);
      }
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (selectedType === "pet") {
      if (!imageFile) {
        alert("Pet photo is required");
        return;
      }
      if (!voiceFile) {
        alert("Pet voice audio is required");
        return;
      }
    }

    // Build personality string based on type
    let personalityString = "";
    if (selectedType === "pet" && selectedPersonalityTrait) {
      personalityString = selectedPersonalityTrait;
    }

    onCreatePersona({
      name,
      type: selectedType,
      description,
      personality: personalityString,
      memories: memoryList.join("; "),
      imageUrl,
    });

    // Reset form
    setName("");
    setDescription("");
    setSelectedPersonalityTrait("");
    setCurrentMemory("");
    setMemoryList([]);
    setImageUrl("");
    setImageFile(null);
    setVoiceFile(null);
    setVideoFile(null);
    setOpen(false);
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
            <Label htmlFor="name">Name</Label>
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

          {/* Personality Trait - Only for Pet */}
          {selectedType === "pet" && (
            <div className="space-y-2">
              <Label htmlFor="personality">Personality Trait</Label>
              <select
                id="personality"
                value={selectedPersonalityTrait}
                onChange={(e) => setSelectedPersonalityTrait(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a personality trait</option>
                {PET_PERSONALITY_TRAITS.map((trait) => (
                  <option key={trait} value={trait}>
                    {trait}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Memories - List Management */}
          <div className="space-y-2">
            <Label htmlFor="memories">Key Memories & Stories</Label>
            <div className="flex gap-2">
              <Input
                id="memories"
                value={currentMemory}
                onChange={(e) => setCurrentMemory(e.target.value)}
                placeholder={selectedType === "pet" ? "e.g. Likes to hide on the sofa" : "Share important memories and stories..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMemory(e as any);
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddMemory}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            
            {/* Memories List */}
            {memoryList.length > 0 && (
              <div className="mt-3 space-y-2 p-3 bg-background rounded-lg border">
                {memoryList.map((memory, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded border text-sm"
                  >
                    <span className="text-foreground">{memory}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMemory(index)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Upload - Mandatory for Pet */}
          {selectedType === "pet" && (
            <div className="space-y-2">
              <Label htmlFor="photo">Pet Photo (Required)</Label>
              <div className="border-2 border-dashed border rounded-lg p-6 text-center transition-colors">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-muted-foreground">
                    Click to upload pet photo
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {imageFile ? imageFile.name : "JPG, PNG, or GIF"}
                  </div>
                </label>
              </div>
              {imageFile && (
                <div className="text-xs text-green-600">✓ Photo uploaded: {imageFile.name}</div>
              )}
            </div>
          )}

          {/* Voice Audio Upload - Mandatory for Pet */}
          {selectedType === "pet" && (
            <div className="space-y-2">
              <Label htmlFor="voice">Pet Voice Audio (Required)</Label>
              <div className="border-2 border-dashed border rounded-lg p-6 text-center transition-colors">
                <input
                  type="file"
                  id="voice"
                  accept="audio/*"
                  onChange={handleVoiceChange}
                  className="hidden"
                />
                <label htmlFor="voice" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-muted-foreground">
                    Click to upload pet voice audio
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {voiceFile ? voiceFile.name : "MP3, WAV, or M4A"}
                  </div>
                </label>
              </div>
              {voiceFile && (
                <div className="text-xs text-green-600">✓ Audio uploaded: {voiceFile.name}</div>
              )}
            </div>
          )}

          {/* Video Upload - Premium Feature */}
          {selectedType === "pet" && (
            <div className="space-y-2">
              <Label htmlFor="video">Pet Video (Premium Feature)</Label>
              <div className="border-2 border-dashed border rounded-lg p-6 text-center bg-muted opacity-50">
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  disabled
                  className="hidden"
                />
                <label htmlFor="video" className="cursor-not-allowed">
                  <div className="flex justify-center mb-2">
                    <Lock className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Video upload requires Premium subscription
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Upgrade your account to enable video memories
                  </div>
                </label>
              </div>
            </div>
          )}

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
