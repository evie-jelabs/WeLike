import type { Lang } from '../../shared/types/index.js';

export type { Lang };

export function detectLang(acceptLanguage?: string | null): Lang {
  if (!acceptLanguage) return 'en';
  return acceptLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function parseLangParam(param?: string | string[] | null): Lang | null {
  const val = Array.isArray(param) ? param[0] : param;
  if (val === 'zh' || val === 'en') return val;
  return null;
}

export const SECTION_LABELS: Record<string, { en: string; zh: string; emoji: string }> = {
  daily_brief:    { en: 'Daily Brief',     zh: '每日要闻',   emoji: '📰' },
  growth_insight: { en: 'Growth Insight',  zh: '增长洞察',   emoji: '📈' },
  launch_radar:   { en: 'Launch Radar',    zh: '发布雷达',   emoji: '🚀' },
  daily_case:     { en: 'Daily Case',      zh: '案例拆解',   emoji: '🔍' },
};

export const UI_STRINGS = {
  en: {
    today: 'Today',
    archive: 'Archive',
    so_what: 'So what',
    no_content: 'No content published today.',
    off_day: 'Day off — back tomorrow.',
    loading: 'Loading...',
  },
  zh: {
    today: '今日',
    archive: '历史归档',
    so_what: '所以呢',
    no_content: '今日暂无发布内容。',
    off_day: '今日休刊，明天见。',
    loading: '加载中…',
  },
} as const;
