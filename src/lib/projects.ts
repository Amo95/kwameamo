// Every project, in the order the Projects page shows them. Those with a slug can be named on the home page.
export interface Project {
  slug?: string;
  title: string;
  /** One line under the title in the details: what it is and what it's built with. */
  kind?: string;
  /** One sentence for the hover preview and the Projects list. */
  short?: string;
  /** What kind of thing it is, for the Projects list. */
  tag?: string;
  description: string;
  tech: string[];
  features?: string[];
  /** Left out for private work: the details say so instead of linking. */
  link?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    slug: "oncall",
    tag: "Product",
    title: "Oncall",
    kind: "Product · Spring Boot and Next.js",
    short: "On-call and incident management for teams in Africa.",
    description:
      "An SMS-first on-call and incident platform. Every alert lands in one place, pages reach any phone (even on 2G), and escalation keeps going until someone answers. Multi-tenant, built from scratch to production patterns.",
    tech: ["Java 21", "Spring Boot", "PostgreSQL", "Redis", "Temporal", "Next.js", "TypeScript"],
    features: [
      "Schedules, rotations and escalation that survives restarts (Temporal)",
      "SMS pages with one-tap acknowledge links, plus Slack and Telegram",
      "Alerts from Grafana or any tool that can send a webhook",
      "Health checks, public status pages and a developer API",
    ],
    link: "https://oncallhubs.com",
    image: "/projects/oncall.jpg",
  },
  {
    slug: "swipefile",
    tag: "Tool",
    title: "Swipe File",
    kind: "Design study tool · Next.js",
    short: "Turns designers' posts on X into design breakdowns.",
    description:
      "Follow the UI and UX designers you like on X. Every time they post, Swipe File pulls the post in, saves the images, splits videos into key frames, and writes a design breakdown to study: layout, type, colour, motion, and ideas worth stealing.",
    tech: ["Next.js", "TypeScript", "SQLite", "ffmpeg", "Claude API", "X API"],
    features: [
      "New posts from the designers you follow, pulled in on a schedule",
      "Videos split into key frames with ffmpeg",
      "A written breakdown of every post, plus your own notes",
      "Search and tags across everyone you follow",
    ],
    image: "/projects/swipefile.jpg",
  },
  {
    slug: "devkit",
    tag: "Tool",
    title: "dev-kit",
    kind: "Developer tooling · Claude Code plugin",
    short: "My Claude Code setup, installable on any machine.",
    description:
      "The skills and agents I use in every project, packaged as a Claude Code plugin: mapping a new codebase, designing UI with references and a mockup first, building agreed changes with tests, and reviewing them for security.",
    tech: ["Claude Code", "Skills", "Agents", "Shell"],
    features: [
      "/explore-codebase: map a repo and trace its flows end to end",
      "/ui-design: references first, a mockup before code",
      "Implementer and security reviewer agents",
      "Motion and polish skills from Emil Kowalski (MIT)",
    ],
    image: "/projects/devkit.jpg",
  },
  {
    slug: "showup",
    tag: "Mobile app",
    title: "ShowUp",
    kind: "Mobile app · Flutter",
    short: "A habit tracker that checks you in when you arrive.",
    description:
      "A location-based habit tracker that rewards you for showing up. Uses geofencing to automatically check you in when you arrive at a place, like the gym, church or library, rather than logging specific activities. Built around the idea that consistency matters more than performance.",
    tech: ["Flutter", "Dart", "Supabase", "Riverpod", "Isar", "Geofencing"],
    features: [
      "Geofence-based automatic check-ins at saved locations",
      "GitHub-style contribution grid for streak and consistency visualization",
      "Carousel-style onboarding with Supabase authentication",
      "Offline-first with Isar local storage",
    ],
    link: "https://showuppp.app",
    image: "/projects/showup.webp",
  },
  {
    slug: "supawake",
    tag: "CLI",
    title: "SupaWake",
    kind: "Developer tool · Node.js",
    short: "Keeps free Supabase databases from pausing.",
    description:
      "A lightweight CLI tool that prevents Supabase free-tier databases from auto-pausing due to inactivity. Automatically pings your projects on a configurable schedule, with support for multi-project management and failure notifications.",
    tech: ["Node.js", "GitHub Actions", "Slack", "Discord"],
    features: [
      "Scheduled pinging with customizable cron intervals (default: every 3 days)",
      "Multi-project management from a single configuration",
      "Failure notifications via Slack, Discord, or ntfy.sh",
      "GitHub Actions workflow templates for free serverless scheduling",
    ],
    link: "https://amo95.github.io/supawake/",
    image: "/projects/supawake.webp",
  },
  {
    slug: "invoica",
    tag: "Web app",
    title: "Invoica",
    kind: "Web app · Next.js",
    short: "Invoices for freelancers, no account needed.",
    description:
      "A web-based invoicing tool for freelancers and small businesses. Create professional invoices, preview and download as PDF, customize designs, and send directly. No account required.",
    tech: ["Next.js", "React", "TypeScript", "Vercel"],
    features: [
      "Multi-currency support (USD, GHS, EUR, GBP, NGN and more)",
      "PDF generation with live preview and direct download",
      "Customizable color schemes and invoice layouts",
      "Guest mode: no registration required to create invoices",
    ],
    link: "https://invoica-livid.vercel.app/",
    image: "/projects/invoica.webp",
  },
  {
    slug: "spiidi",
    tag: "Client",
    title: "Spiidi AI",
    kind: "Client product · end to end",
    short: "An AI tutor, built end to end for a client.",
    description:
      "A full-stack AI-powered educational chat platform built end-to-end for a client: logo, UI design, marketing website, backend API, database, and mobile app. Uses Spring AI with Claude as the core chat model, Wolfram Alpha as an autonomous tool for computation, and OpenAI for voice features.",
    tech: [
      "Spring Boot 4.0.1",
      "Spring AI",
      "Java 21",
      "PostgreSQL",
      "React",
      "Expo / React Native",
      "Claude AI",
      "Wolfram Alpha",
      "OpenAI",
      "Stripe",
      "Supabase",
    ],
    features: [
      "End-to-end product delivery: logo, UI design, website, API, and mobile app",
      "Spring AI ChatClient with Claude, Wolfram Alpha tool use, and conversation memory",
      "Multimodal chat with image and PDF attachments via Supabase storage",
      "Voice input (speech-to-text) and text-to-speech with streaming audio",
      "Subscription tiers with Stripe, usage limits, and gamification system",
      "Anonymous trial chat with IP-based rate limiting and session transfer on signup",
    ],
    link: "https://spiidi.ai",
    image: "/projects/spiidi.webp",
  },
  {
    title: "Logiciel Loans - WhatsApp Flow Integration",
    tag: "Client",
    short: "Apply for and manage loans through WhatsApp.",
    description:
      "WhatsApp Flow integration for loan management API, enabling customers to apply for and manage loans through WhatsApp's conversational interface.",
    tech: ["Spring Boot", "WhatsApp Business API", "PostgreSQL"],
    features: [
      "WhatsApp Flow implementation for loan applications",
      "Loan management API endpoints",
      "Integration with existing loan processing system",
      "Automated notifications and status updates via WhatsApp",
    ],
  },
  {
    title: "Anyigba Land Security Platform",
    tag: "Product",
    short: "Property verification against land fraud in Ghana.",
    description:
      "A property verification system addressing land fraud in Ghana's real estate sector. Provides secure document management, role-based access control, and automated workflows for property transactions.",
    tech: ["Spring Boot", "PostgreSQL", "React", "Railway"],
    features: [
      "JWT authentication with role-based access control",
      "Event-driven notifications for transaction updates",
      "State machine workflows for multi-step verification processes",
      "RESTful API serving both web and mobile clients",
    ],
    link: "https://anyigba.co",
  },
  {
    title: "cedAI",
    tag: "Mobile app",
    short: "Banknote recognition for visually impaired users.",
    description:
      "A mobile currency recognition application designed to help visually impaired users identify banknotes. Developed as a final year thesis project, achieving 99.5% mAP50 accuracy.",
    tech: ["Flutter", "TensorFlow Lite", "YOLO", "Dart"],
    features: [
      "Real-time banknote detection using device camera",
      "Offline inference with TensorFlow Lite models",
      "Audio feedback for accessibility",
      "Trained on custom dataset of Ghanaian banknotes",
    ],
    link: "https://github.com/cedai-gh/MOBILE-DEV",
  },
  {
    title: "GMoney Middleware",
    tag: "Client",
    short: "Payments across providers in Ghana.",
    description:
      "A payment orchestration layer powering peer-to-peer transfers, bank-to-wallet flows, and interbank settlements across multiple payment providers in Ghana.",
    tech: ["Java", "Spring Boot", "AWS", "PostgreSQL", "CloudWatch"],
    features: [
      "Mastercard and Brij API integrations for inbound and outbound calls",
      "GhIPSS interoperability for cross-bank transfers",
      "Loyalty points system for transaction rewards",
      "Production observability with AWS CloudWatch dashboards",
    ],
  },
];

export function projectBySlug(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`No project with slug ${slug}`);
  return project;
}
