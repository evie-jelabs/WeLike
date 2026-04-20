import type { Article, Lang } from '@/lib/types';

interface Props {
  articles: Article[];
  lang: Lang;
}

export default function DailyBrief({ articles, lang }: Props) {
  if (!articles.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-5">
        📰 {lang === 'zh' ? '每日要闻' : 'Daily Brief'}
      </h2>
      <div className="space-y-5">
        {articles.map((a, i) => {
          const title   = lang === 'zh' ? a.title_zh   : a.title_en;
          const content = lang === 'zh' ? a.content_zh : a.content_en;
          const soWhat  = lang === 'zh' ? a.so_what_zh : a.so_what_en;

          return (
            <article
              key={a.id}
              className="border-l-2 border-surface-800 pl-4 hover:border-brand-500/50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white leading-snug mb-1.5">
                <span className="text-surface-600 mr-1.5">{i + 1}.</span>
                {title}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed">{content}</p>
              {soWhat && (
                <p className="mt-2 text-xs text-brand-500/80">
                  <span className="font-bold">
                    {lang === 'zh' ? '所以呢：' : 'So what: '}
                  </span>
                  {soWhat}
                </p>
              )}
              {a.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.sources.map((src) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-surface-600 hover:text-brand-500 transition-colors"
                    >
                      ↗ Source
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
