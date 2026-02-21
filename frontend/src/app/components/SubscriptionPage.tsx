import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";

export interface Sub {
  id: string;
  name: string;
  type: "general" | "family" | "pet";
  description: string;
  cost: number;
}

const subs = [
  {
    id: 0,
    name: "Free",
    type: "general",
    description:
      "Free plan with 50 tokens a month. Explore a feature before committing to a plan!",
    cost: 0,
  },
  {
    id: 1,
    name: "Basic",
    type: "general",
    description:
      "Basic plan with 500 tokens a month, enough for weekly interactions with a few personas.",
    cost: 10,
  },
  {
    id: 2,
    name: "Pet Parent",
    type: "pet",
    description:
      "Pet-only plan with 500 tokens a month! Enjoy our VR pet features at a focused price.",
    cost: 10,
  },
  {
    id: 3,
    name: "Family",
    type: "family",
    description:
      "1500 tokens a month for large families. Visualize your digital family tree!",
    cost: 20,
  },
  {
    id: 4,
    name: "Premium",
    type: "general",
    description:
      "5000 tokens a month, great for frequent interactions with pets and loved ones.",
    cost: 30,
  },
];

export function SubscriptionPage() {
  const [filterType, setFilterType] = useState<
    "all" | "general" | "family" | "pet"
  >("all");

  const filteredSubs = subs.filter((s) =>
    filterType === "all" ? true : s.type === filterType,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Subscriptions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Select a subscription tier here!
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
              All ({subs.length})
            </TabsTrigger>
            <TabsTrigger value="general">
              General (
              {subs.filter((s) => s.type === "general").length})
            </TabsTrigger>
            <TabsTrigger value="family">
              Family (
              {subs.filter((s) => s.type === "family").length})
            </TabsTrigger>
            <TabsTrigger value="pet">
              Pets (
              {subs.filter((s) => s.type === "pet").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-center py-16 px-4">
            <h3 className="text-xl font-semibold mb-2">
              No available subscriptions
            </h3>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubs.map((sub) => (
            <Card
              key={sub.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {sub.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {sub.description}
                </p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  ${sub.cost}/month
                </p>
                <button className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors">
                  Select
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}