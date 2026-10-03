// All site content lives here. Optional fields are hidden in the UI until you fill them in.
/** Resolves a /public file against the deploy base path (Pages serves from /portfolio/). */
export const asset = (path: string) => import.meta.env.BASE_URL + path

export interface Project {
  name: string
  type: string
  year?: string
  role?: string
  stack: string[]
  link: string
  image?: string
  gallery?: { src: string; caption: string }[]
  desc: string
  challenge?: string
  solution?: string
  result?: string
  arch: string[]
}

export const PROJECTS: Project[] = [
  { name: 'PriceOye', type: 'E-commerce', year: '2024 — Present', role: 'Software Engineer · full-stack',
    stack: ['Laravel', 'Vue.js', 'Pinia', 'MySQL', 'Elasticsearch', 'Docker'], link: 'https://priceoye.pk/', image: asset('projects/priceoye.jpg'),
    desc: 'Full-stack product work on an e-commerce platform for mobile phones and electronics: workflows, administration systems, legacy modernization and performance.',
    challenge: 'E-commerce workflows and administration systems need to keep evolving while the codebase stays maintainable, reusable and responsive.',
    solution: 'Modernized Laravel modules with object-oriented design and reusable abstractions. Migrated the Cart from Blade to Vue.js with Pinia, solely owned the Delivery Charges Module, contributed to the approval and audit system, and optimized JSON processing, SQL, caching, queues and Elasticsearch relevance. Also worked on payment gateway integrations, integrated external apps and APIs such as WaadaInsurance, and contributed to the Laravel 10 → 11 migration while keeping production stable with zero downtime.',
    result: 'More reusable frontend and backend building blocks, traceable admin changes through approval and audit records, and a clearer base for ongoing performance and modernization work.',
    arch: ['Vue cart · Pinia', 'Laravel API', 'Services & repositories', 'MySQL · Redis · Elasticsearch', 'Queues · Schedules · 3PL APIs'] },
  { name: 'SheenPay', type: 'BNPL fintech', year: '2024 — 2025', role: 'Full-stack engineer · sole frontend owner',
    stack: ['Laravel', 'Vue.js', 'MySQL', 'REST APIs', 'AWS SES', 'SendGrid'], link: 'https://sheenpay.pk/', image: asset('projects/sheenpay.jpg'),
    desc: 'A Shariah-compliant buy-now-pay-later platform serving web, Android and external application integrations.',
    challenge: 'Customer flows had to be configurable, payment and installment operations dependable, and communications managed by admins without hardcoded frontend structures.',
    solution: 'Involved from research and architecture planning. Solely owned the frontend, including multi-step forms rendered from backend-managed fields, steps and ordering, and the Email Module with WYSIWYG editing, live preview, template testing and SES/SendGrid switching. Contributed to APIs, payment idempotency and gateway integrations.',
    result: 'Admin-configurable form workflows, a provider-agnostic email capability, and integration-ready API and payment foundations.',
    arch: ['Config-driven forms', 'Laravel API', 'Installment workflows', 'Idempotency · MySQL', 'Gateways · SES / SendGrid'] },
  { name: 'Social Desk', type: 'AI · internal PriceOye tool', year: '2025 — 2026', role: 'Full-stack engineer · AI & RAG',
    stack: ['Laravel', 'RAG', 'Embeddings', 'Meta APIs', 'Queues', 'Docker'], link: '',
    desc: 'An internal AI platform for PriceOye that reads and answers Facebook and Instagram comments and inbox messages.',
    challenge: 'Replies had to draw on the right knowledge, handle public comments and private DMs differently, and stay dependable under real customer traffic. A wrong or duplicate reply in public is worse than no reply.',
    solution: 'Designed the knowledge-base architecture and the RAG pipeline: embeddings, retrieval, intent detection and ranking, with confidence guards that hold back a reply when the match is weak. Centralized reply generation, built separate workflows for DMs and public channels, hardened the Meta integrations, and added inbox filtering and pagination, notifications and admin tooling. Queue jobs got retry/backoff and duplicate-comment protection, and I added logging and monitoring so we can see why the AI answered the way it did.',
    result: 'A foundation for automated replies with better retrieval, clear AI diagnostics, and integrations that are easier to observe and debug.',
    arch: ['Meta webhooks', 'Queue workers', 'Intent detection', 'Retrieval · ranking', 'Confidence guard', 'Reply generation'] },
  { name: 'TransPro Alliance', type: 'Multi-tenant SaaS CRM', role: 'Lead · architecture to production',
    stack: ['Laravel', 'React', 'Inertia.js', 'MySQL', 'Redis', 'CQRS'], link: 'https://crm.transproalliance.com/', image: asset('projects/transpro-crm.png'),
    gallery: [
      { src: asset('projects/transpro-admin.png'), caption: 'Admin panel sign-in, on its own subdomain' },
      { src: asset('projects/transpro-tenant.png'), caption: 'Tenant sign-in, scoped to one organization by subdomain' },
      { src: asset('projects/transpro-redis.png'), caption: 'Redis and queue monitoring in the admin panel' },
    ],
    desc: 'A multi-tenant CRM covering customers, leads, sales pipeline, reporting dashboards and automated workflows.',
    challenge: 'Each tenant needed strict data isolation and good performance, inside one codebase that stays maintainable.',
    solution: 'Led the full lifecycle. Database-per-tenant isolation with Spatie Multi-tenancy, sharding, tenant-aware middleware and subdomain routing; CQRS and DDD for the core; React with Inertia on the frontend; Redis for caching and queues. Also owned servers, deployment pipelines and monitoring.',
    arch: ['Subdomain routing', 'Tenant-aware middleware', 'CQRS commands & queries', 'Database per tenant', 'Redis cache & queues'] },
  { name: 'Echo', type: 'Customer engagement · internal PriceOye tool', year: '2026 — Ongoing', role: 'Full-stack engineer',
    stack: ['Laravel', 'Vue.js', 'PostgreSQL', 'Redis', 'Queues'], link: '',
    desc: 'An internal customer-engagement platform in ongoing development for PriceOye.',
    challenge: 'PriceOye needs one shared place to track customer activity and reach customers across channels.',
    solution: 'Contributing across research, planning, system architecture, documentation, frontend, backend and APIs. The platform takes in customer events, builds profiles and segments, and runs journeys and campaigns across channels.',
    result: 'Ongoing. Production outcomes and internal details are not published.',
    arch: ['Event ingestion', 'Customer profiles', 'Segments', 'Journeys · campaigns', 'Channels'] },
  { name: 'Vendor Incentive & Rebate', type: 'Admin · internal PriceOye tool', role: 'Design and implementation',
    stack: ['Laravel 11', 'MySQL'], link: '',
    desc: "A module in PriceOye's legacy admin system for tracking vendor incentives and rebates.",
    challenge: 'Incentives come from principals, distributors and vendors, and have to be allocated correctly against invoices and stock, inside an existing legacy system.',
    solution: 'Designed the data model and built the module on Laravel 11 and MySQL, integrated with the existing invoice, payment and ledger flows.',
    result: 'Internal. Details are not published.',
    arch: ['Incentive agreements', 'Invoice allocation', 'Net cost', 'Ledger integration'] },
  { name: 'Breaker19', type: 'Logistics · carrier portal', role: 'REST APIs, backend & Vue portal',
    stack: ['Vue.js', 'PostgreSQL', 'DynamoDB', 'AWS', 'Auth0'], link: 'https://www.breaker19.app/', image: asset('projects/breaker19.jpg'),
    desc: 'A carrier portal for oilfield hotshot and trucking, working much like ride-hailing for loads.',
    solution: 'Built RESTful APIs and backend functionality documented with Swagger, integrated Auth0 and the Turvo API, and built the carrier portal website in Vue.js.',
    arch: ['Vue carrier portal', 'REST API · Swagger', 'Auth0', 'PostgreSQL · DynamoDB', 'AWS SES · S3 · Turvo'] },
  { name: 'IQ Pages', type: 'Marketing · advertising',
    stack: ['Laravel', 'Vue.js', 'Inertia.js', 'MySQL', 'PayPal'], link: 'https://iqpages.com/', image: asset('projects/iq-pages.jpg'),
    desc: 'A business directory combined with email, deal-of-the-day and online advertising.',
    arch: ['Vue · Inertia', 'Laravel', 'MySQL', 'PayPal', 'Laravel Forge'] },
  { name: 'Data Transfer Object', type: 'Open-source package', role: 'Author',
    stack: ['PHP', 'Laravel', 'OOP', 'Factory pattern'], link: 'https://github.com/saleem189/data-transfer-object', image: asset('projects/data-transfer-object.jpg'),
    desc: 'A Laravel package for handling Data Transfer Objects, with easy property access and conversion to JSON or arrays.',
    arch: ['Request / array', 'DTO', 'Typed property access', 'JSON · Array'] },
]

