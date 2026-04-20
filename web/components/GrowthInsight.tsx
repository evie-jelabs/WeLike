import type { Article, Lang } from '@/lib/types';

interface Props {
  articles: Article[];
  lang: Lang;
}

export default function GrowthInsight({ articles, lang }: Props) {
  const offDay = lang === 'zh' ? '今日休刊，明天见。' : 'Day off — back tomorrow.';

  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-5">
        💡 {lang === 'zh' ? '增长洞察' : 'Growth Insight'}
      </h2>

      {articles.length === 0 ? (
        <p className="text-sm text-surface-600 italic">{offDay}</p>
      ) : (
        <div className="space-y-6">
          {articles.map((a) => {
            const title   = lang === 'zh' ? a.title_zh   : a.title_en;
            const content = lang === 'zh' ? a.content_zh : a.content_en;
            const soWhat  = lang === 'zh' ? a.so_what_zh : a.so_what_en;

            return (
              <article
                key={a.id}
                className="rounded-xl bg-surface-900 border border-surface-800 p-6 hover:border-brand-500/30 transition-colors"
              >
                <h3 className="text-base font-semibold text-white leading-snug mb-3">
                  {title}
                </h3>
                <p className="text-sm text-surface-400 leading-relaxed mb-4">{content}</p>
                {soWhat && (
                  <div className="rounded-lg bg-brand-500/5 border border-brand-500/20 px-4 py-3">
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                      {lang === 'zh' ? '所以呢' : 'So what'}
                    </span>
                    <p className="mt-1 text-sm text-surface-300">{soWhat}</p>
                  </div>
                )}
                {a.sources.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
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
      )}
    </section>
  );
}
