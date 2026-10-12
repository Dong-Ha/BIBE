import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { ContentDocument, ContentSummary } from '../content-types'
import { documentById, documentHref, readingPathRelations, relationshipBasisLabels, relationshipKindLabels } from '../content'
import './path-reading-map.css'

type Props = {
  doc: ContentDocument
  relations: ContentDocument[]
  selectedRelationId?: string
  onSelectRelation: (publicId?: string) => void
  onOpen: (doc: { publicId: string }) => void
}

const desktopCenters = [125, 370, 615]
const desktopCardWidth = 220
const mobileCardWidth = 320

function titleLines(title: string, mobile: boolean) {
  const chars = Array.from(title)
  const max = mobile ? 17 : 15
  const lines: string[] = []
  for (let i = 0; i < chars.length; i += max) lines.push(chars.slice(i, i + max).join(''))
  if (lines.length > 2) lines[1] = `${lines[1].slice(0, max - 1)}…`
  return lines.slice(0, 2)
}

function passageForId(id: string): ContentSummary | undefined {
  const direct = documentById.get(id.startsWith('passages/') ? id : `passages/${id}`)
  return direct?.type === 'Bible Passage' ? direct : undefined
}

function passageKey(passage: ContentSummary) {
  return passage.id.replace(/^passages\//, '')
}

function matchesRelationId(relation: ContentDocument, key: string) {
  return relation.id === key || relation.id === `relationships/${key}` || relation.relationship?.id === key
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export default function PathReadingMap({ doc, relations, selectedRelationId, onSelectRelation, onOpen }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const selectedButton = useRef<HTMLButtonElement>(null)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 600)
  const [listView, setListView] = useState(false)

  useEffect(() => {
    const updateFromWindow = () => setMobile(window.innerWidth <= 600)
    if (typeof ResizeObserver !== 'undefined' && container.current) {
      const observer = new ResizeObserver(entries => setMobile(entries[0]?.contentRect.width <= 600))
      observer.observe(container.current)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', updateFromWindow)
    return () => window.removeEventListener('resize', updateFromWindow)
  }, [])

  const nodes = useMemo(() => [...new Set(doc.nodeIds ?? [])].map(passageForId).filter((item): item is ContentSummary => !!item), [doc.nodeIds])
  const pathSummary = documentById.get(doc.id)
  const allowedRelationIds = useMemo(() => new Set(pathSummary ? readingPathRelations(pathSummary).map(item => item.publicId) : []), [pathSummary])
  const nodeByKey = useMemo(() => {
    const result = new Map<string, ContentSummary>()
    nodes.forEach(item => { result.set(passageKey(item), item); result.set(item.publicId, item); result.set(item.id, item) })
    return result
  }, [nodes])
  const validRelations = useMemo(() => {
    const connectionIds = new Set(doc.connectionIds ?? [])
    return relations.filter(relation => {
      const edge = relation.relationship
      if (!edge || !allowedRelationIds.has(relation.publicId) || ![...connectionIds].some(id => matchesRelationId(relation, id))) return false
      return nodeByKey.has(edge.source) && nodeByKey.has(edge.target)
    })
  }, [allowedRelationIds, doc.connectionIds, nodeByKey, relations])
  const selected = validRelations.find(relation => relation.publicId === selectedRelationId)
  const selectedEdge = selected?.relationship
  const selectedSource = selectedEdge ? nodeByKey.get(selectedEdge.source) : undefined
  const selectedTarget = selectedEdge ? nodeByKey.get(selectedEdge.target) : undefined
  const columns = mobile ? 1 : 3
  const rowGap = mobile ? 112 : 150
  const viewWidth = mobile ? 360 : 740
  const centers = mobile ? [180] : desktopCenters
  const cardWidth = mobile ? mobileCardWidth : desktopCardWidth
  const positions = nodes.map((_, index) => ({
    x: centers[index % columns],
    y: 72 + Math.floor(index / columns) * rowGap,
  }))
  const height = Math.max(144, 144 + (Math.ceil(nodes.length / columns) - 1) * rowGap)
  const indexForKey = (key: string) => nodes.findIndex(item => [passageKey(item), item.publicId, item.id].includes(key))

  function openPassage(event: MouseEvent<HTMLAnchorElement>, passage: ContentSummary) {
    if (!isPlainClick(event)) return
    event.preventDefault()
    onOpen(passage)
  }

  function clearRelation() {
    const button = selectedButton.current
    onSelectRelation(undefined)
    button?.focus()
  }

  return <section className="path-reading-map" aria-label="이 경로의 본문 연결 지도">
    <h2>본문을 연결해 읽기</h2>
    <p className="path-reading-map-intro">경로가 함께 읽도록 묶은 본문과 관계를 보여 줍니다. 선만으로 관계가 증명되는 것은 아닙니다. 종류와 근거는 연결을 선택해 살펴보세요.</p>
    <div className="path-reading-map-legend" aria-label="선의 의미">
      {Object.entries(relationshipKindLabels).map(([kind, label]) => <span key={kind}><i className={`path-map-line path-map-line-${kind}`} aria-hidden="true" />{label}</span>)}
    </div>
    <div className="path-reading-map-caption"><span>{nodes.length}개 본문 · {validRelations.length}개 연결</span><button type="button" aria-pressed={listView} onClick={() => setListView(value => !value)}>{listView ? '그림으로 보기' : '글 목록으로 보기'}</button></div>
    <div className={`path-reading-map-canvas${listView ? ' is-list-view' : ''}`} ref={container}>
      <div className="path-reading-map-visual" hidden={listView}>
        <svg className={`path-reading-map-svg${mobile ? ' is-single-column' : ''}`} viewBox={`0 0 ${viewWidth} ${height}`} role="group" aria-label={`${doc.title} 본문 지도`}>
          <g className="path-map-edges" aria-hidden="true">
            {validRelations.map((relation, index) => {
              const edge = relation.relationship!
              const from = indexForKey(edge.source), to = indexForKey(edge.target)
              if (from < 0 || to < 0) return null
              const a = positions[from], b = positions[to]
              const selectedRelation = relation.publicId === selectedRelationId
              const mobilePath = mobile
                ? (() => { const side = (index + relation.id.length) % 2 ? 8 : viewWidth - 8; const edgeX = side < viewWidth / 2 ? viewWidth / 2 - cardWidth / 2 : viewWidth / 2 + cardWidth / 2; return `M${edgeX} ${a.y} C${side} ${a.y}, ${side} ${b.y}, ${edgeX} ${b.y}` })()
                : `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`
              return <path key={relation.id} className={`path-map-edge path-map-edge-${edge.kind}${selectedRelation ? ' is-selected' : ''}`} data-relation={relation.publicId} d={mobilePath} />
            })}
          </g>
          <g className="path-map-nodes">
            {nodes.map((passage, index) => {
              const point = positions[index]
              const keys = [passageKey(passage), passage.publicId, passage.id]
              const isEndpoint = !!selectedEdge && keys.some(key => key === selectedEdge.source || key === selectedEdge.target)
              const lines = titleLines(passage.title, mobile)
              return <a key={passage.id} className={`path-map-node${isEndpoint ? ' is-endpoint' : ''}`} href={documentHref(passage)} aria-label={`${passage.reference ? `${passage.reference} · ` : ''}${passage.title}`} onClick={event => openPassage(event, passage)}>
                <rect x={point.x - cardWidth / 2} y={point.y - 38} width={cardWidth} height="76" rx="11" />
                <text x={point.x} y={point.y - 13} textAnchor="middle" className="path-map-reference">{passage.reference ?? '성경 본문'}</text>
                {lines.map((line, lineIndex) => <text key={lineIndex} x={point.x} y={point.y + 10 + lineIndex * 19} textAnchor="middle" className="path-map-title">{line}</text>)}
              </a>
            })}
          </g>
        </svg>
      </div>
      <ul className="path-reading-map-node-list" aria-label="경로의 성경 본문" hidden={!listView}>
        {nodes.map(passage => <li key={passage.id}><a href={documentHref(passage)} onClick={event => openPassage(event, passage)}><span>{passage.reference ? `${passage.reference} · ` : ''}{passage.title}</span></a></li>)}
      </ul>
    </div>
    <div className="path-reading-map-relations" aria-label="본문 연결 선택">
      {validRelations.map(relation => <button key={relation.id} ref={relation.publicId === selectedRelationId ? selectedButton : undefined} type="button" className={relation.publicId === selectedRelationId ? 'is-selected' : ''} aria-pressed={relation.publicId === selectedRelationId} onClick={() => onSelectRelation(relation.publicId)}>
        <span>{relation.title}</span><small>{relationshipKindLabels[relation.relationship!.kind]}</small>
      </button>)}
    </div>
    {selected?.relationship && selectedEdge && <aside className="path-reading-map-detail" aria-label="선택한 본문 연결" aria-live="polite">
      <div className="path-reading-map-detail-heading"><div><p className="page-kicker">{relationshipKindLabels[selectedEdge.kind]}</p><h3>{selected.title}</h3></div><button type="button" onClick={clearRelation}>연결 선택 해제</button></div>
      <p>{selectedEdge.explanation}</p>
      {selectedEdge.basis && selectedEdge.basisExplanation && <div className="path-map-basis" role="group" aria-label="해석의 성격"><strong>읽는 방식: {relationshipBasisLabels[selectedEdge.basis]}</strong><p>{selectedEdge.basisExplanation}</p></div>}
      <div className="path-map-evidence" role="group" aria-label="본문에서 확인할 근거"><strong>본문에서 확인할 근거</strong><ul>{selectedEdge.evidence.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
      <nav className="path-map-passage-links" aria-label="함께 읽는 본문">
        {selectedSource && <a href={documentHref(selectedSource)} onClick={event => openPassage(event, selectedSource)}>{selectedSource.reference ? `${selectedSource.reference} · ` : ''}{selectedSource.title}</a>}
        {selectedTarget && <a href={documentHref(selectedTarget)} onClick={event => openPassage(event, selectedTarget)}>{selectedTarget.reference ? `${selectedTarget.reference} · ` : ''}{selectedTarget.title}</a>}
      </nav>
      <a className="path-map-relation-link" href={documentHref(selected)} onClick={event => { if (isPlainClick(event)) { event.preventDefault(); onOpen(selected) } }}>{selected.title} 연결 해설 읽기 →</a>
    </aside>}
  </section>
}
