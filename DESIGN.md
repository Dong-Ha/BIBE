# Design

## Source of truth
- Status: Draft
- Last refreshed: 2026-07-30
- Primary product surfaces: single-page Bible study web app focused on John’s Gospel
- Evidence reviewed: `README.md` only; no existing UI assets, components, or design docs were present

## Brand
- Personality: reverent, sturdy, text-centered, contemplative, and confident without being ornate
- Trust signals: exact passage references, clear separation between observation and theological interpretation, public links to confessional sources
- Avoid: novelty-for-novelty’s-sake, purple-heavy defaults, speculative commentary, and dense paragraph walls

## Product goals
- Goals: help users trace Johannine themes through representative passages, OT background, and Reformed confessional framing
- Non-goals: full Bible text hosting, commentary database, user accounts, community features, or broad denomination comparison
- Success signals: a user can move from one theme to another, inspect a passage, open a confessional reference, and share the current view

## Personas and jobs
- Primary personas: Reformed Bible readers, small-group leaders, and catechetical learners
- User jobs: find a motif quickly, compare passages, connect John to the OT, and see a concise Reformed reading
- Key contexts of use: desktop study, mobile reading between sessions, and shared-link review in a group

## Information architecture
- Primary navigation: seven motif threads in a persistent sidebar
- Core routes/screens: theme overview, passage detail, OT background, confessional references, shareable state
- Content hierarchy: thread summary first, then passage map, then supporting references and confessional notes

## Design principles
- Principle 1: observation before interpretation
- Principle 2: keep Scripture references and confessional references visibly separate
- Tradeoffs: use a compact dataset and client-side rendering instead of a heavier content system

## Visual language
- Color: deep ink, parchment, muted gold, and sage accents on layered dark backgrounds
- Typography: expressive serif headings with a readable sans-serif body stack
- Spacing/layout rhythm: generous outer padding, compact data cards, and clear vertical group separation
- Shape/radius/elevation: rounded panels with restrained elevation and thin borders
- Motion: minimal, purposeful transitions for selection and copy feedback
- Imagery/iconography: no stock imagery; use SVG relationship nodes and simple geometric cues

## Components
- Existing components to reuse: none
- New/changed components: sidebar thread list, hero summary, SVG passage map, passage detail panel, OT background panel, confessional panel, copy-link action
- Variants and states: active/inactive thread, selected/unselected passage node, copied/not copied link state, mobile stacked layout
- Token/component ownership: CSS custom properties own colors, spacing, and typography; data objects own content and references

## Accessibility
- Target standard: WCAG 2.2 AA as a practical baseline
- Keyboard/focus behavior: all interactive thread and passage items must be reachable and visibly focused
- Contrast/readability: high-contrast text on dark surfaces, no meaning carried by color alone
- Screen-reader semantics: buttons for selection, labeled SVG nodes, and headings in document order
- Reduced motion and sensory considerations: avoid continuous animation and keep transitions subtle

## Responsive behavior
- Supported breakpoints/devices: mobile, tablet, and desktop
- Layout adaptations: sidebar collapses into a top rail on small screens; detail cards stack vertically
- Touch/hover differences: larger tap targets on mobile, hover polish only as a progressive enhancement

## Interaction states
- Loading: initial static render with no async loading state required
- Empty: fallback copy if a thread or passage cannot be resolved from the URL
- Error: safe default to the first thread when query parameters are invalid
- Success: copy-link confirmation and visible selection changes
- Disabled: inactive buttons should appear muted but remain readable
- Offline/slow network, if applicable: app should remain usable as a static local file after load

## Content voice
- Tone: concise, theological, and observational
- Terminology: prefer standard Reformed labels such as revelation, regeneration, covenant, assurance, and means of grace
- Microcopy rules: short sentences, explicit verse citations, and no slang

## Implementation constraints
- Framework/styling system: vanilla HTML, CSS, and ES modules; no runtime dependency on external packages
- Design-token constraints: use CSS variables for palette and spacing; no hard-coded ad hoc colors in component logic
- Performance constraints: keep the app static, lightweight, and fully client-rendered without build tooling
- Compatibility constraints: modern evergreen browsers with basic SVG and `URLSearchParams` support
- Test/screenshot expectations: data integrity checks for thread content and a simple local smoke test for the static app

## Open questions
- [ ] Should later releases add direct Bible text rendering for public-domain translations, or keep the app reference-only?
- [ ] Should the motif set remain John-only, or expand to a broader canonical reading plan after MVP validation?
- [ ] Should confessional references stay grouped by tradition, or be reorganized by theological topic in a future version?