export const CATS: [string, string][] = [
  ['All', "Everything here I've used on real projects, not just tutorials."],
  ['Backend', 'Laravel and PHP are where I spend most of my time: services, jobs, observers, scheduled tasks and APIs.'],
  ['Frontend', 'Mostly Vue with Pinia or Inertia. Blade where it makes sense, and some React on TransPro.'],
  ['Data', 'MySQL and PostgreSQL day to day, Redis for cache and queues, Elasticsearch for product search at PriceOye.'],
  ['APIs', 'REST APIs documented in Swagger, plus payment gateways, Meta, logistics and email providers.'],
  ['Infrastructure', 'Docker for local and production parity, AWS (EC2, S3, SES, DynamoDB), and Linux servers running Nginx and Supervisor.'],
  ['Performance', 'Query tuning, indexing, smaller payloads and caching. I check before changing anything.'],
  ['Architecture', 'Services, repositories, factories and some DDD and CQRS where the domain is complex enough to need them.'],
  ['AI', 'RAG and embeddings on Social Desk. I also use Cursor and Claude Code daily, and review what they write.'],
]

export const TAGS = ([
  ['Laravel', 'Backend'], ['PHP', 'Backend'], ['Queues', 'Backend Performance'], ['Observers & Schedules', 'Backend'], ['Laravel WebSockets', 'Backend APIs'], ['Background jobs', 'Backend'],
  ['Vue.js', 'Frontend'], ['Pinia', 'Frontend'], ['Inertia.js', 'Frontend Backend'], ['Blade', 'Frontend'], ['JavaScript', 'Frontend'], ['React', 'Frontend'],
  ['MySQL', 'Data'], ['PostgreSQL', 'Data'], ['Redis', 'Data Performance'], ['Elasticsearch', 'Data Performance'], ['SQL optimization', 'Data Performance'], ['Database design', 'Data Architecture'],
  ['RESTful APIs', 'APIs Backend'], ['Swagger / OpenAPI', 'APIs'], ['Payment integrations', 'APIs'], ['BNPL · installments', 'APIs'], ['AWS SES · SendGrid', 'APIs Infrastructure'], ['Third-party integrations', 'APIs'], ['Meta / Instagram APIs', 'APIs AI'],
  ['Docker', 'Infrastructure'], ['AWS (EC2 · S3 · SES · DynamoDB)', 'Infrastructure'], ['Supervisor', 'Infrastructure'], ['Apache', 'Infrastructure'], ['Nginx', 'Infrastructure Performance'], ['Linux', 'Infrastructure'], ['GitHub / GitLab', 'Infrastructure'],
  ['Caching', 'Performance'], ['Web Vitals', 'Performance Frontend'],
  ['System architecture', 'Architecture'], ['SOLID & OOP', 'Architecture'], ['Design patterns', 'Architecture'], ['Domain-driven design', 'Architecture'], ['Event-driven systems', 'Architecture Backend'], ['Idempotency', 'Architecture APIs'], ['Legacy modernization', 'Architecture Performance'],
  ['RAG', 'AI'], ['Embeddings', 'AI Data'], ['Intent detection', 'AI'], ['Prompt engineering', 'AI'], ['Cursor · Claude Code', 'AI'],
] as [string, string][]).map(([name, c]) => ({ name, c: c.split(' ') }))

