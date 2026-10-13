---
type: Learning Experience
title: 질문의 자리에서 예수를 바라보기
description: 도움을 구하는 호소, 감옥에서 보낸 질문, 무너진 기대, 기록된 증언을 네 장면에서 비교합니다.
status: stable
published: true
public_id: doubt-exploration
tags:
  - 의심
  - 질문
  - 믿음
  - 예수
  - 부활
sources:
  - id: mark9
    title: 마가복음 9:14–29 (개역개정)
    author: 대한성서공회
    resource: https://bible.bskorea.or.kr/bible/NKRV/MRK.9
  - id: matthew11
    title: 마태복음 11:2–19 (개역개정)
    author: 대한성서공회
    resource: https://bible.bskorea.or.kr/bible/NKRV/MAT.11
  - id: luke24
    title: 누가복음 24:13–35 (개역개정)
    author: 대한성서공회
    resource: https://bible.bskorea.or.kr/bible/NKRV/LUK.24
  - id: john20
    title: 요한복음 20:24–31 (개역개정)
    author: 대한성서공회
    resource: https://bible.bskorea.or.kr/bible/NKRV/JHN.20
generated:
  by: codex/resume-language-editor
  at: 2026-10-13T14:10:33.040Z
verified:
  - by: codex/resume-content-review
    at: 2026-10-13T14:10:33.040Z
