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

  it('starts with nineteen life and faith questions and seven book reading paths', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: '지금의 질문에서, 다시 복음으로.' })).toBeInTheDocument()
    expect(document.querySelectorAll('#questions .question-card')).toHaveLength(19)
    expect(document.querySelectorAll('[aria-label="책과 함께 읽기"] .question-card')).toHaveLength(7)
    expect(screen.getByRole('link', { name: /교회에 실망했는데 예수를 알아볼 수 있을까/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /왜 기독교는 죄를 말할까/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /예수의 십자가는 무엇을 바꾸나요/ })).toBeInTheDocument()
  })

  it('opens a question with deep reading and source links, previews a concept in place and follows its full page', async () => {
    setUrl('/BIBE/?doc=acceptance')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: '잘해야만 사랑받을 수 있을까?' })).toBeInTheDocument()
    const source = await screen.findByRole('link', { name: /The Prodigal Sons/ })
    expect(source).toHaveAttribute('href', expect.stringContaining('doc=keller-prodigal'))
    expect(screen.getByRole('link', { name: /누가복음 15:1–32/ })).toHaveAttribute('href', expect.stringContaining('bible.bskorea.or.kr'))
    const deepReading = (await screen.findByText('깊은 읽기와 해석의 근거')).closest('details')!
    fireEvent.click(within(deepReading).getByText('깊은 읽기와 해석의 근거'))
    expect(within(deepReading).getByText(/저자 자료 요약은/)).toBeInTheDocument()
    const term = screen.getByRole('link', { name: /칭의/ })
    fireEvent.click(term)
    expect(await screen.findByRole('dialog', { name: '칭의' })).toBeInTheDocument()
    expect(term).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '말뜻 설명 닫기' }))
    expect(term).toHaveFocus()
    expect(screen.getByRole('link', { name: /칭의/ })).toBe(term)
    fireEvent.click(term)
    expect(await screen.findByRole('dialog', { name: '칭의' })).toBeInTheDocument()
    expect(window.location.search).toContain('doc=acceptance')
    fireEvent.click(screen.getByRole('link', { name: '이 용어의 전체 페이지 읽기 →' }))
    await waitFor(() => expect(window.location.search).toContain('doc=justification'))
    expect(await screen.findByRole('heading', { level: 1, name: '칭의' })).toBeInTheDocument()
  })

  it('handles an invalid document and invalid experience state with a useful notice', async () => {
    setUrl('/BIBE/?doc=not-a-page')
    const { unmount } = render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('찾을 수 없는 주소')
    expect(screen.getByRole('heading', { name: /지금의 질문에서/ })).toBeInTheDocument()
    unmount()

    setUrl('/BIBE/?doc=story&state=not-a-scene')
    render(<App />)
    expect(await screen.findByText('탐색 상태를 찾을 수 없어 처음 상태로 열었습니다.')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: '두 아들과 아버지의 이야기' })).toBeInTheDocument()
  })

  it('restores a document after browser popstate navigation', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /잘해야만 사랑받을 수 있을까/ }))
    await waitFor(() => expect(window.location.search).toContain('doc=acceptance'))
    expect(await screen.findByRole('heading', { level: 1, name: '잘해야만 사랑받을 수 있을까?' })).toBeInTheDocument()
    window.history.pushState({}, '', '/BIBE/?doc=church-hurt')
    fireEvent(window, new PopStateEvent('popstate'))
    await waitFor(() => expect(window.location.search).toContain('doc=church-hurt'))
    expect(await screen.findByRole('heading', { level: 1, name: '교회에 실망했는데 예수를 알아볼 수 있을까?' })).toBeInTheDocument()
  })

  it('copies the current document and selected experience state to the clipboard', async () => {
    setUrl('/BIBE/?doc=story')
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /형의 분노/ }))
    expect(window.location.search).toContain('state=resentment')
    fireEvent.click(await screen.findByRole('button', { name: /이 페이지 공유/ }))
    await waitFor(() => expect(clipboardWrite).toHaveBeenCalledWith(expect.stringContaining('doc=story')))
    expect(clipboardWrite.mock.calls[0][0]).toContain('state=resentment')
    expect(await screen.findByRole('button', { name: /링크 복사됨/ })).toBeInTheDocument()
  })

  it('starts new questions with their embedded layers and connections and previews linked concepts in place', async () => {
    setUrl('/BIBE/?doc=sin-question')
    const first = render(<App />)
    expect(await screen.findByRole('heading', { level: 2, name: '은혜와 변화의 관계' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: '왜 기독교는 죄를 말할까?' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 3, name: '은혜로 주어짐' })).toBeInTheDocument()
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '3' } })
    expect(window.location.search).toContain('state=response')
    expect(await screen.findByRole('heading', { level: 3, name: '선한 일을 향한 삶' })).toBeInTheDocument()
    const sinTerm = document.querySelector<HTMLAnchorElement>('.reading-body a[data-doc="concepts/sin"]')!
    fireEvent.click(sinTerm)
    expect(await screen.findByRole('dialog', { name: '죄' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '말뜻 설명 닫기' }))
    expect(sinTerm).toHaveFocus()
    expect(window.location.search).toContain('doc=sin-question')
    expect(window.location.search).toContain('state=response')
    first.unmount()

    setUrl('/BIBE/?doc=cross-question')
    render(<App />)
    expect(await screen.findByRole('heading', { level: 2, name: '유월절과 예수의 십자가' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: '예수의 십자가는 무엇을 바꾸나요?' })).toBeInTheDocument()
    const filters = screen.getByRole('group', { name: '본문 연결 종류' })
    expect(within(filters).getByRole('button', { name: '모든 연결' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(within(filters).getByRole('button', { name: '주제의 연결' }))
    expect(window.location.search).toContain('state=theme')
    const map = await screen.findByRole('group', { name: '선택한 장면의 관계를 보여주는 그림' })
    fireEvent.click(within(map).getByRole('button', { name: /주제의 연결/ }))
    expect(within(document.querySelector('.le-evidence')!).getByText(/유월절 어린양/)).toBeInTheDocument()
  })

  it('offers a selectable address when clipboard access fails', async () => {
    clipboardWrite.mockRejectedValueOnce(new Error('clipboard unavailable'))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 페이지 공유/ }))
    const fallback = await screen.findByRole('textbox', { name: '현재 주소를 복사하세요' })
    expect(fallback).toHaveValue(window.location.href)
  })
})


