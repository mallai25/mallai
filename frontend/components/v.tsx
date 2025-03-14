import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronRight, Gift, User, BarChart, Vote, ArrowRight } from "lucide-react";

export function AdaptHero() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Consumer Product Intelligence & Analytics
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Understand your consumers better through dynamic engagement and real-time analytics.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg" className="rounded-full">
                    Login
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full">
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 border p-8 rounded-xl">
              <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold">Receive Updates</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Join our mailing list to receive updates about our latest products and features.
                </p>
              </div>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Input placeholder="Email" type="email" className="rounded-xl h-11" />
                </div>
                <Button className="w-full rounded-xl">Join Newsletter</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Tracking Box */}
      <section className="py-10 bg-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Track Your Brand Rewards</h2>
                <p className="text-blue-700">
                  Create a free account to track rewards campaigns from consumer packaged goods brands and influencer promotions. Participate in polls and get exclusive access.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <Gift className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Rewards</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <Vote className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Polls</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Influencers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <BarChart className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="/join">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
                    size="lg"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Mailing List */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Join Our Mailing List
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Stay up-to-date with the latest news, product releases, and exclusive offers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="rounded-full">
                  Subscribe
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 border p-8 rounded-xl">
              <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold">Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Have questions or need assistance? Reach out to our support team.
                </p>
              </div>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Input placeholder="Email" type="email" className="rounded-xl h-11" />
                </div>
                <Button className="w-full rounded-xl">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CreativitySection */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Unleash Your Creativity
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explore new ways to engage with your audience and create memorable experiences.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="rounded-full">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  View Examples
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 border p-8 rounded-xl">
              <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold">Share Your Ideas</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Connect with other creators and share your innovative ideas.
                </p>
              </div>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Input placeholder="Email" type="email" className="rounded-xl h-11" />
                </div>
                <Button className="w-full rounded-xl">Join Community</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Unlock Exclusive Benefits
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Gain access to premium features and resources to enhance your experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="rounded-full">
                  Explore Benefits
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 border p-8 rounded-xl">
              <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold">Upgrade Your Account</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Unlock additional features and capabilities by upgrading your account.
                </p>
              </div>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Input placeholder="Email" type="email" className="rounded-xl h-11" />
                </div>
                <Button className="w-full rounded-xl">Upgrade Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}