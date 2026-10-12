import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { documentByPublicId } from '../content'
import ReadingGuide from './ReadingGuide'

const doc = documentByPublicId.get('return-to-grace-7-days')!
const storageKey = `bibe-reading-guide:${doc.publicId}`
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks() })

it('selects a day without locking later days and persists only explicit read marks', () => {
  const change = vi.fn(), open = vi.fn()
  const { unmount } = render(<ReadingGuide doc={doc} dayId="day-3" onDayChange={change} onOpen={open} />)
  expect(localStorage.getItem(storageKey)).toBeNull()
  fireEvent.click(within(screen.getByRole('group', { name: '읽을 날 선택' })).getByRole('button', { name: /7일/ }))
  expect(change).toHaveBeenCalledWith('day-7')
  fireEvent.click(screen.getByRole('button', { name: '읽은 날 표시' }))
  expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(['day-3'])
  unmount()
  render(<ReadingGuide doc={doc} dayId="day-3" onDayChange={change} onOpen={open} />)
  expect(screen.getByRole('button', { name: '읽은 날 표시 취소' })).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('button', { name: '읽은 날 표시 취소' }))
  expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual([])
})

it('ignores malformed and unknown saved marks and responds to updates from another tab', () => {
  localStorage.setItem(storageKey, 'broken json')
  render(<ReadingGuide doc={doc} dayId="day-1" onDayChange={vi.fn()} onOpen={vi.fn()} />)
  expect(screen.getByRole('status')).toHaveTextContent('0일 읽음')
  localStorage.setItem(storageKey, JSON.stringify(['day-1', 'day-1', 'missing', 7]))
  fireEvent(window, new StorageEvent('storage', { key: storageKey }))
  expect(screen.getByRole('status')).toHaveTextContent('1일 읽음')
  expect(screen.getByRole('button', { name: '읽은 날 표시 취소' })).toBeInTheDocument()
})

it('keeps the guide usable when browser storage is unavailable', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('unavailable') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable') })
  render(<ReadingGuide doc={doc} dayId="day-1" onDayChange={vi.fn()} onOpen={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: '읽은 날 표시' }))
  expect(screen.getByRole('status')).toHaveTextContent('1일 읽음')
  expect(screen.getByText(/이 브라우저에 표시를 저장할 수 없습니다/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /성경 본문/ })).toHaveAttribute('href', '?doc=lk-15-11')
})
