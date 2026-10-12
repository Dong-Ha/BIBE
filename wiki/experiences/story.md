---
type: Learning Experience
title: "두 아들과 아버지의 이야기"
description: "누가복음 15장의 세 장면을 따라가며 잃음과 환대, 형제의 반응을 살펴봅니다."
status: stable
published: true
public_id: story
tags:
  - 누가복음
  - 잃은 자
  - 은혜
sources:
  - id: luke-15
    title: "누가복음 15:11–32"
    resource: https://www.biblegateway.com/passage/?search=Luke%2015%3A11-32&version=NRSVUE
generated:
  by: codex/experience-editor
  at: "2026-10-12T13:47:25Z"
verified: []
definition:
  id: story
  kind: story
  title: "두 아들과 아버지의 이야기"
  goal: "이야기의 장면을 따라가며 아버지의 환대와 두 아들의 서로 다른 반응을 본문에서 확인합니다."
  before: "이 이야기에서 누가 잃어버린 사람이라고 생각하나요? 장면이 바뀔 때 판단이 어떻게 달라지는지 살펴보세요."
  after: "실패한 사람을 맞이하는 환대와, 그 환대에 불편함을 느끼는 마음이 오늘의 공동체에서 어떻게 드러나는지 생각해 보세요."
  transfer: "본문의 아버지를 하나님과 연결해 읽을 때에도 비유의 문맥과 예수의 초대를 함께 살펴봅니다. 인물 하나를 예수와 일대일로 대응시키지는 않습니다."
  defaultState: leaving
  states:
    - id: leaving
      label: "떠남"
      description: "작은아들은 유산을 요구하고 먼 나라로 떠납니다. 자신이 원하는 삶을 아버지와의 관계 밖에서 찾으려 합니다."
      evidence: ["누가복음 15:11–16"]
      activeNodes: [younger, father]
      activeEdges: [ask, leave]
    - id: returning
      label: "돌아옴"
      description: "궁핍해진 아들은 돌아가기로 합니다. 아버지는 먼저 달려가 아들을 맞고 잔치를 엽니다."
      evidence: ["누가복음 15:17–24"]
      activeNodes: [younger, father]
      activeEdges: [return, welcome]
    - id: resentment
      label: "형의 분노"
      description: "큰아들은 잔치에 들어가기를 거부합니다. 아버지는 집 밖으로 나와 큰아들에게도 말을 건넵니다."
      evidence: ["누가복음 15:25–32"]
      activeNodes: [older, father]
      activeEdges: [invite, resent]
  nodes:
    - id: younger
      label: "작은아들"
      detail: "유산을 받고 떠났다가 궁핍 속에서 돌아옵니다. 이야기는 그의 귀환을 넘어, 그를 맞이하는 아버지와 형의 반응까지 보여 줍니다."
      reference: "눅 15:11–24"
    - id: older
      label: "큰아들"
      detail: "집에 남아 일했지만 동생을 위한 잔치를 거부합니다. 아버지는 그에게도 함께 기뻐하자고 초대합니다."
      reference: "눅 15:25–32"
    - id: father
      label: "아버지"
      detail: "두 아들을 모두 향해 나갑니다. 작은아들을 맞이하고 큰아들에게는 함께 기뻐하자고 청합니다."
      reference: "눅 15:20–32"
  edges:
    - id: ask
      source: younger
      target: father
      kind: direct
      explanation: "작은아들은 아버지에게 유산을 요구합니다."
      evidence: ["누가복음 15:12"]
    - id: leave
      source: father
      target: younger
      kind: direct
      explanation: "작은아들은 먼 나라로 떠나고, 아버지와의 관계는 이야기의 긴장을 이룹니다."
      evidence: ["누가복음 15:13"]
    - id: return
      source: younger
      target: father
      kind: direct
      explanation: "아들은 돌아갈 결심을 하고 집으로 향합니다."
      evidence: ["누가복음 15:17–20"]
    - id: welcome
      source: father
      target: younger
      kind: direct
      explanation: "아버지는 아들을 보고 달려가 맞이하고 잔치를 엽니다."
      evidence: ["누가복음 15:20–24"]
    - id: invite
      source: father
      target: older
      kind: direct
      explanation: "아버지는 집 밖으로 나와 큰아들에게도 함께 기뻐하자고 청합니다."
      evidence: ["누가복음 15:28–32"]
    - id: resent
      source: older
      target: father
      kind: direct
      explanation: "큰아들은 잔치에 들어가기를 거부하고 자신의 억울함을 말합니다."
      evidence: ["누가복음 15:28–30"]
---

## 따라가며 읽기

장면 선택은 이야기의 강조점이 어떻게 이동하는지 돕는 읽기 도구입니다. 작은아들의 귀환에서 멈추지 말고, 큰아들을 향한 아버지의 초대까지 읽어 보세요. 비유가 누구에게 주어졌는지는 앞의 두 비유와 누가복음 15:1–2에서 확인할 수 있습니다.
