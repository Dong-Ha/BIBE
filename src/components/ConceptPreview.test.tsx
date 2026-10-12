import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import ConceptPreview from './ConceptPreview'
import { documentByPublicId, loadDocument } from '../content'
import type { ContentDocument } from '../content-types'

vi.mock('../content', async importOriginal => ({ ...await importOriginal<typeof import('../content')>(), loadDocument: vi.fn() }))
const grace = documentByPublicId.get('grace')!, faith = documentByPublicId.get('faith')!
const detail = (summary = grace): ContentDocument => ({ ...summary, sections: [{ title: '설명', html: `<p>${summary.title} 상세 내용 <a href="#source-bible">근거</a></p>` }], sources: [{ id: 'bible', resource: 'https://bible.bskorea.or.kr/', title: '성경' }], verified: [], searchText: '', relationship: undefined })
const originalModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
// JSDOM has no native dialog API. Browser tests verify modality and focus trapping.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.open = true } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.open = false } })
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})
afterAll(() => {
  for (const [prototype, name, descriptor] of [[HTMLDialogElement.prototype, 'showModal', originalModal], [HTMLDialogElement.prototype, 'close', originalClose], [HTMLElement.prototype, 'scrollIntoView', originalScroll]] as const) {
    if (descriptor) Object.defineProperty(prototype, name, descriptor)
    else Reflect.deleteProperty(prototype, name)
  }
})
beforeEach(() => vi.mocked(loadDocument).mockReset())
function trigger() { const anchor = document.createElement('a'); anchor.href = '?doc=grace'; document.body.append(anchor); anchor.focus(); return anchor }

it('shows the definition during failure and retries the explanation', async () => {
  vi.mocked(loadDocument).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(detail())
  const anchor = trigger()
  const { unmount } = render(<ConceptPreview summary={grace} trigger={anchor} onClose={vi.fn()} onOpen={vi.fn()} />)
  expect(screen.getByText(grace.description)).toBeInTheDocument()
  expect(await screen.findByRole('alert')).toHaveTextContent('상세 설명을 불러오지 못했습니다')
  fireEvent.click(screen.getByRole('button', { name: '설명 다시 불러오기' }))
  expect(await screen.findByText(/은혜 상세 내용/)).toBeInTheDocument()
  expect(loadDocument).toHaveBeenCalledTimes(2)
  unmount(); expect(document.activeElement).toBe(anchor); anchor.remove()
})

it('keeps a late explanation from overwriting the next concept or a closed preview', async () => {
  let finish!: (doc: ContentDocument) => void
  vi.mocked(loadDocument).mockImplementationOnce(() => new Promise(resolve => { finish = resolve })).mockResolvedValueOnce(detail(faith))
  const anchor = trigger(), onClose = vi.fn(), onOpen = vi.fn()
  const { rerender, unmount } = render(<ConceptPreview summary={grace} trigger={anchor} onClose={onClose} onOpen={onOpen} />)
  expect(screen.getByRole('status')).toBeInTheDocument()
  rerender(<ConceptPreview summary={faith} trigger={anchor} onClose={onClose} onOpen={onOpen} />)
  expect(await screen.findByText(/믿음 상세 내용/)).toBeInTheDocument()
  await act(async () => finish(detail()))
  expect(screen.queryByText(/은혜 상세 내용/)).not.toBeInTheDocument()
  expect(screen.getByText(/믿음 상세 내용/)).toBeInTheDocument()
  unmount(); anchor.remove()
  expect(onClose).not.toHaveBeenCalled()
})

it('reveals source evidence without changing the reading address and offers a full page', async () => {
  vi.mocked(loadDocument).mockResolvedValue(detail())
  const anchor = trigger(), onClose = vi.fn(), onOpen = vi.fn(), originalUrl = window.location.href
  const { unmount } = render(<ConceptPreview summary={grace} trigger={anchor} onClose={onClose} onOpen={onOpen} />)
  fireEvent.click(await screen.findByRole('link', { name: '근거' }))
  expect(window.location.href).toBe(originalUrl)
  expect(document.querySelector('.concept-preview-sources')).toHaveAttribute('open')
  expect(document.activeElement?.id).toBe('concept-source-bible')
  expect(screen.getByRole('link', { name: /성경/ })).toHaveAttribute('target', '_blank')
  fireEvent.click(screen.getByRole('link', { name: '이 용어의 전체 페이지 읽기 →' }))
  expect(onOpen).toHaveBeenCalledWith(grace)
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
  expect(onClose).toHaveBeenCalledOnce()
  await waitFor(() => expect(loadDocument).toHaveBeenCalledOnce())
  unmount(); anchor.remove()
})
