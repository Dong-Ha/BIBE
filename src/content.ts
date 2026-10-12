import generated from './generated/manifest.json'
import type { PublicationManifest, ContentSummary, ContentDocument, ReadingPayload, RelationshipBasis, RelationshipKind } from './content-types'

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
export const relationshipKindLabels: Record<RelationshipKind, string> = {
  direct: '본문의 직접 연결', promise: '약속과 성취의 해석', theme: '주제의 연결', application: '삶의 적용',
}
export const relationshipBasisLabels: Record<RelationshipBasis, string> = {
  explicit: '본문의 명시적 선언 또는 인용',
  allusion: '본문의 표현과 문맥이 암시',
  editorial: '함께 읽기 위한 편집 해석',
}
export const mapGroups = ['all', 'bible', 'concepts', 'sources', 'experiences', 'questions', 'reading'] as const
export type MapGroup = typeof mapGroups[number]
export const mapGroupLabels: Record<MapGroup, string> = {
  all: '모든 자료', bible: '성경 본문', concepts: '용어', sources: '출처', experiences: '직접 탐색', questions: '다른 질문', reading: '이어 읽기',
}
export function readingLinkGroup(doc: ContentSummary): Exclude<MapGroup, 'all'> {
  switch (doc.type) {
    case 'Bible Passage': return 'bible'
    case 'Concept': return 'concepts'
    case 'Reference': case 'Author': return 'sources'
    case 'Learning Experience': return 'experiences'
    case 'Question': return 'questions'
    default: return 'reading'
  }
}
// Navigation associations are authored reading links, not biblical relation claims.
export function readingLinksFor(question: ContentSummary, group: MapGroup = 'all'): ContentSummary[] {
  const ids = [...new Set(question.links)]
  return ids.map(id => documentById.get(id)).filter((doc): doc is ContentSummary => !!doc && doc.id !== question.id && (group === 'all' || readingLinkGroup(doc) === group))
    .sort((a, b) => mapGroups.indexOf(readingLinkGroup(a)) - mapGroups.indexOf(readingLinkGroup(b)) || a.title.localeCompare(b.title, 'ko'))
}
// Relationship choices are available only when their endpoints are nodes in
// this path. The manifest summaries carry those endpoints, so URL validation
// does not need to fetch the path payload.
export function readingPathRelations(path: ContentSummary): ContentSummary[] {
  if (path.type !== 'Reading Path') return []
  const nodeIds = new Set(path.nodeIds ?? [])
  const connectionIds = [...new Set(path.connectionIds ?? [])]
  return connectionIds.map(id => documentById.get(`relationships/${id}`)).filter((relation): relation is ContentSummary => {
    const edge = relation?.relationship
    return relation?.type === 'Relationship' && !!edge && nodeIds.has(edge.source) && nodeIds.has(edge.target)
  })
}
export function mapHref(focusPublicId: string, group: MapGroup = 'all', nodePublicId?: string) {
  const params = new URLSearchParams({ view: 'map', focus: focusPublicId, group })
  if (nodePublicId) params.set('node', nodePublicId)
  return `?${params}`
}
export interface NavigationState {
  view: 'home' | 'guides' | 'library' | 'scripture' | 'experiences' | 'glossary' | 'sources' | 'search' | 'map'
  mapFocus?: ContentSummary
  mapGroup?: MapGroup
  mapNode?: ContentSummary
  document?: ContentSummary
  relationId?: string
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
  const requestedRelation = params.get('relation')
  let relationId: string | undefined
  if (requestedRelation) {
    const allowed = requestedDoc && doc?.type === 'Reading Path' ? readingPathRelations(doc) : []
    const relation = allowed.find(item => item.publicId === requestedRelation)
    if (relation) relationId = relation.publicId
    else notice = [notice, '선택한 본문 연결을 이 경로에서 찾을 수 없어 선택을 해제했습니다.'].filter(Boolean).join(' ')
  }
  const view = params.get('view')
  let mapFocus: ContentSummary | undefined, mapGroup: MapGroup | undefined, mapNode: ContentSummary | undefined
  if (view === 'map' && !doc) {
    const focus = params.get('focus'), requestedFocus = documentByPublicId.get(focus ?? '')
    mapFocus = requestedFocus?.type === 'Question' ? requestedFocus : questions[0]
    const mapNotices: string[] = []
    if (focus && requestedFocus?.type !== 'Question') mapNotices.push('지도의 질문을 찾을 수 없어 첫 질문으로 열었습니다.')
    const group = params.get('group')
    mapGroup = mapGroups.includes(group as MapGroup) ? group as MapGroup : 'all'
    if (group && !mapGroups.includes(group as MapGroup)) mapNotices.push('자료 종류를 찾을 수 없어 모든 연결을 보여 드립니다.')
    const node = params.get('node')
    mapNode = mapFocus ? readingLinksFor(mapFocus, mapGroup).find(doc => doc.publicId === node) : undefined
    if (node && !mapNode) {
      const linked = mapFocus && readingLinksFor(mapFocus).some(doc => doc.publicId === node)
      mapNotices.push(linked ? '선택한 자료가 현재 자료 종류에 포함되지 않아 자료 선택을 해제했습니다.' : '선택한 자료가 이 질문의 연결에 없어 자료 선택을 해제했습니다.')
    }
    notice = [notice, ...mapNotices].filter(Boolean).join(' ') || undefined
  }
  return { mapFocus, mapGroup, mapNode, view: ['home', 'guides', 'library', 'scripture', 'experiences', 'glossary', 'sources', 'search', 'map'].includes(view ?? '') ? view as NavigationState['view'] : 'home', document: doc, relationId, dayId, stateId: validState ? requestedState! : doc?.experienceState ?? experience?.defaultState, query: params.get('q') ?? '', notice }
}
export function documentHref(doc: { publicId: string }, stateId?: string, dayId?: string, relationId?: string) {
  const params = new URLSearchParams({ doc: doc.publicId })
  if (stateId) params.set('state', stateId)
  if (dayId) params.set('day', dayId)
  const summary = documentByPublicId.get(doc.publicId)
  const path = summary?.type === 'Reading Path' ? summary : undefined
  if (relationId && path && readingPathRelations(path).some(relation => relation.publicId === relationId)) params.set('relation', relationId)
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
const relationshipBases: readonly RelationshipBasis[] = ['explicit', 'allusion', 'editorial']
function validRelationshipBasis(value: { basis?: unknown; basisExplanation?: unknown }) {
  const hasBasis = value.basis !== undefined, hasExplanation = value.basisExplanation !== undefined
  return !hasBasis && !hasExplanation || hasBasis && hasExplanation
    && relationshipBases.includes(value.basis as RelationshipBasis)
    && typeof value.basisExplanation === 'string' && value.basisExplanation.trim().length > 0
}
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
    if (!def.edges.every(edge => edge && [edge.id, edge.source, edge.target, edge.kind, edge.explanation].every(value => typeof value === 'string') && strings(edge.evidence) && validRelationshipBasis(edge))) return false
  }
  if (summary.relationship) {
    const relation = doc.relationship
    if (!relation || relation.source !== summary.relationship.source || relation.target !== summary.relationship.target || relation.kind !== summary.relationship.kind || typeof relation.explanation !== 'string' || !strings(relation.evidence) || !validRelationshipBasis(relation)) return false
  }
  if (summary.dayIds) {
    if (!Array.isArray(doc.days) || JSON.stringify(doc.days.map(day => day?.id)) !== JSON.stringify(summary.dayIds)) return false
    if (!doc.days.every(day => day && [day.title, day.focus, day.reflection, day.practice, day.question, day.passage].every(value => typeof value === 'string') && documentById.get(day.question)?.type === 'Question' && documentById.get(day.passage)?.type === 'Bible Passage' && (day.experience === undefined || documentById.get(day.experience)?.type === 'Learning Experience'))) return false
  }
  if (summary.nodeIds && (!strings(doc.nodeIds) || !strings(doc.connectionIds)
    || JSON.stringify(doc.nodeIds) !== JSON.stringify(summary.nodeIds)
    || JSON.stringify(doc.connectionIds) !== JSON.stringify(summary.connectionIds))) return false
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
