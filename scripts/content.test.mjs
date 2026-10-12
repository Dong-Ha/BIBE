import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readConcept, publicationErrors, compileBundle, renderMarkdown } from './content.mjs'

const base = { type: 'Concept', title: '은혜', description: '설명', public_id: 'grace', status: 'stable', published: true, sources: [{ id: 'bible', resource: 'https://example.org/source' }] }
function doc(meta = {}, body = '## 설명\n\n근거를 확인합니다.[^bible]\n\n[^bible]: 원자료') { return { id: 'concepts/grace', path: 'concepts/grace.md', meta: { ...base, ...meta }, body } }

test('OKF reader accepts the minimal standard and preserves producer fields', () => {
  const value = readConcept('---\ntype: Custom\nproducer_note: abc\n---\n본문', 'new/concept.md')
  assert.equal(value.id, 'new/concept')
  assert.equal(value.meta.producer_note, 'abc')
  assert.throws(() => readConcept('---\ntitle: missing type\n---\n본문', 'missing.md'), /type is required/)
})
test('site publication is stricter than OKF reading and checks attribution', () => {
  assert.deepEqual(publicationErrors([doc()]), [])
  assert.match(publicationErrors([doc({}, '[없는 본문](/passages/missing.md)')]).join(), /missing target/)
  assert.match(publicationErrors([doc({}, '주장[^unknown]')]).join(), /citation without source/)
  assert.match(publicationErrors([doc({ sources: [{}] })]).join(), /source.resource/)
  assert.match(publicationErrors([doc({ sources: [{ resource: 'javascript:alert(1)' }] })]).join(), /site source must/)
})
test('publication catches invalid exercise states and relation endpoints', () => {
  const invalid = { kind: 'connections', goal: '목표', before: '질문', after: '발견', transfer: '적용', defaultState: 'missing', states: [{ id: 'one', label: '하나', description: '설명', evidence: ['본문'], activeNodes: ['missing'] }, { id: 'two', label: '둘', description: '설명', evidence: ['본문'], activeNodes: [] }], nodes: [], edges: [] }
  assert.match(publicationErrors([doc({ definition: invalid })]).join(), /invalid experience defaultState/)
  assert.match(publicationErrors([doc({ definition: invalid })]).join(), /unknown active node/)
  assert.match(publicationErrors([doc({ relationship: { kind: 'theme', from: '/missing.md', to: '/other.md', explanation: '연결', evidence: ['근거'] } })]).join(), /missing relationship endpoint/)
})
test('compiler produces backlinks and repeatable output; drafts stay out of the site', () => {
  const a = doc({}, '## 설명\n\n[믿음](/concepts/faith.md)')
  const b = { ...doc({ public_id: 'faith' }), id: 'concepts/faith', path: 'concepts/faith.md' }
  const draft = { ...doc({ public_id: 'draft', status: 'draft', published: false }), id: 'concepts/draft', path: 'concepts/draft.md' }
  const compiled = compileBundle([a, b, draft])
  assert.equal(compiled.documents.length, 2)
  assert.deepEqual(compiled.documents[1].backlinks, ['concepts/grace'])
  assert.equal(JSON.stringify(compiled), JSON.stringify(compileBundle([a, b, draft])))
})
test('Markdown output strips active HTML and rewrites bundle links without losing source anchors', () => {
  const a = doc({}, '')
  const html = renderMarkdown('<script>alert(1)</script><img src=x onerror=alert(1)>\n\n[위험](javascript:alert(1)) [내부](/concepts/grace.md) 근거[^bible]', a, new Map([[a.id, a]]))
  assert.doesNotMatch(html, /<script|onerror|javascript:/)
  assert.match(html, /data-doc="concepts\/grace"/)
  assert.match(html, /href="#source-bible"/)
})
