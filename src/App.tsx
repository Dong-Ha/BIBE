import { useEffect, useMemo, useRef, useState } from 'react'
import {
  connectionById,
  getInitialSelection,
  nodeById,
  nodes,
  threadById,
  threads,
} from './data'
import type { Connection, PassageNode, Thread } from './types'

function writeSelection(threadId: string, passageId: string, replace = false) {
  const url = new URL(window.location.href)
  url.searchParams.set('thread', threadId)
  url.searchParams.set('passage', passageId)
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
}

function ThreadRail({
  selectedThread,
  onSelect,
}: {
  selectedThread: Thread
  onSelect: (thread: Thread) => void
}) {
  return (
    <nav className="thread-rail" aria-label="요한복음 실타래">
      <p className="rail-label">여덟 개의 실타래</p>
      <div className="thread-list">
        {threads.map((thread) => {
          const isSelected = selectedThread.id === thread.id
          return (
            <button
              key={thread.id}
              className="thread-button"
              data-active={isSelected}
              aria-current={isSelected ? 'true' : undefined}
              style={{ '--thread-color': thread.color } as React.CSSProperties}
              onClick={() => onSelect(thread)}
            >
              <span className="thread-number">{thread.number}</span>
              <span>
                <strong>{thread.name}</strong>
                <small>{thread.premise}</small>
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function InsightMap({
  thread,
  selectedNode,
  onSelect,
}: {
  thread: Thread
  selectedNode: PassageNode
  onSelect: (node: PassageNode) => void
}) {
  const threadNodes = thread.nodeIds
    .map((id) => nodeById.get(id))
    .filter((node): node is PassageNode => Boolean(node))
  const threadConnections = thread.connectionIds
    .map((id) => connectionById.get(id))
    .filter((connection): connection is Connection => Boolean(connection))

  return (
    <section
      className="map-shell"
      aria-labelledby="map-heading"
      style={{ '--thread-color': thread.color } as React.CSSProperties}
    >
      <div className="map-heading-row">
        <div>
          <p className="overline">현재 실타래 · {thread.number}</p>
          <h2 id="map-heading">{thread.name}</h2>
        </div>
        <span className="map-count">{threadNodes.length}개의 본문</span>
      </div>
      <p className="map-premise">{thread.premise}</p>

      <div className="desktop-map">
        <svg
          viewBox="0 0 920 400"
          role="group"
          aria-label={`${thread.name} 본문 연결 지도. 탭 키로 본문을 선택할 수 있습니다.`}
        >
          <defs>
            <filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#172337" floodOpacity=".1" />
            </filter>
          </defs>
          {threadConnections.map((connection) => {
            const source = nodeById.get(connection.source)
            const target = nodeById.get(connection.target)
            if (!source || !target) return null
            const midX = (source.x + target.x) / 2
            const midY = (source.y + target.y) / 2
            const curve = Math.abs(target.x - source.x) > 250 ? 36 : 18
            return (
              <g key={connection.id} className="connection">
                <path
                  d={`M ${source.x} ${source.y} Q ${midX} ${midY - curve} ${target.x} ${target.y}`}
                  style={{ '--thread-color': thread.color } as React.CSSProperties}
                />
                <g transform={`translate(${midX}, ${midY - curve / 2})`}>
                  <rect x="-34" y="-13" width="68" height="26" rx="13" />
                  <text textAnchor="middle" dominantBaseline="central">{connection.type}</text>
                </g>
              </g>
            )
          })}
          {threadNodes.map((node, index) => {
            const isSelected = node.id === selectedNode.id
            return (
              <g
                key={node.id}
                className="map-node"
                data-active={isSelected}
                transform={`translate(${node.x}, ${node.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${node.reference}, ${node.title}${isSelected ? ', 선택됨' : ''}`}
                onClick={() => onSelect(node)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect(node)
                  }
                }}
              >
                <circle
                  r={isSelected ? 49 : 41}
                  style={{ '--thread-color': thread.color } as React.CSSProperties}
                  filter="url(#paper-shadow)"
                />
                <text className="node-index" textAnchor="middle" y="-6">
                  {String(index + 1).padStart(2, '0')}
                </text>
                <text className="node-reference" textAnchor="middle" y="14">
                  {node.reference.replace('요한복음 ', '요 ')}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="map-hint"><span /> 선을 따라 본문이 어떻게 반복되고 성취되는지 살펴보세요.</p>
      </div>

      <div className="mobile-path" aria-label={`${thread.name} 본문 목록`}>
        {threadNodes.map((node, index) => {
          const previous = index > 0 ? threadNodes[index - 1] : null
          const connection = previous
            ? threadConnections.find((item) =>
              (item.source === previous.id && item.target === node.id)
              || (item.target === previous.id && item.source === node.id))
            : null
          return (
            <div key={node.id}>
              {connection && (
                <div className="mobile-relation">
                  <span>{connection.type}</span>
                  <p>{connection.label}</p>
                </div>
              )}
              <button
                className="mobile-node"
                data-active={selectedNode.id === node.id}
                onClick={() => onSelect(node)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <small>{node.eyebrow}</small>
                  <strong>{node.reference}</strong>
                  <em>{node.title}</em>
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PassagePanel({
  node,
  thread,
  onShare,
  shareState,
}: {
  node: PassageNode
  thread: Thread
  onShare: () => void
  shareState: 'idle' | 'copied' | 'failed'
}) {
  const [lensOpen, setLensOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const relatedConnections = thread.connectionIds
    .map((id) => connectionById.get(id))
    .filter((connection): connection is Connection => Boolean(connection))
    .filter((connection) => connection.source === node.id || connection.target === node.id)

  useEffect(() => {
    setLensOpen(false)
    setStudyOpen(false)
  }, [node.id])

  return (
    <aside
      className="passage-panel"
      aria-label={`${node.reference} 상세`}
      style={{ '--thread-color': thread.color } as React.CSSProperties}
    >
      <div className="passage-topline">
        <span>{node.eyebrow}</span>
        <button className="share-button" onClick={onShare}>
          {shareState === 'copied' ? '링크 복사됨' : shareState === 'failed' ? '주소 표시됨' : '이 발견 공유'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="passage-reference">{node.reference}</p>
      <h2>{node.title}</h2>
      <p className="passage-summary">{node.summary}</p>

      <section className="observation-card">
        <div className="section-kicker">
          <span>01</span>
          <p>본문 관찰</p>
        </div>
        <p>{node.observation}</p>
      </section>

      {relatedConnections.length > 0 && (
        <section className="connection-card">
          <div className="section-kicker">
            <span>02</span>
            <p>본문 사이의 결</p>
          </div>
          <div className="connection-details">
            {relatedConnections.map((connection) => {
              const peerId = connection.source === node.id ? connection.target : connection.source
              const peer = nodeById.get(peerId)
              return (
                <article key={connection.id}>
                  <div>
                    <span>{connection.type}</span>
                    <strong>{connection.label}</strong>
                  </div>
                  {peer && <small>{peer.reference} · {peer.title}</small>}
                  <p>{connection.explanation}</p>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {node.study && (
        <section className="study-section">
          <button
            className="study-disclosure"
            aria-expanded={studyOpen}
            aria-controls="study-guide"
            onClick={() => setStudyOpen((open) => !open)}
          >
            <span>
              <small>03 · 스스로 살펴보기</small>
              <strong>더 깊이 읽기</strong>
            </span>
            <span className="disclosure-icon" aria-hidden="true">{studyOpen ? '−' : '+'}</span>
          </button>
          {studyOpen && (
            <div id="study-guide" className="study-content">
              <section>
                <h3>이 장면의 문맥</h3>
                <p>{node.study.context}</p>
              </section>
              <section>
                <h3>본문에 묻기</h3>
                <ol>
                  {node.study.questions.map((question) => <li key={question}>{question}</li>)}
                </ol>
              </section>
              <aside>
                <strong>읽을 때 주의할 점</strong>
                <p>{node.study.caution}</p>
              </aside>
            </div>
          )}
        </section>
      )}

      <section className="lens-section">
        <button
          className="lens-disclosure"
          aria-expanded={lensOpen}
          aria-controls="reformed-lens"
          onClick={() => setLensOpen((open) => !open)}
        >
          <span className="lens-symbol" aria-hidden="true">R</span>
          <span>
            <small>{node.study ? '04' : '03'} · 해석의 자리</small>
            <strong>개혁주의 렌즈</strong>
          </span>
          <span className="disclosure-icon" aria-hidden="true">{lensOpen ? '−' : '+'}</span>
        </button>

        {lensOpen && (
          <div id="reformed-lens" className="lens-content">
            <h3>{node.lens.title}</h3>
            <p>{node.lens.summary}</p>
            <div className="source-block">
              <p>함께 읽을 말씀</p>
              <ul>
                {node.lens.scripture.map((reference) => <li key={reference}>{reference}</li>)}
              </ul>
            </div>
            <div className="confession-block">
              <p>신앙고백과 함께 읽기</p>
              {node.lens.confessions.map((confession) => (
                <a key={`${confession.document}-${confession.section}`} href={confession.url} target="_blank" rel="noreferrer">
                  <span>
                    <strong>{confession.document}</strong>
                    <small>{confession.section}</small>
                  </span>
                  <em>{confession.summary}</em>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      <a className="bible-link" href={node.externalUrl} target="_blank" rel="noreferrer">
        대한성서공회에서 본문 읽기
        <span aria-hidden="true">→</span>
      </a>
      {shareState === 'failed' && (
        <label className="share-fallback">
          현재 주소를 복사하세요
          <input value={window.location.href} readOnly onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}
    </aside>
  )
}

export default function App() {
  const initial = useRef(getInitialSelection(window.location.search))
  const [threadId, setThreadId] = useState(initial.current.threadId)
  const [passageId, setPassageId] = useState(initial.current.passageId)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const selectedThread = threadById.get(threadId) || threads[0]
  const selectedNode = nodeById.get(passageId) || nodes[0]

  const relationSummary = useMemo(() => {
    const connections = selectedThread.connectionIds
      .map((id) => connectionById.get(id))
      .filter((connection): connection is Connection => Boolean(connection))
    const related = connections.filter((connection) =>
      connection.source === selectedNode.id || connection.target === selectedNode.id)
    return related.map((connection) => connection.label).join(', ')
  }, [selectedNode.id, selectedThread])

  useEffect(() => {
    writeSelection(selectedThread.id, selectedNode.id, true)
    const onPopState = () => {
      const next = getInitialSelection(window.location.search)
      setThreadId(next.threadId)
      setPassageId(next.passageId)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    setShareState('idle')
    document.title = `${selectedNode.reference} · ${selectedThread.name} | 말씀의 결`
  }, [selectedNode.reference, selectedThread.name])

  const selectThread = (thread: Thread) => {
    const nextPassage = thread.nodeIds[0]
    setThreadId(thread.id)
    setPassageId(nextPassage)
    writeSelection(thread.id, nextPassage)
  }

  const selectNode = (node: PassageNode) => {
    setPassageId(node.id)
    writeSelection(selectedThread.id, node.id)
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareState('copied')
    } catch {
      setShareState('failed')
    }
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="말씀의 결 홈">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>
            <strong>말씀의 결</strong>
            <small>LOGOS THREADS</small>
          </span>
        </a>
        <div className="book-context">
          <span>탐험 중인 책</span>
          <strong>요한복음</strong>
          <small>복음서 · 21장</small>
        </div>
        <div className="view-principle">
          <span aria-hidden="true">◌</span>
          <p><small>읽기의 원칙</small><strong>본문에서 시작해, 그리스도께로</strong></p>
        </div>
      </header>

      <main className="workspace">
        <ThreadRail selectedThread={selectedThread} onSelect={selectThread} />
        <InsightMap thread={selectedThread} selectedNode={selectedNode} onSelect={selectNode} />
        <PassagePanel node={selectedNode} thread={selectedThread} onShare={share} shareState={shareState} />
      </main>

      <footer className="page-footer">
        <p>본문 관찰과 신학적 해설을 구분하여 읽습니다.</p>
        <span>{relationSummary ? `현재 연결 · ${relationSummary}` : '요한복음의 결을 따라가세요.'}</span>
      </footer>
      <div className="sr-only" aria-live="polite">
        {shareState === 'copied' ? '현재 탐색 주소가 클립보드에 복사되었습니다.' : ''}
      </div>
    </div>
  )
}
