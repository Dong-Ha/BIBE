---
type: Learning Experience
title: 성경의 큰 이야기 따라 읽기
description: 창조와 약속, 그리스도의 오심과 구원, 새 창조를 다섯 국면으로 살펴봅니다.
status: stable
published: true
public_id: story-timeline
tags: [성경, 창조, 약속, 새창조]
sources:
  - id: bible
    title: "창세기 1:1–2:3; 12:1–3; 요한복음 1:1–18; 로마서 3:21–26; 요한계시록 21:1–5"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T15:05:35Z
verified: []
definition:
  id: story-timeline
  kind: story
  title: 창조에서 새 창조까지
  goal: 주요 성경 본문을 따라 구원의 이야기와 본문 사이 연결의 종류를 관찰합니다.
  before: 다섯 국면은 성경의 모든 사건을 대신하는 정확한 연대표나 과학적 시간표가 아닙니다.
  after: 연결을 직접 인용, 약속과 성취, 정경적 주제 읽기로 구별하며 각 본문의 문맥을 존중할 수 있습니다.
  transfer: 서로 다른 문학 장르와 역사적 문맥을 지우지 말고, 성경이 명시하는 관계의 강도에 맞춰 말하세요.
  defaultState: creation
  states:
    - id: creation
      label: 창조의 선함
      description: 창세기는 하나님이 세계를 창조하시고 선하다고 선언하신 일을 증언합니다.
      evidence: ["창세기 1:1–2:3"]
      activeNodes: [creation]
      activeEdges: []
    - id: promise
      label: 열방을 향한 약속
      description: 하나님은 아브람을 부르시며 땅의 모든 족속이 그를 통해 복을 얻으리라고 약속하십니다.
      evidence: ["창세기 12:1–3"]
      activeNodes: [creation, promise]
      activeEdges: [creation-to-promise]
    - id: christ
      label: 말씀이 육신이 됨
      description: 요한복음은 창조의 말씀과 육신이 되어 오신 예수를 연결해 증언합니다.
      evidence: ["요한복음 1:1–18"]
      activeNodes: [creation, promise, christ]
      activeEdges: [creation-to-promise, creation-to-word]
    - id: redemption
      label: 그리스도 안의 구원
      description: 로마서는 죄 아래 있는 모든 사람과 예수의 구속, 믿음으로 받는 하나님의 은혜를 말합니다.
      evidence: ["로마서 3:21–26"]
      activeNodes: [creation, promise, christ, redemption]
      activeEdges: [creation-to-promise, creation-to-word, promise-to-gospel]
    - id: renewal
      label: 새 창조의 소망
      description: 요한계시록은 하나님이 함께 거하시고 만물을 새롭게 하시는 환상을 전합니다.
      evidence: ["요한계시록 21:1–5"]
      activeNodes: [creation, promise, christ, redemption, renewal]
      activeEdges: [creation-to-promise, creation-to-word, promise-to-gospel, gospel-to-renewal]
  nodes:
    - id: creation
      label: 창조
      detail: 창세기는 하나님이 말씀으로 창조하시고 창조 세계를 선하다고 선언하셨다고 전합니다.
      reference: "창세기 1:1–2:3"
    - id: promise
      label: 아브라함의 약속
      detail: 아브람을 통한 복은 그 가족을 넘어 땅의 모든 족속을 향합니다.
      reference: "창세기 12:1–3"
    - id: christ
      label: 육신이 되신 말씀
      detail: 요한은 창조의 말씀을 예수의 성육신과 은혜와 진리에 연결합니다.
      reference: "요한복음 1:1–18"
    - id: redemption
      label: 그리스도의 구속
      detail: 바울은 그리스도의 구속을 믿는 이에게 주시는 하나님의 은혜로 설명합니다.
      reference: "로마서 3:21–26"
    - id: renewal
      label: 새 창조
      detail: 하나님이 함께하시고 죽음과 눈물을 끝내며 만물을 새롭게 하실 소망이 제시됩니다.
      reference: "요한계시록 21:1–5"
  edges:
    - id: creation-to-promise
      source: creation
      target: promise
      kind: theme
      explanation: 창조된 세계와 모든 족속을 향한 복의 약속은 성경 이야기 안에서 함께 읽을 수 있습니다.
      evidence: ["창세기 1:1–2:3; 12:1–3"]
    - id: creation-to-word
      source: creation
      target: christ
      kind: direct
      explanation: 요한복음의 시작은 창세기의 창조 언어를 사용해 말씀의 정체를 소개합니다.
      evidence: ["창세기 1:1; 요한복음 1:1–3, 14"]
    - id: promise-to-gospel
      source: promise
      target: redemption
      kind: theme
      explanation: 복음은 아브라함의 약속을 포함한 율법과 예언서의 증언을 배경으로 읽힙니다. 로마서 3장은 창세기 12장을 직접 인용하지 않습니다.
      evidence: ["창세기 12:1–3; 로마서 3:21–26"]
    - id: gospel-to-renewal
      source: redemption
      target: renewal
      kind: theme
      explanation: 그리스도 안의 구원과 새 창조는 정경의 큰 소망 안에서 연결되지만, 요한계시록 21장은 로마서 3장을 직접 인용하지 않습니다.
      evidence: ["로마서 3:21–26; 요한계시록 21:1–5"]
---

## 펼쳐서 살펴보기

순서는 성경 전체의 간단한 연표라기보다 각 본문이 증언하는 주요 장면을 나란히 놓은 읽기 도구입니다. 요한복음은 창세기와 같은 “태초”로 직접 시작하지만, 다른 연결은 주제적 독법일 수 있습니다. 연결이 직접 인용인지, 약속과 성취인지, 정경적 종합인지 구분하세요. [성경의 큰 이야기](/questions/big-story.md)와 [창조에서 새 창조까지의 학습 시리즈](/studies/one-story.md)를 함께 읽을 수 있습니다.
