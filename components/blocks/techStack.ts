import type { TechItem } from '@/components/blocks/BlocksTechCarousel'

// Local SVGs for logos that break or are missing on the CDN.
const LOCAL: Record<string, string> = {
  aws: '/media/tech/amazonwebservices.svg',
  azure: '/media/tech/azure.svg',
  openai: '/media/tech/openai.svg',
  googleanalytics: '/media/tech/googleanalytics.svg',
  googleads: '/media/tech/googleads.svg',
}

export const WEB_TECH_STACK: TechItem[] = [
  { name: 'AWS', src: LOCAL.aws },
  { name: 'Azure', src: LOCAL.azure },
  { name: 'Google Cloud', icon: 'googlecloud' },
  { name: 'Netlify', icon: 'netlify' },
  { name: 'Neon', icon: 'neon' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Docker', icon: 'docker' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Python', icon: 'python' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'React', icon: 'react' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'Prisma', icon: 'prisma' },
  { name: 'OpenAI', src: LOCAL.openai },
  { name: 'LangChain', icon: 'langchain' },
  { name: 'Sentry', icon: 'sentry' },
  { name: 'Stripe', icon: 'stripe' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Google Analytics', src: LOCAL.googleanalytics },
  { name: 'Google Ads', src: LOCAL.googleads },
  { name: 'Meta Ads', icon: 'meta' },
]
