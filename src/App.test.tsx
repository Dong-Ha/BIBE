import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('explorer', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('moves between threads and writes the state to the URL', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /성전과 그리스도/ }))
    expect(screen.getByRole('heading', { name: '성전과 그리스도' })).toBeInTheDocument()
    expect(window.location.search).toContain('thread=temple')
    expect(window.location.search).toContain('passage=ex-40-34')
  })

  it('keeps the home link inside the GitHub Pages repository path', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: '말씀의 결 홈' })).toHaveAttribute('href', '/BIBE/')
  })

  it('reveals Reformed commentary after textual observation', () => {
    render(<App />)
    const disclosure = screen.getByRole('button', { name: /개혁주의 렌즈/ })
    expect(disclosure).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(disclosure)
    expect(disclosure).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('heading', { name: '계시는 인격으로 완성된다' })).toBeInTheDocument()
  })

  it('shows why the selected passage connects to its neighbors', () => {
    render(<App />)
    expect(screen.getAllByText('태초와 창조')).toHaveLength(2)
    expect(screen.getByText('두 책 모두 “태초”와 하나님의 창조 행위로 시작한다.')).toBeInTheDocument()
  })

  it('reveals the expanded guide for every thread', () => {
    render(<App />)
    fireEvent.click(screen.getByText('이 실타래 더 깊이 읽기'))
    expect(screen.getByText('읽기의 초점')).toBeInTheDocument()
    expect(screen.getByText(/창조와 성막의 언어를 어떻게 이어 가는지/)).toBeInTheDocument()
    expect(screen.getByText('핵심 질문')).toBeInTheDocument()
  })

  it('opens the two new content threads', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /생수와 성령/ }))
    expect(screen.getByRole('heading', { name: '생수와 성령' })).toBeInTheDocument()
    expect(screen.getByText('5개의 본문')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /증언과 믿음/ }))
    expect(screen.getByRole('heading', { name: '증언과 믿음' })).toBeInTheDocument()
    expect(window.location.search).toContain('thread=witness')
  })

  it('opens the Old Testament covenant path', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /언약과 성취/ }))

    expect(screen.getByRole('heading', { name: '언약과 성취' })).toBeInTheDocument()
    expect(screen.getByText('10개의 본문')).toBeInTheDocument()
    expect(screen.getAllByText('창세기 12:1–3').length).toBeGreaterThanOrEqual(2)
    expect(window.location.search).toContain('thread=covenant')
    expect(window.location.search).toContain('passage=gen-12-1')
  })

  it('opens the deeper reading guide for the cross and resurrection thread', () => {
    window.history.replaceState({}, '', '/?thread=cross&passage=jn-20-24')
    render(<App />)

    const disclosure = screen.getByRole('button', { name: /더 깊이 읽기/ })
    expect(disclosure).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(disclosure)

    expect(disclosure).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('heading', { name: '이 장면의 문맥' })).toBeInTheDocument()
    expect(screen.getByText(/도마의 장면은 복음서의 기록 목적 바로 앞에 놓인다/)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('does not add history entries when the selected passage is clicked again', () => {
    render(<App />)
    const pushState = vi.spyOn(window.history, 'pushState')
    fireEvent.click(screen.getByRole('button', { name: /요한복음 1:1–3,.*선택됨/ }))
    expect(pushState).not.toHaveBeenCalled()
    pushState.mockRestore()
  })

  it('restores the passage and closes commentary on browser navigation', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /개혁주의 렌즈/ }))
    window.history.replaceState({}, '', '/?thread=light&passage=jn-8-12')
    fireEvent.popState(window)
    expect(screen.getByRole('heading', { name: '빛과 어둠' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /개혁주의 렌즈/ })).toHaveAttribute('aria-expanded', 'false')
    expect(document.title).toContain('요한복음 8:12')
  })

  it('ignores a pending copy result after the selected thread changes', async () => {
    let complete!: () => void
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(new Promise<void>((resolve) => { complete = resolve }))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 발견 공유/ }))
    fireEvent.click(screen.getByRole('button', { name: /성전과 그리스도/ }))
    await act(async () => { complete() })
    expect(screen.getByRole('button', { name: /이 발견 공유/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /링크 복사됨/ })).not.toBeInTheDocument()
  })

  it('offers the current URL when copying fails', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('clipboard unavailable'))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 발견 공유/ }))
    expect(await screen.findByLabelText('현재 주소를 복사하세요')).toHaveValue(window.location.href)
  })

  it('selects map passages using the keyboard', () => {
    render(<App />)
    const node = screen.getByRole('button', { name: /창세기 1:1–5,/ })
    fireEvent.keyDown(node, { key: ' ' })
    expect(node).toHaveAttribute('aria-pressed', 'true')
    expect(window.location.search).toContain('passage=gen-1-1')
  })

  it('gives all ten covenant passages distinct map positions', () => {
    window.history.replaceState({}, '', '/?thread=covenant')
    const { container } = render(<App />)
    const nodes = Array.from(container.querySelectorAll('.map-node'))
    expect(nodes).toHaveLength(10)
    expect(new Set(nodes.map((node) => node.getAttribute('transform'))).size).toBe(10)
    const addedNode = screen.getByRole('button', { name: /누가복음 22:19–20,/ })
    fireEvent.click(addedNode)
    expect(screen.getByRole('heading', { name: '너희를 위하여 주는 몸' })).toBeInTheDocument()
    expect(window.location.search).toContain('passage=lk-22-19')
  })

  it('copies a deep link for the selected discovery', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 발견 공유/ }))
    expect(await screen.findByRole('button', { name: /링크 복사됨/ })).toBeInTheDocument()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('thread=word'))
  })
})
