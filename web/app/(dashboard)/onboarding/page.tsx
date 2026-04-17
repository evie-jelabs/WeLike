"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type ProductContext } from "@/lib/auth-context";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

// AI product categories organized by AI track
const AI_CATEGORIES = [
  {
    group: "AI Infrastructure",
    items: [
      { value: "llm-framework", label: "LLM Framework / SDK" },
      { value: "vector-db", label: "Vector Database" },
      { value: "mlops", label: "MLOps / Model Serving" },
      { value: "gpu-cloud", label: "GPU Cloud / Compute" },
      { value: "data-pipeline", label: "Data Pipeline / ETL" },
      { value: "ai-gateway", label: "AI Gateway / Router" },
    ],
  },
  {
    group: "AI Applications",
    items: [
      { value: "ai-chatbot", label: "AI Chatbot / Assistant" },
      { value: "ai-coding", label: "AI Coding Tool" },
      { value: "ai-writing", label: "AI Writing / Content" },
      { value: "ai-image-video", label: "AI Image / Video Generation" },
      { value: "ai-search", label: "AI Search / RAG" },
      { value: "ai-analytics", label: "AI Analytics / BI" },
    ],
  },
  {
    group: "AI for Industry",
    items: [
      { value: "ai-healthcare", label: "AI for Healthcare" },
      { value: "ai-finance", label: "AI for Finance / Fintech" },
      { value: "ai-education", label: "AI for Education" },
      { value: "ai-ecommerce", label: "AI for E-commerce" },
      { value: "ai-legal", label: "AI for Legal" },
      { value: "ai-hr", label: "AI for HR / Recruiting" },
    ],
  },
  {
    group: "AI Agents & Automation",
    items: [
      { value: "ai-agent", label: "AI Agent Platform" },
      { value: "ai-workflow", label: "AI Workflow Automation" },
      { value: "ai-rpa", label: "AI-Powered RPA" },
      { value: "ai-api", label: "AI API / Model-as-a-Service" },
    ],
  },
  {
    group: "Open Source AI",
    items: [
      { value: "open-source-model", label: "Open-Source Model" },
      { value: "open-source-tool", label: "Open-Source AI Tool" },
      { value: "open-source-framework", label: "Open-Source Framework" },
    ],
  },
];

const STAGE_OPTIONS = [
  { value: "idea", label: "Idea / Research" },
  { value: "building", label: "Building MVP" },
  { value: "beta", label: "Beta / Private Launch" },
  { value: "launched", label: "Launched / Live" },
  { value: "growing", label: "Growing (PMF found)" },
  { value: "scaling", label: "Scaling" },
];

const REGION_OPTIONS = [
  "Global",
  "North America",
  "Europe",
  "Southeast Asia",
  "Japan & Korea",
  "China / Greater China",
  "Middle East",
  "Latin America",
  "Africa",
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "cn", label: "Chinese" },
  { value: "both", label: "English + Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "multi", label: "Multi-language" },
];

