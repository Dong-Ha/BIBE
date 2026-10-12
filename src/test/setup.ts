import '@testing-library/jest-dom/vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Tests exercise the same hashed publication files as production. Node reads
// them here only; application code continues to request them through fetch.
const publicationDir = resolve(process.cwd(), 'public/generated-content')
const publication = new Map<string, unknown>()
for (const filename of readdirSync(publicationDir).filter(name => name.endsWith('.json'))) {
  publication.set(filename, JSON.parse(readFileSync(resolve(publicationDir, filename), 'utf8')))
}

const publicationFetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input), 'http://localhost')
    const name = url.pathname.split('/').pop() ?? ''
    const data = publication.get(name)
    return data === undefined
      ? { ok: false, status: 404, json: async () => ({}) }
      : { ok: true, status: 200, json: async () => data }
  })
vi.stubGlobal('fetch', publicationFetch)

beforeEach(() => { vi.stubGlobal('fetch', publicationFetch) })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
