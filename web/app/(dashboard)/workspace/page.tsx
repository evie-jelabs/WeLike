"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Radio, DollarSign, ArrowRight, ChevronRight, Globe } from "lucide-react";

const TOOLS = [
  {
    id: "social-listening",
    href: "/tools/social-listening",
    icon: Radio,
    name: "Social Listening",
    description:
      "Monitor real-time discussions about your product across X, Reddit, and developer communities. Get alerts on sentiment shifts and trending narratives.",
    features: [
      "Real-time mention tracking",
      "Sentiment analysis & alerts",
      "Competitor mention comparison",
      "Trending narrative extraction",
    ],
    color: "purple",
  },
  {
    id: "kol-pricer",
    href: "/tools/kol-pricer",
    icon: DollarSign,
    name: "KOL Pricer",
    description:
      "Get fair-market pricing benchmarks for KOL and influencer partnerships. Compare rates across platforms and engagement tiers.",
    features: [
      "Platform-specific pricing data",
      "Engagement-based benchmarks",
      "ROI estimation per KOL",
      "Budget allocation suggestions",
    ],
    color: "brand",
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  purple: {
    bg: "bg-purple-500/5",
    border: "border-purple-500/20 hover:border-purple-500/40",
    icon: "bg-purple-500/10 text-purple-400",
    badge: "bg-purple-500/10 text-purple-400",
  },
  brand: {
    bg: "bg-brand-500/5",
    border: "border-brand-500/20 hover:border-brand-500/40",
    icon: "bg-brand-500/10 text-brand-500",
    badge: "bg-brand-500/10 text-brand-500",
  },
};

export default function WorkspacePage() {
  const { productContext } = useAuth();

  // Derive display info from product context
  const categoryLabel = productContext?.category
    ? productContext.category
        .replace(/-/g, " ")
        .replace(/\bai\b/gi, "AI")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <div>
      {/* Hero — Product Card */}
      <div className="rounded-2xl border border-surface-800 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-500/5 p-8 mb-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3">
              GTM Workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {productContext?.name || "Your Product"}
            </h1>
            {productContext?.oneLiner && (
              <p className="text-surface-300 text-base leading-relaxed mb-5 max-w-xl">
                {productContext.oneLiner}
              </p>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel && (
                <span className="inline-flex items-center gap-1.5 bg-brand-500/10 text-brand-500 text-xs font-medium px-3 py-1 rounded-full">
                  {categoryLabel}
                </span>
              )}
              {productContext?.stage && (
                <span className="inline-flex items-center gap-1.5 bg-surface-800 text-surface-300 text-xs font-medium px-3 py-1 rounded-full">
                  {productContext.stage.charAt(0).toUpperCase() + productContext.stage.slice(1)}
                </span>
              )}
              {productContext?.targetRegions && productContext.targetRegions.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-surface-800 text-surface-300 text-xs font-medium px-3 py-1 rounded-full">
                  <Globe className="h-3 w-3" />
                  {productContext.targetRegions.slice(0, 2).join(", ")}
                  {productContext.targetRegions.length > 2 && ` +${productContext.targetRegions.length - 2}`}
                </span>
              )}
              {productContext?.url && (
                <a
                  href={productContext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-surface-500 hover:text-brand-500 transition-colors"
                >
                  {productContext.url.replace(/^https?:\/\//, "")}
                  <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Edit button */}
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-white bg-surface-800 hover:bg-surface-700 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            Edit
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Toolkit Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Toolkit and Playbook</h2>
        <p className="text-sm text-surface-500">
          Battle-tested tools to execute your go-to-market strategy.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOLS.map((tool) => {
          const colors = COLOR_MAP[tool.color];
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={`block rounded-xl border ${colors.border} ${colors.bg} p-6 transition-all group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-surface-600 group-hover:text-surface-300 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed mb-4">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {tool.features.map((feature) => (
                  <span
                    key={feature}
                    className={`text-xs ${colors.badge} px-2 py-1 rounded-md`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Coming Soon */}
      <div className="mt-8 text-center">
        <p className="text-xs text-surface-600">
          More tools coming soon — Scout, AEO Optimizer, Channel Matcher, and more.
        </p>
      </div>
    </div>
  );
}
