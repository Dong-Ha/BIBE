import { useEffect, useMemo, useState } from 'react'
import type { InteractiveDefinition, ExperienceEdge, ExperienceNode, ExperienceState } from '../content-types'
import './learning-experience.css'

const relationLabels: Record<ExperienceEdge['kind'], string> = {
  direct: '본문에서 직접 연결',
  promise: '약속과 성취',
  theme: '주제의 연결',
  application: '오늘의 적용',
}

const kindLabels: Record<InteractiveDefinition['kind'], string> = {
  story: '이야기 따라 읽기',
  connections: '본문 연결 살펴보기',
  layers: '의미를 펼쳐 보기',
  perspectives: '상황을 다른 관점으로 보기',
}

function SvgMap({
  nodes, edges, activeNodes, activeEdges, selectedNode, onSelectNode, onSelectEdge,
}: {
  nodes: ExperienceNode[]
  edges: ExperienceEdge[]
  activeNodes: string[]
  activeEdges: string[]
  selectedNode: string | null
  onSelectNode: (id: string) => void
  onSelectEdge: (edge: ExperienceEdge) => void
}) {
  const desktopColumns = nodes.length > 4 ? 4 : Math.max(1, nodes.length)
  const [columns, setColumns] = useState(desktopColumns)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(max-width: 540px)')
    const update = () => setColumns(media.matches ? 1 : desktopColumns)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [desktopColumns])
  const positions = useMemo(() => new Map(nodes.map((node, index) => {
    const row = Math.floor(index / columns)
    const col = index % columns
    return [node.id, { x: columns === 1 ? 150 : 110 + col * 180, y: (columns === 1 ? 80 : 110) + row * 130 }]
  })), [nodes, columns])
  const rowCount = Math.ceil(nodes.length / columns)
  const height = Math.max(200, 180 + (rowCount - 1) * 130)
  const width = columns === 1 ? 300 : Math.max(360, 220 + (columns - 1) * 180)
  return <svg className="le-map" viewBox={`0 0 ${width} ${height}`} role="group" aria-label="선택한 장면의 관계를 보여주는 그림">
    {edges.filter((edge) => activeEdges.includes(edge.id)).map((edge) => {
      const from = positions.get(edge.source); const to = positions.get(edge.target)
      if (!from || !to) return null
      const midX = (from.x + to.x) / 2; const midY = (from.y + to.y) / 2
      return <g key={edge.id} className="le-edge" role="button" tabIndex={0} aria-label={`${relationLabels[edge.kind]}: ${edge.explanation}`} onClick={() => onSelectEdge(edge)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectEdge(edge) } }}>
        <path d={`M ${from.x} ${from.y} Q ${midX} ${midY - (from.y === to.y ? 100 : 0)} ${to.x} ${to.y}`} />
        <text x={midX} y={midY - (from.y === to.y ? 76 : 8)} textAnchor="middle">{relationLabels[edge.kind]}</text>
      </g>
    })}
    {nodes.map((node) => {
      const pos = positions.get(node.id)!
      const active = activeNodes.includes(node.id)
      return <g key={node.id} className="le-node" data-active={active} data-selected={selectedNode === node.id} transform={`translate(${pos.x} ${pos.y})`} role="button" tabIndex={0} aria-pressed={selectedNode === node.id} aria-label={`${node.label}. ${node.reference}`} onClick={() => onSelectNode(node.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectNode(node.id) } }}>
        <rect x="-75" y="-35" width="150" height="70" rx="18" />
        <text className="le-node-label" textAnchor="middle" y="-2">{node.label}</text>
        <text className="le-node-ref" textAnchor="middle" y="19">{node.reference}</text>
      </g>
    })}
  </svg>
}

