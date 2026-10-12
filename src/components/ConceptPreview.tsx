import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { ContentDocument, ContentSummary } from '../content-types'
import { documentById, documentHref, loadDocument } from '../content'

export default function ConceptPreview({ summary, trigger, onClose, onOpen }: {
  summary: ContentSummary
  trigger: HTMLElement
  onClose: () => void
  onOpen: (doc: { publicId: string }) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null), closeButton = useRef<HTMLButtonElement>(null)
  const [retry, setRetry] = useState(0)
  const key = `${summary.id}:${retry}`
  const [result, setResult] = useState<{ key: string; document?: ContentDocument; error?: boolean }>()
  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => { element.close(); if (trigger.isConnected) trigger.focus({ preventScroll: true }) }
  }, [trigger])
  useEffect(() => {
    let current = true
    dialog.current!.scrollTop = 0
    closeButton.current?.focus({ preventScroll: true })
    loadDocument(summary.id).then(document => { if (current) setResult({ key, document }) }, () => { if (current) setResult({ key, error: true }) })
    return () => { current = false }
  }, [summary.id, retry])
  const document = result?.key === key ? result.document : undefined
  function followFragment(event: MouseEvent<HTMLDialogElement>) {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#concept-source-"]')
    if (!anchor || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const source = Array.from(dialog.current!.querySelectorAll<HTMLElement>('[id]')).find(node => node.id === anchor.hash.slice(1))
    const disclosure = source?.closest('details')
    if (disclosure) disclosure.open = true
    source?.scrollIntoView({ block: 'nearest' })
    source?.focus({ preventScroll: true })
  }
  return <dialog ref={dialog} className="concept-preview" aria-labelledby="concept-preview-title" aria-describedby="concept-preview-description" onCancel={event => { event.preventDefault(); onClose() }} onClick={followFragment}>
    <header className="concept-preview-header"><div><p className="page-kicker">읽던 자리에서, 말뜻 살펴보기</p><h2 id="concept-preview-title">{summary.title}</h2></div><button ref={closeButton} type="button" autoFocus onClick={onClose} aria-label="말뜻 설명 닫기">닫기 <span aria-hidden="true">×</span></button></header>
    <div className="concept-preview-body"><p id="concept-preview-description" className="concept-definition">{summary.description}</p>
      {document ? <><p className="visually-hidden" role="status">상세 설명을 불러왔습니다.</p><div className="prose">{document.sections.map((section, i) => <section key={i}>{section.title !== '설명' && <h3>{section.title}</h3>}<div dangerouslySetInnerHTML={{ __html: section.html.replaceAll('href="#source-', 'href="#concept-source-') }} /></section>)}</div>
        <details className="concept-preview-sources"><summary>설명의 근거와 원자료</summary>{document.sources.map(source => { const internal = source.resource.startsWith('/') ? documentById.get(source.resource.slice(1).replace(/\.md$/, '')) : undefined; return <div key={source.id} id={`concept-source-${source.id}`} tabIndex={-1}><a href={internal ? documentHref(internal) : source.resource} target="_blank" rel="noopener noreferrer">{source.title ?? '원자료'} <span aria-hidden="true">↗</span><span className="visually-hidden"> (새 탭)</span></a></div> })}</details></> : result?.key === key && result.error ? <div role="alert"><p>상세 설명을 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.</p><button type="button" onClick={() => setRetry(value => value + 1)}>설명 다시 불러오기</button></div> : <p role="status">상세 설명을 불러오고 있습니다.</p>}
    </div><footer className="concept-preview-footer"><button type="button" onClick={onClose}>읽던 자리로 돌아가기</button><a href={documentHref(summary)} onClick={event => { if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onOpen(summary) } }}>이 용어의 전체 페이지 읽기 →</a></footer>
  </dialog>
}
