import { fireEvent, render, screen, within } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { ContentDocument } from '../content-types'
import { documentById, paths, readingPathRelations } from '../content'
import PathReadingMap from './PathReadingMap'

const pathSummary = paths.find(path => readingPathRelations(path).length > 0)!
const firstRelationSummary = readingPathRelations(pathSummary)[0]
const relationKey = pathSummary.connectionIds!.find(id => documentById.get(`relationships/${id}`)?.publicId === firstRelationSummary.publicId)!
const edge = firstRelationSummary.relationship!
const relation = {
  ...firstRelationSummary,
  title: '선택한 본문 연결 해설',
  description: '연결 설명',
  relationship: {
    id: relationKey,
    source: edge.source,
    target: edge.target,
    kind: edge.kind,
    from: `/passages/${edge.source}.md`,
    to: `/passages/${edge.target}.md`,
    explanation: '두 본문을 함께 읽을 때 살펴볼 설명입니다.',
    evidence: ['첫 본문 1장', '둘째 본문 2장'],
    basis: 'explicit' as const,
    basisExplanation: '본문에서 직접 확인할 수 있는 선언입니다.',
  },
  sections: [], sources: [], searchText: '',
} as unknown as ContentDocument
const pathDoc = { ...pathSummary, sections: [], sources: [], searchText: '' } as unknown as ContentDocument
const nodeSummaries = pathSummary.nodeIds!.map(id => documentById.get(`passages/${id}`)!).filter(Boolean)

function renderMap(props: Partial<ComponentProps<typeof PathReadingMap>> = {}) {
  const onSelectRelation = vi.fn()
  const onOpen = vi.fn()
  const view = render(<PathReadingMap doc={pathDoc} relations={[relation]} onSelectRelation={onSelectRelation} onOpen={onOpen} {...props} />)
  return { ...view, onSelectRelation, onOpen }
}

describe('PathReadingMap', () => {
  it('shows real passage links and relation choices from the path membership', () => {
    renderMap()
    const map = screen.getByRole('region', { name: '이 경로의 본문 연결 지도' })
    expect(within(map).getAllByRole('link')).toHaveLength(nodeSummaries.length)
    expect(within(map).getByRole('button', { name: /선택한 본문 연결 해설/ })).toHaveAttribute('aria-pressed', 'false')
    expect(map.querySelectorAll('[data-relation]')).toHaveLength(1)
  })

  it('selects only from props, shows the explanation and both passage links, and clears through the callback', () => {
    const { rerender, onSelectRelation } = renderMap()
    fireEvent.click(screen.getByRole('button', { name: /선택한 본문 연결 해설/ }))
    expect(onSelectRelation).toHaveBeenCalledWith(relation.publicId)
    expect(screen.queryByRole('complementary', { name: '선택한 본문 연결' })).not.toBeInTheDocument()

    rerender(<PathReadingMap doc={pathDoc} relations={[relation]} selectedRelationId={relation.publicId} onSelectRelation={onSelectRelation} onOpen={vi.fn()} />)
    const detail = screen.getByRole('complementary', { name: '선택한 본문 연결' })
    expect(within(detail).getByRole('group', { name: '해석의 성격' })).toHaveTextContent('본문의 명시적 선언 또는 인용')
    expect(within(detail).getByRole('group', { name: '본문에서 확인할 근거' })).toHaveTextContent('첫 본문 1장')
    expect(within(detail).getByRole('navigation', { name: '함께 읽는 본문' }).querySelectorAll('a')).toHaveLength(2)
    expect(within(detail).getByRole('link', { name: /선택한 본문 연결 해설 연결 해설 읽기/ })).toBeInTheDocument()
    fireEvent.click(within(detail).getByRole('button', { name: '연결 선택 해제' }))
    expect(onSelectRelation).toHaveBeenLastCalledWith(undefined)
    expect(screen.getByRole('button', { name: /선택한 본문 연결 해설/ })).toHaveFocus()
  })

  it('keeps complete node names in list view and follows passage anchors through onOpen', () => {
    const { onOpen } = renderMap()
    const listToggle = screen.getByRole('button', { name: '글 목록으로 보기' })
    fireEvent.click(listToggle)
    expect(screen.getByRole('button', { name: '그림으로 보기' })).toHaveAttribute('aria-pressed', 'true')
    const passage = nodeSummaries[0]
    const nodeLink = screen.getByRole('link', { name: `${passage.reference} · ${passage.title}` })
    fireEvent.click(nodeLink)
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ publicId: passage.publicId }))
  })

  it('does not intercept modified anchor clicks and ignores an invalid controlled relation id', () => {
    const { onOpen } = renderMap({ selectedRelationId: 'not-in-this-path' })
    expect(screen.queryByRole('complementary', { name: '선택한 본문 연결' })).not.toBeInTheDocument()
    const passage = nodeSummaries[0]
    const anchor = screen.getByRole('link', { name: `${passage.reference} · ${passage.title}` })
    fireEvent.click(anchor, { ctrlKey: true })
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('uses a single-column 360px SVG on mobile and updates after a resize', () => {
    const originalWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 })
    const { container } = renderMap()
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('viewBox', expect.stringMatching(/^0 0 360 /))
    expect(svg.querySelectorAll('.path-map-node')).toHaveLength(nodeSummaries.length)
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
    fireEvent(window, new Event('resize'))
    expect(svg).toHaveAttribute('viewBox', expect.stringMatching(/^0 0 740 /))
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth })
  })
})
