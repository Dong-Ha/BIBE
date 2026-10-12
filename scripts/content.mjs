import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { parse, stringify } from 'yaml'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export const projectRoot = process.env.BIBE_CONTENT_ROOT ? path.resolve(process.env.BIBE_CONTENT_ROOT) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const wikiRoot = path.join(projectRoot, 'wiki')

export async function markdownFiles(root) {
  const entries = await readdir(root, { withFileTypes: true })
  const groups = await Promise.all(entries.map(async entry => {
    const name = path.join(root, entry.name)
    return entry.isDirectory() ? markdownFiles(name) : entry.name.endsWith('.md') ? [name] : []
  }))
  return groups.flat().sort()
}

export function readConcept(text, relativePath) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`${relativePath}: YAML frontmatter is required for a concept`)
  let meta
  try { meta = parse(match[1]) } catch (error) { throw new Error(`${relativePath}: ${error.message}`) }
  if (!meta || typeof meta.type !== 'string' || !meta.type.trim()) throw new Error(`${relativePath}: type is required`)
  const body = match[2]
  return { id: relativePath.replace(/\.md$/, ''), path: relativePath, meta, body, hash: createHash('sha256').update(text).digest('hex') }
}

export function resolveConceptLink(href, fromId) {
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('#')) return null
  const [file] = href.split('#')
  if (!file.endsWith('.md')) return null
  return path.posix.normalize(file.startsWith('/') ? file.slice(1) : path.posix.join(path.posix.dirname(fromId), file)).replace(/\.md$/, '')
}

export function linksIn(body, id) {
  const links = []
  marked.walkTokens(marked.lexer(body), token => {
    if (token.type === 'link') {
      const resolved = resolveConceptLink(token.href, id)
      if (resolved) links.push(resolved)
    }
  })
  return [...new Set(links)]
}

export async function loadConcepts(root = wikiRoot) {
  const files = await markdownFiles(root)
  const docs = []
  for (const file of files) {
    if (['index.md', 'log.md'].includes(path.basename(file))) continue
    docs.push(readConcept(await readFile(file, 'utf8'), path.relative(root, file).split(path.sep).join('/')))
  }
  return docs
}

const relationKinds = ['direct', 'promise', 'theme', 'application']
const experienceKinds = ['story', 'connections', 'layers', 'perspectives']

