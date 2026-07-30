import { fireEvent, render, screen } from '@testing-library/react'
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

  it('copies a deep link for the selected discovery', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /이 발견 공유/ }))
    expect(await screen.findByRole('button', { name: /링크 복사됨/ })).toBeInTheDocument()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('thread=word'))
  })
})
