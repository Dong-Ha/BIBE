import { describe, expect, it } from 'vitest'
import { connections, getInitialSelection, nodes, threads, validateContent } from './data'

describe('curated content', () => {
  it('contains eight literary threads', () => {
    expect(threads).toHaveLength(8)
  })

  it('gives every thread enough passages for a meaningful path', () => {
    for (const thread of threads) {
      expect(thread.nodeIds.length).toBeGreaterThanOrEqual(4)
      expect(thread.connectionIds.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('draws background passages from several Old Testament books', () => {
    const oldTestamentPrefixes = new Set(
      nodes
        .filter((node) => !node.id.startsWith('jn-'))
        .map((node) => node.id.split('-')[0]),
    )

    expect(oldTestamentPrefixes.size).toBeGreaterThanOrEqual(5)
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

  it('gives every cross and resurrection passage a substantial study guide', () => {
    const crossThread = threads.find((thread) => thread.id === 'cross')
    expect(crossThread).toBeDefined()

    for (const nodeId of crossThread?.nodeIds ?? []) {
      const node = nodes.find((item) => item.id === nodeId)
      expect(node?.study?.context.length).toBeGreaterThan(50)
      expect(node?.study?.questions).toHaveLength(3)
      expect(node?.study?.caution.length).toBeGreaterThan(50)
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

  it('opens the cross and resurrection path from a deep link', () => {
    expect(getInitialSelection('?thread=cross&passage=jn-20-24')).toEqual({
      threadId: 'cross',
      passageId: 'jn-20-24',
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
