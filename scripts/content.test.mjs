import { test } from 'node:test'
import { mkdtemp, mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { readConcept, publicationErrors, compileBundle, compilePublication, writePublication, renderMarkdown } from './content.mjs'

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
test('relationship basis metadata is an optional complete pair and stays out of the compact manifest', () => {
  const relation = {
    id: 'test-edge', source: 'grace', target: 'grace', from: '/concepts/grace.md', to: '/concepts/grace.md',
    kind: 'theme', explanation: '함께 읽을 수 있습니다.', evidence: ['요한복음 4:10'],
  }
  assert.deepEqual(publicationErrors([doc({ type: 'Relationship', relationship: relation })]), [])
  const withBasis = { ...relation, basis: 'allusion', basisExplanation: '표현과 문맥이 함께 암시합니다.' }
  assert.deepEqual(publicationErrors([doc({ type: 'Relationship', relationship: withBasis })]), [])
  for (const invalid of [
    { ...relation, basis: 'unknown', basisExplanation: '해석' },
    { ...relation, basis: 'explicit' },
    { ...relation, basisExplanation: '해석' },
    { ...relation, basis: 'editorial', basisExplanation: '   ' },
  ]) assert.match(publicationErrors([doc({ type: 'Relationship', relationship: invalid })]).join(), /relationship basis requires/)

  const publication = compilePublication(compileBundle([doc({ type: 'Relationship', relationship: withBasis })]))
  const summary = publication.manifest.documents[0]
  assert.deepEqual(summary.relationship, { source: 'grace', target: 'grace', kind: 'theme' })
  const detail = JSON.parse(publication.details.get(summary.detailHash))
  assert.equal(detail.relationship.basis, 'allusion')
  assert.equal(detail.relationship.basisExplanation, withBasis.basisExplanation)
})

test('experience edges validate relationship basis metadata when supplied', () => {
  const definition = {
    kind: 'connections', goal: '목표', before: '질문', after: '발견', transfer: '적용', defaultState: 'one',
    states: [
      { id: 'one', label: '하나', description: '설명', evidence: ['요한복음 1:1'], activeNodes: ['n'] },
      { id: 'two', label: '둘', description: '설명', evidence: ['요한복음 1:2'], activeNodes: [] },
    ],
    nodes: [{ id: 'n', label: '말씀', detail: '설명', reference: '요한복음 1:1' }],
    edges: [{ id: 'e', source: 'n', target: 'n', kind: 'direct', explanation: '연결', evidence: ['요한복음 1:1'], basis: 'explicit', basisExplanation: '본문에서 직접 말합니다.' }],
  }
  assert.deepEqual(publicationErrors([doc({ definition })]), [])
  definition.edges[0].basis = 'uncertain'
  assert.match(publicationErrors([doc({ definition })]).join(), /invalid relationship basis on experience edge/)
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
  assert.match(html, /aria-haspopup="dialog"/)
  assert.match(html, /href="#source-bible"/)
})


test('book links are validated and contribute backlinks; Logos launch URI matches the resource', () => {
  const book = { ...doc({ type: 'Reference', public_id: 'book', logos: { resource_id: 'LLS:EXAMPLE', uri: 'logosres:example', access: 'catalog' } }), id: 'references/book', path: 'references/book.md' }
  const reader = doc({ books: ['/references/book.md'] })
  assert.deepEqual(publicationErrors([reader, book]), [])
  const bundle = compileBundle([reader, book])
  assert.deepEqual(bundle.documents[0].books, ['references/book'])
  assert.deepEqual(bundle.documents[1].backlinks, ['concepts/grace'])
  assert.match(publicationErrors([doc({ books: ['/references/missing.md'] })]).join(), /missing target/)
  assert.match(publicationErrors([doc({ books: 'references/book' })]).join(), /books must be an array/)
  assert.match(publicationErrors([doc({ books: [null] })]).join(), /book paths must be strings/)
  assert.match(publicationErrors([{ ...book, meta: { ...book.meta, logos: { ...book.meta.logos, uri: 'javascript:alert(1)' } } }]).join(), /invalid Logos resource/)
  assert.match(publicationErrors([doc({ type: 'Study Series' })]).join(), /study needs/)
})


test('daily guide publication checks unique days and target document types', () => {
  const question = { ...doc({ type: 'Question', public_id: 'q', passages: ['/passages/p.md'], experience: '/experiences/e.md' }, '## 본문과 맥락\n## 복음으로 읽기\n## 남는 질문\n## 오늘의 응답'), id: 'questions/q' }
  const passage = { ...doc({ type: 'Bible Passage', public_id: 'p', reference: '로마서 8:1' }, '## 본문과 맥락\n## 복음으로 읽기'), id: 'passages/p' }
  const exercise = { ...doc({ type: 'Learning Experience', public_id: 'e' }), id: 'experiences/e' }
  const days = Array.from({ length: 7 }, (_, i) => ({ id: `day-${i + 1}`, title: '오늘 읽기', question: '/questions/q.md', passage: '/passages/p.md', focus: '초점', reflection: '질문', practice: '응답' }))
  const guide = { ...doc({ type: 'Reading Guide', public_id: 'guide', days }), id: 'guides/guide' }
  assert.deepEqual(publicationErrors([question, passage, exercise, guide]), [])
  const compiled = compileBundle([question, passage, exercise, guide])
  assert.ok(compiled.documents.find(d => d.id === 'passages/p').backlinks.includes('guides/guide'))
  assert.match(publicationErrors([{ ...guide, meta: { ...guide.meta, days: days.slice(0, 6) } }]).join(), /seven unique days/)
  assert.match(publicationErrors([{ ...guide, meta: { ...guide.meta, days: [...days.slice(0, 6), days[0]] } }]).join(), /seven unique days/)
  assert.match(publicationErrors([{ ...guide, meta: { ...guide.meta, days: days.map(day => ({ ...day, question: '/passages/p.md' })) } }, passage]).join(), /published Question/)
})


test('publication splits compact manifest, hashed details and complete search text deterministically', () => {
  const definition = { kind: 'story', title: '체험 제목 검색', goal: '목표 검색어', before: '시작', after: '마침', transfer: '옮김', defaultState: 'one', states: [
    { id: 'one', label: '처음', description: '첫 설명', evidence: ['증거 본문'] },
    { id: 'two', label: '다음', description: '둘 설명', evidence: ['둘 근거'] },
  ], nodes: [{ id: 'n', label: '노드 검색', detail: '노드 내용', reference: '창세기 1:1' }], edges: [] }
  const sourceDoc = doc({ definition, days: Array.from({ length: 7 }, (_, i) => ({ id: `day-${i + 1}`, title: `날 ${i + 1}`, question: 'questions/q', passage: 'passages/p', focus: '날 초점 검색', reflection: '날 성찰', practice: '날 실천' })) }, '## 설명\n\n본문검색어[^bible]')
  const bundle = compileBundle([sourceDoc])
  const output = compilePublication(bundle)
  const summary = output.manifest.documents[0]
  assert.equal(summary.detailHash, createHash('sha256').update(JSON.stringify(bundle.documents[0])).digest('hex'))
  assert.equal(summary.defaultState, 'one')
  assert.deepEqual(summary.stateIds, ['one', 'two'])
  assert.deepEqual(summary.dayIds, Array.from({ length: 7 }, (_, i) => `day-${i + 1}`))
  assert.equal('sections' in summary, false)
  assert.equal('sources' in summary, false)
  assert.equal('definition' in summary, false)
  assert.equal('days' in summary, false)
  assert.ok(output.details.has(summary.detailHash))
  const search = JSON.parse(output.search.serialized)
  for (const term of ['체험 제목 검색', '본문검색어', '목표 검색어', '증거 본문', '날 초점 검색', '날 성찰', '날 실천']) assert.ok(search.rows[0].text.includes(term), term)
  assert.deepEqual(compilePublication(bundle), output)
  assert.deepEqual(output.manifest.legacy, bundle.legacy)
})

test('publication writer refuses to clean unmarked files and writes artifacts when directory is owned', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bibe-publication-'))
  try {
    const outputDir = path.join(root, 'public', 'generated-content')
    await mkdir(outputDir, { recursive: true })
    await writeFile(path.join(outputDir, 'keep.txt'), 'user data')
    const publication = compilePublication(compileBundle([doc()]))
    await assert.rejects(writePublication(publication, root), /unmarked generated-content/)
    assert.equal(await readFile(path.join(outputDir, 'keep.txt'), 'utf8'), 'user data')
    await rm(path.join(outputDir, 'keep.txt'))
    await writePublication(publication, root)
    const entries = await readdir(outputDir)
    assert.ok(entries.includes('.bibe-generated'))
    assert.ok(entries.includes(`${publication.search.hash}.json`))
    assert.ok(entries.includes(`${publication.manifest.documents[0].detailHash}.json`))
    assert.equal(JSON.parse(await readFile(path.join(root, 'src/generated/manifest.json'), 'utf8')).schemaVersion, 1)
  } finally { await rm(root, { recursive: true, force: true }) }
})


test('publication rejects numeric scripture evidence before it reaches the browser', () => {
  const definition = { kind: 'story', goal: '목표', before: '시작', after: '마침', transfer: '적용', defaultState: 'one', nodes: [{ id: 'n' }], edges: [], states: [
    { id: 'one', label: '첫째', description: '설명', evidence: ['마태복음 6:8', 13] },
    { id: 'two', label: '둘째', description: '설명', evidence: ['마태복음 6:13'] },
  ] }
  assert.match(publicationErrors([doc({ definition })]).join(), /needs explanation and evidence/)
  definition.states[0].evidence = ['마태복음 6:8, 13']
  assert.deepEqual(publicationErrors([doc({ definition })]), [])
  definition.edges = [{ id: 'e', source: 'n', target: 'n', kind: 'direct', explanation: '연결', evidence: [13] }]
  assert.match(publicationErrors([doc({ definition })]).join(), /invalid experience edge/)
})