describe('prayer reading and state links', () => {
  beforeEach(() => {
    setUrl('/BIBE/')
    clipboardWrite.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: clipboardWrite } })
  })

  it('opens the Lord’s Prayer experience, shares its state, restores it on reload, and resets', async () => {
    setUrl('/BIBE/?doc=prayer-start')
    const { unmount } = render(<App />)
    expect(await screen.findByRole('heading', { level: 2, name: '주기도문의 여섯 초점' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: '기도를 어떻게 시작할 수 있을까?' })).toBeInTheDocument()
    const scenes = await screen.findByRole('group', { name: '이야기 장면' })
    fireEvent.click(within(scenes).getByRole('button', { name: /나라와 뜻을 구함/ }))
    expect(window.location.search).toContain('state=kingdom')
    fireEvent.click(screen.getByRole('button', { name: /이 페이지 공유/ }))
    await waitFor(() => expect(clipboardWrite).toHaveBeenCalledWith(expect.stringContaining('state=kingdom')))

    unmount()
    setUrl('/BIBE/?doc=prayer-start&state=kingdom')
    render(<App />)
    expect(await screen.findByRole('heading', { name: '나라와 뜻을 구함' })).toBeInTheDocument()
    fireEvent.click(await screen.findByRole('button', { name: '처음부터 다시 살펴보기' }))
    expect(window.location.search).toContain('state=father')
    expect(await screen.findByRole('heading', { name: '아버지께 나아감' })).toBeInTheDocument()
  })

  it('starts waiting and silence questions in their selected perspective states', async () => {
    setUrl('/BIBE/?doc=unanswered-prayer')
    const { unmount } = render(<App />)
    expect(await screen.findByRole('heading', { name: '기다림 · 관계 안에서 말함' })).toBeInTheDocument()
    unmount()
    setUrl('/BIBE/?doc=prayer-silence')
    render(<App />)
    expect(await screen.findByRole('heading', { name: '말없음 · 연약함을 맡김' })).toBeInTheDocument()
  })
})
