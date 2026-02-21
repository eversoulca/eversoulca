import { useState, useEffect } from "react";
import {
  Heart,
  Moon,
  Sun,
  Globe,
  User,
  ShoppingBag,
  Coins,
  CreditCard,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Persona } from "./PersonaCard";

interface HeaderProps {
  personas: Persona[];
  onNavigateHome: () => void;
  onViewPersona: (persona: Persona) => void;
  onViewPersonaPage?: () => void;
  onViewSubscriptions: () => void;
  onSignup?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  currentUser?: any;
  authToken?: string;
}

export function Header({
  personas,
  onNavigateHome,
  onViewPersona,
  onViewPersonaPage,
  onViewSubscriptions,
  onSignup,
  onLogin,
  onLogout,
  currentUser,
  authToken,
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isTogglingTwoFactor, setIsTogglingTwoFactor] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState("");

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Load 2FA status when user changes
  useEffect(() => {
    if (currentUser?.isEmailTwoFactorEnabled !== undefined) {
      setIsTwoFactorEnabled(currentUser.isEmailTwoFactorEnabled);
    }
  }, [currentUser]);

  const handleToggleTwoFactor = async () => {
    if (!authToken) {
      setTwoFactorMessage("Not authenticated");
      return;
    }

    setIsTogglingTwoFactor(true);
    setTwoFactorMessage("");

    try {
      const response = await fetch(
        "http://localhost:5266/api/auth/enable-email-2fa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ enable: !isTwoFactorEnabled }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update 2FA settings");
      }

      const data = await response.json();
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
      setTwoFactorMessage(data.message);

      // Clear message after 3 seconds
      setTimeout(() => setTwoFactorMessage(""), 3000);
    } catch (err) {
      setTwoFactorMessage(
        err instanceof Error ? err.message : "Failed to update 2FA settings"
      );
    } finally {
      setIsTogglingTwoFactor(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("dark-mode", String(newMode));

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br via-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg">
            <a className="text-secondary dark:text-primary">Upload</a><a className="text-primary dark:text-secondary">Soul</a>
          </span>
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Language/Translation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  English (EN)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  简体中文 (CN)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  繁體中文 (TW)
                </span>
                </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  日本語 (JP)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  한국어 (KR)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  Español (ES)
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            {currentUser ? (
              <DropdownMenuContent align="end" className="w-72">
                {/* Account Details Section */}
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1 w-full">
                    <span className="font-medium">{currentUser?.username || "User"}</span>
                    <span className="text-xs text-gray-500">
                      {currentUser?.username || "user"}@uploadsoul.com
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                {/* Security Section */}
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={handleToggleTwoFactor} disabled={isTogglingTwoFactor}>
                  <div className="flex items-center gap-2 w-full">
                    <Shield className="w-4 h-4" />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm">
                        Email 2FA
                      </span>
                      <span className="text-xs text-gray-500">
                        {isTwoFactorEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isTwoFactorEnabled ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                </DropdownMenuItem>
                {twoFactorMessage && (
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-blue-600">{twoFactorMessage}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Created Personas Section */}
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Your Personas ({personas.length})
                </DropdownMenuLabel>
                {personas.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto">
                    {personas.slice(0, 5).map((persona) => (
                      <DropdownMenuItem
                        key={persona.id}
                        onClick={() => onViewPersona(persona)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          {persona.imageUrl ? (
                            <img
                              src={persona.imageUrl}
                              alt={persona.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {persona.name}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {persona.type}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {personas.length > 5 && (
                      <DropdownMenuItem onClick={onNavigateHome}>
                        <span className="text-xs text-gray-500">
                          + {personas.length - 5} more personas
                        </span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={onViewPersonaPage}>
                      <span className="text-xs text-gray-500">
                        Visit Persona Page
                      </span>
                    </DropdownMenuItem>
                  </div>
                ) : (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-500">
                      No personas yet
                    </span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Shop Section */}
                <DropdownMenuLabel className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onViewSubscriptions}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span>Subscriptions</span>
                    <span className="text-xs text-gray-500">
                      Upgrade your plan
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Coins className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span>Platform Currency</span>
                    <span className="text-xs text-gray-500">
                      Buy immortality tokens
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span>Premium Features</span>
                    <span className="text-xs text-gray-500">
                      Voice chat, VR, & more
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={onLogout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end" className="w-72">
                {/* Signup/Login */}
                <DropdownMenuItem onClick={onLogin}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignup}>
                  Signup
                </DropdownMenuItem>  
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}