export default function OnboardingPage() {
  const { user, productContext, setProductContext } = useAuth();
  const router = useRouter();
  const isEditing = !!productContext;
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    url: "",
    oneLiner: "",
    description: "",
    category: "",
    stage: "",
    targetAudience: "",
    targetRegions: [] as string[],
    competitors: "",
    language: "en",
  });

  // Pre-fill if editing
  useEffect(() => {
    if (productContext) {
      setForm({
        name: productContext.name,
        url: productContext.url || "",
        oneLiner: productContext.oneLiner,
        description: productContext.description,
        category: productContext.category,
        stage: productContext.stage,
        targetAudience: productContext.targetAudience,
        targetRegions: productContext.targetRegions,
        competitors: productContext.competitors.join(", "),
        language: productContext.language,
      });
    }
  }, [productContext]);

  const update = (field: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleRegion = (region: string) => {
    setForm((prev) => ({
      ...prev,
      targetRegions: prev.targetRegions.includes(region)
        ? prev.targetRegions.filter((r) => r !== region)
        : [...prev.targetRegions, region],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const ctx: ProductContext = {
      id: productContext?.id || crypto.randomUUID(),
      userId: user!.id,
      name: form.name,
      url: form.url || undefined,
      oneLiner: form.oneLiner,
      description: form.description,
      category: form.category,
      stage: form.stage,
      targetAudience: form.targetAudience,
      targetRegions: form.targetRegions,
      competitors: form.competitors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      language: form.language,
      createdAt: productContext?.createdAt || now,
      updatedAt: now,
    };
    setProductContext(ctx);
    setSaved(true);
    setTimeout(() => {
      router.push("/workspace");
    }, 1500);
  };

  const isValid = form.name && form.oneLiner && form.category;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          <span className="text-xs text-brand-500 font-medium">
            {isEditing ? "Edit Product" : "Step 1 of 1"}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {isEditing ? "Product Settings" : "Tell us about your product"}
        </h1>
        <p className="text-surface-400 text-sm">
          {isEditing
            ? "Update your product information. Changes will be reflected across all tools."
            : "This information powers all WeLike tools. Fill it once, use it everywhere."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Basic Info */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Product Name <span className="text-brand-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. WeLike"
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="https://yourproduct.com"
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              One-liner <span className="text-brand-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.oneLiner}
              onChange={(e) => update("oneLiner", e.target.value)}
              placeholder="Describe your product in one sentence"
              maxLength={120}
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors"
            />
            <p className="text-xs text-surface-600 mt-1">{form.oneLiner.length}/120</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What does your product do? Who is it for? What problem does it solve?"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors resize-none"
            />
          </div>
        </section>

        {/* Section: Category & Stage */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
            Category & Stage
          </h2>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              AI Category <span className="text-brand-500">*</span>
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white focus-brand transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23737373' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="" className="bg-surface-900">Select category...</option>
              {AI_CATEGORIES.map((group) => (
                <optgroup key={group.group} label={group.group} className="bg-surface-900">
                  {group.items.map((item) => (
                    <option key={item.value} value={item.value} className="bg-surface-900">
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Product Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => update("stage", e.target.value)}
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white focus-brand transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23737373' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="" className="bg-surface-900">Select stage...</option>
                {STAGE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-surface-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Primary Language
              </label>
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white focus-brand transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23737373' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-surface-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section: Target Market */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
            Target Market
          </h2>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Target Audience
            </label>
            <textarea
              rows={2}
              value={form.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder="e.g. AI startup founders, DevOps engineers at mid-size companies, indie hackers..."
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Target Regions
            </label>
            <div className="flex flex-wrap gap-2">
              {REGION_OPTIONS.map((region) => {
                const isSelected = form.targetRegions.includes(region);
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      isSelected
                        ? "bg-brand-500/10 border-brand-500/30 text-brand-500"
                        : "bg-surface-900 border-surface-700 text-surface-400 hover:border-surface-600 hover:text-surface-300"
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Known Competitors
            </label>
            <input
              type="text"
              value={form.competitors}
              onChange={(e) => update("competitors", e.target.value)}
              placeholder="Comma-separated, e.g. Competitor A, Competitor B, Competitor C"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus-brand transition-colors"
            />
            <p className="text-xs text-surface-600 mt-1">
              Our Scout tool will also discover competitors automatically.
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-2 pb-12">
          {saved ? (
            <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-500/10 border border-brand-500/20 px-6 py-3 text-sm font-semibold text-brand-500">
              <CheckCircle className="h-4 w-4" />
              {isEditing ? "Changes saved successfully" : "Workspace set up successfully"}
            </div>
          ) : (
            <button
              type="submit"
              disabled={!isValid}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-black hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors glow-brand"
            >
              {isEditing ? "Save changes" : "Set up workspace"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <p className="text-center text-xs text-surface-600 mt-3">
            {saved
              ? "You can explore the tools from the sidebar."
              : "You can always update this later from Product Settings."}
          </p>
        </div>
      </form>
    </div>
  );
}