export function publicationErrors(concepts) {
  const errors = []
  const publicDocs = concepts.filter(d => d.meta.published === true && d.meta.status === 'stable')
  const byId = new Map(publicDocs.map(d => [d.id, d]))
  const publicIds = new Set()
  for (const doc of publicDocs) {
    const { meta, body, id } = doc
    const fail = message => errors.push(`${id}: ${message}`)
    if (!meta.title || !meta.description || !meta.public_id) fail('site requires title, description and public_id')
    if (publicIds.has(meta.public_id)) fail(`duplicate public_id ${meta.public_id}`)
    publicIds.add(meta.public_id)
    if (!Array.isArray(meta.sources) || !meta.sources.length) fail('published explanation needs sources')
    const sourceIds = new Set()
    for (const source of meta.sources ?? []) {
      if (!source.resource) fail('source.resource is required')
      else if (!/^https?:\/\//i.test(source.resource) && !resolveConceptLink(source.resource, id)) fail('site source must be an HTTP(S) URL or a bundle document')
      if (source.id && sourceIds.has(source.id)) fail(`duplicate source id ${source.id}`)
      if (source.id) sourceIds.add(source.id)
      const sourceTarget = source.resource && resolveConceptLink(source.resource, id)
      if (sourceTarget && !byId.has(sourceTarget)) fail(`missing source document ${sourceTarget}`)
    }
    const footnoteDefinitions = new Set([...body.matchAll(/^\[\^([^\]]+)\]:/gm)].map(match => match[1]))
    for (const citation of body.matchAll(/\[\^([^\]]+)\]/g)) {
      if (!sourceIds.has(citation[1])) fail(`citation without source ${citation[1]}`)
      if (!footnoteDefinitions.has(citation[1])) fail(`citation without footnote definition ${citation[1]}`)
    }
    const books = Array.isArray(meta.books) ? meta.books : []
    if (meta.books !== undefined && !Array.isArray(meta.books)) fail('books must be an array')
    if (books.some(book => typeof book !== 'string')) fail('book paths must be strings')
    const bookPaths = books.filter(book => typeof book === 'string')
    if (meta.days !== undefined && !Array.isArray(meta.days)) fail('days must be an array')
    const days = Array.isArray(meta.days) ? meta.days : []
    const dayLinks = days.flatMap(day => [day?.question, day?.passage, day?.experience].filter(link => typeof link === 'string'))
    const references = [...linksIn(body, id), ...(meta.passages ?? []), ...(meta.questions ?? []), ...bookPaths, ...dayLinks, ...(meta.experience ? [meta.experience] : [])]
    for (const link of references) {
      const target = link.replace(/^\//, '').replace(/\.md$/, '')
      if (!byId.has(target)) fail(`unpublished or missing target ${target}`)
    }
    for (const book of bookPaths) {
      const target = byId.get(book.replace(/^\//, '').replace(/\.md$/, ''))
      if (target && target.meta.type !== 'Reference') fail('book must reference a source document')
    }
    if (meta.logos && (!/^LLS:[A-Z0-9]+$/.test(meta.logos.resource_id ?? '') || meta.logos.uri !== `logosres:${meta.logos.resource_id.slice(4).toLowerCase()}` || !meta.logos.access)) fail('invalid Logos resource metadata')
    if (meta.type === 'Study Series' && (!meta.books?.length || !meta.passages?.length || !meta.experience || !body.includes('## 대화와 작은 실천'))) fail('study needs books, passages, experience and practice')
    if (meta.type === 'Reading Guide') {
      if (days.length !== 7 || new Set(days.map(day => day?.id)).size !== 7) fail('guide needs seven unique days')
      for (const day of days) {
        if (!day || !/^day-[1-7]$/.test(day.id ?? '') || !['title', 'focus', 'reflection', 'practice'].every(key => typeof day[key] === 'string' && day[key].trim())) { fail('guide day needs id, title, focus, reflection and practice'); continue }
        for (const [field, type] of [['question', 'Question'], ['passage', 'Bible Passage'], ['experience', 'Learning Experience']]) {
          if (field === 'experience' && day[field] === undefined) continue
          const target = typeof day[field] === 'string' && byId.get(day[field].replace(/^\//, '').replace(/\.md$/, ''))
          if (!target || target.meta.type !== type) fail(`guide day ${day.id} needs a published ${type}`)
        }
      }
    }
    if (meta.type === 'Question') {
      for (const heading of ['본문과 맥락', '복음으로 읽기', '남는 질문', '오늘의 응답']) {
        if (!body.includes(`## ${heading}`)) fail(`missing editorial section ${heading}`)
      }
      if (!meta.passages?.length || !meta.experience) fail('question needs passages and an experience')
      const exercise = byId.get(meta.experience?.replace(/^\//, '').replace(/\.md$/, ''))?.meta.definition
      if (meta.experience_state && !exercise?.states.some(state => state.id === meta.experience_state)) fail('unknown question experience_state')
    }
    if (meta.type === 'Bible Passage' && (!meta.reference || !body.includes('## 본문과 맥락') || !body.includes('## 복음으로 읽기'))) fail('passage needs reference, context and gospel explanation')
    if (meta.relationship) {
      const relation = meta.relationship
      if (!relationKinds.includes(relation.kind) || !relation.explanation || !relation.evidence?.length) fail('relationship requires kind, explanation and evidence')
      for (const target of [relation.from, relation.to]) if (!byId.has(target?.replace(/^\//, '').replace(/\.md$/, ''))) fail(`missing relationship endpoint ${target}`)
    }
    if (meta.definition) {
      const def = meta.definition
      const states = def.states ?? []
      if (!experienceKinds.includes(def.kind) || !def.goal || !def.before || !def.after || !def.transfer || states.length < 2) fail('experience needs learning tasks and at least two states')
      if (!states.some(s => s.id === def.defaultState)) fail('invalid experience defaultState')
      const nodeIds = new Set((def.nodes ?? []).map(n => n.id))
      const edgeIds = new Set((def.edges ?? []).map(e => e.id))
      if (new Set(states.map(s => s.id)).size !== states.length) fail('duplicate experience state')
      if (nodeIds.size !== (def.nodes ?? []).length || edgeIds.size !== (def.edges ?? []).length) fail('duplicate experience node or edge')
      for (const state of states) {
        if (!state.label || !state.description || !state.evidence?.length) fail(`state ${state.id} needs explanation and evidence`)
        for (const node of state.activeNodes ?? []) if (!nodeIds.has(node)) fail(`unknown active node ${node}`)
        for (const edge of state.activeEdges ?? []) if (!edgeIds.has(edge)) fail(`unknown active edge ${edge}`)
      }
      for (const edge of def.edges ?? []) if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target) || !relationKinds.includes(edge.kind) || !edge.explanation || !edge.evidence?.length) fail(`invalid experience edge ${edge.id}`)
    }
    for (const actor of [meta.generated, ...([meta.verified].flat())].filter(Boolean)) {
      if (!actor.by || !/^(human:|process:|[^/]+\/)/.test(actor.by) || !actor.at || !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(actor.at)) fail('invalid actor or timestamp')
    }
  }
  return [...new Set(errors)]
}

export function renderMarkdown(body, doc, byId) {
  const sources = new Map((doc.meta.sources ?? []).map(source => [source.id, source]))
  const prepared = body.replace(/^\[\^[^\]]+\]:.*$/gm, '').replace(/\[\^([^\]]+)\]/g, (_, key) => sources.has(key) ? `[근거](#source-${key})` : '')
  return sanitizeHtml(marked.parse(prepared), {
    allowedTags: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'h3', 'h4', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr'],
    allowedAttributes: { a: ['href', 'rel', 'data-doc'], th: ['scope'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    transformTags: {
      a: (_, attrs) => {
        const target = resolveConceptLink(attrs.href ?? '', doc.id)
        if (target && byId.has(target)) return { tagName: 'a', attribs: { href: `?doc=${encodeURIComponent(byId.get(target).meta.public_id)}`, 'data-doc': target } }
        return { tagName: 'a', attribs: { href: attrs.href, rel: 'noopener noreferrer' } }
      },
    },
  })
}

export function compileBundle(concepts) {
  const docs = concepts.filter(d => d.meta.published === true && d.meta.status === 'stable')
  const byId = new Map(docs.map(d => [d.id, d]))
  const links = new Map(docs.map(d => [d.id, [...new Set([...linksIn(d.body, d.id), ...(d.meta.sources ?? []).map(source => resolveConceptLink(source.resource, d.id)).filter(Boolean), ...(d.meta.passages ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')), ...(d.meta.questions ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')), ...(d.meta.days ?? []).flatMap(day => [day.question, day.passage, day.experience].filter(Boolean).map(p => p.replace(/^\//, '').replace(/\.md$/, ''))), ...(d.meta.books ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')), ...(d.meta.experience ? [d.meta.experience.replace(/^\//, '').replace(/\.md$/, '')] : [])])]]))
  const legacy = { passages: {}, threads: {}, connections: {} }
  const documents = docs.map(doc => {
    const { meta, id, body } = doc
    const sections = []
    const matches = [...body.matchAll(/^## (.+)$/gm)]
    if (!matches.length) sections.push({ title: '설명', html: renderMarkdown(body, doc, byId) })
    else for (let i = 0; i < matches.length; i++) sections.push({ title: matches[i][1], html: renderMarkdown(body.slice(matches[i].index + matches[i][0].length, matches[i + 1]?.index ?? body.length), doc, byId) })
    if (meta.legacy_id && meta.type === 'Bible Passage') legacy.passages[meta.legacy_id] = meta.public_id
    if (meta.type === 'Reading Path') legacy.threads[meta.legacy_id] = { path: meta.public_id, firstPassage: meta.node_ids[0], passages: meta.node_ids }
    if (meta.type === 'Relationship' && meta.legacy_id) legacy.connections[meta.legacy_id] = meta.public_id
    return {
      id, publicId: meta.public_id, type: meta.type, title: meta.title, description: meta.description,
      reference: meta.reference, order: meta.order, tags: meta.tags ?? [], aliases: meta.aliases ?? [],
      passages: (meta.passages ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')),
      days: meta.days?.map(day => ({ ...day, question: day.question.replace(/^\//, '').replace(/\.md$/, ''), passage: day.passage.replace(/^\//, '').replace(/\.md$/, ''), experience: day.experience?.replace(/^\//, '').replace(/\.md$/, '') })),
      books: (meta.books ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')), logos: meta.logos,
      questions: (meta.questions ?? []).map(p => p.replace(/^\//, '').replace(/\.md$/, '')),
      experience: meta.experience?.replace(/^\//, '').replace(/\.md$/, ''), experienceState: meta.experience_state, sources: meta.sources ?? [],
      links: links.get(id), backlinks: docs.filter(other => links.get(other.id).includes(id)).map(other => other.id), sections,
      searchText: [meta.title, meta.description, meta.reference, ...(meta.tags ?? []), ...(meta.aliases ?? [])].filter(Boolean).join(' '),
      generated: meta.generated, verified: meta.verified ? [meta.verified].flat() : [], definition: meta.definition,
      nodeIds: meta.node_ids, connectionIds: meta.connection_ids, relationship: meta.relationship,
    }
  })
  return { documents, legacy }
}

export async function syncWiki(concepts, entry) {
  const dirs = new Set(['', ...concepts.map(d => path.posix.dirname(d.path))])
  for (const dir of dirs) {
    const direct = concepts.filter(d => path.posix.dirname(d.path) === (dir || '.'))
    const subdirs = [...new Set(concepts.map(d => d.path).filter(p => dir ? p.startsWith(`${dir}/`) : true).map(p => (dir ? p.slice(dir.length + 1) : p).split('/')).filter(parts => parts.length > 1).map(parts => parts[0]))].sort()
    const lines = [dir ? `# ${dir}` : '---\nokf_version: "0.2"\n---\n# 말씀의 결 지식 위키', '', ...subdirs.map(sub => `- [${sub}](${sub}/index.md) — 자료 묶음`), ...direct.map(d => `- [${d.meta.title}](${path.posix.basename(d.path)}) — ${d.meta.description}`), '']
    await mkdir(path.join(wikiRoot, dir), { recursive: true })
    await writeFile(path.join(wikiRoot, dir, 'index.md'), lines.join('\n'))
  }
  if (entry) {
    const logfile = path.join(wikiRoot, 'log.md')
    let old = await readFile(logfile, 'utf8').catch(() => '# 갱신 기록\n')
    old = old.replace(/^# 갱신 기록\s*/, '')
    await writeFile(logfile, `# 갱신 기록\n\n## ${new Date().toISOString().slice(0, 10)}\n\n- ${entry}\n\n${old}`.trimEnd() + '\n')
  }
}

async function main() {
  const command = process.argv[2] ?? 'build'
  const concepts = await loadConcepts()
  const errors = publicationErrors(concepts)
  if (errors.length) {
    process.stderr.write(`${errors.join('\n')}\n`)
    process.exitCode = 1
    return
  }
  if (command === 'lint') {
    const bundle = compileBundle(concepts)
    const orphans = bundle.documents.filter(doc => !doc.backlinks.length && ['Concept', 'Reference'].includes(doc.type)).map(doc => doc.id)
    const stale = concepts.filter(doc => doc.meta.stale_after && Date.parse(doc.meta.stale_after) <= Date.now()).map(doc => doc.id)
    const draft = concepts.filter(doc => doc.meta.status === 'draft').map(doc => doc.id)
    process.stdout.write(`위키 점검: 연결이 없는 개념·참고 자료 ${orphans.length}개, 재확인 기한 경과 ${stale.length}개, 조사 대기 ${draft.length}개\n`)
    for (const [label, items] of [['연결 확인', orphans], ['기한 확인', stale], ['초안', draft]]) if (items.length) process.stdout.write(`${label}: ${items.slice(0, 12).join(', ')}${items.length > 12 ? ' …' : ''}\n`)
    process.stdout.write('내용의 모순·견해 차이와 인용 범위는 관련 원자료를 읽어 별도로 점검합니다.\n')
  } else if (command === 'sync') await syncWiki(concepts, process.argv.slice(3).join(' ') || '문서 목록과 연결을 점검하고 인덱스를 갱신했다.')
  else if (command === 'build') {
    await mkdir(path.join(projectRoot, 'src/generated'), { recursive: true })
    await writeFile(path.join(projectRoot, 'src/generated/content.json'), JSON.stringify(compileBundle(concepts)))
  }
  process.stdout.write(`OKF 문서 ${concepts.length}개 · 공개 문서 ${concepts.filter(d => d.meta.published === true && d.meta.status === 'stable').length}개 · 출판 검사 통과\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
