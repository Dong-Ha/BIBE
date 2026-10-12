import { describe, expect, it } from 'vitest'
import { bundle, concepts, documentByPublicId, documents, experiences, passages, paths, questions, readNavigation, searchDocuments, studies, guides } from './content'

describe('published content and navigation data', () => {
  it('publishes a complete home, passage, concept, path, and experience corpus', () => {
    expect(documents.length).toBeGreaterThanOrEqual(60)
    expect(questions).toHaveLength(14)
    expect(Object.keys(bundle.legacy.passages)).toHaveLength(55)
    expect(Object.keys(bundle.legacy.threads)).toHaveLength(11)
    expect(paths).toHaveLength(11)
    expect(studies).toHaveLength(6)
    expect(passages).toHaveLength(84)
    expect(experiences).toHaveLength(11)
    expect(passages.length).toBeGreaterThanOrEqual(55)
    expect(concepts.length).toBeGreaterThan(0)
    expect(experiences.length).toBeGreaterThanOrEqual(4)
    expect(new Set(experiences.map(doc => doc.definition?.kind))).toEqual(new Set(['story', 'connections', 'layers', 'perspectives']))
    expect(new Set(documents.map(doc => doc.publicId)).size).toBe(documents.length)
  })

  it('maps all legacy passage and thread links to current documents', () => {
    for (const publicId of Object.values(bundle.legacy.passages)) {
      expect(documentByPublicId.get(publicId)?.type).toBe('Bible Passage')
    }
    for (const [legacyId, thread] of Object.entries(bundle.legacy.threads)) {
      expect(thread.path, legacyId).toBeTruthy()
      expect(documentByPublicId.get(thread.path)?.type).toBe('Reading Path')
      expect(thread.passages.length).toBeGreaterThan(0)
      expect(thread.passages.every(id => !!bundle.legacy.passages[id])).toBe(true)
    }
  })

  it('searches Korean aliases and full Bible references', () => {
    const justification = documentByPublicId.get('justification')
    expect(justification?.aliases).toContain('의롭다 하심')
    expect(searchDocuments('의롭다 하심').some(doc => doc.publicId === 'justification')).toBe(true)

    const passage = passages.find(doc => doc.reference === '요한복음 20:24–29')
    expect(passage).toBeDefined()
    expect(searchDocuments('요한복음 20:24–29').some(doc => doc.id === passage!.id)).toBe(true)
  })

  it('resolves the historic cross thread and passage URL to the same Scripture document', () => {
    const navigation = readNavigation('?thread=cross&passage=jn-20-24')
    expect(navigation.document?.publicId).toBe('jn-20-24')
    expect(navigation.notice).toContain('이전에 공유한 본문')
  })

  it('keeps valid experience states and falls back with a notice for unknown states', () => {
    expect(readNavigation('?doc=story&state=resentment').stateId).toBe('resentment')
    const invalid = readNavigation('?doc=story&state=missing')
    expect(invalid.stateId).toBe('leaving')
    expect(invalid.notice).toContain('처음 상태로 열었습니다')
  })
})


describe('book reading paths', () => {
  it('preserves source scope and resolves linked books in the knowledge graph', () => {
    expect(readNavigation('?view=library').view).toBe('library')
    for (const study of studies) {
      expect(study.books.length).toBeGreaterThan(0)
      expect(study.passages.length).toBeGreaterThan(0)
      for (const bookId of study.books) {
        const book = documents.find(doc => doc.id === bookId)!
        expect(book.type).toBe('Reference')
        expect(book.backlinks).toContain(study.id)
        expect(book.logos?.uri).toMatch(/^logosres:[a-z0-9]+$/)
      }
    }
    const galatians = documentByPublicId.get('logosbook-keller-galatians')!
    expect(galatians.logos?.access).toContain('local-body-excerpt')
    expect(galatians.sections.map(section => section.html).join(' ')).toContain('한국어판 전체를 읽은 것은 아니며')
    expect(searchDocuments('갈라디아서 5:13').some(doc => doc.publicId === 'gal-5-13')).toBe(true)
  })
})


it('finds article body text and interactive states after eliminating duplicate generated text', () => {
  expect(searchDocuments('인정·편안함·통제').some(doc => doc.publicId === 'logosbook-keller-galatians')).toBe(true)
  expect(searchDocuments('정죄하지').some(doc => doc.publicId === 'conscience')).toBe(true)
  expect(searchDocuments('필요와 경계를 묻는 돌봄').some(doc => doc.publicId === 'belonging-practice')).toBe(true)
})


it('validates guide day addresses, links and searches their authored prompts', () => {
  expect(guides).toHaveLength(3)
  for (const guide of guides) {
    expect(guide.days).toHaveLength(7)
    for (const day of guide.days!) {
      expect(documents.find(doc => doc.id === day.question)?.type).toBe('Question')
      expect(documents.find(doc => doc.id === day.passage)?.backlinks).toContain(guide.id)
    }
  }
  expect(readNavigation('?view=guides').view).toBe('guides')
  expect(readNavigation('?doc=return-to-grace-7-days&day=day-4').dayId).toBe('day-4')
  const invalid = readNavigation('?doc=return-to-grace-7-days&day=missing')
  expect(invalid.dayId).toBe('day-1')
  expect(invalid.notice).toContain('첫날')
  expect(searchDocuments('선한 창조').some(doc => doc.publicId === 'explore-christianity-7-days')).toBe(true)
})
