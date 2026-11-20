// Rate limiting for the contact form.
//
// Counts are kept in Netlify Blobs so they survive across function instances.
// If Blobs is unavailable (e.g. `next dev` without `netlify dev`), it falls
// back to an in-memory map, which only protects a single warm instance.
//
// IP addresses are never stored: only a salted SHA-256 hash, kept for 24 h.

import { createHash } from 'node:crypto'
import { connectLambda, getStore } from '@netlify/blobs'

// Per visitor (hashed IP).
const SHORT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const SHORT_LIMIT = 3
const DAY_MS = 24 * 60 * 60 * 1000
const DAY_LIMIT = 8

// Whole site — a backstop so a botnet can't burn through the SES quota.
const GLOBAL_DAY_LIMIT = 60

type LambdaEvent = Parameters<typeof connectLambda>[0]
type Store = {
  get(key: string): Promise<number[] | null>
  set(key: string, value: number[]): Promise<void>
}

const memory = new Map<string, number[]>()
const memoryStore: Store = {
  async get(key) {
    return memory.get(key) ?? null
  },
  async set(key, value) {
    memory.set(key, value)
  },
}

function openStore(event: LambdaEvent): Store {
  try {
    connectLambda(event)
    const blobs = getStore({ name: 'contact-rate-limit', consistency: 'strong' })
    return {
      async get(key) {
        return ((await blobs.get(key, { type: 'json' })) as number[] | null) ?? null
      },
      async set(key, value) {
        await blobs.setJSON(key, value)
      },
    }
  } catch {
    return memoryStore
  }
}

function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT || 'brehaut-contact'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

export function clientIp(headers: Record<string, string | undefined>) {
  return (
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown'
  )
}

// Returns true if this submission is allowed, and records it.
export async function allowSubmission(event: LambdaEvent, ip: string): Promise<boolean> {
  const now = Date.now()
  let store = openStore(event)

  const visitorKey = `ip-${hashIp(ip)}`
  const globalKey = `global-${new Date(now).toISOString().slice(0, 10)}`

  let visitor: number[]
  let global: number[]
  try {
    ;[visitor, global] = await Promise.all([
      store.get(visitorKey).then((v) => v ?? []),
      store.get(globalKey).then((v) => v ?? []),
    ])
  } catch {
    // Blobs configured but unreachable — don't block real enquiries over it.
    store = memoryStore
    visitor = (await store.get(visitorKey)) ?? []
    global = (await store.get(globalKey)) ?? []
  }

  visitor = visitor.filter((t) => now - t < DAY_MS)
  const recent = visitor.filter((t) => now - t < SHORT_WINDOW_MS)

  if (
    recent.length >= SHORT_LIMIT ||
    visitor.length >= DAY_LIMIT ||
    global.length >= GLOBAL_DAY_LIMIT
  ) {
    return false
  }

  try {
    await Promise.all([
      store.set(visitorKey, [...visitor, now]),
      store.set(globalKey, [...global, now]),
    ])
  } catch (error) {
    console.error('rate limit write failed:', error)
  }
  return true
}
