"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { ArrowRight, Zap, Eye, BarChart3, Radio, BookOpen, Code, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, productContext, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (productContext) {
        router.push("/workspace");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, productContext, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      {/* Nav */}
      <nav className="border-b border-surface-800">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">W</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">WeLike</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-surface-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-brand-500 text-black font-medium px-4 py-2 rounded-lg hover:bg-brand-400 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-surface-900 border border-surface-800 rounded-full px-4 py-1.5 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs text-surface-400">GTM Workspace for AI Products</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            Your AI is groundbreaking.
            <br />
            <span className="text-gradient">Your GTM should be too.</span>
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed mb-10 max-w-2xl">
            WeLike is the GTM workspace for AI products.
            Battle-tested playbooks and tools from 100+ launches.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-400 transition-colors"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-surface-500">No credit card required</span>
          </div>
        </div>
      </section>

      {/* Why WeLike */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Code,
              title: "Built for AI products, not generic SaaS",
              desc: "We understand developer marketing, GitHub presence, API docs, open-source dynamics, and dev community engagement — because that's all we do.",
            },
            {
              icon: BookOpen,
              title: "Playbooks from 100+ launches",
              desc: "Every tool encodes real GTM know-how from JE Labs' experience launching frontier AI projects — not theoretical frameworks.",
            },
            {
              icon: Users,
              title: "Tools + strategy, not just dashboards",
              desc: "Go beyond analytics. Get actionable GTM plans, positioning strategies, and ready-to-ship content — all informed by what actually works.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-surface-900 border border-surface-800 rounded-xl p-6 hover:border-brand-500/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-brand-500" />
              </div>
              <h3 className="font-semibold mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Your GTM toolkit</h2>
          <p className="text-surface-400 text-sm">Every tool you need, from market research to launch day and beyond.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Eye,
              title: "Scout",
              desc: "Competitive intelligence & market signals, refreshed weekly.",
            },
            {
              icon: Zap,
              title: "AEO Optimizer",
              desc: "Make your product discoverable by ChatGPT, Perplexity & Claude.",
            },
            {
              icon: Radio,
              title: "Social Listening",
              desc: "Real-time sentiment tracking across X, Reddit & dev communities.",
            },
            {
              icon: BarChart3,
              title: "KOL Pricer",
              desc: "Smart pricing benchmarks for influencer & KOL partnerships.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-surface-900 border border-surface-800 rounded-xl p-6 hover:border-surface-700 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-surface-800 flex items-center justify-center mb-4 group-hover:bg-brand-500/10 transition-colors">
                <f.icon className="h-5 w-5 text-brand-500" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-surface-500">&copy; 2026 WeLike by JE Labs</p>
          <p className="text-xs text-surface-600">Built for the AI builders.</p>
        </div>
      </footer>
    </div>
  );
}
