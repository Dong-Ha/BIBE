import generated from './generated/content.json'
import type { ContentBundle, ContentDocument } from './content-types'

export const bundle = generated as unknown as ContentBundle
export const documents = bundle.documents
export const documentById = new Map(documents.map(doc => [doc.id, doc]))
export const documentByPublicId = new Map(documents.map(doc => [doc.publicId, doc]))
export const questions = documents.filter(doc => doc.type === 'Question').sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
export const passages = documents.filter(doc => doc.type === 'Bible Passage')
export const paths = documents.filter(doc => doc.type === 'Reading Path')
export const experiences = documents.filter(doc => doc.type === 'Learning Experience')
export const concepts = documents.filter(doc => doc.type === 'Concept')
export const references = documents.filter(doc => ['Reference', 'Author'].includes(doc.type))
export const typeLabels: Record<string, string> = {
  Question: '삶과 신앙의 질문', 'Bible Passage': '성경 본문', 'Reading Path': '성경 읽기 경로',
  'Learning Experience': '직접 탐색', Concept: '쉬운 용어 설명', Reference: '원자료 안내', Author: '저자와 자료', Relationship: '본문 연결의 근거',
}
export interface NavigationState {
  view: 'home' | 'scripture' | 'experiences' | 'glossary' | 'sources' | 'search'
  document?: ContentDocument
  stateId?: string
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
  const experience = doc?.definition ? doc : doc?.experience ? documentById.get(doc.experience) : undefined
  const definition = experience?.definition, requestedState = params.get('state')
  const validState = definition?.states.some(s => s.id === requestedState)
  if (requestedState && definition && !validState) notice = '탐색 상태를 찾을 수 없어 처음 상태로 열었습니다.'
  const view = params.get('view')
  return { view: ['home', 'scripture', 'experiences', 'glossary', 'sources', 'search'].includes(view ?? '') ? view as NavigationState['view'] : 'home', document: doc, stateId: validState ? requestedState! : doc?.experienceState ?? definition?.defaultState, query: params.get('q') ?? '', notice }
}
export function documentHref(doc: ContentDocument, stateId?: string) {
  const params = new URLSearchParams({ doc: doc.publicId })
  if (stateId) params.set('state', stateId)
  return `?${params}`
}
function normalize(value: string) { return value.normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s:：–—.,·\-]/g, '') }
export function searchDocuments(query: string) {
  const tokens = query.trim().split(/\s+/).map(normalize).filter(Boolean)
  if (!tokens.length) return []
  return documents.filter(doc => doc.type !== 'Relationship').map(doc => {
    const text = normalize(doc.searchText), title = normalize(`${doc.title} ${doc.reference ?? ''} ${doc.aliases.join(' ')}`)
    return { doc, score: tokens.every(token => text.includes(token)) ? tokens.reduce((score, token) => score + (title.includes(token) ? 3 : 1), 0) : 0 }
  }).filter(result => result.score).sort((a, b) => b.score - a.score).map(result => result.doc)
}
