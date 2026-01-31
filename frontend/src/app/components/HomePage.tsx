import {
  Heart,
  Sparkles,
  Brain,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-secondary">
            <a className="text-secondary dark:text-primary">Upload</a>Soul - Digital Immortalization
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto mb-8">
          Preserve the essence, memories, and personality of
          yourself, loved ones, and pets forever. Create
          AI-powered digital companions you can interact with
          anytime.
        </p>
        <Button
          onClick={onGetStarted}
          size="lg"
          className="text-lg px-8 py-6"
        >
          Start Your Experience
        </Button>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              Preserve Memories
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload photos, videos, documents, and stories.
              Capture their voice, mannerisms, and the little
              details that make them unique.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              AI-Powered Personalities
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our advanced AI learns from the information you
              provide to create authentic digital companions
              that truly reflect their personality.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              Intelligent Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chat naturally with your digital companions. They
              respond with the same wisdom, humor, and warmth
              you remember.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your memories are precious. We use end-to-end
              encryption to ensure your data remains private and
              secure.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              Forever Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Keep memories alive across generations. Share
              stories, wisdom, and love with family members for
              years to come.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              Quick & Easy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first digital companion in minutes.
              Our intuitive interface makes the process simple
              and meaningful.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Who Can You Immortalize?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Yourself
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create a digital legacy for future generations.
              Share your wisdom, stories, and experiences with
              loved ones who come after you.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Family Members
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Preserve the memory of grandparents, parents, or
              siblings. Keep their stories, advice, and love
              alive forever.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Beloved Pets
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Remember your furry friends who brought so much
              joy. Capture their playful spirit and
              unconditional love.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-400 to-red-400 py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Begin Your Immortalization Journey Today
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Don't let precious memories fade away. Start creating
          digital companions that will preserve the essence of
          those you love forever.
        </p>
        <Button
          onClick={onGetStarted}
          size="lg"
          variant="secondary"
          className="text-lg px-8 py-6"
        >
          Create Your First Companion
        </Button>
      </div>
    </div>
  );
}