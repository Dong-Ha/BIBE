import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { projectRoot, readConcept, loadConcepts, compileBundle } from './content.mjs'

test('source collection preserves snapshots, creates a draft, skips unchanged sources and records inaccessible sources', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bibe-ingest-'))
  await mkdir(path.join(root, 'wiki/questions'), { recursive: true })
  await writeFile(path.join(root, 'wiki/questions/example.md'), '---\ntype: Question\ntitle: 예시\ndescription: 설명\npublic_id: example\nstatus: stable\npublished: true\n---\n## 질문\n본문')
  let html = '<html><title>자료</title><p>첫 번째 원자료</p></html>'
  const server = createServer((req, res) => { if (req.url === '/missing') { res.writeHead(403); res.end(); return } res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(html) })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const run = args => promisify(execFile)(process.execPath, [path.join(projectRoot, 'scripts/ingest.mjs'), ...args], { env: { ...process.env, BIBE_CONTENT_ROOT: root } })
  try {
    const args = ['--url', `http://127.0.0.1:${port}/source`, '--id', 'test-source', '--title', '테스트 원자료', '--related', 'questions/example']
    await run(args)
    const docPath = path.join(root, 'wiki/references/test-source.md')
    const draft = readConcept(await readFile(docPath, 'utf8'), 'references/test-source.md')
    assert.equal(draft.meta.status, 'draft')
    assert.equal(draft.meta.published, false)
    assert.equal(draft.meta.verified, undefined)
    assert.equal((await readdir(path.join(root, 'raw/snapshots'))).length, 1)
    assert.equal(compileBundle(await loadConcepts(path.join(root, 'wiki'))).documents.length, 1)
    const originalLog = await readFile(path.join(root, 'wiki/log.md'), 'utf8')
    assert.match(originalLog, /questions\/example/)
    const unchanged = await run(args)
    assert.match(unchanged.stdout, /바뀌지 않았습니다/)
    assert.equal(await readFile(path.join(root, 'wiki/log.md'), 'utf8'), originalLog)
    html = '<html><p>수정된 원자료</p></html>'
    await run(args)
    assert.equal((await readdir(path.join(root, 'raw/snapshots'))).length, 2)
    const newLog = await readFile(path.join(root, 'wiki/log.md'), 'utf8')
    assert.ok(newLog.length > originalLog.length)
    await run(['--url', `http://127.0.0.1:${port}/missing`, '--id', 'blocked-source', '--title', '접근 제한'])
    const catalog = JSON.parse(await readFile(path.join(root, 'raw/ingest-catalog.json'), 'utf8'))
    assert.equal(catalog.at(-1).access, 'unavailable')
    assert.equal(catalog.at(-1).error, 'HTTP 403')
    assert.equal((await readdir(path.join(root, 'raw/snapshots'))).length, 2)
  } finally {
    await new Promise(resolve => server.close(resolve))
    await rm(root, { recursive: true, force: true })
  }
})
