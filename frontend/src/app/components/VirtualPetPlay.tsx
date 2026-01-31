import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Zap, Utensils, Sparkles } from "lucide-react";
import { Persona } from "./PersonaCard";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface VirtualPetPlayProps {
  persona: Persona;
  onBack: () => void;
}

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
  cleanliness: number;
}

interface InteractionButton {
  label: string;
  icon: React.ReactNode;
  effect: Partial<PetStats>;
  cooldown?: number;
}

// Pet-specific interactions based on type
const getPetInteractions = (
  personaName: string,
  personaType: string
): InteractionButton[] => {
  const name = personaName.toLowerCase();

  // Determine specific pet type from name or description
  if (name.includes("dog") || personaType === "dog") {
    return [
      {
        label: "Pet",
        icon: "🐕",
        effect: { happiness: 10, energy: -2 },
      },
      {
        label: "Feed",
        icon: "🍖",
        effect: { hunger: 30, happiness: 5 },
      },
      {
        label: "Give Treat",
        icon: "🦴",
        effect: { happiness: 15, hunger: 10 },
      },
      {
        label: "Clean",
        icon: "🛁",
        effect: { cleanliness: 30, happiness: -5 },
      },
      {
        label: "Play Fetch",
        icon: "🎾",
        effect: { happiness: 20, energy: -15, hunger: -10 },
      },
    ];
  }

  if (name.includes("cat") || personaType === "cat") {
    return [
      {
        label: "Pet",
        icon: "🐈",
        effect: { happiness: 10, energy: -2 },
      },
      {
        label: "Feed",
        icon: "🐟",
        effect: { hunger: 30, happiness: 5 },
      },
      {
        label: "Give Treat",
        icon: "🥫",
        effect: { happiness: 15, hunger: 10 },
      },
      {
        label: "Chase Laser",
        icon: "🔴",
        effect: { happiness: 25, energy: -20, hunger: -15 },
      },
    ];
  }

  if (name.includes("bird") || personaType === "bird") {
    return [
      {
        label: "Hold",
        icon: "🤲",
        effect: { happiness: 15, energy: -5 },
      },
      {
        label: "Feed",
        icon: "🌾",
        effect: { hunger: 30, happiness: 5 },
      },
      {
        label: "Sing Together",
        icon: "🎵",
        effect: { happiness: 20, energy: -10 },
      },
    ];
  }

  if (name.includes("rabbit") || name.includes("bunny") || personaType === "rabbit") {
    return [
      {
        label: "Pet",
        icon: "🐰",
        effect: { happiness: 10, energy: -2 },
      },
      {
        label: "Feed",
        icon: "🥕",
        effect: { hunger: 30, happiness: 5 },
      },
      {
        label: "Give Treat",
        icon: "🥬",
        effect: { happiness: 15, hunger: 10 },
      },
      {
        label: "Play Hop",
        icon: "🏃",
        effect: { happiness: 20, energy: -15 },
      },
    ];
  }

  if (name.includes("hamster") || personaType === "hamster") {
    return [
      {
        label: "Pet",
        icon: "🐹",
        effect: { happiness: 10, energy: -2 },
      },
      {
        label: "Feed",
        icon: "🌰",
        effect: { hunger: 30, happiness: 5 },
      },
      {
        label: "Clean Cage",
        icon: "🧹",
        effect: { cleanliness: 40, happiness: 5 },
      },
      {
        label: "Exercise Wheel",
        icon: "⚙️",
        effect: { happiness: 15, energy: -10 },
      },
    ];
  }

  // Default generic pet interactions
  return [
    {
      label: "Pet",
      icon: "🐾",
      effect: { happiness: 10, energy: -2 },
    },
    {
      label: "Feed",
      icon: "🍖",
      effect: { hunger: 30, happiness: 5 },
    },
    {
      label: "Give Treat",
      icon: "🦴",
      effect: { happiness: 15, hunger: 10 },
    },
    {
      label: "Play",
      icon: "🎾",
      effect: { happiness: 20, energy: -15, hunger: -10 },
    },
  ];
};

