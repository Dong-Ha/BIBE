import { describe, expect, it } from 'vitest'
import { bundle, concepts, documentByPublicId, documents, experiences, passages, paths, questions, readNavigation, searchDocuments, studies, guides, loadDocument, loadReadingPayload } from './content'

describe('published content and navigation data', () => {
  it('publishes compact summaries and supports asynchronous detail loading', async () => {
    expect(documents).toHaveLength(251)
    expect(questions).toHaveLength(17)
    expect(Object.keys(bundle.legacy.passages)).toHaveLength(55)
    expect(Object.keys(bundle.legacy.threads)).toHaveLength(11)
    expect(paths).toHaveLength(11)
    expect(studies).toHaveLength(7)
    expect(passages).toHaveLength(89)
    expect(experiences).toHaveLength(13)
    expect(concepts.length).toBeGreaterThan(0)
    expect(guides).toHaveLength(3)
    expect(new Set(experiences.map(doc => doc.experienceKind))).toEqual(new Set(['story', 'connections', 'layers', 'perspectives']))
    expect(new Set(documents.map(doc => doc.publicId)).size).toBe(documents.length)
    for (const summary of documents) {
      expect(summary).not.toHaveProperty('sections')
      expect(summary).not.toHaveProperty('sources')
      expect(summary).not.toHaveProperty('searchText')
      expect(summary).not.toHaveProperty('definition')
      expect(summary).not.toHaveProperty('days')
      expect(summary).not.toHaveProperty('logos')
    }
    const detail = await loadDocument(documentByPublicId.get('acceptance')!.id)
    expect(detail.sections.length).toBeGreaterThan(0)
    expect(detail.sources.length).toBeGreaterThan(0)
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

  it('searches Korean aliases and full Bible references', async () => {
    const justification = documentByPublicId.get('justification')
    expect(justification?.aliases).toContain('의롭다 하심')
    expect((await searchDocuments('의롭다 하심')).some(doc => doc.publicId === 'justification')).toBe(true)

    const passage = passages.find(doc => doc.reference === '요한복음 20:24–29')
    expect(passage).toBeDefined()
    expect((await searchDocuments('요한복음 20:24–29')).some(doc => doc.id === passage!.id)).toBe(true)
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
  it('preserves source scope and resolves linked books in the knowledge graph', async () => {
    expect(readNavigation('?view=library').view).toBe('library')
    for (const study of studies) {
      expect(study.books.length).toBeGreaterThan(0)
      expect(study.passages.length).toBeGreaterThan(0)
      for (const bookId of study.books) {
        const book = documents.find(doc => doc.id === bookId)!
        expect(book.type).toBe('Reference')
        expect(book.backlinks).toContain(study.id)
        const fullBook = await loadDocument(book.id)
        expect(fullBook.logos?.uri).toMatch(/^logosres:[a-z0-9]+$/)
      }
    }
    const galatians = await loadDocument(documentByPublicId.get('logosbook-keller-galatians')!.id)
    expect(galatians.logos?.access).toContain('local-body-excerpt')
    expect(galatians.sections.map(section => section.html).join(' ')).toContain('한국어판 전체를 읽은 것은 아니며')
    expect((await searchDocuments('갈라디아서 5:13')).some(doc => doc.publicId === 'gal-5-13')).toBe(true)
  })
})

it('finds article body text and interactive states after eliminating duplicate generated text', async () => {
  expect((await searchDocuments('인정·편안함·통제')).some(doc => doc.publicId === 'logosbook-keller-galatians')).toBe(true)
  expect((await searchDocuments('정죄하지')).some(doc => doc.publicId === 'conscience')).toBe(true)
  expect((await searchDocuments('필요와 경계를 묻는 돌봄')).some(doc => doc.publicId === 'belonging-practice')).toBe(true)
})

it('validates guide day addresses, links and searches their authored prompts', async () => {
  expect(guides).toHaveLength(3)
  for (const guide of guides) {
    expect(guide.dayIds).toHaveLength(7)
    const fullGuide = await loadDocument(guide.id)
    expect(fullGuide.days).toHaveLength(7)
    for (const day of fullGuide.days!) {
      expect(documents.find(doc => doc.id === day.question)?.type).toBe('Question')
      expect(documents.find(doc => doc.id === day.passage)?.backlinks).toContain(guide.id)
    }
  }
  expect(readNavigation('?view=guides').view).toBe('guides')
  expect(readNavigation('?doc=return-to-grace-7-days&day=day-4').dayId).toBe('day-4')
  const invalid = readNavigation('?doc=return-to-grace-7-days&day=missing')
  expect(invalid.dayId).toBe('day-1')
  expect(invalid.notice).toContain('첫날')
  expect((await searchDocuments('선한 창조')).some(doc => doc.publicId === 'explore-christianity-7-days')).toBe(true)
})

it('loads the reading experience and its related documents as one payload', async () => {
  const story = documentByPublicId.get('story')!
  const payload = await loadReadingPayload(story.id)
  expect(payload.document.publicId).toBe('story')
  expect(payload.experience?.states.some(state => state.id === 'resentment')).toBe(true)
  expect(payload.experience?.kind).toBe('story')
  const path = documentByPublicId.get('path-cross')!
  const pathPayload = await loadReadingPayload(path.id)
  expect(pathPayload.relationships.length).toBeGreaterThan(0)
  expect(pathPayload.relationships.every(relation => relation.type === 'Relationship')).toBe(true)
})


it('loads every published detail with matching guide and experience navigation metadata', async () => {
  const loaded = await Promise.all(documents.map(summary => loadDocument(summary.id)))
  expect(loaded).toHaveLength(251)
  for (let i = 0; i < documents.length; i++) {
    expect(loaded[i].publicId).toBe(documents[i].publicId)
    expect(loaded[i].backlinks).toEqual(documents[i].backlinks)
    expect(loaded[i].days?.map(day => day.id)).toEqual(documents[i].dayIds)
    expect(loaded[i].definition?.states.map(state => state.id)).toEqual(documents[i].stateIds)
  }
})


it('publishes prayer questions with matching experience defaults and three-session study links', async () => {
  const prayerStart = documentByPublicId.get('prayer-start')!
  const unanswered = documentByPublicId.get('unanswered-prayer')!
  const prayerSilence = documentByPublicId.get('prayer-silence')!
  expect([prayerStart.order, unanswered.order, prayerSilence.order]).toEqual([15, 16, 17])
  expect(prayerStart.experienceState).toBeUndefined()
  expect(readNavigation('?doc=prayer-start').stateId).toBe('father')
  expect(readNavigation('?doc=unanswered-prayer').stateId).toBe('waiting-relationship')
  expect(readNavigation('?doc=prayer-silence').stateId).toBe('honest-heart')

  const startPayload = await loadReadingPayload(prayerStart.id)
  expect(startPayload.experience?.id).toBe('prayer-pattern')
  expect(startPayload.experience?.states.map(state => state.id)).toEqual(['father', 'name', 'kingdom', 'bread', 'forgiveness', 'help'])
  const waitingPayload = await loadReadingPayload(unanswered.id)
  expect(waitingPayload.experience?.id).toBe('prayer-perspectives')
  expect(waitingPayload.experience?.states.map(state => state.id)).toEqual(['waiting-bargain', 'waiting-relationship', 'words-blocked', 'honest-heart'])
  const silencePayload = await loadReadingPayload(prayerSilence.id)
  expect(silencePayload.experience?.defaultState).toBe('waiting-bargain')

  const study = await loadDocument(documentByPublicId.get('study-prayer-with-scripture')!.id)
  expect(study.passages.map(id => documents.find(doc => doc.id === id)?.type)).toEqual(Array(6).fill('Bible Passage'))
  expect(study.books.map(id => documents.find(doc => doc.id === id)?.type)).toEqual(['Reference'])
  expect(study.sections.filter(section => /^\d\. /.test(section.title))).toHaveLength(3)
  for (const title of ['예수께서 가르치신 기도의 방향', '기다림과 겟세마네의 기도', '말로 다 못 하는 연약함']) {
    expect(study.sections.find(section => section.title.includes(title))?.html).toContain('?doc=')
  }
})

it('searches new prayer article and experience prose through the shared index', async () => {
  expect((await searchDocuments('말이 나오지 않을 때도 기도할 수 있을까')).some(doc => doc.publicId === 'prayer-silence')).toBe(true)
  expect((await searchDocuments('주기도문의 여섯 초점')).some(doc => doc.publicId === 'prayer-pattern')).toBe(true)
  expect((await searchDocuments('성령의 도우심')).some(doc => doc.publicId === 'prayer-silence')).toBe(true)
})
