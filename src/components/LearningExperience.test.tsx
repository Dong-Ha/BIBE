import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LearningExperience } from './LearningExperience'
import type { InteractiveDefinition } from '../content-types'

const node = (id: string, label: string, reference: string) => ({ id, label, reference, detail: `${label}의 본문 설명` })
const definition = (kind: InteractiveDefinition['kind'], states: InteractiveDefinition['states'], edges: InteractiveDefinition['edges'] = []): InteractiveDefinition => ({
  id: `test-${kind}`, kind, title: '본문을 살펴보기', goal: '본문의 관계를 살펴봅니다.',
  before: '무엇이 먼저 눈에 들어오나요?', after: '새 사례에서 어떻게 적용할 수 있나요?',
  transfer: '본문의 문맥을 확인하세요.', defaultState: states[0].id, states,
  nodes: [node('a', '첫 장면', '눅 15:11'), node('b', '다음 장면', '눅 15:20')], edges,
})
const states: InteractiveDefinition['states'] = [
  { id: 'start', label: '떠남', description: '아들이 집을 떠납니다.', evidence: ['누가복음 15:11–16'], activeNodes: ['a'], activeEdges: [] },
  { id: 'end', label: '돌아옴', description: '아버지가 아들을 맞이합니다.', evidence: ['누가복음 15:20–24'], activeNodes: ['a', 'b'], activeEdges: ['welcome'] },
]

describe('LearningExperience', () => {
  it('story controls update the URL-controlled state and reset to the default', () => {
    const onStateChange = vi.fn()
    render(<LearningExperience definition={definition('story', states)} stateId="start" onStateChange={onStateChange} />)
    fireEvent.click(screen.getByRole('button', { name: /돌아옴/ }))
    expect(onStateChange).toHaveBeenCalledWith('end')
    expect(screen.getByText('누가복음 15:11–16')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 살펴보기' }))
    expect(onStateChange).toHaveBeenLastCalledWith('start')
  })

  it('connection map reveals the selected relationship and its evidence', () => {
    const edge = { id: 'welcome', source: 'a', target: 'b', kind: 'direct' as const, explanation: '아버지가 아들을 맞이합니다.', evidence: ['누가복음 15:20'] }
    const onStateChange = vi.fn()
    const connectionDefinition = definition('connections', states, [edge])
    const { rerender } = render(<LearningExperience definition={connectionDefinition} stateId="start" onStateChange={onStateChange} />)
    fireEvent.click(screen.getByRole('button', { name: '돌아옴' }))
    expect(onStateChange).toHaveBeenCalledWith('end')
    rerender(<LearningExperience definition={connectionDefinition} stateId="end" onStateChange={onStateChange} />)
    const nodeButton = screen.getByRole('button', { name: '첫 장면. 눅 15:11' })
    fireEvent.keyDown(nodeButton, { key: 'Enter' })
    expect(screen.getByText('첫 장면의 본문 설명')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /본문에서 직접 연결: 아버지가 아들을 맞이합니다/ }))
    expect(screen.getByText('근거: 누가복음 15:20')).toBeInTheDocument()
  })

  it('layer slider exposes a named stage and a text-only alternative', () => {
    const onStateChange = vi.fn()
    const layerStates = [
      { ...states[0], id: 'grace', label: '은혜', description: '구원은 선물입니다.' },
      { ...states[1], id: 'response', label: '응답', description: '새 삶으로 응답합니다.' },
    ]
    render(<LearningExperience definition={definition('layers', layerStates)} stateId="grace" onStateChange={onStateChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } })
    expect(onStateChange).toHaveBeenCalledWith('response')
    fireEvent.click(screen.getByRole('button', { name: '글로 보기' }))
    expect(screen.queryByRole('group', { name: '의미의 여러 단계' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('그림 없이 내용 전체 읽기'))
    expect(within(screen.getByText('그림 없이 내용 전체 읽기').closest('details')!).getByText('구원은 선물입니다.')).toBeInTheDocument()
  })

  it('perspective cards can be filtered to one viewpoint and switched by keyboard', () => {
    const perspectiveStates = [
      { ...states[0], id: 'failure-self', label: '실패 · 자기 증명' },
      { ...states[1], id: 'failure-grace', label: '실패 · 은혜의 응답' },
    ]
    const onStateChange = vi.fn()
    const perspectiveDefinition = definition('perspectives', perspectiveStates)
    const { rerender } = render(<LearningExperience definition={perspectiveDefinition} stateId="failure-self" onStateChange={onStateChange} />)
    fireEvent.click(screen.getByRole('button', { name: '첫 번째 관점' }))
    expect(screen.getByRole('button', { name: '첫 번째 관점' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(within(screen.getByRole('group', { name: '상황과 관점 선택' })).getByRole('button', { name: '실패 · 은혜의 응답' }))
    expect(onStateChange).toHaveBeenCalledWith('failure-grace')
    rerender(<LearningExperience definition={perspectiveDefinition} stateId="failure-grace" onStateChange={onStateChange} />)
    expect(screen.getAllByText('아버지가 아들을 맞이합니다.')).toHaveLength(3)
  })
})


it('exposes each cumulative connection stage even when it is not a single edge-kind filter', () => {
  const onStateChange = vi.fn()
  const cumulative = definition('connections', [states[0], { ...states[1], id: 'middle', label: '가운데' }, { ...states[1], id: 'complete', label: '함께 돌보기' }])
  render(<LearningExperience definition={cumulative} stateId="start" onStateChange={onStateChange} />)
  fireEvent.click(screen.getByRole('button', { name: '함께 돌보기' }))
  expect(onStateChange).toHaveBeenCalledWith('complete')
})


it('resets to the reading page’s initial state and falls back for unknown overrides', () => {
  const onStateChange = vi.fn()
  const def = definition('story', states)
  const { rerender } = render(<LearningExperience definition={def} stateId="start" resetStateId="end" onStateChange={onStateChange} />)
  fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 살펴보기' }))
  expect(onStateChange).toHaveBeenLastCalledWith('end')
  rerender(<LearningExperience definition={def} stateId="end" resetStateId="missing" onStateChange={onStateChange} />)
  fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 살펴보기' }))
  expect(onStateChange).toHaveBeenLastCalledWith('start')
})
