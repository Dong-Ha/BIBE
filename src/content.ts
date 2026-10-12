import generated from './generated/manifest.json'
import type { PublicationManifest, ContentSummary, ContentDocument, ReadingPayload } from './content-types'

export const bundle = generated as unknown as PublicationManifest
export const documents: readonly ContentSummary[] = bundle.documents
export const documentById: ReadonlyMap<string, ContentSummary> = new Map(documents.map(doc => [doc.id, doc]))
export const documentByPublicId: ReadonlyMap<string, ContentSummary> = new Map(documents.map(doc => [doc.publicId, doc]))
export const questions = documents.filter(doc => doc.type === 'Question').sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
export const passages = documents.filter(doc => doc.type === 'Bible Passage')
export const paths = documents.filter(doc => doc.type === 'Reading Path')
export const experiences = documents.filter(doc => doc.type === 'Learning Experience')
export const guides = documents.filter(doc => doc.type === 'Reading Guide').sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
export const studies = documents.filter(doc => doc.type === 'Study Series')
export const concepts = documents.filter(doc => doc.type === 'Concept')
export const references = documents.filter(doc => ['Reference', 'Author'].includes(doc.type))
export const typeLabels: Record<string, string> = {
  Question: '삶과 신앙의 질문', 'Study Series': '책과 함께 읽기', 'Reading Guide': '하루씩 읽기', 'Bible Passage': '성경 본문', 'Reading Path': '성경 읽기 경로',
  'Learning Experience': '직접 탐색', Concept: '쉬운 용어 설명', Reference: '원자료 안내', Author: '저자와 자료', Relationship: '본문 연결의 근거',
}
export interface NavigationState {
  view: 'home' | 'guides' | 'library' | 'scripture' | 'experiences' | 'glossary' | 'sources' | 'search'
  document?: ContentSummary
  stateId?: string
  dayId?: string
  query: string
  notice?: string
}
export function readNavigation(search: string): NavigationState {
  const params = new URLSearchParams(search)
  const requestedDoc = params.get('doc'), legacyPassage = params.get('passage'), legacyThread = params.get('thread')
  let doc = requestedDoc ? documentByPublicId.get(requestedDoc) : undefined
  let notice: string | undefined
  if (!requestedDoc && (legacyPassage || legacyThread)) {
    const thread = legacyThread ? bundle.legacy.threads[legacyThread] : undefined
    const validPassage = legacyPassage && (!thread || thread.passages.includes(legacyPassage)) ? bundle.legacy.passages[legacyPassage] : undefined
    doc = documentByPublicId.get(validPassage || (thread && bundle.legacy.passages[thread.firstPassage]) || '')
    if (doc) notice = '이전에 공유한 본문을 새 읽기 화면에서 열었습니다.'
  }
  if ((requestedDoc || legacyPassage || legacyThread) && !doc) notice = '찾을 수 없는 주소입니다. 아래 질문에서 다시 시작해 주세요.'
  const experience = doc?.experienceKind ? doc : doc?.experience ? documentById.get(doc.experience) : undefined
  const requestedState = params.get('state')
  const validState = experience?.stateIds?.includes(requestedState ?? '')
  if (requestedState && experience && !validState) notice = '탐색 상태를 찾을 수 없어 처음 상태로 열었습니다.'
  const requestedDay = params.get('day'), validDay = doc?.dayIds?.includes(requestedDay ?? '')
  if (requestedDay && doc?.dayIds && !validDay) notice = '읽을 날을 찾을 수 없어 첫날로 열었습니다.'
  const dayId = validDay ? requestedDay! : doc?.dayIds?.[0]
  const view = params.get('view')
  return { view: ['home', 'guides', 'library', 'scripture', 'experiences', 'glossary', 'sources', 'search'].includes(view ?? '') ? view as NavigationState['view'] : 'home', document: doc, dayId, stateId: validState ? requestedState! : doc?.experienceState ?? experience?.defaultState, query: params.get('q') ?? '', notice }
}
export function documentHref(doc: { publicId: string }, stateId?: string, dayId?: string) {
  const params = new URLSearchParams({ doc: doc.publicId })
  if (stateId) params.set('state', stateId)
  if (dayId) params.set('day', dayId)
  return `?${params}`
}
function normalize(value: string) { return value.normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s:：–—.,·\-]/g, '') }

