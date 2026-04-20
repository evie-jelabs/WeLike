import type { Article, Lang } from '@/lib/types';

interface Props {
  article: Article | null;
  lang: Lang;
}

export default function DailyCase({ article, lang }: Props) {
  if (!article) return null;

  const title   = lang === 'zh' ? article.title_zh   : article.title_en;
  const content = lang === 'zh' ? article.content_zh : article.content_en;
  const soWhat  = lang === 'zh' ? article.so_what_zh : article.so_what_en;

  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-5">
        📚 {lang === 'zh' ? '案例拆解' : 'Daily Case'}
      </h2>
      <article className="rounded-xl bg-gradient-to-br from-surface-900 to-brand-500/5 border border-brand-500/20 p-7">
        <h3 className="text-lg font-bold text-white leading-snug mb-4">{title}</h3>
        <p className="text-sm text-surface-300 leading-relaxed mb-5">{content}</p>
        {soWhat && (
          <div className="rounded-lg bg-brand-500/10 border border-brand-500/30 px-5 py-4">
            <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1">
              {lang === 'zh' ? '所以呢' : 'So what'}
            </p>
            <p className="text-sm text-surface-200 leading-relaxed">{soWhat}</p>
          </div>
        )}
        {article.sources.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {article.sources.map((src) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-surface-500 hover:text-brand-500 transition-colors"
              >
                ↗ Source
              </a>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
