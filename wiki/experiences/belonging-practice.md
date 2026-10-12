---
type: Learning Experience
title: 선물로 받은 소속과 서로의 돌봄
description: 수행으로 얻는 소속, 은혜로 받는 자녀 됨, 공동체의 환대와 돌봄을 네 관점에서 살펴봅니다.
status: stable
published: true
public_id: belonging-practice
tags: [소속, 입양, 은혜, 교회]
sources:
  - id: bible
    title: "요한복음 1:12–13; 에베소서 2:1–10; 로마서 8:14–17; 12:1–8"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T15:05:35Z
verified: []
definition:
  id: belonging-practice
  kind: perspectives
  title: 소속을 배우는 네 관점
  goal: 하나님의 자녀 됨이 선물이라는 성경의 선언과 공동체의 응답을 구별해 살펴봅니다.
  before: 하나님께 속한다는 말이 사람을 소유하거나 통제할 권리를 주지 않는다는 점을 기억하며 각 관점을 읽습니다.
  after: 자녀 됨의 은혜와 안전하고 책임 있는 공동체의 실천을 연결할 수 있습니다.
  transfer: 상태는 개인의 영적 수준을 평가하지 않습니다. 경험과 공동체의 상황에 따라 서로 다른 질문을 비춥니다.
  defaultState: performance
  states:
    - id: performance
      label: 성취로 증명하려는 마음
      description: 사람은 인정받기 위해 성과를 쌓을 수 있습니다. 성경은 하나님의 자녀 됨을 인간의 혈통이나 의지로 얻는 지위가 아니라고 말합니다.
      evidence: ["요한복음 1:12–13; 에베소서 2:8–9"]
      activeNodes: [gift, identity, community, care]
      activeEdges: [gift-to-identity]
    - id: receiving
      label: 선물로 받는 자녀 됨
      description: 예수를 믿는 이에게 하나님의 자녀라는 이름이 주어집니다. 이것은 성취의 보상이 아닙니다.
      evidence: ["요한복음 1:12–13; 로마서 8:14–17"]
      activeNodes: [gift, identity, community, care]
      activeEdges: [gift-to-identity, identity-to-community]
    - id: witness
      label: 공동체의 증언
      description: 교회는 서로 다른 은사를 지닌 몸으로 환대와 섬김을 실천함으로 하나님이 주시는 소속을 증언합니다.
      evidence: ["로마서 12:1–8"]
      activeNodes: [gift, identity, community, care]
      activeEdges: [gift-to-identity, identity-to-community, community-to-witness]
    - id: care
      label: 필요와 경계를 묻는 돌봄
      description: 환대는 상대의 필요와 경계를 듣고 실제 지원과 책임을 제공하는 방식으로 드러날 수 있습니다.
      evidence: ["로마서 12:9–13; 에베소서 2:10"]
      activeNodes: [gift, identity, community, care]
      activeEdges: [gift-to-identity, identity-to-community, community-to-witness, witness-to-care]
  nodes:
    - id: gift
      label: 선물
      detail: 구원과 자녀 됨은 자랑할 성취가 아니라 하나님께서 주시는 선물입니다.
      reference: "에베소서 2:8–9; 요한복음 1:12–13"
    - id: identity
      label: 자녀의 정체성
      detail: 성령은 믿는 이들이 두려움의 종이 아니라 하나님께 속한 자녀임을 증언하십니다.
      reference: "로마서 8:14–17"
    - id: community
      label: 한 몸의 공동체
      detail: 서로 다른 은사를 받은 이들이 한 몸 안에서 서로를 섬깁니다.
      reference: "로마서 12:3–8"
    - id: care
      label: 구체적 돌봄
      detail: 선한 일을 위해 새롭게 된 사람은 환대와 실제적인 필요 돌봄으로 이웃을 섬길 수 있습니다.
      reference: "로마서 12:9–13; 에베소서 2:10"
  edges:
    - id: gift-to-identity
      source: gift
      target: identity
      kind: direct
      explanation: 성경은 사람의 성취가 아니라 하나님이 주시는 선물과 자녀 됨을 말합니다.
      evidence: ["요한복음 1:12–13; 에베소서 2:8–9"]
    - id: identity-to-community
      source: identity
      target: community
      kind: theme
      explanation: 하나님께 속한 정체성은 서로의 은사를 존중하며 한 몸으로 사는 삶과 함께 제시됩니다.
      evidence: ["로마서 8:14–17; 12:3–8"]
    - id: community-to-witness
      source: community
      target: care
      kind: application
      explanation: 공동체는 환대와 섬김으로 선물 받은 은혜를 이웃에게 보일 수 있습니다.
      evidence: ["로마서 12:9–13"]
    - id: witness-to-care
      source: care
      target: community
      kind: application
      explanation: 환대는 상대의 동의와 경계를 존중하며 필요를 묻고 실제 도움을 제공하는 관계적 실천입니다.
      evidence: ["로마서 12:10–13"]
---

## 펼쳐서 살펴보기

네 관점은 한 사람의 소속을 판정하는 단계가 아닙니다. 성취로 얻지 않는 선물을 먼저 보고, 공동체가 그 선물을 어떻게 환대와 돌봄으로 드러낼지 살펴봅니다. 교회의 환대가 말과 다르거나 누군가에게 해를 주었다면 안전과 책임을 먼저 다루어야 합니다. [나는 누구에게 속해 있는 사람일까?](/questions/belonging.md)를 함께 읽으세요.