definition:
  id: doubt-exploration
  kind: perspectives
  title: 질문의 자리에서 예수를 바라보기
  goal: 네 복음서 장면에서 질문이 놓인 상황과 예수의 응답을 관찰하고, 십자가와 부활의 복음이 각 장면에서 어떻게 드러나는지 비교합니다.
  before: 이 선택지는 믿음의 크기나 상태를 나타내지 않습니다. 지금의 질문과 비슷한 장면을 골라 본문에서 실제로 일어난 일을 먼저 찾아보세요.
  after: 각 장면의 맥락과 예수의 응답은 서로 다릅니다. 공통점과 차이를 본문 단서에 근거해 설명하고, 자신의 감정이나 상황에 곧바로 판정을
    내리지 않습니다.
  transfer: 다른 질문을 만날 때도 먼저 그 사람의 실제 상황을 듣고, 본문이 말하는 역사적 사건과 오늘의 적용을 구분해 보세요. 예수의
    십자가와 부활에 비추어 필요한 동행이나 구체적 도움을 물을 수 있습니다.
  defaultState: help
  states:
    - id: help
      label: 도움을 구하는 질문
      description: 아이를 돕지 못한 제자들 뒤에 아버지는 예수께 아이를 데려와 도움을 청합니다. “믿습니다. 나의 믿음 없는 것을
        도와주소서”라는 호소에는 믿음과 망설임이 함께 드러나며, 예수는 아이를 일으키십니다. 이 특정 사건은 모든 질병의 원인이나 치유
        결과를 설명하는 공식이 아닙니다.
      evidence:
        - 마가복음 9:14–29
      activeNodes:
        - father-plea
        - jesus-raises
      activeEdges:
        - help-to-compassion
    - id: waiting
      label: 고통 속에서 묻는 질문
      description: 감옥에 있던 세례 요한은 제자들을 보내 예수께서 오실 이인지 묻습니다. 예수는 회복의 표지와 가난한 이에게 전해지는
        복음을 전하라 하시고, 이어지는 문맥에서 요한을 높이십니다. 이 본문은 요한의 감옥 생활이 끝났다고 말하지 않습니다.
      evidence:
        - 마태복음 11:2–6
      activeNodes:
        - john-asks
        - jesus-points
      activeEdges:
        - waiting-to-witness
    - id: disappointed
      label: 기대가 무너진 질문
      description: 엠마오로 가는 두 제자는 예수가 이스라엘을 구원할 분이라 바랐지만, 십자가 뒤 그 기대가 무너진 듯 말합니다. 부활하신
        예수는 그들이 더디 믿는다고 지적하신 뒤, 예수의 고난과 영광을 성경으로 풀어 주십니다(24:25–27). 예수는 그들과
        동행하시며 성경을 풀어 주고 자신을 알리십니다.
      evidence:
        - 누가복음 24:13–35
        - 누가복음 24:25–27
      activeNodes:
        - lost-expectation
        - suffering-and-glory
      activeEdges:
        - disappointment-to-scripture
    - id: witness
      label: 증언을 살피는 질문
      description: 도마는 다른 제자들의 증언을 듣고도 직접 확인하고 싶다고 말합니다. 예수는 그에게 상처를 보이시며 “믿는 자가 되라”고
        하십니다(20:27). 요한은 기록한 표적의 목적이 예수를 하나님이 보내신 구원자이며 하나님의 아들로 믿고 생명을 얻게 하는 데
        있다고 밝힙니다(20:30–31). 이 기록은 복음서가 밝히는 사도적 증언의 목적이지, 질문하는 사람을 재촉하거나 모든 역사적
        논쟁을 한 문장으로 끝내는 말이 아닙니다.
      evidence:
        - 요한복음 20:24–31
        - 요한복음 20:30–31
      activeNodes:
        - thomas-meets
        - written-witness
      activeEdges:
        - witness-to-life
  nodes:
    - id: father-plea
      label: 아버지의 도움 요청
      detail: 아버지는 제자들의 실패 뒤에도 예수께 아이를 데려오며 자신의 믿음 없는 면까지 도와 달라고 호소합니다. 본문은 그를 믿음의 점수로
        평가하지 않습니다.
      reference: 마가복음 9:14–24
    - id: jesus-raises
      label: 아이를 일으키시는 예수
      detail: 예수는 아이를 고치고 손을 잡아 일으키십니다. 이 사건은 그 장면에서 예수의 권위와 자비를 증언하며, 모든 고통이 같은 방식으로
        해결된다는 보장을 주지 않습니다.
      reference: 마가복음 9:25–29
    - id: john-asks
      label: 감옥에서 온 요한의 질문
      detail: 세례 요한은 감옥에 있는 동안 제자들을 보내 예수의 정체를 묻습니다. 본문은 그의 질문을 믿음의 실패라고 판정하지 않습니다.
      reference: 마태복음 11:2–3
    - id: jesus-points
      label: 사역의 표지를 가리키는 예수
      detail: 예수는 병든 이들의 회복과 가난한 이들에게 전해지는 복음을 요한에게 알리라 하십니다. 이 표지는 예수가 하나님이 보내신 구원자로서
        행하시는 일을 드러냅니다. 본문은 요한의 투옥이 즉시 끝났다고 말하지 않습니다.
      reference: 마태복음 11:4–6
    - id: lost-expectation
      label: 구원을 바랐던 제자들
      detail: 두 제자는 예수를 이스라엘을 구원할 분으로 바랐다고 말하면서, 예수의 죽음과 빈 무덤 소식 앞에서 슬퍼하고 혼란스러워합니다.
      reference: 누가복음 24:13–24
    - id: suffering-and-glory
      label: 고난 뒤 영광을 풀어 주심
      detail: 예수는 제자들의 더딘 믿음을 지적하시고 성경을 들어 예수가 고난을 받고 영광에 들어가야 함을 설명하십니다. 이 해석의 중심은
        고난받고 부활하신 예수입니다.
      reference: 누가복음 24:25–35
    - id: thomas-meets
      label: 도마에게 자신을 보이신 예수
      detail: 도마는 부활하신 예수를 만나 “나의 주님이시요 나의 하나님이시니이다”라고 고백합니다. 예수는 그에게 “믿는 자가 되라”고
        말씀하시며 보지 않고 믿는 이의 복도 선언하십니다.
      reference: 요한복음 20:24–29
    - id: written-witness
      label: 기록된 표적의 목적
      detail: 요한은 예수가 하나님이 보내신 구원자이며 하나님의 아들이심을 믿고 그 이름 안에서 생명을 얻게 하려고 표적을 기록했다고 밝힙니다.
        본문은 오늘 독자가 읽는 복음서 증언의 목적을 설명합니다.
      reference: 요한복음 20:30–31
  edges:
    - id: help-to-compassion
      source: father-plea
      target: jesus-raises
      kind: direct
      explanation: 아버지가 도움을 청한 장면에서 예수는 아이에게 다가가 고치고 일으키십니다. 본문이 보여 주는 구체적 응답을 모든 치유의
        결과를 보장하는 공식으로 확대하지 않습니다.
      evidence:
        - 마가복음 9:22–27
    - id: waiting-to-witness
      source: john-asks
      target: jesus-points
      kind: direct
      explanation: 요한의 질문에 예수는 자신의 사역에서 드러나는 회복과 복음 선포를 전하라고 답하십니다. 이어지는 요한에 대한 예수의
        평가는 질문과 정죄를 동일시하지 않게 돕습니다.
      evidence:
        - 마태복음 11:2–11
    - id: disappointment-to-scripture
      source: lost-expectation
      target: suffering-and-glory
      kind: direct
      explanation: 예수는 엠마오 제자들의 무너진 기대를 성경에 따라 다시 설명하십니다. 하나님이 보내신 구원자가 고난을 받고 영광에
        들어가야 한다는 것이 설명의 중심입니다. 오늘의 모든 상실을 제자들의 오해 탓으로 돌리는 적용은 본문이 말하지 않습니다.
      evidence:
        - 누가복음 24:21–27
    - id: witness-to-life
      source: thomas-meets
      target: written-witness
      kind: direct
      explanation: 도마의 만남 뒤에 요한은 복음서의 표적 기록이 예수를 믿고 생명을 얻게 하려는 목적을 밝힙니다. 이 서술은 기록된 증언을
        통해 독자를 초대합니다.
      evidence:
        - 요한복음 20:28–31
