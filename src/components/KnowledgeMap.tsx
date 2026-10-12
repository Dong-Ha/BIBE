import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ContentSummary } from '../content-types'
import { documentHref, mapGroupLabels, mapGroups, questions, readingLinksFor, typeLabels } from '../content'
import type { MapGroup } from '../content'
import './knowledge-map.css'

type Props = {
  focus: ContentSummary
  group: MapGroup
  node?: ContentSummary
  onChange: (focusPublicId: string, group: MapGroup, nodePublicId?: string) => void
}

const desktopColumns = [175, 500, 825]
const mobileColumns = [160]
const cardWidth = 276
const cardHeight = 100
const rowHeight = 124

function linesFor(title: string) {
  const chars = Array.from(title)
  const lines: string[] = []
  for (let index = 0; index < chars.length; index += 16) {
    lines.push(chars.slice(index, index + 16).join(''))
  }
  if (lines.length > 3) lines[2] = `${lines[2].slice(0, 15)}…`
  return lines.slice(0, 3)
}

export default function KnowledgeMap({ focus, group, node, onChange }: Props) {
  const [listView, setListView] = useState(false)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 600)
  useEffect(() => {
    const updateLayout = () => setMobile(window.innerWidth <= 600)
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])
  const links = useMemo(() => readingLinksFor(focus, group), [focus, group])
  const selected = links.find(item => item.publicId === node?.publicId)
  const columns = mobile ? mobileColumns : desktopColumns
  const viewWidth = mobile ? 320 : 1000
  const centerX = viewWidth / 2
  const height = Math.max(310, 168 + Math.ceil(links.length / columns.length) * rowHeight)

  function chooseQuestion(publicId: string) { onChange(publicId, group) }
  function chooseGroup(next: MapGroup) { onChange(focus.publicId, next) }
  function chooseNode(item: ContentSummary) { onChange(focus.publicId, group, item.publicId) }
  function activateNode(event: KeyboardEvent<SVGGElement>, item: ContentSummary) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseNode(item) }
  }

  return <section className="knowledge-map" aria-labelledby="knowledge-map-title">
    <p className="page-kicker">질문에서 자료로</p>
    <h1 id="knowledge-map-title">한 질문에서, 연결을 따라 읽기</h1>
    <p className="knowledge-map-lede">질문을 고르고 연결된 본문과 자료를 살펴보세요. 선은 이 질문에서 함께 읽도록 편집한 자료를 나타냅니다.</p>

    <div className="knowledge-map-controls">
      <label htmlFor="knowledge-map-question">지도의 질문</label>
      <select id="knowledge-map-question" value={focus.publicId} onChange={event => chooseQuestion(event.target.value)}>
        {questions.map(question => <option key={question.id} value={question.publicId}>{question.title}</option>)}
      </select>
    </div>

    <nav className="knowledge-map-filters" aria-label="자료 종류 선택">
      {mapGroups.map(item => <button type="button" key={item} aria-pressed={group === item} onClick={() => chooseGroup(item)}>{mapGroupLabels[item]} <span>{readingLinksFor(focus, item).length}</span></button>)}
    </nav>

    <div className="knowledge-map-caption"><span>{links.length}개 자료</span><button type="button" aria-pressed={listView} onClick={() => setListView(value => !value)}>{listView ? '그림으로 보기' : '글 목록으로 보기'}</button></div>
    {links.length ? <div className={`knowledge-map-canvas${listView ? ' is-list-view' : ''}`}>
      {!listView && <svg className="knowledge-map-svg" viewBox={`0 0 ${viewWidth} ${height}`} role="group" aria-label={`${focus.title}에서 이어 읽을 자료 ${links.length}개`}>
        <g className="knowledge-map-center">
          <rect x={centerX - 150} y="24" width="300" height="82" rx="14" />
          <text x={centerX} y="51" textAnchor="middle">시작 질문</text>
          {linesFor(focus.title).slice(0, 2).map((line, i) => <text key={i} x={centerX} y={74 + i * 19} textAnchor="middle" className="knowledge-map-focus-title">{line}</text>)}
        </g>
        {links.map((item, index) => {
          const x = columns[index % columns.length], y = 178 + Math.floor(index / columns.length) * rowHeight
          return <path key={`link-${item.id}`} className="knowledge-map-link" d={`M${centerX} 106 C${centerX} 142 ${x} 142 ${x} ${y}`} />
        })}
        {links.map((item, index) => {
          const col = index % columns.length, row = Math.floor(index / columns.length)
          const x = columns[col], y = 178 + row * rowHeight
          const selectedItem = item.publicId === node?.publicId
          const titleLines = linesFor(item.title)
          return <g key={item.id} className={`knowledge-map-node${selectedItem ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-label={`${item.reference ? `${item.reference} · ` : ''}${item.title}`} aria-pressed={selectedItem} onClick={() => chooseNode(item)} onKeyDown={event => activateNode(event, item)}>
            <rect x={x - cardWidth / 2} y={y} width={cardWidth} height={cardHeight} rx="12" />
            <text x={x} y={y + 24} textAnchor="middle" className="knowledge-map-node-type">{typeLabels[item.type] ?? item.type}</text>
            {titleLines.map((line, i) => <text key={i} x={x} y={y + 47 + i * 16} textAnchor="middle" className="knowledge-map-node-title">{line}</text>)}
          </g>
        })}
      </svg>}
      {listView && <ul className="knowledge-map-list">{links.map(item => <li key={item.id}><button type="button" aria-pressed={item.publicId === node?.publicId} onClick={() => chooseNode(item)}><span>{item.title}</span><small>{typeLabels[item.type] ?? item.type}</small></button></li>)}</ul>}
    </div> : <p className="knowledge-map-empty">이 질문에는 이 종류의 연결 자료가 아직 없습니다. 다른 종류를 선택해 살펴보세요.</p>}

    {selected ? <aside className="knowledge-map-detail" aria-label="선택한 연결 자료" aria-live="polite">
      <p className="page-kicker">{typeLabels[selected.type] ?? selected.type}</p>
      <h2>{selected.title}</h2>
      <p>{selected.description}</p>
      {selected.type === 'Concept' && <a className="knowledge-map-concept-link" href={documentHref(selected)} data-doc={selected.id} aria-haspopup="dialog">읽던 자리에서 말뜻 보기</a>}
      <a href={documentHref(selected)} data-doc={selected.id} data-open-page="true">전체 페이지 읽기 →</a>
    </aside> : <p className="knowledge-map-empty">지도에서 자료를 선택하면 설명이 여기에 나타납니다.</p>}

    <a className="knowledge-map-focus-link" href={documentHref(focus)} data-doc={focus.id}>이 질문 전체 읽기: {focus.title} →</a>
  </section>
}
