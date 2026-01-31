import { MessageCircle, Heart, User, PawPrint, Users, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export interface Persona {
  id: string;
  name: string;
  type: "self" | "family" | "pet";
  description: string;
  personality: string;
  memories: string;
  imageUrl?: string;
  createdAt: string;
}

interface PersonaCardProps {
  persona: Persona;
  onChat: (persona: Persona) => void;
}

const typeConfig = {
  self: { icon: User, label: "You", color: "bg-blue-500" },
  family: { icon: Users, label: "Family", color: "bg-purple-500" },
  pet: { icon: PawPrint, label: "Pet", color: "bg-green-500" },
};

export function PersonaCard({ persona, onChat }: PersonaCardProps) {
  const config = typeConfig[persona.type];
  const Icon = config.icon;
  
  // Determine button text and icon based on persona type
  const isPet = persona.type === "pet";
  const buttonIcon = isPet ? Gamepad2 : MessageCircle;
  const ButtonIcon = buttonIcon;
  const buttonText = isPet ? "Start Play" : "Start Chat";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {persona.imageUrl ? (
          <img
            src={persona.imageUrl}
            alt={persona.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-20 h-20 text-gray-400" />
          </div>
        )}
        <div className={`absolute top-3 right-3 ${config.color} rounded-full p-2`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{persona.name}</h3>
            <Badge variant="secondary" className="text-xs mt-1">
              {config.label}
            </Badge>
          </div>
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {persona.description}
        </p>
        <button
          onClick={() => onChat(persona)}
          className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <ButtonIcon className="w-4 h-4" />
          {buttonText}
        </button>
      </CardContent>
    </Card>
  );
}