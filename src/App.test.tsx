import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const clipboardWrite = vi.fn()

function setUrl(url: string) {
  window.history.replaceState({}, '', url)
}

describe('question and reading experience', () => {
  beforeEach(() => {
    setUrl('/BIBE/')
    clipboardWrite.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: clipboardWrite } })
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('starts with fourteen life and faith questions and six book reading paths', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: '지금의 질문에서, 다시 복음으로.' })).toBeInTheDocument()
    expect(document.querySelectorAll('#questions .question-card')).toHaveLength(14)
    expect(document.querySelectorAll('[aria-label="책과 함께 읽기"] .question-card')).toHaveLength(6)
    expect(screen.getByRole('link', { name: /교회에 실망했는데 예수를 알아볼 수 있을까/ })).toBeInTheDocument()
  })

  it('opens a question with deep reading and source links, then follows an internal document link', async () => {
    setUrl('/BIBE/?doc=acceptance')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: '잘해야만 사랑받을 수 있을까?' })).toBeInTheDocument()
    const source = screen.getByRole('link', { name: /The Prodigal Sons/ })
    expect(source).toHaveAttribute('href', expect.stringContaining('doc=keller-prodigal'))
    expect(screen.getByRole('link', { name: /누가복음 15:1–32/ })).toHaveAttribute('href', expect.stringContaining('bible.bskorea.or.kr'))
    const deepReading = screen.getByText('깊은 읽기와 해석의 근거').closest('details')!
    fireEvent.click(within(deepReading).getByText('깊은 읽기와 해석의 근거'))
    expect(within(deepReading).getByText(/저자 자료 요약은/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: /칭의/ }))
    expect(await screen.findByRole('heading', { level: 1, name: '칭의' })).toBeInTheDocument()
    expect(window.location.search).toContain('doc=justification')
  })

  it('handles an invalid document and invalid experience state with a useful notice', () => {
    setUrl('/BIBE/?doc=not-a-page')
    const { unmount } = render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('찾을 수 없는 주소')
    expect(screen.getByRole('heading', { name: /지금의 질문에서/ })).toBeInTheDocument()
    unmount()

    setUrl('/BIBE/?doc=story&state=not-a-scene')
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('탐색 상태를 찾을 수 없어 처음 상태로 열었습니다.')
    expect(screen.getByRole('heading', { level: 1, name: '두 아들과 아버지의 이야기' })).toBeInTheDocument()
  })

  it('restores a document after browser popstate navigation', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /잘해야만 사랑받을 수 있을까/ }))
    expect(await screen.findByRole('heading', { level: 1, name: '잘해야만 사랑받을 수 있을까?' })).toBeInTheDocument()
    window.history.pushState({}, '', '/BIBE/?doc=church-hurt')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(await screen.findByRole('heading', { level: 1, name: '교회에 실망했는데 예수를 알아볼 수 있을까?' })).toBeInTheDocument()
  })

  it('copies the current document and selected experience state to the clipboard', async () => {
    setUrl('/BIBE/?doc=story')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /형의 분노/ }))
    expect(window.location.search).toContain('state=resentment')
    fireEvent.click(screen.getByRole('button', { name: /이 페이지 공유/ }))
    await waitFor(() => expect(clipboardWrite).toHaveBeenCalledWith(expect.stringContaining('doc=story')))
    expect(clipboardWrite.mock.calls[0][0]).toContain('state=resentment')
    expect(await screen.findByRole('button', { name: /링크 복사됨/ })).toBeInTheDocument()
  })

  it('offers a selectable address when clipboard access fails', async () => {
    clipboardWrite.mockRejectedValueOnce(new Error('clipboard unavailable'))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 페이지 공유/ }))
    const fallback = await screen.findByRole('textbox', { name: '현재 주소를 복사하세요' })
    expect(fallback).toHaveValue(window.location.href)
  })
})
