import { describe, expect, it } from 'vitest'
import { connections, getInitialSelection, nodes, threads, validateContent } from './data'

describe('curated content', () => {
  it('contains eleven literary threads', () => {
    expect(threads).toHaveLength(11)
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

    expect(oldTestamentPrefixes.size).toBeGreaterThanOrEqual(8)
  })

  it('includes an Old Testament-focused covenant path', () => {
    const covenantThread = threads.find((thread) => thread.id === 'covenant')
    expect(covenantThread).toBeDefined()
    expect(covenantThread?.nodeIds).toEqual(expect.arrayContaining([
      'gen-12-1',
      'ex-19-4',
      'deut-30-6',
      '2sa-7-12',
      'jer-31-31',
      'jn-1-14',
    ]))
    expect(covenantThread?.connectionIds).toHaveLength(9)

    const newCovenantPassages = covenantThread?.nodeIds.filter((id) => !id.startsWith('jn-') && !id.startsWith('lk-')) ?? []
    expect(newCovenantPassages).toHaveLength(8)
    expect(newCovenantPassages.every((nodeId) => nodes.some((node) => node.id === nodeId))).toBe(true)
  })

  it('adds ten complete passages to the existing paths', () => {
    expect(nodes).toHaveLength(55)
    const addedIds = ['gen-15-5', 'ex-24-3', 'isa-55-3', 'lk-22-19', 'isa-53-4', 'jn-19-28', 'jn-20-19', '1co-15-20', 'jn-6-35', 'rom-6-3']
    for (const id of addedIds) {
      const node = nodes.find((item) => item.id === id)
      expect(node).toBeDefined()
      expect(node?.study?.questions).toHaveLength(3)
      expect(node?.study?.context.length).toBeGreaterThan(50)
      expect(node?.study?.caution.length).toBeGreaterThan(50)
      expect(getInitialSelection(`?thread=${threads.find((thread) => thread.nodeIds.includes(id))?.id}&passage=${id}`).passageId).toBe(id)
    }
  })

  it('has unique identifiers', () => {
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length)
    expect(new Set(connections.map((connection) => connection.id)).size).toBe(connections.length)
    expect(new Set(threads.map((thread) => thread.id)).size).toBe(threads.length)
  })

  it('reports duplicate IDs before lookup maps can hide them', () => {
    expect(validateContent({ nodes: [nodes[0], nodes[0]], connections: [], threads: [] }))
      .toContain(`nodes: duplicate id ${nodes[0].id}`)
  })

  it('reports missing references and connections outside their thread', () => {
    const connection = { ...connections[0], id: 'broken', target: 'missing' }
    const thread = { ...threads[0], nodeIds: [connection.source], connectionIds: ['broken', 'absent'] }
    const errors = validateContent({ nodes, connections: [connection], threads: [thread] })
    expect(errors).toContain('broken: missing target missing')
    expect(errors).toContain(`${thread.id}: missing connection absent`)
    expect(errors).toContain(`${thread.id}: connection broken leaves thread`)
  })

  it('includes every curated passage and connection in an accessible thread', () => {
    const visibleNodes = new Set(threads.flatMap((thread) => thread.nodeIds))
    const visibleConnections = new Set(threads.flatMap((thread) => thread.connectionIds))
    expect(nodes.every((node) => visibleNodes.has(node.id))).toBe(true)
    expect(connections.every((connection) => visibleConnections.has(connection.id))).toBe(true)
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

  it('gives every thread an expanded reading guide', () => {
    for (const thread of threads) {
      expect(thread.guide.context.length).toBeGreaterThan(80)
      expect(thread.guide.focus.length).toBeGreaterThan(30)
      expect(thread.guide.question.length).toBeGreaterThan(30)
    }
  })

  it('adds substantial water and witness paths', () => {
    expect(threads.find((thread) => thread.id === 'water')?.nodeIds).toHaveLength(5)
    expect(threads.find((thread) => thread.id === 'witness')?.nodeIds).toHaveLength(5)
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
