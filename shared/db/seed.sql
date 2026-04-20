-- Seed: sample articles for local development
INSERT INTO articles (date, section, order_in_section, title_en, title_zh, content_en, content_zh, so_what_en, so_what_zh, sources, published_at)
VALUES
  (CURRENT_DATE, 'daily_brief', 1,
   'Anthropic releases Claude 4 Opus with extended context',
   'Anthropic 发布 Claude 4 Opus，支持超长上下文',
   'Anthropic has released Claude 4 Opus featuring a 1M token context window and improved reasoning capabilities.',
   'Anthropic 发布 Claude 4 Opus，新增 100 万 token 上下文窗口，推理能力显著提升。',
   'For AI product teams, this unlocks full-codebase analysis and long-document workflows without chunking.',
   '对 AI 产品团队而言，这意味着无需分块即可处理完整代码库和长文档工作流。',
   '["https://anthropic.com/news"]', NOW()),

  (CURRENT_DATE, 'growth_insight', 1,
   'How Linear grew to $35M ARR with zero outbound sales',
   'Linear 如何在零外销的情况下增长至 3500 万美元 ARR',
   'Linear''s PLG playbook: frictionless onboarding, viral team invites, and a product so good users evangelize it.',
   'Linear 的 PLG 策略：无摩擦入职、病毒式团队邀请，以及让用户自愿传播的卓越产品体验。',
   'The key lever: make the free tier genuinely useful so teams onboard themselves.',
   '关键杠杆：让免费版真正好用，团队自然完成入职。',
   '["https://linear.app/blog"]', NOW()),

  (CURRENT_DATE, 'launch_radar', 1,
   'Cursor 1.0 — AI-native IDE exits beta',
   'Cursor 1.0 正式发布，AI 原生 IDE 退出 Beta',
   'Cursor ships 1.0 with multi-file edit, background agents, and SOC 2 Type II compliance.',
   'Cursor 正式发布 1.0，支持多文件编辑、后台 Agent 和 SOC 2 Type II 合规认证。',
   NULL, NULL,
   '["https://cursor.com/blog/cursor-1-0"]', NOW()),

  (CURRENT_DATE, 'daily_case', 1,
   'Perplexity''s growth from 0 to 10M DAU in 18 months',
   'Perplexity：18 个月从 0 增长至 1000 万日活',
   'A breakdown of how Perplexity used SEO arbitrage, API partnerships, and aggressive iteration to grow 10x YoY.',
   '深度拆解 Perplexity 如何利用 SEO 套利、API 合作和高频迭代实现年增长 10 倍。',
   'The underrated move: launching a free API tier that made developers build and share Perplexity-powered tools.',
   '被低估的关键动作：推出免费 API，让开发者构建并传播基于 Perplexity 的工具。',
   '["https://blog.perplexity.ai"]', NOW());
