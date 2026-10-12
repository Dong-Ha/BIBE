---
type: Learning Experience
title: 주기도문의 흐름 따라 읽기
description: 예수께서 가르치신 기도의 여섯 요청을 살펴보며 기도를 관계와 일상의 언어로 읽습니다.
status: stable
published: true
public_id: prayer-pattern
tags: [마태복음, 기도, 주기도문]
sources:
  - id: bible
    title: "마태복음 6:5–15"
    resource: https://bible.bskorea.or.kr/
generated:
  by: codex/experience-editor
  at: 2026-10-12T16:11:46Z
verified:
  - by: codex/content-review
    at: 2026-10-12T16:22:21.805188Z
definition:
  id: prayer-pattern
  kind: story
  title: 주기도문의 여섯 초점
  goal: 예수께서 제자들에게 가르치신 기도의 순서와 공동체적 언어를 성경 본문에서 살펴봅니다.
  before: 기도 문장을 성취해야 할 단계나 원하는 결과를 얻는 공식으로 보지 말고, 예수의 가르침을 따라 하나님과 이웃을 향한 요청을 관찰하세요.
  after: 하나님을 아버지라 부르는 관계에서 이름과 나라, 일상의 필요와 용서를 구하는 기도의 흐름을 읽을 수 있습니다.
  transfer: 이 흐름은 기도 응답의 순서나 결과를 약속하지 않습니다. 자기 말로 하나님을 부르고 이웃의 필요를 함께 기억하는 데 사용할 수 있습니다.
  defaultState: father
  states:
    - id: father
      label: 아버지께 나아감
      description: 예수는 제자들에게 하나님을 아버지라 부르며 기도를 시작하게 하십니다. 공개적인 과시나 반복되는 말로 기도의 가치를 증명할 필요가 없습니다.
      evidence: [마태복음 6:5–9]
      activeNodes: [father]
      activeEdges: []
    - id: name
      label: 이름이 거룩히 여김을 받으시며
      description: 기도는 먼저 하나님의 이름이 거룩히 여김 받기를 구합니다. 이것은 내 요구를 먼저 관철하는 일이 아니라 하나님을 향한 예배와 소망을 말합니다.
      evidence: [마태복음 6:9]
      activeNodes: [father, name]
      activeEdges: [begin]
    - id: kingdom
      label: 나라와 뜻을 구함
      description: 예수는 하나님의 나라가 오고 뜻이 이루어지기를 구하게 하십니다. 기도자는 자신의 바람을 숨기지 않으면서 더 넓은 하나님의 선한 통치를 구합니다.
      evidence: [마태복음 6:10]
      activeNodes: [name, kingdom]
      activeEdges: [honor]
    - id: bread
      label: 일용할 양식
      description: 제자들은 오늘 필요한 양식을 함께 구합니다. 기도에는 영적인 표현만이 아니라 몸의 필요와 공동체가 나누는 일상의 공급이 포함됩니다.
      evidence: [마태복음 6:11]
      activeNodes: [kingdom, bread]
      activeEdges: [reign]
    - id: forgiveness
      label: 용서와 관계
      description: 기도는 우리 죄를 용서해 달라고 구하고 우리가 용서하는 일도 다룹니다. 이 권면은 피해자에게 안전을 포기하거나 가해자와 관계를 회복하라고 강요하는 근거가 아닙니다.
      evidence: ["마태복음 6:12, 14–15"]
      activeNodes: [bread, forgiveness]
      activeEdges: [provision]
    - id: help
      label: 시험과 악에서 지켜 주심
      description: 제자들은 시험에 빠지지 않고 악에서 구해 주시기를 구합니다. 사람의 취약함과 위험을 인정하며 보호와 도움을 요청할 수 있습니다.
      evidence: [마태복음 6:13]
      activeNodes: [father, forgiveness, help]
      activeEdges: [reconcile, deliver]
  nodes:
    - id: father
      label: 아버지께 나아감
      detail: 예수는 기도를 하나님 아버지께 향하게 하며, 제자들이 이미 필요한 것을 아시는 분께 나아간다고 가르칩니다.
      reference: 마태복음 6:5–9
    - id: name
      label: 하나님의 이름
      detail: 하나님의 이름이 거룩히 여김 받기를 구하는 찬양과 청원입니다.
      reference: 마태복음 6:9
    - id: kingdom
      label: 나라와 뜻
      detail: 하나님의 나라가 오고 뜻이 이루어지기를 구합니다.
      reference: 마태복음 6:10
    - id: bread
      label: 일상의 필요
      detail: 우리에게 필요한 양식을 오늘 주시기를 구합니다.
      reference: 마태복음 6:11
    - id: forgiveness
      label: 용서
      detail: 하나님께 죄의 용서를 구하고 이웃과의 관계에서 용서를 배우도록 가르칩니다.
      reference: 마태복음 6:12, 14–15
    - id: help
      label: 보호와 도움
      detail: 시험과 악에서 구해 주시기를 구하는 청원입니다.
      reference: 마태복음 6:13
  edges:
    - id: begin
      source: father
      target: name
      kind: direct
      explanation: 예수의 가르침은 아버지를 부르며 하나님의 이름을 구하는 기도로 시작합니다.
      evidence: [마태복음 6:9]
    - id: honor
      source: name
      target: kingdom
      kind: direct
      explanation: 하나님의 이름을 거룩히 구한 뒤 나라와 뜻을 구합니다.
      evidence: [마태복음 6:9–10]
    - id: reign
      source: kingdom
      target: bread
      kind: direct
      explanation: 하나님 나라를 구하는 기도는 오늘 필요한 양식을 구하는 청원과 이어집니다.
      evidence: [마태복음 6:10–11]
    - id: provision
      source: bread
      target: forgiveness
      kind: direct
      explanation: 일상의 필요를 구한 뒤 죄의 용서를 구합니다.
      evidence: [마태복음 6:11–12]
    - id: reconcile
      source: forgiveness
      target: help
      kind: direct
      explanation: 용서를 구한 뒤 시험과 악에서 보호해 주시기를 구합니다.
      evidence: [마태복음 6:12–13]
    - id: deliver
      source: father
      target: help
      kind: theme
      explanation: 기도자는 필요한 것을 아시는 아버지께 시험과 악에서 구해 달라고 청합니다.
      evidence: ["마태복음 6:8, 13"]
---

## 따라가며 읽기

마태복음 6:5–15에서 예수는 제자들에게 기도를 가르치기 전에 사람에게 보이려는 기도와 빈말의 반복을 경계하십니다. 이어지는 주기도문은 하나님을 아버지라 부르고 그 이름과 나라를 구한 뒤, 오늘 필요한 양식과 용서와 보호를 청합니다. 여섯 장면은 그 흐름을 한눈에 따라가도록 정리한 것입니다.

도식을 여는 목적은 문장을 정확히 반복하거나 마음을 한 가지 감정으로 바꾸는 데 있지 않습니다. 각 장면에서 “이 요청은 하나님과 이웃을 어떻게 바라보게 하는가?”를 물어보세요. 필요한 것이 있다면 예수의 가르침처럼 구체적으로 말할 수 있고, 기도를 듣는 분을 설득해야 한다는 압박은 내려놓아도 됩니다. [기도를 어떻게 시작할 수 있을까?](/questions/prayer-start.md)와 함께 읽고, 자신의 말로 드릴 짧은 기도 한 문장을 적어 보세요.
