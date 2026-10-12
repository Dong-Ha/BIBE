---
type: Learning Experience
title: 양심과 식탁의 분별
description: 로마서 14장의 음식과 날에 관한 차이를 네 관점에서 읽고 양심 존중과 실제 해악을 구별합니다.
status: stable
published: true
public_id: conscience-table
tags: [로마서, 양심, 자유, 공동체]
sources:
  - id: bible
    title: "로마서 14:1–15:7; 고린도전서 6:19–20"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T15:05:35Z
verified: []
definition:
  id: conscience-table
  kind: perspectives
  title: 같은 식탁, 다른 양심
  goal: 음식과 날을 두고 다른 양심을 가진 신자들을 향한 바울의 권면을 네 관점에서 살펴봅니다.
  before: 로마서 14장의 관습 논쟁을 범죄나 안전 침해와 같은 문제로 취급하지 말고 본문 범위를 먼저 확인하세요.
  after: 양심의 차이에는 환대와 인내를, 실제 피해에는 보호와 책임을 적용하는 분별을 연습합니다.
  transfer: 관점은 사람의 신앙 점수를 매기지 않습니다. 같은 사람도 상황에 따라 서로 다른 배려가 필요할 수 있습니다.
  defaultState: abstain
  states:
    - id: abstain
      label: 삼가는 사람
      description: 어떤 신자는 고기를 먹지 않고 특정한 날을 특별히 여깁니다. 바울은 그 사람이 주를 위해 한다면 업신여김의 대상이 아니라고 합니다.
      evidence: ["로마서 14:2–6"]
      activeNodes: [practice, abstaining, receiving, community]
      activeEdges: [two-practices, lordship]
    - id: receive
      label: 먹는 사람
      description: 다른 신자는 모든 음식을 먹고 주께 감사할 수 있습니다. 이 자유가 다른 이를 멸시할 근거는 아닙니다.
      evidence: ["로마서 14:2–6"]
      activeNodes: [practice, abstaining, receiving, community]
      activeEdges: [two-practices, lordship]
    - id: accountable
      label: 서로를 정죄하지 않기
      description: 각 사람은 주님의 종이며 하나님 앞에 설 것입니다. 서로의 주인이 된 듯 정죄하지 말라는 권면입니다.
      evidence: ["로마서 14:4, 10–12"]
      activeNodes: [practice, abstaining, receiving, community]
      activeEdges: [two-practices, lordship, answerable]
    - id: love
      label: 이웃을 세우는 자유
      description: 자기 선택이 형제자매에게 어떤 영향을 주는지 살피고, 서로 받아들이며 공동체를 세우라고 합니다.
      evidence: ["로마서 14:13–15:7"]
      activeNodes: [practice, abstaining, receiving, community]
      activeEdges: [two-practices, lordship, answerable, build-up]
  nodes:
    - id: practice
      label: 논쟁의 범위
      detail: 로마서 14장의 쟁점은 음식과 특별한 날을 지키는 신앙 실천입니다.
      reference: "로마서 14:1–6"
    - id: abstaining
      label: 삼가는 양심
      detail: 먹지 않는 사람은 주를 위해 감사하며 삼갑니다.
      reference: "로마서 14:2–6"
    - id: receiving
      label: 먹는 양심
      detail: 먹는 사람도 주께 감사하며 자유를 행사합니다.
      reference: "로마서 14:2–6"
    - id: community
      label: 한 주님께 속한 공동체
      detail: 서로 다른 실천을 하는 두 사람 모두 주님께 속합니다.
      reference: "로마서 14:7–9"
  edges:
    - id: two-practices
      source: abstaining
      target: receiving
      kind: theme
      explanation: 본문은 서로 다른 음식 실천을 나란히 놓아 차이를 보여 줍니다.
      evidence: ["로마서 14:2–6"]
    - id: lordship
      source: abstaining
      target: community
      kind: direct
      explanation: 먹든 먹지 않든 각 사람이 주님을 향해 행동한다고 바울은 말합니다.
      evidence: ["로마서 14:6–9"]
    - id: answerable
      source: receiving
      target: community
      kind: direct
      explanation: 서로의 주인이 아니며 각 사람은 하나님 앞에 설 것입니다.
      evidence: ["로마서 14:4, 10–12"]
    - id: build-up
      source: receiving
      target: community
      kind: application
      explanation: 자유는 이웃을 넘어뜨리기보다 세우는 방향으로 행사됩니다.
      evidence: ["로마서 14:13–15:7"]
---

## 펼쳐서 살펴보기

두 사람이 같은 주님께 감사하면서도 다르게 실천할 수 있습니다. 바울은 서로를 멸시하거나 정죄하지 말라고 하고, 자유를 이웃을 세우는 데 사용하도록 권합니다. 이 본문을 폭력과 착취의 변명으로 확장하지 마세요. 관습의 차이와 실제 해악은 다른 종류의 문제입니다. [양심이 다르면 누가 맞는 걸까?](/questions/conscience.md)를 함께 읽어 보세요.
