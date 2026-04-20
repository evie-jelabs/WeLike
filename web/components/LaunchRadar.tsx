import type { Article, Lang } from '@/lib/types';

interface Props {
  articles: Article[];
  lang: Lang;
}

export default function LaunchRadar({ articles, lang }: Props) {
  if (!articles.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-5">
        🚀 {lang === 'zh' ? '发布雷达' : 'Launch Radar'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((a) => {
          const title   = lang === 'zh' ? a.title_zh   : a.title_en;
          const content = lang === 'zh' ? a.content_zh : a.content_en;

          return (
            <article
              key={a.id}
              className="rounded-xl bg-surface-900 border border-surface-800 p-5 hover:border-brand-500/30 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white leading-snug mb-2">{title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{content}</p>
              {a.sources[0] && (
                <a
                  href={a.sources[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 transition-colors"
                >
                  {lang === 'zh' ? '了解更多' : 'Learn more'} →
                </a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