export const LAYERS = [
  { name: 'Client', tech: 'Vue · React · Blade', lives: 'Storefronts, dashboards and admin panels. What people actually click on.', watch: ['Loading states and page speed', 'Accessible, predictable interactions', 'Keeping business rules out of the UI'] },
  { name: 'API edge', tech: 'Routing · Auth · Limits', lives: 'Routes, auth and validation. Bad input should stop here.', watch: ['Validation at the boundary', 'Authentication and authorization', 'Versioning without breaking clients'] },
  { name: 'Application services', tech: 'Use cases · Orchestration', lives: 'Where a request becomes a business action: place an order, sync stock, issue a refund.', watch: ['One clear entry point per use case', 'Transactions and idempotency', 'Moving slow work onto queues'] },
  { name: 'Domain logic', tech: 'Rules · Models · Invariants', lives: 'Business rules like delivery charges or installment schedules, kept out of controllers.', watch: ['Invariants enforced in one place', 'Explicit states instead of boolean flags', 'Testable without HTTP or a database'] },
  { name: 'Data · Cache · Queue', tech: 'MySQL · PostgreSQL · Redis', lives: 'Tables, the cache in front of them, and the queues that take slow work off the request.', watch: ['Indexes that match real queries', 'Cache invalidation you can explain', 'Migrations safe to run on live data'] },
  { name: 'External integrations', tech: 'Payments · Meta · SES', lives: 'Payment gateways, Meta, email and logistics APIs. They go down sometimes, so every call needs a plan for that.', watch: ['Timeouts, retries and circuit breakers', 'Webhook verification and replay', 'Logging every exchange for support'] },
]

