import { Heart, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-6">
        <Heart className="w-10 h-10 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No companions yet</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Start your digital immortalization journey by creating your first companion.
        Preserve memories, personalities, and stories forever.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4" />
        <span>Create meaningful connections that transcend time</span>
      </div>
    </div>
  );
}