export function LearningExperience({ definition, stateId, onStateChange }: {
  definition: InteractiveDefinition
  stateId: string
  onStateChange: (id: string) => void
}) {
  const [textMode, setTextMode] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<ExperienceEdge | null>(null)
  const [perspective, setPerspective] = useState<'both' | 'first' | 'second'>('both')
  const current = definition.states.find((state) => state.id === stateId)
    ?? definition.states.find((state) => state.id === definition.defaultState)
    ?? definition.states[0]
  const stateIndex = Math.max(0, definition.states.indexOf(current))
  const visibleEdges = current.activeEdges ?? definition.edges.map((edge) => edge.id)
  const evidence = current.evidence
  const chooseState = (state: ExperienceState) => { setSelectedEdge(null); setSelectedNode(null); onStateChange(state.id) }

  useEffect(() => {
    if (!playing || definition.kind !== 'story') return
    const timer = window.setInterval(() => {
      const next = definition.states[(stateIndex + 1) % definition.states.length]
      onStateChange(next.id)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [playing, definition.kind, definition.states, stateIndex, onStateChange])

  useEffect(() => { setPlaying(false); setSelectedEdge(null); setSelectedNode(null) }, [definition.id])

  return <section className="learning-experience" data-kind={definition.kind} aria-labelledby={`le-title-${definition.id}`}>
    <header className="le-header">
      <div><p className="le-kicker">직접 탐색하기 · {kindLabels[definition.kind]}</p><h2 id={`le-title-${definition.id}`}>{definition.title}</h2></div>
      <button className="le-text-toggle" type="button" aria-pressed={textMode} onClick={() => setTextMode((value) => !value)}>{textMode ? '그림 보기' : '글로 보기'}</button>
    </header>
    <p className="le-goal"><span>살펴볼 질문</span>{definition.goal}</p>
    <div className="le-steps" aria-label="탐색 순서">
      <span>1 예상하기</span><span>2 조작하기</span><span>3 본문 확인하기</span><span>4 발견 돌아보기</span><span>5 새 상황에 옮기기</span>
    </div>
    <div className="le-prediction"><span>먼저 예상해 보기</span><p>{definition.before}</p></div>
    {definition.kind === 'story' && <div className="le-controls">
      <div className="le-state-buttons" role="group" aria-label="이야기 장면">
        {definition.states.map((state, index) => <button key={state.id} type="button" data-active={state.id === current.id} aria-pressed={state.id === current.id} onClick={() => chooseState(state)}><span>{String(index + 1).padStart(2, '0')}</span>{state.label}</button>)}
      </div>
      <button className="le-secondary-button" type="button" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>{playing ? '이야기 멈추기' : '장면 이어 보기'}</button>
    </div>}
    {definition.kind === 'connections' && <div className="le-controls le-state-buttons" role="group" aria-label="본문 연결 종류">
      {definition.states.map(state => {
        const matchingKind = definition.defaultState === 'all' && (Object.keys(relationLabels) as ExperienceEdge['kind'][]).find(kind => {
          const ids = definition.edges.filter(edge => edge.kind === kind).map(edge => edge.id)
          return ids.length > 0 && ids.length === state.activeEdges?.length && ids.every(id => state.activeEdges?.includes(id))
        })
        const label = state.id === 'all' ? '모든 연결' : matchingKind ? relationLabels[matchingKind] : state.label
        return <button className="le-filter" key={state.id} type="button" aria-pressed={current.id === state.id} onClick={() => chooseState(state)}>{label}</button>
      })}
    </div>}
    {definition.kind === 'layers' && <div className="le-layer-control"><label htmlFor={`le-range-${definition.id}`}>살펴볼 단계 <strong>{current.label}</strong></label><input id={`le-range-${definition.id}`} type="range" min="0" max={definition.states.length - 1} step="1" value={stateIndex} onChange={(event) => chooseState(definition.states[Number(event.target.value)])} aria-valuetext={current.label} /><div className="le-range-labels"><span>{definition.states[0]?.label}</span><span>{definition.states.at(-1)?.label}</span></div></div>}
    {definition.kind === 'perspectives' && <div className="le-controls" role="group" aria-label="관점 비교 방식">
      {([['both', '두 관점 함께'], ['first', '첫 번째 관점'], ['second', '다른 관점']] as const).map(([id, label]) => <button className="le-filter" key={id} type="button" aria-pressed={perspective === id} onClick={() => setPerspective(id)}>{label}</button>)}
      <div className="le-state-buttons le-perspective-options" role="group" aria-label="상황과 관점 선택">{definition.states.map((state) => <button key={state.id} type="button" data-active={state.id === current.id} aria-pressed={state.id === current.id} onClick={() => chooseState(state)}>{state.label}</button>)}</div>
    </div>}
    <div className="le-workbench">
      {!textMode && <div className="le-visual-panel">
        {definition.kind === 'layers' ? <div className="le-layers" aria-label="의미의 여러 단계">
          {definition.states.map((state, index) => <button key={state.id} type="button" className="le-layer" data-active={state.id === current.id} style={{ '--layer-depth': index } as React.CSSProperties} aria-pressed={state.id === current.id} onClick={() => chooseState(state)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{state.label}</strong><small>{state.id === current.id ? state.description : '선택하여 살펴보기'}</small></button>)}
        </div> : definition.kind === 'perspectives' ? <div className="le-perspective-cards" data-view={perspective}>
          {definition.states.map((state, index) => <button key={state.id} type="button" className="le-perspective-card" data-active={state.id === current.id} data-side={index % 2 === 0 ? 'first' : 'second'} aria-pressed={state.id === current.id} onClick={() => chooseState(state)}><span>{state.label}</span><strong>{state.description}</strong></button>)}
        </div> : <SvgMap nodes={definition.nodes} edges={definition.edges} activeNodes={current.activeNodes} activeEdges={visibleEdges} selectedNode={selectedNode} onSelectNode={setSelectedNode} onSelectEdge={setSelectedEdge} />}
      </div>}
      <div className="le-reading" aria-live="polite">
        <div className="le-current"><span>{definition.kind === 'story' ? '이야기의 장면' : definition.kind === 'layers' ? '살펴보는 단계' : definition.kind === 'perspectives' ? '선택한 관점' : '관계의 초점'}</span><h3>{current.label}</h3><p>{current.description}</p></div>
        {selectedNode && definition.nodes.some((node) => node.id === selectedNode) && (() => { const node = definition.nodes.find((item) => item.id === selectedNode)!; return <div className="le-evidence"><span>선택한 인물 또는 본문</span><h4>{node.label} · {node.reference}</h4><p>{node.detail}</p></div> })()}
        {selectedEdge && <div className="le-evidence"><span>{relationLabels[selectedEdge.kind]}</span><h4>{definition.nodes.find((node) => node.id === selectedEdge.source)?.label} → {definition.nodes.find((node) => node.id === selectedEdge.target)?.label}</h4><p>{selectedEdge.explanation}</p><p className="le-citation">근거: {selectedEdge.evidence.join(' · ')}</p></div>}
        <div className="le-evidence"><span>본문에서 확인하기</span><ul>{evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="le-reflection"><span>발견 돌아보기</span><p>{definition.after}</p></div>
        <div className="le-transfer"><span>새 상황에 옮겨 보기</span><p>{definition.transfer}</p></div>
        <button className="le-reset" type="button" onClick={() => { setPlaying(false); setSelectedNode(null); setSelectedEdge(null); setPerspective('both'); onStateChange(definition.defaultState) }}>처음부터 다시 살펴보기</button>
      </div>
    </div>
    <details className="le-text-alternative"><summary>그림 없이 내용 전체 읽기</summary><ol>{definition.states.map((state) => <li key={state.id}><strong>{state.label}</strong><p>{state.description}</p><p>본문: {state.evidence.join(' · ')}</p></li>)}</ol><ul>{definition.nodes.map((node) => <li key={node.id}><strong>{node.label} ({node.reference})</strong> — {node.detail}</li>)}</ul></details>
  </section>
}

export default LearningExperience
