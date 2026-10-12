---
type: Learning Experience
title: 로마서의 은혜 논증
description: 복음의 능력과 인간의 책임, 그리스도 안의 의를 세 층위로 관찰합니다.
status: stable
published: true
public_id: romans-grace
tags: [로마서, 복음, 은혜, 믿음]
sources:
  - id: bible
    title: "로마서 1:16–17; 2:1–11; 3:21–26"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T15:05:35Z
verified: []
definition:
  id: romans-grace
  kind: layers
  title: 로마서 1–3장의 은혜 논증
  goal: 바울이 복음의 능력에서 하나님의 공정한 심판과 그리스도 안의 의로 나아가는 논증을 구별해 읽습니다.
  before: 층위를 더 많이 열었다고 더 큰 은혜를 얻는 것이 아닙니다. 각 단계는 하나의 논증에서 다른 진술을 전경에 놓습니다.
  after: 본문이 죄를 정직하게 다루는 일과 은혜로 의롭다 하시는 일을 함께 말한다는 점을 설명할 수 있습니다.
  transfer: 단계들은 구원의 시간표나 개인의 도덕 점수가 아닙니다. 본문의 문장과 연결을 읽기 위한 보기입니다.
  defaultState: gospel
  states:
    - id: gospel
      label: 복음의 능력
      description: 바울은 복음을 믿는 모든 사람을 구원하는 하나님의 능력이라고 소개합니다.
      evidence: ["로마서 1:16–17"]
      activeNodes: [gospel]
      activeEdges: []
    - id: accountability
      label: 모든 사람의 책임
      description: 바울의 논증은 남을 판단하는 청자에게 돌아오며, 하나님은 사람을 외모로 판단하지 않으십니다.
      evidence: ["로마서 2:1–11"]
      activeNodes: [gospel, accountability]
      activeEdges: [gospel-to-accountability]
    - id: grace
      label: 그리스도 안의 의
      description: 율법과 예언서가 증언한 하나님의 의는 예수 그리스도를 통한 구속과 믿음으로 받는 은혜로 나타납니다.
      evidence: ["로마서 3:21–26"]
      activeNodes: [gospel, accountability, grace]
      activeEdges: [gospel-to-accountability, accountability-to-grace]
  nodes:
    - id: gospel
      label: 복음
      detail: 복음은 바울에게 하나님이 구원하시는 능력이며 믿음으로 받는 소식입니다.
      reference: "로마서 1:16–17"
    - id: accountability
      label: 책임과 심판
      detail: 타인을 판단하는 사람도 같은 하나님의 공정한 심판 아래 있으며, 어느 집단도 면제되지 않습니다.
      reference: "로마서 2:1–11"
    - id: grace
      label: 그리스도 안의 은혜
      detail: 하나님은 예수의 구속을 통해 믿는 사람을 값없이 의롭다고 하십니다.
      reference: "로마서 3:21–26"
  edges:
    - id: gospel-to-accountability
      source: gospel
      target: accountability
      kind: theme
      explanation: 복음의 필요를 설명하는 바울의 논증은 사람의 죄와 판단을 다루는 장들로 이어집니다.
      evidence: ["로마서 1:16–2:11"]
    - id: accountability-to-grace
      source: accountability
      target: grace
      kind: direct
      explanation: 모든 사람이 죄 아래 있다는 논증 다음에 하나님의 의와 그리스도의 구속이 설명됩니다.
      evidence: ["로마서 2:1–3:26"]
---

## 펼쳐서 살펴보기

바울의 논증을 세 구간으로 읽습니다. 복음은 자기 의를 세우기 위한 자격이 아니며, 죄의 진단은 타인을 낙인찍으려는 허가가 아닙니다. 본문이 정직하게 드러내는 책임과 그리스도 안에 주어진 선물을 함께 바라보세요. [로마서의 복음 시리즈](/studies/romans-good-news.md)와 [판단의 경계](/questions/moral-judgment.md)를 이어 읽을 수 있습니다.
