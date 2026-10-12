import { useEffect, useState } from 'react'
import type { ContentDocument } from '../content-types'
import { documentById, documentHref } from '../content'

function readProgress(key: string, valid: Set<string>) {
  let raw: string | null
  try { raw = localStorage.getItem(key) }
  catch { return { completed: [], available: false } }
  try {
    const saved: unknown = JSON.parse(raw ?? '[]')
    return { completed: Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && valid.has(id)))] : [], available: true }
  } catch { return { completed: [], available: true } }
}

export default function ReadingGuide({ doc, dayId, onDayChange, onOpen }: {
  doc: ContentDocument
  dayId?: string
  onDayChange: (id: string) => void
  onOpen: (doc: ContentDocument) => void
}) {
  const days = doc.days!
  const index = Math.max(0, days.findIndex(day => day.id === dayId)), day = days[index]
  const key = `bibe-reading-guide:${doc.publicId}`
  const [progress, setProgress] = useState(() => readProgress(key, new Set(days.map(day => day.id))))
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setProgress(readProgress(key, new Set(days.map(day => day.id))))
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [key, days])
  const completed = progress.completed.includes(day.id)
  function toggle() {
    const next = completed ? progress.completed.filter(id => id !== day.id) : [...progress.completed, day.id]
    try { localStorage.setItem(key, JSON.stringify(next)); setProgress({ completed: next, available: true }) }
    catch { setProgress({ completed: next, available: false }) }
  }
  function linked(id: string, label: string) {
    const target = documentById.get(id)!
    return <a href={documentHref(target)} onClick={event => {
      if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onOpen(target) }
    }}><small>{label}</small><strong>{target.reference ? `${target.reference} · ` : ''}{target.title}</strong><span aria-hidden="true">↗</span></a>
  }
  return <section className="daily-guide" aria-label="7일 읽기 안내">
    <p className="muted">원하는 날을 골라 시작하세요. 쉬었다가 돌아와도 괜찮습니다.</p>
    <div className="guide-days" role="group" aria-label="읽을 날 선택">{days.map((item, i) => <button type="button" key={item.id} aria-pressed={item.id === day.id} onClick={() => onDayChange(item.id)}><span>{i + 1}일</span><small>{progress.completed.includes(item.id) ? '읽음' : item.title}</small></button>)}</div>
    <div className="guide-day-content">
      <p className="page-kicker">{index + 1}일 · {days.length}일 안내</p><h2>{day.title}</h2><p>{day.focus}</p>
      <div className="guide-reading-links">{linked(day.question, '오늘의 질문')}{linked(day.passage, '성경 본문')}{day.experience && linked(day.experience, '직접 탐색')}</div>
      <div className="guide-reflection"><h3>돌아볼 질문</h3><p>{day.reflection}</p><h3>작은 실천</h3><p>{day.practice}</p></div>
      <div className="guide-actions"><button type="button" aria-pressed={completed} onClick={toggle}>{completed ? '읽은 날 표시 취소' : '읽은 날 표시'}</button><span role="status">{progress.completed.length}일 읽음</span></div>
      <p className="muted">{progress.available ? '읽은 날 표시는 이 기기의 브라우저에 저장됩니다. 믿음이나 성장을 평가하는 점수가 아닙니다.' : '이 브라우저에 표시를 저장할 수 없습니다. 지금 고른 날은 주소로 공유하거나 다시 열 수 있습니다.'}</p>
      <div className="guide-next"><button type="button" disabled={index === 0} onClick={() => onDayChange(days[index - 1].id)}>이전 날</button><button type="button" disabled={index === days.length - 1} onClick={() => onDayChange(days[index + 1].id)}>다음 날</button></div>
    </div>
  </section>
}
