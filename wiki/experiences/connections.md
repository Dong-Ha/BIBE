---
type: Learning Experience
title: "유월절과 예수의 십자가"
description: "출애굽기의 유월절 본문과 요한복음의 예수 증언 사이의 직접 인용과 주제 연결을 구별합니다."
status: stable
published: true
public_id: connections
tags:
  - 출애굽기
  - 요한복음
  - 유월절
sources:
  - id: exodus-12
    title: "출애굽기 12장"
    resource: https://www.biblegateway.com/passage/?search=Exodus%2012&version=NRSVUE
  - id: john-1
    title: "요한복음 1:29"
    resource: https://www.biblegateway.com/passage/?search=John%201%3A29&version=NRSVUE
  - id: john-19
    title: "요한복음 19:31–37"
    resource: https://www.biblegateway.com/passage/?search=John%2019%3A31-37&version=NRSVUE
generated:
  by: codex/experience-editor
  at: "2026-10-12T13:47:25Z"
verified: []
definition:
  id: connections
  kind: connections
  title: "유월절과 예수의 십자가"
  goal: "성경 본문 사이의 직접 인용과 주제적 연결을 구별하고 각 연결의 근거를 확인합니다."
  before: "두 본문이 비슷해 보인다면, 실제로 같은 말을 인용하는지 아니면 주제가 서로를 비추는지 살펴보세요."
  after: "다른 구약 본문과 신약 본문을 연결할 때도 단어의 반복, 문맥, 저자의 설명을 근거로 관계의 종류를 정해 보세요."
  transfer: "연결선은 모든 독법에 대한 판정이 아니라, 본문으로 점검할 수 있는 한 가지 읽기 제안입니다."
  defaultState: all
  states:
    - id: all
      label: "모든 연결"
      description: "출애굽기의 유월절 규정, 요한의 어린양 증언, 십자가 장면의 뼈에 관한 서술을 나란히 살펴봅니다."
      evidence: ["출애굽기 12:5–13, 46", "요한복음 1:29", "요한복음 19:31–37"]
      activeNodes: [passover, lamb, cross]
      activeEdges: [lamb-theme, bone-echo]
    - id: direct
      label: "본문의 직접 연결"
      description: "요한복음 19:36은 뼈가 꺾이지 않았다는 일을 성경 말씀의 성취로 설명합니다. 출애굽기 12:46의 유월절 규정과 함께 읽을 수 있습니다."
      evidence: ["출애굽기 12:46", "요한복음 19:31–37"]
      activeNodes: [passover, cross]
      activeEdges: [bone-echo]
    - id: theme
      label: "주제의 연결"
      description: "세례 요한은 예수를 하나님의 어린양이라고 부릅니다. 유월절 어린양과 연결해 읽을 수 있지만, 이 표현을 출애굽기 한 구절의 직접 인용으로 표시하지 않습니다."
      evidence: ["출애굽기 12:5–13", "요한복음 1:29"]
      activeNodes: [passover, lamb]
      activeEdges: [lamb-theme]
  nodes:
    - id: passover
      label: "유월절 규정"
      detail: "출애굽기는 어린양을 먹는 방식과 뼈를 꺾지 말라는 규정을 말합니다. 이스라엘의 해방을 기념하는 문맥을 함께 읽습니다."
      reference: "출 12:5–13, 46"
    - id: lamb
      label: "어린양 증언"
      detail: "요한은 예수를 하나님의 어린양이라고 부릅니다. 이 표현은 유월절과 연결해 읽을 수 있는 주제적 울림을 지니지만, 본문은 이곳에서 출애굽기를 직접 인용하지 않습니다."
      reference: "요 1:29"
    - id: cross
      label: "십자가 장면"
      detail: "요한복음은 예수의 다리가 꺾이지 않은 일을 성경 말씀과 연결합니다. 출애굽기의 유월절 규정과 관계를 설명하는 본문상의 근거입니다."
      reference: "요 19:31–37"
  edges:
    - id: lamb-theme
      source: passover
      target: lamb
      kind: theme
      explanation: "유월절 어린양과 예수를 어린양이라 부르는 요한의 표현은 주제적으로 연결해 읽을 수 있습니다. 직접 인용과 구분합니다."
      evidence: ["출애굽기 12:5–13", "요한복음 1:29"]
    - id: bone-echo
      source: passover
      target: cross
      kind: direct
      explanation: "요한복음 19:36은 뼈가 꺾이지 않았다는 말씀의 성취를 말하며 출애굽기 12:46과 연결됩니다."
      evidence: ["출애굽기 12:46", "요한복음 19:31–37"]
---

## 관계를 구별하며 읽기

연결 종류는 본문에서 확인되는 근거를 설명합니다. ‘직접 연결’은 본문 자체의 명시적 인용 또는 성취 언급에, ‘주제의 연결’은 반복되는 이미지와 문맥에 근거합니다. 유월절과 십자가를 연결할 때 요한복음 19:36의 설명은 직접 근거로, 요한복음 1:29의 어린양 표현은 주제적 연결로 표시했습니다.