---

## 네 장면을 비교하기

복음서에는 질문이 서로 다른 자리에서 나옵니다. 마가복음의 아버지는 아이를 위해 도움을 청하고, 마태복음의 세례 요한은 감옥에서 예수의 정체를 묻습니다. 누가복음의 두 제자는 무너진 기대와 부활 소식을 말하고, 요한복음의 도마는 동료들의 증언을 들은 뒤 부활하신 예수를 만납니다.[^mark9] [^matthew11] [^luke24] [^john20]

화면에서 네 상태를 차례로 선택하며 인물의 상황, 예수의 응답, 본문이 직접 말하는 근거를 비교해 보세요. 네 장면을 한 가지 심리 유형이나 믿음의 단계로 묶지 않습니다. 어느 한 장면을 선택했다고 해서 자신의 믿음이 좋거나 부족하다는 뜻도 아닙니다.

누가복음 24:25–27에서 예수는 제자들의 더딘 이해를 지적하고, 성경에 따라 하나님이 보내신 구원자가 고난을 받고 영광에 들어가야 한다고 설명하십니다. 복음의 소망은 고난을 겪은 사람이 충분히 믿으면 원하는 결과를 얻는다는 약속이 아니라, 십자가를 지나 부활하신 그리스도께 있습니다. 마가복음의 특정 치유, 요한의 감옥, 엠마오 제자들의 상실, 도마에게 주어진 만남은 각각의 이야기 맥락을 지닙니다.

오늘의 적용을 생각할 때는 본문의 역사적 증언과 내 상황에 대한 판단을 구분하세요. 요한복음 20:30–31은 기록된 표적의 목적을 예수를 하나님이 보내신 구원자이며 하나님의 아들로 믿고 생명을 얻게 하는 것이라고 설명합니다. 질문에 당장 결론을 강요하기보다 본문을 함께 읽고, 고통 중인 사람에게 필요한 동행과 실제 도움을 물을 수 있습니다. [예수와 부활을 믿을 이유가 있을까?](/questions/evidence.md)도 함께 읽을 수 있습니다.

[^mark9]: [대한성서공회, 마가복음 9:14–29](https://bible.bskorea.or.kr/bible/NKRV/MRK.9)
[^matthew11]: [대한성서공회, 마태복음 11:2–19](https://bible.bskorea.or.kr/bible/NKRV/MAT.11)
[^luke24]: [대한성서공회, 누가복음 24:13–35](https://bible.bskorea.or.kr/bible/NKRV/LUK.24)
[^john20]: [대한성서공회, 요한복음 20:24–31](https://bible.bskorea.or.kr/bible/NKRV/JHN.20)
