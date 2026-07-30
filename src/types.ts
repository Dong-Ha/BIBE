export type RelationType = '반복' | '대조' | '인용' | '평행' | '성취' | '발전'

export interface ConfessionReference {
  document: string
  section: string
  summary: string
  url: string
}

export interface ReformedLens {
  title: string
  summary: string
  scripture: string[]
  confessions: ConfessionReference[]
}

export interface PassageNode {
  id: string
  reference: string
  eyebrow: string
  title: string
  summary: string
  observation: string
  x: number
  y: number
  externalUrl: string
  lens: ReformedLens
}

export interface Connection {
  id: string
  source: string
  target: string
  type: RelationType
  label: string
  explanation: string
}

export interface Thread {
  id: string
  number: string
  name: string
  shortName: string
  premise: string
  color: string
  nodeIds: string[]
  connectionIds: string[]
}
