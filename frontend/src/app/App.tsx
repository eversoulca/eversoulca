import { useState, useEffect } from "react";
import { PersonaCard, Persona } from "./components/PersonaCard";
import { CreatePersonaDialog } from "./components/CreatePersonaDialog";
import { ChatInterface } from "./components/ChatInterface";
import { VirtualPetPlay } from "./components/VirtualPetPlay";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { SubscriptionPage } from "./components/SubscriptionPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Heart, Sparkles } from "lucide-react";

export default function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] =
    useState<Persona | null>(null);
  const [currentView, setCurrentView] = useState<
    "home" | "personas" | "subs" | "tokens" | "login" | "signup"
  >("home");
  const [filterType, setFilterType] = useState<
    "all" | "self" | "family" | "pet"
  >("all");

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load personas from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("digital-personas");
    if (stored) {
      try {
        setPersonas(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading personas:", e);
      }
    } else {
      // Add sample personas for demo
      const samplePersonas: Persona[] = [
        {
          id: "sample-1",
          name: "Grandma Rose",
          type: "family",
          description:
            "A warm-hearted grandmother with endless stories and wisdom",
          personality:
            "Kind, patient, loves baking cookies, always has a story to tell, speaks with gentle wisdom",
          memories:
            "Remember the summer days in the garden, teaching me how to plant tomatoes. 'Patience, dear,' she'd say. Her famous apple pie recipe, the smell of fresh bread every Sunday morning.",
          imageUrl:
            "https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZ3JhbmRtb3RoZXIlMjBzbWlsaW5nfGVufDF8fHx8MTc2ODE2ODU3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          createdAt: new Date().toISOString(),
        },
        {
          id: "sample-2",
          name: "Max",
          type: "pet",
          description:
            "The most loyal golden retriever who brought joy to every day",
          personality:
            "Playful, energetic, loved fetch and belly rubs, always excited about everything, wagged tail constantly",
          memories:
            "Running in the park every morning, the way he'd greet me at the door, his favorite tennis ball, beach days and swimming in the ocean.",
          imageUrl:
            "https://images.unsplash.com/photo-1719292606971-0916fc62f5b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2clMjBoYXBweXxlbnwxfHx8fDE3NjgwODUwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          createdAt: new Date().toISOString(),
        },
        {
          id: "sample-3",
          name: "Whiskers",
          type: "pet",
          description:
            "A mischievous cat with an independent spirit and soft purrs",
          personality:
            "Independent, curious, loves naps in sunny spots, playful at night, purrs loudly when content",
          memories:
            "Chasing laser pointers, knocking things off counters, cuddling on cold evenings, the way she'd meow for treats.",
          imageUrl:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3MzY2MzQ2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
          createdAt: new Date().toISOString(),
        },
        {
          id: "sample-4",
          name: "Tweety",
          type: "pet",
          description:
            "A cheerful bird with the most beautiful songs",
          personality:
            "Vocal, social, loves singing in the morning, chirps when happy, enjoys sitting on shoulders",
          memories:
            "Morning songs that woke the house, learning to whistle tunes, head scratches, flying around the living room.",
          imageUrl:
            "https://images.unsplash.com/photo-1552728089-57bdde30beb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJha2VldCUyMGJpcmR8ZW58MXx8fHwxNzM2NjM0NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          createdAt: new Date().toISOString(),
        },
      ];
      setPersonas(samplePersonas);
    }
  }, []);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");

    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    } else {
      setCurrentView("login");
    }
  }, []);

  // Authentication handlers
  const handleLogin = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentView("home");
  };

  const handleSignup = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentView("home");
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setCurrentView("login");
    setSelectedPersona(null);
  };

  const handleCreatePersona = (
    personaData: Omit<Persona, "id" | "createdAt">,
  ) => {
    const newPersona: Persona = {
      ...personaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPersonas((prev) => [newPersona, ...prev]);
  };

  const handleNavigateHome = () => {
    setCurrentView("home");
    setSelectedPersona(null);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView("personas");
    } else {
      setCurrentView("login");
    }
  };

  const handleSwitchToSignup = () => {
    setCurrentView("signup");
  };

  const handleSwitchToLogin = () => {
    setCurrentView("login");
  };

  const handleViewPersona = (persona: Persona) => {
    setCurrentView("personas");
    setSelectedPersona(persona);
  };

  const handleViewPersonaPage = () => {
    setCurrentView("personas");
    setSelectedPersona(null);
  };

  const handleViewSubscriptions = () => {
    setCurrentView("subs");
  };

  const filteredPersonas = personas.filter((p) =>
    filterType === "all" ? true : p.type === filterType,
  );

  // Interaction view - Show VirtualPetPlay for pets, ChatInterface for others
  if (selectedPersona) {
    const isPet = selectedPersona.type === "pet";
    
    return (
      <div className="h-screen flex flex-col">
        <Header
          personas={personas}
          onNavigateHome={handleNavigateHome}
          onViewPersona={handleViewPersona}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <div className="flex-1 overflow-hidden">
          {isPet ? (
            <VirtualPetPlay
              persona={selectedPersona}
              onBack={() => setSelectedPersona(null)}
            />
          ) : (
            <ChatInterface
              persona={selectedPersona}
              onBack={() => setSelectedPersona(null)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header
        personas={personas}
        onNavigateHome={handleNavigateHome}
        onViewPersona={handleViewPersona}
        onViewPersonaPage={handleViewPersonaPage}
        onViewSubscriptions={handleViewSubscriptions}
        onSignup={handleSwitchToSignup}
        onLogin={handleSwitchToLogin}
        onLogout={handleLogout}
        currentUser={isAuthenticated ? currentUser : null}
      />

      {currentView === "home" && (
        <HomePage onGetStarted={handleGetStarted} />
      )}

      {/* Show login/signup for unauthenticated users */}
      {currentView === "login" && !isAuthenticated && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}

      {currentView === "signup" && !isAuthenticated && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {/* Main app for authenticated users */}
      {isAuthenticated && (
        <>

          {currentView === "subs" && <SubscriptionPage />}

          {currentView === "personas" && (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              {/* Page Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">
                  Your Digital Companions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                  Manage and chat with all your immortalized
                  personas in one place
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <Tabs
                  value={filterType}
                  onValueChange={(v) => setFilterType(v as any)}
                >
                  <TabsList>
                    <TabsTrigger value="all">
                      All ({personas.length})
                    </TabsTrigger>
                    <TabsTrigger value="self">
                      Yourself (
                      {
                        personas.filter((p) => p.type === "self")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="family">
                      Family (
                      {
                        personas.filter((p) => p.type === "family")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="pet">
                      Pets (
                      {
                        personas.filter((p) => p.type === "pet")
                          .length
                      }
                      )
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <CreatePersonaDialog
                  onCreatePersona={handleCreatePersona}
                />
              </div>

              {/* Personas Grid */}
              {filteredPersonas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <EmptyState />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPersonas.map((persona) => (
                    <PersonaCard
                      key={persona.id}
                      persona={persona}
                      onChat={setSelectedPersona}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}