export type Mode = 'request' | 'job'
export const PATHS: Record<Mode, number[]> = { request: [0, 1, 2, 3, 4, 3, 2, 1, 0], job: [2, 4, 2, 5, 2, 4] }
export const CAPTIONS: Record<Mode, string> = {
  request: 'A normal page load: down through each layer to the database and back.',
  job: 'Slow work like sending an email or calling a payment API goes on a queue instead.',
}

export const JOBS = [
  { when: 'Feb 2024 – Present', title: 'Software Engineer', org: 'PriceOye Technologies · Islamabad',
    summary: 'Modernizing a production e-commerce platform: refactoring tightly coupled legacy code into modular, object-oriented architecture and owning key commerce systems end to end.',
    points: ['Delivery Charges Module and an admin Approval & Audit System with before/after tracking', 'Cart rebuilt from Blade to Vue.js with Pinia state and reusable components', 'SQL tuning, payload reduction and Elasticsearch work for Web Vitals and search',
      'Payment gateway integrations and external app/API integrations, including WaadaInsurance', 'Laravel 10 → 11 migration with production kept stable and no downtime; Swagger/OpenAPI docs, queues, observers and caching'],
    stack: 'Laravel · Vue · Pinia · MySQL · Elasticsearch · Redis · Docker' },
  { when: 'Aug 2021 – Feb 2024', title: 'Software Engineer (PHP/Laravel)', org: 'Peek International · Rawalpindi',
    summary: 'Delivered full-stack applications with Laravel, Vue.js and Inertia.js, and designed the APIs used by distributed teams in the UK, Brazil and Bangladesh.',
    points: ['RESTful APIs architected and documented with Swagger', '3 full-stack applications delivered with teams in the UK, Brazil and Bangladesh', 'Real-time notifications and live data with Laravel WebSockets', 'Deployment automation through custom Artisan commands and internal packages', 'AWS infrastructure (EC2, S3, SES, DynamoDB) tuned with Nginx, Apache and Supervisor'],
    stack: 'Laravel · Vue · Inertia · WebSockets · AWS · Nginx' },
]

export const PRINCIPLES = [
  ['Readable beats clever.', 'Someone else will open this file next month. Quite often that someone is me.'],
  ['Measure, then optimize.', "Most slow pages I've fixed came down to one heavy query or an oversized JSON payload."],
  ['Log the things that break.', 'When a webhook fails at night, good logs are the difference between a fix and a guess.'],
  ['Keep it simple for as long as possible.', 'A service class and a queue job solve more problems than people expect.'],
  ['Leave the code a bit better.', 'Small refactors, done often, are how legacy code becomes manageable.'],
]

export const NAV = ['about', 'work', 'stack', 'systems', 'experience'] as const
export const EMAIL = 'saleemayoub1@gmail.com'
