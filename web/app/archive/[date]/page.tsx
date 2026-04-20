import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDailyContent } from '@/lib/db';
import { getCache, setCache, dailyKey, CACHE_TTL } from '@/lib/redis';
import { detectLang, parseLangParam } from '@/lib/i18n';
import Layout from '@/components/Layout';
import DailyBrief from '@/components/DailyBrief';
import GrowthInsight from '@/components/GrowthInsight';
import LaunchRadar from '@/components/LaunchRadar';
import DailyCase from '@/components/DailyCase';
import type { Lang, DailyContent } from '@/lib/types';

interface Props {
  params: { date: string };
  searchParams: { lang?: string };
}

export async function generateMetadata({ params, searchParams }: Props) {
  return {
    title: `AI Marketer Daily — ${params.date}`,
    description: `AI industry digest for ${params.date}`,
  };
}

export default async function ArchivePage({ params, searchParams }: Props) {
  const { date } = params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const headersList = headers();
  const acceptLang  = headersList.get('accept-language');
  const lang: Lang  = parseLangParam(searchParams.lang) ?? detectLang(acceptLang);

  const cacheKey = dailyKey(date);
  let content = await getCache<DailyContent>(cacheKey);
  if (!content) {
    content = await getDailyContent(date);
    await setCache(cacheKey, content, CACHE_TTL.archive);
  }

  const hasContent =
    content.daily_brief.length ||
    content.growth_insight.length ||
    content.launch_radar.length ||
    content.daily_case.length;

  if (!hasContent) notFound();

  return (
    <Layout lang={lang}>
      <p className="text-xs text-surface-600 mb-8">{date}</p>
      <DailyBrief    articles={content.daily_brief}    lang={lang} />
      <GrowthInsight articles={content.growth_insight} lang={lang} />
      <LaunchRadar   articles={content.launch_radar}   lang={lang} />
      <DailyCase     article={content.daily_case[0] ?? null} lang={lang} />
    </Layout>
  );
}
