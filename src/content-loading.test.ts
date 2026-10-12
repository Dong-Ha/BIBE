import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => { vi.resetModules() })

it('imports only summaries, deduplicates concurrent reads and keeps the summary registry unchanged', async () => {
  const fetcher = vi.fn(fetch)
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content')
  expect(fetcher).not.toHaveBeenCalled()
  const summary = content.documentByPublicId.get('acceptance')!
  const first = content.loadDocument(summary.id), second = content.loadDocument(summary.id)
  expect(first).toBe(second)
  const doc = await first
  expect(doc.sections.length).toBeGreaterThan(0)
  expect(fetcher).toHaveBeenCalledTimes(1)
  expect(content.loadDocument(summary.id)).toBe(first)
  expect(content.documentById.get(summary.id)).toBe(summary)
  expect(summary).not.toHaveProperty('sections')
})

it('evicts failed and invalid responses so retry can recover', async () => {
  const original = fetch
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'wrong', publicId: 'wrong', sections: [], sources: [] }) }).mockImplementation(original)
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content'), id = content.documentByPublicId.get('story')!.id
  await expect(content.loadDocument(id)).rejects.toThrow('503')
  await expect(content.loadDocument(id)).rejects.toThrow('Invalid content')
  expect((await content.loadDocument(id)).definition?.kind).toBe('story')
  expect(fetcher).toHaveBeenCalledTimes(3)
})

it('treats a failed embedded experience as a failed reading payload and reuses successful documents on retry', async () => {
  const original = fetch
  let failed = false
  const fetcher = vi.fn(async (url: RequestInfo | URL) => {
    const response = await original(url), doc = await response.json()
    if (doc.publicId === 'perspectives' && !failed) { failed = true; return { ok: false, status: 503, json: async () => ({}) } }
    return { ok: true, status: 200, json: async () => doc }
  })
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content'), id = content.documentByPublicId.get('acceptance')!.id
  await expect(content.loadReadingPayload(id)).rejects.toThrow('503')
  const payload = await content.loadReadingPayload(id)
  expect(payload.experience?.kind).toBe('perspectives')
  expect(payload.document.publicId).toBe('acceptance')
  expect(fetcher).toHaveBeenCalledTimes(3)
})

it('does not fetch empty searches and recovers a failed shared search index', async () => {
  const original = fetch
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 }).mockImplementation(original)
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content')
  expect(await content.searchDocuments('  ')).toEqual([])
  expect(fetcher).not.toHaveBeenCalled()
  await expect(content.searchDocuments('은혜')).rejects.toThrow('503')
  const [grace, resurrection] = await Promise.all([content.searchDocuments('은혜'), content.searchDocuments('부활')])
  expect(grace.length).toBeGreaterThan(0)
  expect(resurrection.some(doc => doc.publicId === 'evidence')).toBe(true)
  expect(fetcher).toHaveBeenCalledTimes(2)
})

it('rejects matching-ID responses missing required experience or relationship details and allows retry', async () => {
  const original = fetch
  const corrupted = new Set<string>()
  const fetcher = vi.fn(async (url: RequestInfo | URL) => {
    const response = await original(url), doc = await response.json()
    if (doc.definition && !corrupted.has(doc.id)) { corrupted.add(doc.id); const { definition, ...missing } = doc; return { ok: true, json: async () => missing } }
    if (doc.relationship && !corrupted.has(doc.id)) { corrupted.add(doc.id); const { relationship, ...missing } = doc; return { ok: true, json: async () => missing } }
    return { ok: true, json: async () => doc }
  })
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content'), experience = content.documentByPublicId.get('story')!, relation = content.documents.find(doc => doc.type === 'Relationship')!
  for (const summary of [experience, relation]) {
    await expect(content.loadDocument(summary.id)).rejects.toThrow('Invalid content')
    expect((await content.loadDocument(summary.id)).id).toBe(summary.id)
  }
  expect(fetcher).toHaveBeenCalledTimes(4)
})

it('validates optional relationship basis and explanation pairs in loaded full payloads', async () => {
  const original = fetch
  let attempts = 0
  const fetcher = vi.fn(async (url: RequestInfo | URL) => {
    const response = await original(url), doc = await response.json()
    if (!doc.relationship) return { ok: true, json: async () => doc }
    const next = structuredClone(doc)
    if (attempts === 0) Object.assign(next.relationship, { basis: 'unsupported', basisExplanation: '해석' })
    else if (attempts === 1) {
      next.relationship.basis = 'allusion'
      delete next.relationship.basisExplanation
    }
    else if (attempts === 2) Object.assign(next.relationship, { basis: 'editorial', basisExplanation: '  ' })
    else Object.assign(next.relationship, { basis: 'allusion', basisExplanation: '본문의 표현과 문맥이 함께 암시합니다.' })
    attempts++
    return { ok: true, status: 200, json: async () => next }
  })
  vi.stubGlobal('fetch', fetcher)
  const content = await import('./content'), summary = content.documents.find(doc => doc.type === 'Relationship')!
  for (let i = 0; i < 3; i++) await expect(content.loadDocument(summary.id)).rejects.toThrow('Invalid content')
  const valid = await content.loadDocument(summary.id)
  expect(valid.relationship?.basis).toBe('allusion')
  expect(valid.relationship?.basisExplanation).toContain('문맥')
  expect(fetcher).toHaveBeenCalledTimes(4)
})