export function VirtualPetPlay({ persona, onBack }: VirtualPetPlayProps) {
  const [stats, setStats] = useState<PetStats>({
    happiness: 70,
    hunger: 50,
    energy: 80,
    cleanliness: 60,
  });

  const [lastInteraction, setLastInteraction] = useState<string>("");
  const [interactionCooldown, setInteractionCooldown] = useState<string | null>(null);

  const interactions = getPetInteractions(persona.name, persona.type);

  // Passive stat decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        happiness: Math.max(0, prev.happiness - 0.5),
        hunger: Math.max(0, prev.hunger - 1),
        energy: Math.max(0, prev.energy + 0.5),
        cleanliness: Math.max(0, prev.cleanliness - 0.5),
      }));
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-clear last interaction after 2.5 seconds with fade out
  useEffect(() => {
    if (lastInteraction) {
      const timeout = setTimeout(() => {
        setLastInteraction("");
      }, 2500);
      
      return () => clearTimeout(timeout);
    }
  }, [lastInteraction]);

  const handleInteraction = (interaction: InteractionButton) => {
    if (interactionCooldown === interaction.label) return;

    setStats((prev) => ({
      happiness: Math.min(100, Math.max(0, prev.happiness + (interaction.effect.happiness || 0))),
      hunger: Math.min(100, Math.max(0, prev.hunger + (interaction.effect.hunger || 0))),
      energy: Math.min(100, Math.max(0, prev.energy + (interaction.effect.energy || 0))),
      cleanliness: Math.min(100, Math.max(0, prev.cleanliness + (interaction.effect.cleanliness || 0))),
    }));

    setLastInteraction(`${interaction.label} ${interaction.icon}`);
    
    // Set cooldown for this specific interaction
    if (interaction.cooldown !== 0) {
      setInteractionCooldown(interaction.label);
      setTimeout(() => setInteractionCooldown(null), interaction.cooldown || 2000);
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatTextColor = (value: number) => {
    if (value >= 70) return "text-green-600 dark:text-green-400";
    if (value >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">
                Playing with {persona.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {persona.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pet Display */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                  {persona.imageUrl ? (
                    <img
                      src={persona.imageUrl}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-9xl">🐾</div>
                  )}
                  
                  {/* Interaction Feedback */}
                  {lastInteraction && (
                    <div className="text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce pointer-events-none transition-opacity duration-1000 opacity-100" style={{ animation: 'bounce 1s ease-in-out 2, fadeOut 0.5s ease-in-out 2s forwards' }}>
                      {lastInteraction}
                    </div>
                  )}

                  {/* Status Gauges Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 backdrop-blur-sm">
                    <div className="space-y-3">
                      {/* Happiness */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Happiness</span>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {Math.round(stats.happiness)}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(stats.happiness)} transition-all duration-500`}
                            style={{ width: `${stats.happiness}%` }}
                          />
                        </div>
                      </div>

                      {/* Hunger */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Fullness</span>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {Math.round(stats.hunger)}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(stats.hunger)} transition-all duration-500`}
                            style={{ width: `${stats.hunger}%` }}
                          />
                        </div>
                      </div>

                      {/* Energy */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Energy</span>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {Math.round(stats.energy)}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(stats.energy)} transition-all duration-500`}
                            style={{ width: `${stats.energy}%` }}
                          />
                        </div>
                      </div>

                      {/* Cleanliness (if applicable) */}
                      {interactions.some(i => i.label.toLowerCase().includes('clean')) && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-white" />
                              <span className="text-sm font-medium text-white">Cleanliness</span>
                            </div>
                            <span className="text-sm font-bold text-white">
                              {Math.round(stats.cleanliness)}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getStatColor(stats.cleanliness)} transition-all duration-500`}
                              style={{ width: `${stats.cleanliness}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interaction Buttons */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Interactions</h3>
                <div className="space-y-3">
                  {interactions.map((interaction) => (
                    <Button
                      key={interaction.label}
                      onClick={() => handleInteraction(interaction)}
                      disabled={interactionCooldown === interaction.label}
                      className="w-full justify-start gap-3 h-auto py-4 text-base"
                      variant={interactionCooldown === interaction.label ? "secondary" : "default"}
                    >
                      <span className="text-2xl">{interaction.icon}</span>
                      <span>{interaction.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="text-m font-semibold mb-2 text-accent">💡 Tips</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Stats decrease over time</li>
                    <li>• Keep all stats above 40%</li>
                    <li>• Each interaction has effects</li>
                    <li>• Balance is key to happiness!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}