// Successful resources are shared across readers. A failed request is removed
// so retry can make a new request; consumers never cancel a shared promise.
const resources = new Map<string, Promise<unknown>>()
function resource<T>(hash: string, validate: (value: unknown) => value is T): Promise<T> {
  if (!/^[a-f0-9]{64}$/.test(hash)) return Promise.reject(new Error('Invalid content hash'))
  const existing = resources.get(hash)
  if (existing) return existing as Promise<T>
  const pending = (async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}generated-content/${hash}.json`)
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`)
    const value: unknown = await response.json()
    if (!validate(value)) throw new Error('Invalid content response')
    return value
  })()
  resources.set(hash, pending)
  void pending.catch(() => { if (resources.get(hash) === pending) resources.delete(hash) })
  return pending
}
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')
function usableDocument(value: unknown, summary: ContentSummary): value is ContentDocument {
  const doc = value as ContentDocument | null
  if (!doc || doc.id !== summary.id || doc.publicId !== summary.publicId || doc.type !== summary.type || typeof doc.title !== 'string' || typeof doc.description !== 'string') return false
  if (![doc.tags, doc.aliases, doc.passages, doc.questions, doc.books, doc.links, doc.backlinks].every(strings)) return false
  if (!Array.isArray(doc.sections) || !doc.sections.every(section => section && typeof section.title === 'string' && typeof section.html === 'string')) return false
  if (!Array.isArray(doc.sources) || !doc.sources.every(source => source && typeof source.resource === 'string')) return false
  if (summary.experienceKind) {
    const def = doc.definition
    if (!def || def.kind !== summary.experienceKind || def.defaultState !== summary.defaultState || !Array.isArray(def.states) || !Array.isArray(def.nodes) || !Array.isArray(def.edges)) return false
    if (JSON.stringify(def.states.map(state => state?.id)) !== JSON.stringify(summary.stateIds)) return false
    if (!['id', 'title', 'goal', 'before', 'after', 'transfer'].every(field => typeof def[field as keyof typeof def] === 'string')) return false
    if (!def.states.every(state => state && typeof state.label === 'string' && typeof state.description === 'string' && strings(state.evidence) && strings(state.activeNodes) && (state.activeEdges === undefined || strings(state.activeEdges)))) return false
    if (!def.nodes.every(node => node && [node.id, node.label, node.detail, node.reference].every(value => typeof value === 'string'))) return false
    if (!def.edges.every(edge => edge && [edge.id, edge.source, edge.target, edge.kind, edge.explanation].every(value => typeof value === 'string') && strings(edge.evidence))) return false
  }
  if (summary.relationship) {
    const relation = doc.relationship
    if (!relation || relation.source !== summary.relationship.source || relation.target !== summary.relationship.target || relation.kind !== summary.relationship.kind || typeof relation.explanation !== 'string' || !strings(relation.evidence)) return false
  }
  if (summary.dayIds) {
    if (!Array.isArray(doc.days) || JSON.stringify(doc.days.map(day => day?.id)) !== JSON.stringify(summary.dayIds)) return false
    if (!doc.days.every(day => day && [day.title, day.focus, day.reflection, day.practice, day.question, day.passage].every(value => typeof value === 'string') && documentById.get(day.question)?.type === 'Question' && documentById.get(day.passage)?.type === 'Bible Passage' && (day.experience === undefined || documentById.get(day.experience)?.type === 'Learning Experience'))) return false
  }
  if (summary.nodeIds && (!strings(doc.nodeIds) || !strings(doc.connectionIds))) return false
  return true
}
export function loadDocument(id: string): Promise<ContentDocument> {
  const summary = documentById.get(id)
  if (!summary) return Promise.reject(new Error('Unknown document'))
  return resource(summary.detailHash, (value): value is ContentDocument => usableDocument(value, summary))
}
export async function loadReadingPayload(id: string): Promise<ReadingPayload> {
  const summary = documentById.get(id)
  if (!summary) throw new Error('Unknown document')
  const [document, embedded, relationships] = await Promise.all([
    loadDocument(id), summary.experience ? loadDocument(summary.experience) : Promise.resolve(undefined),
    Promise.all((summary.connectionIds ?? []).map(key => loadDocument(`relationships/${key}`))),
  ])
  if (summary.experience && !embedded?.definition) throw new Error('Missing learning experience')
  return { document, experience: document.definition ?? embedded?.definition, relationships }
}
interface SearchIndex { schemaVersion: number; rows: { id: string; text: string }[] }
let normalizedSearch: Promise<Map<string, string>> | undefined
function loadSearchIndex() {
  if (normalizedSearch) return normalizedSearch
  const pending = resource(bundle.searchHash, (value): value is SearchIndex => {
    const index = value as SearchIndex | null
    return !!index && index.schemaVersion === 1 && Array.isArray(index.rows) && index.rows.length === documents.length && index.rows.every(row => typeof row.id === 'string' && documentById.has(row.id) && typeof row.text === 'string') && new Set(index.rows.map(row => row.id)).size === documents.length
  }).then(index => new Map(index.rows.map(row => [row.id, normalize(row.text)])))
  normalizedSearch = pending
  void pending.catch(() => { if (normalizedSearch === pending) normalizedSearch = undefined })
  return pending
}
export async function searchDocuments(query: string): Promise<ContentSummary[]> {
  const tokens = query.trim().split(/\s+/).map(normalize).filter(Boolean)
  if (!tokens.length) return []
  const index = await loadSearchIndex()
  return documents.filter(doc => doc.type !== 'Relationship').map(doc => {
    const text = index.get(doc.id) ?? '', title = normalize(`${doc.title} ${doc.reference ?? ''} ${doc.aliases.join(' ')}`)
    return { doc, score: tokens.every(token => text.includes(token)) ? tokens.reduce((score, token) => score + (title.includes(token) ? 3 : 1), 0) : 0 }
  }).filter(result => result.score).sort((a, b) => b.score - a.score).map(result => result.doc)
}
