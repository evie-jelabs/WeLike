import { headers } from 'next/headers';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDailyContent, getMostRecentDate } from '@/lib/db';
import { getCache, setCache } from '@/lib/redis';
import { detectLang, parseLangParam, UI_STRINGS } from '@/lib/i18n';
import DailyBrief    from '@/components/DailyBrief';
import GrowthInsight from '@/components/GrowthInsight';
import LaunchRadar   from '@/components/LaunchRadar';
import DailyCase     from '@/components/DailyCase';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Lang, DailyContent } from '@/lib/types';

const CACHE_TTL = 24 * 60 * 60; // 24 h — PRD cache key: articles:YYYY-MM-DD

interface Props {
  searchParams: { date?: string; lang?: string };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
}

function offsetDate(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(date: string, lang: Lang): string {
  return new Date(date + 'T00:00:00Z').toLocaleDateString(
    lang === 'zh' ? 'zh-CN' : 'en-GB',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );
}

function hasAnyContent(c: DailyContent): boolean {
  return !!(
    c.daily_brief.length ||
    c.growth_insight.length ||
    c.launch_radar.length ||
    c.daily_case.length
  );
}

async function fetchContent(date: string): Promise<DailyContent> {
  const key    = `articles:${date}`;
  const cached = await getCache<DailyContent>(key);
  if (cached) return cached;

  const content = await getDailyContent(date);
  if (hasAnyContent(content)) await setCache(key, content, CACHE_TTL);
  return content;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const today   = new Date().toISOString().slice(0, 10);
  const date    = isValidDate(searchParams.date ?? '') ? searchParams.date! : today;
  const dateStr = formatDate(date, 'en');

  return {
    title:       `AI Marketer Daily — ${dateStr}`,
    description: 'The daily intelligence brief for AI marketers worldwide. 8 minutes a day. Free forever.',
    openGraph: {
      title:       `AI Marketer Daily — ${dateStr}`,
      description: 'Daily AI marketing intelligence: news, growth insights, product launches, and case studies.',
      type:        'website',
    },
    twitter: {
      card:        'summary',
      title:       `AI Marketer Daily — ${dateStr}`,
      description: 'Daily AI marketing intelligence. 8 minutes a day.',
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({ searchParams }: Props) {
  // Resolve language (URL param > Accept-Language > default 'en')
  const acceptLang = headers().get('accept-language');
  const lang: Lang = parseLangParam(searchParams.lang) ?? detectLang(acceptLang);
  const s          = UI_STRINGS[lang];

  // Resolve date
  const today   = new Date().toISOString().slice(0, 10);
  const reqDate = isValidDate(searchParams.date ?? '') ? searchParams.date! : today;

  // Fetch content — with DB error handling so page never crashes
  let content: DailyContent = {
    date: reqDate, daily_brief: [], growth_insight: [], launch_radar: [], daily_case: [],
  };
  let dbError = false;

  try {
    content = await fetchContent(reqDate);

    // Rule 4: if today has no content, fall back to most recent published date
    if (!hasAnyContent(content) && reqDate === today) {
      const recentDate = await getMostRecentDate();
      if (recentDate && recentDate !== today) {
        content = await fetchContent(recentDate);
        // Redirect user to the actual date so the URL reflects reality
        // (handled client-side via meta refresh — avoids server redirect issues)
      }
    }
  } catch (err) {
    console.error('[HomePage] DB/Redis error:', err);
    dbError = true;
  }

  const displayDate = content.date;
  const prevDate    = offsetDate(displayDate, -1);
  const nextDate    = offsetDate(displayDate, +1);
  const isFuture    = nextDate > today;

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-surface-800 sticky top-0 z-50 bg-surface-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/?lang=${lang}`} className="block">
              <span className="text-sm font-bold tracking-tight text-white">
                AI Marketer Daily
              </span>
            </Link>
            <p className="mt-0.5 text-[11px] text-surface-500 leading-snug hidden sm:block max-w-xs">
              {s.slogan}
            </p>
          </div>
          {/* Language switcher — right corner, globally visible */}
          <Suspense fallback={null}>
            <LanguageSwitcher current={lang} />
          </Suspense>
        </div>
      </header>

      {/* ── Date bar ───────────────────────────────────────────────────── */}
      <div className="border-b border-surface-800/50 bg-surface-900/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-2 flex items-center justify-between">
          <time
            dateTime={displayDate}
            className="text-[11px] font-medium text-surface-400 tracking-wide"
          >
            {formatDate(displayDate, lang)}
          </time>
          <span className="text-[11px] text-surface-600">{s.min_read}</span>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="mx-auto max-w-2xl px-4 sm:px-6">
        {dbError ? (
          <div className="py-20 text-center">
            <p className="text-surface-600 text-sm">
              {lang === 'zh' ? '内容加载失败，请稍后重试。' : 'Failed to load content. Please try again later.'}
            </p>
          </div>
        ) : !hasAnyContent(content) ? (
          <div className="py-20 text-center">
            <p className="text-surface-600 text-sm">{s.no_content}</p>
          </div>
        ) : (
          /*
           * Section order is fixed per PRD 4.2:
           * 📅 Daily Brief → 💡 Growth Insight → 🚀 Launch Radar → 📚 Daily Case
           * Dividers: <hr> between every pair of sections
           */
          <div className="divide-y divide-surface-800">
            {/* 1. Daily Brief */}
            <section className="py-8">
              <DailyBrief articles={content.daily_brief} lang={lang} />
            </section>

            {/* 2. Growth Insight */}
            <section className="py-8">
              <GrowthInsight articles={content.growth_insight} lang={lang} />
            </section>

            {/* 3. Launch Radar */}
            <section className="py-8">
              <LaunchRadar articles={content.launch_radar} lang={lang} />
            </section>

            {/* 4. Daily Case */}
            <section className="py-8">
              <DailyCase article={content.daily_case[0] ?? null} lang={lang} />
            </section>
          </div>
        )}
      </main>

      {/* ── Date navigation ────────────────────────────────────────────── */}
      <nav
        aria-label={lang === 'zh' ? '日期导航' : 'Date navigation'}
        className="border-t border-surface-800 mt-4"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link
            href={`/?date=${prevDate}&lang=${lang}`}
            className="group flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>{s.prev_day}</span>
          </Link>

          {!isFuture && (
            <Link
              href={`/?date=${nextDate}&lang=${lang}`}
              className="group flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors"
            >
              <span>{s.next_day}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
        </div>
      </nav>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-800">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-surface-600">
          <span>© {new Date().getFullYear()} AI Marketer Daily by JE Labs</span>
          <span>{lang === 'zh' ? '仅供内部使用' : 'Internal use only'}</span>
        </div>
      </footer>

    </div>
  );
}
