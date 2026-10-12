import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { stringify } from 'yaml'
import { projectRoot, loadConcepts, readConcept, syncWiki } from './content.mjs'

const args = process.argv.slice(2)
const option = name => { const index = args.indexOf(`--${name}`); return index < 0 ? undefined : args[index + 1] }
const resource = option('url'), slug = option('id'), title = option('title')
if (!resource || !slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  process.stderr.write('사용법: npm run wiki:ingest -- --url https://... --id source-slug --title "자료 제목" [--related questions/acceptance,concepts/grace]\n')
  process.exit(1)
}
const url = new URL(resource)
if (!['http:', 'https:'].includes(url.protocol)) throw new Error('웹 자료는 HTTP(S) 주소로 입력해 주세요.')
const catalogPath = path.join(projectRoot, 'raw/ingest-catalog.json')
const catalog = JSON.parse(await readFile(catalogPath, 'utf8').catch(() => '[]'))
const checkedAt = new Date().toISOString()
const related = (option('related') ?? '').split(',').filter(Boolean)
const existing = await loadConcepts()
for (const id of related) if (!existing.some(doc => doc.id === id)) throw new Error(`관련 문서가 없습니다: ${id}`)
let response, bytes, failure
try {
  response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'BIBE-source-collector/1.0' } })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const reader = response.body.getReader()
  const chunks = []
  let size = 0
  while (true) {
    const chunk = await reader.read()
    if (chunk.done) break
    size += chunk.value.length
    if (size > 5_000_000) { await reader.cancel(); throw new Error('자료가 5MB를 초과합니다. 다운로드 범위를 따로 확인해 주세요.') }
    chunks.push(Buffer.from(chunk.value))
  }
  bytes = Buffer.concat(chunks)
} catch (error) { failure = error.message }
const hash = bytes ? createHash('sha256').update(bytes).digest('hex') : undefined
const last = catalog.filter(entry => entry.id === slug && entry.resource === resource).at(-1)
await mkdir(path.dirname(catalogPath), { recursive: true })
if (last?.sha256 === hash && hash) {
  process.stdout.write('원자료가 바뀌지 않았습니다. 위키를 다시 생성하지 않았습니다.\n')
  process.exit(0)
}
const record = { id: slug, resource, title, checked_at: checkedAt, access: failure ? 'unavailable' : 'fetched', sha256: hash, error: failure, related }
catalog.push(record)
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n')
if (bytes) {
  const directory = path.join(projectRoot, 'raw/snapshots')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, hash), bytes)
}
const docPath = path.join(projectRoot, 'wiki/references', `${slug}.md`)
const previousText = await readFile(docPath, 'utf8').catch(() => null)
const previous = previousText ? readConcept(previousText, `references/${slug}.md`) : null
const meta = {
  ...(previous?.meta ?? {}), type: 'Reference', title, public_id: previous?.meta.public_id ?? `source-${slug}`,
  description: previous?.meta.description ?? '원자료를 수집한 뒤 내용과 인용 근거를 대조할 자료입니다.',
  status: 'draft', published: false, tags: previous?.meta.tags ?? [],
  sources: [{ id: slug, resource, title }], generated: { by: 'process:source-collector', at: checkedAt },
  source_hash: hash, access_status: record.access, review_required: true,
}
delete meta.verified
const body = previous?.body ?? `\n## 원자료 확인\n\n[${title}](${resource})\n\n## 내용 요약\n\n원자료를 읽고 직접 확인한 내용만 요약합니다. 검색 색인이나 영상 제목을 원문 정독으로 기록하지 않습니다.\n\n## 관련 자료\n\n${related.map(id => `- [${id}](/${id}.md)`).join('\n') || '관련 질문과 개념을 조사 후 연결합니다.'}\n`
await mkdir(path.dirname(docPath), { recursive: true })
await writeFile(docPath, `---\n${stringify(meta, { lineWidth: 0 })}---\n${body}`)
await syncWiki(await loadConcepts(), `수집: [${title}](/references/${slug}.md). ${failure ? `접근 불가 (${failure})` : `원자료 ${hash.slice(0, 12)} 보존`}. 관련 문서: ${related.join(', ') || '조사 대기'}. 요약·종합·출처 대조는 편집 작업에서 이어간다.`)
process.stdout.write(`${failure ? '접근 상태를 기록했습니다' : '원자료를 보존했습니다'}. 참고 문서는 조사 대기로 생성했습니다. 관련 문서를 종합하고 출처를 대조한 후 공개하세요.\n`)
