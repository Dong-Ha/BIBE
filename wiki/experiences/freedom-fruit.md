---
type: Learning Experience
title: 자유에서 사랑의 열매로
description: 갈라디아서 5–6장의 자유와 성령의 열매, 서로 짐을 지는 공동체를 네 장면으로 살펴봅니다.
status: stable
published: true
public_id: freedom-fruit
tags: [갈라디아서, 자유, 사랑, 성령]
sources:
  - id: bible
    title: "갈라디아서 5:13–26; 6:1–5; 로마서 12:1–8"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T15:05:35Z
verified: []
definition:
  id: freedom-fruit
  kind: connections
  title: 복음의 자유와 이웃 사랑
  goal: 그리스도 안의 자유가 성령의 열매와 공동체의 상호 돌봄으로 이어지는 본문 연결을 읽습니다.
  before: 선행이 은혜를 얻는 값이라고 생각하지 말고, 본문이 자유와 사랑을 어떤 순서로 놓는지 관찰하세요.
  after: 사랑의 섬김이 구원의 대가가 아니라 선물 받은 사람이 걷는 응답임을 말할 수 있습니다.
  transfer: 연결은 한 사람의 성장 정도나 구원 여부를 측정하지 않습니다. 본문이 제시하는 삶의 방향을 나타냅니다.
  defaultState: gift
  states:
    - id: gift
      label: 그리스도께서 주신 자유
      description: 갈라디아서의 권면은 그리스도께서 자유롭게 하셨다는 선언을 전제로 합니다.
      evidence: ["갈라디아서 5:1, 13"]
      activeNodes: [freedom, spirit, love, burden]
      activeEdges: [freedom-to-spirit]
    - id: spirit
      label: 성령을 따라 걷기
      description: 자유는 자기 욕망의 방임이 아니라 성령을 따라 걷는 삶으로 향합니다.
      evidence: ["갈라디아서 5:16–25"]
      activeNodes: [freedom, spirit, love, burden]
      activeEdges: [freedom-to-spirit, spirit-to-fruit]
    - id: love
      label: 서로 사랑으로 섬김
      description: 바울은 자유를 서로 사랑으로 종노릇하라는 권면과 연결합니다.
      evidence: ["갈라디아서 5:13–14"]
      activeNodes: [freedom, spirit, love, burden]
      activeEdges: [freedom-to-spirit, spirit-to-fruit, freedom-to-love]
    - id: burden
      label: 짐을 함께 나눔
      description: 온유하게 회복하고 서로 짐을 지되 각자의 책임도 존중합니다. 도움은 강제된 자기 희생과 다릅니다.
      evidence: ["갈라디아서 6:1–5"]
      activeNodes: [freedom, spirit, love, burden]
      activeEdges: [freedom-to-spirit, spirit-to-fruit, freedom-to-love, love-to-burden]
  nodes:
    - id: freedom
      label: 그리스도 안의 자유
      detail: 자유는 하나님께 받아들여지기 위한 율법의 성취 부담에서 놓인 자리입니다.
      reference: "갈라디아서 5:1, 13"
    - id: spirit
      label: 성령의 인도
      detail: 성령을 따라 걷는 삶은 서로 다투고 삼키는 행동을 경계합니다.
      reference: "갈라디아서 5:16–26"
    - id: love
      label: 사랑의 섬김
      detail: 바울은 자유를 이웃 사랑과 서로 섬기는 일로 향하게 합니다.
      reference: "갈라디아서 5:13–14"
    - id: burden
      label: 서로의 짐
      detail: 공동체는 회복을 돕고 짐을 나누며 각 사람의 책임을 함께 생각합니다.
      reference: "갈라디아서 6:1–5"
  edges:
    - id: freedom-to-spirit
      source: freedom
      target: spirit
      kind: theme
      explanation: 그리스도께서 주신 자유는 성령을 따라 걷는 권면과 이어집니다.
      evidence: ["갈라디아서 5:1, 13–16"]
    - id: spirit-to-fruit
      source: spirit
      target: love
      kind: direct
      explanation: 사랑은 성령의 열매 가운데 처음으로 언급되며 공동체의 삶을 이끕니다.
      evidence: ["갈라디아서 5:22–26"]
    - id: freedom-to-love
      source: freedom
      target: love
      kind: direct
      explanation: 바울은 자유를 사랑으로 서로 섬기는 일에 사용하라고 명시합니다.
      evidence: ["갈라디아서 5:13–14"]
    - id: love-to-burden
      source: love
      target: burden
      kind: application
      explanation: 서로의 짐을 나누는 일은 사랑의 구체적 실천이지만 강압이나 피해자에게 책임 전가를 뜻하지 않습니다.
      evidence: ["갈라디아서 6:1–5"]
---

## 펼쳐서 살펴보기

단계를 따라가며 은혜의 선물과 사랑의 응답이 본문에서 어떻게 이어지는지 봅니다. 열매는 구원의 점수나 남과 비교할 성적표가 아닙니다. 그 열매는 실제 이웃을 살리는 방향을 가리킵니다. [갈라디아서의 자유와 열매 시리즈](/studies/galatians-freedom.md)와 [자유와 사랑](/questions/freedom-love.md)을 이어 읽으세요.
