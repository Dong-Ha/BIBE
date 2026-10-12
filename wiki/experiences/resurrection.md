---
type: Learning Experience
title: 부활의 증언과 그 의미
description: 본문이 전하는 증언과 그 증언에서 설명하는 소망을 구분합니다.
public_id: resurrection-map
status: stable
published: true
tags:
  - 부활
  - 증언
  - 소망
sources:
  - id: bible
    resource: https://bible.bskorea.or.kr/
    title: 고린도전서 15:3–8, 20–23; 요한복음 20:24–31
generated:
  by: codex/experience-editor
  at: 2026-10-12T14:09:10.042Z
definition:
  id: resurrection
  kind: connections
  title: 부활의 증언과 그 의미
  goal: 본문이 전하는 증언과 그 증언에서 설명하는 소망을 구분합니다.
  before: 예수가 살아나셨다는 증언과 그 부활이 우리에게 의미하는 것을 서로 나눠 말할 수 있을까요?
  after: 고린도전서 15장과 요한복음 20장을 다시 읽고 어떤 말이 사건에 대한 주장이고 어떤 말이 그 의미에 대한 설명인지 찾아보세요.
  transfer: 다른 역사적 주장을 읽을 때도 자료가 주장하는 내용, 자료의 신뢰성을 확인할 질문, 그 사건의 의미를 각각 나눠 보세요.
  defaultState: all
  states:
    - id: all
      label: 증언과 소망 함께
      description: 바울과 요한의 본문은 예수의 부활을 증언하고, 그 사건에 근거한 생명과 미래의 소망을 설명합니다. 연결도 자체가 역사적 사실성을 증명하지는 않습니다.
      evidence:
        - 고린도전서 15:3–8, 20–23
        - 요한복음 20:24–31
      activeNodes:
        - testimony
        - risen
        - hope
      activeEdges:
        - witness
        - firstfruit
    - id: direct
      label: 본문이 전하는 증언
      description: 바울은 예수가 죽고 장사되고 살아나 여러 사람에게 나타나셨다고 전합니다. 도마의 장면에서도 부활하신 예수를 만났다는 주장이 제시됩니다. 기록의 주장과 기록의 신뢰성을 판단하는 질문은 구별합니다.
      evidence:
        - 고린도전서 15:3–8
        - 요한복음 20:24–29
      activeNodes:
        - testimony
        - risen
      activeEdges:
        - witness
    - id: promise
      label: 부활에서 오는 소망
      description: 바울은 부활하신 예수를 첫 열매라고 부릅니다. 예수에게 속한 사람이 장차 살리심을 받는다는 소망은 그분의 부활에 기대고 있습니다. 현재의 상실과 애도를 생략하라는 뜻은 아닙니다.
      evidence:
        - 고린도전서 15:20–23
        - 요한복음 20:30–31
      activeNodes:
        - risen
        - hope
      activeEdges:
        - firstfruit
  nodes:
    - id: testimony
      label: 기록된 증언
      detail: 기록은 예수의 죽음과 장사, 부활과 나타나심을 전합니다. 각 기록의 내용을 직접 살피는 것이 탐구의 출발점입니다.
      reference: 고전 15:3–8; 요 20:24–29
    - id: risen
      label: 부활하신 예수
      detail: 기독교는 예수가 기억 속에 남았다는 주장보다 실제로 살아나셨다는 주장을 제시합니다.
      reference: 고전 15:3–8
    - id: hope
      label: 생명과 회복의 소망
      detail: 예수의 부활을 첫 열매로 설명하는 바울은 그리스도에게 속한 이의 부활도 말합니다.
      reference: 고전 15:20–23
  edges:
    - id: witness
      source: testimony
      target: risen
      kind: direct
      explanation: 두 본문은 예수가 부활해 나타나셨다고 명시적으로 증언합니다. 이 선은 기록의 주장과 그 대상의 관계를 표시하며 독립적인 역사 검증 결과를 표시하지 않습니다.
      evidence:
        - 고린도전서 15:3–8
        - 요한복음 20:24–29
    - id: firstfruit
      source: risen
      target: hope
      kind: promise
      explanation: 바울은 부활하신 예수를 첫 열매로 소개하고 그분에게 속한 이들이 장차 살아날 소망을 설명합니다.
      evidence:
        - 고린도전서 15:20–23
---

## 증언과 의미를 함께 살펴보기

이 지도는 성경 본문이 하는 주장과 그 의미를 구분하는 도구입니다. 지도에 표시된 관계가 부활의 역사성을 자동으로 입증하지는 않습니다.

- [바울이 전한 복음](/passages/1co-15-3.md)
- [도마의 질문과 고백](/passages/jn-20-24.md)
- [첫 열매의 소망](/passages/1co-15-20.md)

본문을 읽으며 기록의 내용과 추가로 조사하고 싶은 질문을 나누어 보세요.[^bible]

[^bible]: 고린도전서 15장과 요한복음 20장.
