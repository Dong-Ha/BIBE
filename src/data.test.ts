import { describe, expect, it } from 'vitest'
import { connections, getInitialSelection, nodes, threads, validateContent } from './data'

describe('curated content', () => {
  it('contains seven literary threads', () => {
    expect(threads).toHaveLength(7)
  })

  it('has unique identifiers', () => {
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length)
    expect(new Set(connections.map((connection) => connection.id)).size).toBe(connections.length)
    expect(new Set(threads.map((thread) => thread.id)).size).toBe(threads.length)
  })

  it('contains no dangling references', () => {
    expect(validateContent()).toEqual([])
  })

  it('keeps textual observation separate from Reformed interpretation', () => {
    for (const node of nodes) {
      expect(node.observation.length).toBeGreaterThan(20)
      expect(node.lens.summary.length).toBeGreaterThan(20)
      expect(node.lens.scripture.length).toBeGreaterThan(0)
      expect(node.lens.confessions.length).toBeGreaterThan(0)
    }
  })
})

describe('URL selection', () => {
  it('restores a valid thread and passage', () => {
    expect(getInitialSelection('?thread=light&passage=jn-8-12')).toEqual({
      threadId: 'light',
      passageId: 'jn-8-12',
    })
  })

  it('falls back when URL parameters are invalid', () => {
    expect(getInitialSelection('?thread=unknown&passage=missing')).toEqual({
      threadId: threads[0].id,
      passageId: threads[0].nodeIds[0],
    })
  })

  it('rejects a passage outside the selected thread', () => {
    expect(getInitialSelection('?thread=temple&passage=jn-8-12')).toEqual({
      threadId: 'temple',
      passageId: 'ex-40-34',
    })
  })
})
