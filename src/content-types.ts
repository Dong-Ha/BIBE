export type ExperienceKind = 'story' | 'connections' | 'layers' | 'perspectives'
export type RelationshipKind = 'direct' | 'promise' | 'theme' | 'application'
export type RelationshipBasis = 'explicit' | 'allusion' | 'editorial'

export interface ExperienceState {
  id: string
  label: string
  description: string
  evidence: string[]
  activeNodes: string[]
  activeEdges?: string[]
}

export interface ExperienceNode {
  id: string
  label: string
  detail: string
  reference: string
}

export interface ExperienceEdge {
  id: string
  source: string
  target: string
  kind: RelationshipKind
  explanation: string
  evidence: string[]
  basis?: RelationshipBasis
  basisExplanation?: string
}

export interface InteractiveDefinition {
  id: string
  kind: ExperienceKind
  title: string
  goal: string
  before: string
  after: string
  transfer: string
  defaultState: string
  states: ExperienceState[]
  nodes: ExperienceNode[]
  edges: ExperienceEdge[]
}

export interface SourceReference {
  id?: string
  resource: string
  title?: string
  author?: string
}

export interface ContentSection {
  title: string
  html: string
}

export interface GuideDay {
  id: string
  title: string
  question: string
  passage: string
  experience?: string
  focus: string
  reflection: string
  practice: string
}

export interface ContentDocument {
  id: string
  publicId: string
  type: string
  title: string
  description: string
  tags: string[]
  aliases: string[]
  reference?: string
  order?: number
  experience?: string
  experienceState?: string
  passages: string[]
  days?: GuideDay[]
  books: string[]
  logos?: { resource_id: string; uri: string; access: string }
  questions: string[]
  links: string[]
  backlinks: string[]
  sources: SourceReference[]
  sections: ContentSection[]
  searchText: string
  generated?: { by: string; at: string }
  verified?: { by: string; at: string }[]
  definition?: InteractiveDefinition
  nodeIds?: string[]
  connectionIds?: string[]
  relationship?: ExperienceEdge & { from: string; to: string }
}

export interface ContentBundle {
  documents: ContentDocument[]
  legacy: {
    passages: Record<string, string>
    threads: Record<string, { path: string; firstPassage: string; passages: string[] }>
    connections: Record<string, string>
  }
}


export type ContentSummary = Omit<ContentDocument, 'sections' | 'sources' | 'searchText' | 'definition' | 'days' | 'logos' | 'generated' | 'verified' | 'relationship'> & {
  detailHash: string
  experienceKind?: ExperienceKind
  defaultState?: string
  stateIds?: string[]
  dayIds?: string[]
  relationship?: Pick<ExperienceEdge, 'source' | 'target' | 'kind'>
}
export interface PublicationManifest {
  schemaVersion: number
  documents: ContentSummary[]
  legacy: ContentBundle['legacy']
  searchHash: string
}
export interface ReadingPayload {
  document: ContentDocument
  experience?: InteractiveDefinition
  relationships: ContentDocument[]
}
