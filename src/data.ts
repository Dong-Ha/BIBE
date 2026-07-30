import type { Connection, PassageNode, Thread } from './types'

const confessionUrls = {
  westminster: 'https://www.opc.org/wcf.html',
  heidelberg: 'https://www.crcna.org/welcome/beliefs/confessions/heidelberg-catechism',
  belgic: 'https://www.crcna.org/welcome/beliefs/confessions/belgic-confession',
  dort: 'https://www.crcna.org/welcome/beliefs/confessions/canons-dort',
}

const bibleUrl = 'https://bible.bskorea.or.kr/'

export const nodes: PassageNode[] = [
  {
    id: 'jn-1-1',
    reference: '요한복음 1:1–3',
    eyebrow: '서문의 문턱',
    title: '태초에 계신 말씀',
    summary: '요한은 예수 그리스도의 이야기를 창조 이전, 하나님과 함께 계신 말씀에서 시작한다.',
    observation: '“태초”, “함께”, “말씀”이 창세기 1장의 창조 언어를 불러오면서도 말씀과 하나님 사이의 구별을 유지한다.',
    x: 98,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '계시는 인격으로 완성된다',
      summary: '개혁주의는 성자를 영원한 하나님으로 고백하며, 창조와 구속에서 삼위 하나님의 사역이 분리되지 않는다고 본다. 성경의 중심은 인간이 찾아낸 원리가 아니라 자신을 알리신 그리스도다.',
      scripture: ['창세기 1:1–3', '골로새서 1:15–17', '히브리서 1:1–3'],
      confessions: [
        { document: '벨직 신앙고백', section: '제8–10조', summary: '삼위일체와 예수 그리스도의 참되고 영원한 신성', url: confessionUrls.belgic },
        { document: '웨스트민스터 신앙고백', section: '제2장, 제8장', summary: '삼위 하나님과 중보자 그리스도', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'gen-1-1',
    reference: '창세기 1:1–5',
    eyebrow: '구약의 배경',
    title: '말씀으로 시작된 창조',
    summary: '하나님이 말씀하시자 빛이 생기고 빛과 어둠이 나뉜다.',
    observation: '요한복음의 “태초”와 “빛”은 창세기의 첫 장면을 직접 떠올리게 한다.',
    x: 338,
    y: 72,
    externalUrl: bibleUrl,
    lens: {
      title: '창조의 주가 새 창조의 주다',
      summary: '창조가 하나님의 자유롭고 주권적인 말씀으로 시작되었듯, 구원도 인간의 자력보다 생명을 주시는 하나님의 선행하는 은혜에서 시작된다.',
      scripture: ['고린도후서 4:6', '에베소서 2:4–5'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제4장', summary: '창조에 관하여', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-1-5',
    reference: '요한복음 1:4–5',
    eyebrow: '첫 번째 대조',
    title: '어둠이 이기지 못한 빛',
    summary: '말씀 안의 생명이 사람들의 빛이며, 어둠은 그 빛을 이기지 못한다.',
    observation: '빛과 어둠은 단순한 분위기가 아니라 계시와 거부, 생명과 심판을 가르는 반복 대조로 발전한다.',
    x: 340,
    y: 204,
    externalUrl: bibleUrl,
    lens: {
      title: '은혜는 어둠보다 먼저 비춘다',
      summary: '죄로 어두워진 인간은 스스로 빛을 만들어 내지 못한다. 그리스도의 빛이 먼저 비추며, 성령은 그 계시를 믿음으로 받도록 마음을 밝히신다.',
      scripture: ['고린도후서 4:4–6', '에베소서 5:8–14'],
      confessions: [
        { document: '도르트 신조', section: '제3·4교리, 제11–12항', summary: '성령이 복음으로 마음을 밝히시고 새 생명을 일으키심', url: confessionUrls.dort },
      ],
    },
  },
  {
    id: 'jn-3-19',
    reference: '요한복음 3:19–21',
    eyebrow: '빛에 대한 반응',
    title: '빛으로 나오는 사람',
    summary: '빛이 세상에 왔지만 악을 사랑하는 사람은 자신의 행위가 드러날까 빛을 피한다.',
    observation: '빛은 정보를 제공하는 데 그치지 않고 사람의 사랑과 행위를 드러내는 심판의 기능을 한다.',
    x: 576,
    y: 120,
    externalUrl: bibleUrl,
    lens: {
      title: '불신은 지식 부족만의 문제가 아니다',
      summary: '개혁주의 인간론은 죄가 지성뿐 아니라 의지와 사랑 전체를 굽게 한다고 본다. 빛으로 나옴은 진리를 더 수집하는 일이 아니라 은혜로 새롭게 된 마음의 반응이다.',
      scripture: ['로마서 1:18–23', '에베소서 4:17–18'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제5–8문', summary: '타락 이후 인간의 부패와 거듭남의 필요', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'jn-8-12',
    reference: '요한복음 8:12',
    eyebrow: '자기 계시',
    title: '나는 세상의 빛이다',
    summary: '예수는 자신을 따르는 사람이 어둠에 다니지 않고 생명의 빛을 얻는다고 선언한다.',
    observation: '서문의 빛이 이제 예수 자신의 “나는 …이다” 선언과 제자도의 요청으로 구체화된다.',
    x: 594,
    y: 282,
    externalUrl: bibleUrl,
    lens: {
      title: '구원은 그리스도와의 연합이다',
      summary: '빛을 얻는 길은 추상적 원리를 소유하는 것이 아니라 믿음으로 그리스도를 따르는 데 있다. 개혁주의는 구원의 모든 유익이 그리스도와의 연합 안에서 주어진다고 강조한다.',
      scripture: ['고린도후서 5:17', '골로새서 2:6–7'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제20–21문', summary: '참된 믿음과 그리스도 안에서 받는 구원', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'jn-12-35',
    reference: '요한복음 12:35–36',
    eyebrow: '공생애의 끝',
    title: '빛이 있을 동안 걸으라',
    summary: '예수는 빛이 잠시 더 있을 때 빛을 믿어 빛의 자녀가 되라고 촉구한다.',
    observation: '1장에서 시작한 빛의 주제가 공적 사역의 마지막에 시간의 긴박성과 믿음의 요청으로 돌아온다.',
    x: 812,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '복음의 부름은 지금 응답을 요구한다',
      summary: '복음은 단지 세계관을 설명하지 않고 그리스도를 믿으라고 부른다. 외적 부름이 선포될 때 성령은 택한 자 안에서 유효하게 역사하신다.',
      scripture: ['이사야 55:6–7', '고린도후서 6:2'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제10장', summary: '유효한 부르심에 관하여', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-3-3',
    reference: '요한복음 3:3–8',
    eyebrow: '위로부터 난 생명',
    title: '성령으로 거듭남',
    summary: '하나님 나라를 보는 일은 육의 가능성이 아니라 성령으로 위로부터 나는 일에 달려 있다.',
    observation: '“나다”라는 동사가 출생과 기원의 의미를 함께 품고, 바람의 비유는 성령의 자유로운 역사를 드러낸다.',
    x: 337,
    y: 203,
    externalUrl: bibleUrl,
    lens: {
      title: '중생은 하나님의 주권적 역사다',
      summary: '새 생명은 인간이 먼저 자신을 개조한 결과가 아니다. 성령이 죽은 마음을 살리시며, 믿음은 이 새 생명의 열매로 나타난다.',
      scripture: ['에스겔 36:25–27', '에베소서 2:4–5', '디도서 3:5'],
      confessions: [
        { document: '도르트 신조', section: '제3·4교리, 제12항', summary: '중생은 하나님의 초자연적이고 강력한 사역', url: confessionUrls.dort },
      ],
    },
  },
  {
    id: 'ezk-36-25',
    reference: '에스겔 36:25–27',
    eyebrow: '예언의 배경',
    title: '새 마음과 새 영',
    summary: '하나님은 자기 백성을 깨끗하게 하고 새 마음과 영을 주어 말씀에 순종하게 하겠다고 약속한다.',
    observation: '물과 성령, 새 마음이라는 약속은 니고데모가 알아야 했던 구약의 배경을 이룬다.',
    x: 98,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '새 언약의 변화는 안에서 시작된다',
      summary: '하나님은 명령만 반복하지 않고 순종할 새 마음을 주신다. 칭의와 중생은 구별되지만 구원 안에서 결코 분리되지 않는다.',
      scripture: ['예레미야 31:31–34', '디도서 3:5–7'],
      confessions: [
        { document: '벨직 신앙고백', section: '제24조', summary: '성화와 선행은 참된 믿음에서 나오는 열매', url: confessionUrls.belgic },
      ],
    },
  },
  {
    id: 'jn-20-31',
    reference: '요한복음 20:30–31',
    eyebrow: '기록의 목적',
    title: '믿고 생명을 얻게 하려 함',
    summary: '선택되어 기록된 표적은 예수가 그리스도이자 하나님의 아들이심을 믿고 생명을 얻게 한다.',
    observation: '“표적–믿음–생명”은 개별 기적을 책 전체의 목적과 묶는 해석 열쇠다.',
    x: 812,
    y: 200,
    externalUrl: bibleUrl,
    lens: {
      title: '말씀은 믿음을 일으키는 은혜의 방편이다',
      summary: '성경 기록은 중립적인 정보 보관소가 아니다. 성령은 기록되고 선포된 말씀을 통해 그리스도를 알게 하시고 믿음을 일으키신다.',
      scripture: ['로마서 10:14–17', '베드로전서 1:23–25'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제14장', summary: '구원하는 믿음은 말씀의 사역으로 생겨남', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-10-11',
    reference: '요한복음 10:11–16',
    eyebrow: '목자의 선언',
    title: '양을 위해 목숨을 버리는 목자',
    summary: '선한 목자는 양을 알고 자기 목숨을 내어 주며 한 무리로 모은다.',
    observation: '목자와 삯꾼의 대조는 돌봄의 질보다 목자가 양을 위해 죽는 대속적 행동에 절정을 둔다.',
    x: 340,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '목자는 자기 백성을 실제로 구원한다',
      summary: '그리스도의 죽음은 구원의 가능성만 제시하는 모호한 희생이 아니라, 아버지가 맡기신 양을 알고 얻으시는 유효한 구속이다.',
      scripture: ['에스겔 34:11–16', '요한복음 6:37–40', '에베소서 5:25–27'],
      confessions: [
        { document: '도르트 신조', section: '제2교리, 제8항', summary: '그리스도의 죽음이 택한 자의 구원을 확실히 이룸', url: confessionUrls.dort },
      ],
    },
  },
  {
    id: 'ezk-34-11',
    reference: '에스겔 34:11–16',
    eyebrow: '언약의 약속',
    title: '하나님이 친히 찾는 양',
    summary: '실패한 목자들과 달리 하나님 자신이 흩어진 양을 찾아 먹이고 쉬게 하겠다고 약속한다.',
    observation: '예수가 선한 목자라고 선언할 때, 그는 다윗 같은 목자일 뿐 아니라 친히 양을 찾는 하나님의 역할을 맡는다.',
    x: 98,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '언약의 하나님이 잃은 백성을 찾으신다',
      summary: '구원의 주도권은 길을 발견한 양이 아니라 찾아 나선 목자에게 있다. 은혜는 하나님의 약속과 행동에서 시작된다.',
      scripture: ['누가복음 15:3–7', '베드로전서 2:25'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제1문', summary: '몸과 영혼이 신실한 구주 예수 그리스도께 속한다는 위로', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'jn-2-19',
    reference: '요한복음 2:19–22',
    eyebrow: '성전 표적',
    title: '무너뜨리라, 사흘 만에 세우리라',
    summary: '예수는 헤롯 성전이 아니라 자기 몸을 가리켜 죽음과 부활을 예고한다.',
    observation: '서술자는 제자들이 부활 후 이 말씀과 성경을 믿었다고 설명하며 표적의 의미를 독자에게 해석한다.',
    x: 340,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '하나님의 임재는 그리스도 안에 거한다',
      summary: '성전이 가리키던 임재와 속죄는 그리스도의 몸, 죽음, 부활에서 성취된다. 교회는 그분과 연합하여 성령이 거하시는 성전이 된다.',
      scripture: ['골로새서 2:9', '에베소서 2:19–22', '베드로전서 2:4–5'],
      confessions: [
        { document: '벨직 신앙고백', section: '제21조', summary: '그리스도의 유일하고 완전한 속죄', url: confessionUrls.belgic },
      ],
    },
  },
  {
    id: 'ex-40-34',
    reference: '출애굽기 40:34–38',
    eyebrow: '성막의 배경',
    title: '영광이 성막에 충만하다',
    summary: '여호와의 영광이 완성된 성막에 충만하고 구름이 백성의 길을 이끈다.',
    observation: '요한복음 1:14의 “거하시매”와 “영광”은 하나님이 장막 가운데 거하신 이 장면을 배경으로 읽힌다.',
    x: 98,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '그림자가 실체를 가리킨다',
      summary: '성막과 성전은 하나님이 죄인 가운데 거하시는 길을 예표한다. 그 실체는 육신을 입고 오신 중보자 그리스도다.',
      scripture: ['요한복음 1:14–18', '히브리서 9:11–12'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제7장 5–6항', summary: '율법 아래의 모형과 복음 아래 드러난 실체', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-12-23',
    reference: '요한복음 12:23–28',
    eyebrow: '때가 이르다',
    title: '인자가 영광을 얻을 때',
    summary: '예수는 죽음을 앞두고 한 알의 밀이 죽어 많은 열매를 맺는 것으로 자신의 영광을 설명한다.',
    observation: '앞서 반복되던 “아직 때가 아니다”가 “때가 왔다”로 전환되며 영광과 죽음이 역설적으로 결합한다.',
    x: 340,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '십자가는 패배가 아니라 왕의 영광이다',
      summary: '하나님의 구원 계획에서 십자가는 우발적 비극이 아니다. 그리스도는 자원하여 순종하고, 수치의 죽음으로 자기 백성을 살리며 아버지를 영화롭게 하신다.',
      scripture: ['사도행전 2:23', '빌립보서 2:8–11'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제8장 4–5항', summary: '중보자의 자발적 낮아지심과 완전한 속죄', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-7-30',
    reference: '요한복음 7:30',
    eyebrow: '아직 이르지 않은 때',
    title: '그의 때가 아직 오지 않았다',
    summary: '적대자들이 예수를 잡으려 하지만 그의 때가 아직 이르지 않아 손을 대지 못한다.',
    observation: '반복되는 “때”는 사건들이 인간의 적대만이 아니라 정해진 구속의 시간표 안에 있음을 보여준다.',
    x: 98,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '섭리는 악한 행동까지 제한한다',
      summary: '사람의 죄악된 의도는 실제 책임을 지지만 하나님의 구원 계획을 앞당기거나 좌절시키지 못한다.',
      scripture: ['창세기 50:20', '사도행전 4:27–28'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제5장', summary: '하나님의 섭리와 피조물의 실제 원인성', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-2-11',
    reference: '요한복음 2:11',
    eyebrow: '첫 표적',
    title: '영광을 나타낸 표적',
    summary: '가나의 표적은 예수의 영광을 나타내고 제자들이 그를 믿게 한다.',
    observation: '요한은 기적을 “표적”이라 부르며 사건 자체보다 그것이 가리키는 예수의 정체에 시선을 둔다.',
    x: 98,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '표적은 그리스도를 가리킨다',
      summary: '믿음은 기이한 현상에 머물지 않고 표적이 증언하는 그리스도를 붙든다. 참된 믿음의 대상은 하나님의 약속과 그 중심이신 그리스도다.',
      scripture: ['요한복음 4:48', '고린도전서 1:22–24'],
      confessions: [
        { document: '벨직 신앙고백', section: '제7조', summary: '성경의 충족성과 신앙의 완전한 규범', url: confessionUrls.belgic },
      ],
    },
  },
]

export const connections: Connection[] = [
  { id: 'word-genesis', source: 'jn-1-1', target: 'gen-1-1', type: '평행', label: '태초와 창조', explanation: '두 책 모두 “태초”와 하나님의 창조 행위로 시작한다.' },
  { id: 'word-light', source: 'jn-1-1', target: 'jn-1-5', type: '반복', label: '말씀 안의 생명과 빛', explanation: '창조주 말씀 안의 생명이 사람들의 빛으로 소개된다.' },
  { id: 'light-creation', source: 'gen-1-1', target: 'jn-1-5', type: '발전', label: '창조의 빛과 생명의 빛', explanation: '창조 때 어둠을 가른 빛이 요한복음에서 말씀 안에 있는 생명의 빛으로 발전한다.' },
  { id: 'light-judgment', source: 'jn-1-5', target: 'jn-3-19', type: '발전', label: '빛이 사람을 드러냄', explanation: '서문의 대조가 인간의 사랑과 행위를 드러내는 심판 주제로 발전한다.' },
  { id: 'light-i-am', source: 'jn-1-5', target: 'jn-8-12', type: '성취', label: '빛의 정체', explanation: '서문에서 소개된 빛을 예수께서 자신의 정체로 선언한다.' },
  { id: 'light-last-call', source: 'jn-8-12', target: 'jn-12-35', type: '반복', label: '빛을 따르고 믿으라', explanation: '빛의 선언은 공적 사역의 끝에서 믿음과 제자도를 촉구한다.' },
  { id: 'newbirth-ezekiel', source: 'ezk-36-25', target: 'jn-3-3', type: '성취', label: '물과 성령의 약속', explanation: '새 마음과 영의 예언이 위로부터 나는 생명의 배경을 이룬다.' },
  { id: 'newbirth-purpose', source: 'jn-3-3', target: 'jn-20-31', type: '평행', label: '새 생명과 기록의 목적', explanation: '성령으로 난 생명이 책의 결론에서 믿음으로 얻는 생명과 만난다.' },
  { id: 'sign-purpose', source: 'jn-2-11', target: 'jn-20-31', type: '평행', label: '첫 표적에서 기록 목적까지', explanation: '첫 표적의 영광과 믿음이 선택된 표적 전체의 목적을 미리 보여준다.' },
  { id: 'shepherd-promise', source: 'ezk-34-11', target: 'jn-10-11', type: '성취', label: '하나님이 친히 목자가 되심', explanation: '흩어진 양을 찾겠다는 약속이 선한 목자의 선언에서 성취된다.' },
  { id: 'temple-tabernacle', source: 'ex-40-34', target: 'jn-2-19', type: '성취', label: '임재의 처소', explanation: '장막과 성전이 가리키던 하나님의 임재가 그리스도의 몸에 집중된다.' },
  { id: 'hour-not-yet', source: 'jn-7-30', target: 'jn-12-23', type: '대조', label: '아직 아니다 → 때가 왔다', explanation: '붙잡을 수 없던 때가 십자가의 영광을 향한 정해진 때로 전환된다.' },
]

export const threads: Thread[] = [
  { id: 'word', number: '01', name: '말씀과 계시', shortName: '말씀', premise: '창조의 말씀이 육신을 입고 하나님을 알리신다.', color: '#8f4438', nodeIds: ['jn-1-1', 'gen-1-1', 'jn-1-5'], connectionIds: ['word-genesis', 'word-light'] },
  { id: 'light', number: '02', name: '빛과 어둠', shortName: '빛', premise: '빛은 예수의 정체를 밝히고 인간의 사랑을 드러낸다.', color: '#b17b2a', nodeIds: ['gen-1-1', 'jn-1-5', 'jn-3-19', 'jn-8-12', 'jn-12-35'], connectionIds: ['light-creation', 'light-judgment', 'light-i-am', 'light-last-call'] },
  { id: 'life', number: '03', name: '생명과 중생', shortName: '생명', premise: '위로부터 주시는 생명이 믿음으로 드러난다.', color: '#56705d', nodeIds: ['ezk-36-25', 'jn-3-3', 'jn-20-31'], connectionIds: ['newbirth-ezekiel', 'newbirth-purpose'] },
  { id: 'sign', number: '04', name: '표적과 믿음', shortName: '표적', premise: '표적은 기이함을 넘어 그리스도의 영광을 가리킨다.', color: '#65558f', nodeIds: ['jn-2-11', 'jn-20-31'], connectionIds: ['sign-purpose'] },
  { id: 'shepherd', number: '05', name: '선한 목자와 언약', shortName: '목자', premise: '하나님이 약속하신 목자가 자기 양을 찾아 목숨을 내어 준다.', color: '#53747d', nodeIds: ['ezk-34-11', 'jn-10-11'], connectionIds: ['shepherd-promise'] },
  { id: 'hour', number: '06', name: '때와 영광', shortName: '영광', premise: '정해진 때에 십자가가 왕의 영광으로 드러난다.', color: '#985a43', nodeIds: ['jn-7-30', 'jn-12-23'], connectionIds: ['hour-not-yet'] },
  { id: 'temple', number: '07', name: '성전과 그리스도', shortName: '성전', premise: '하나님의 임재와 속죄가 그리스도의 몸에 집중된다.', color: '#746647', nodeIds: ['ex-40-34', 'jn-2-19'], connectionIds: ['temple-tabernacle'] },
]

export const nodeById = new Map(nodes.map((node) => [node.id, node]))
export const connectionById = new Map(connections.map((connection) => [connection.id, connection]))
export const threadById = new Map(threads.map((thread) => [thread.id, thread]))

export function getInitialSelection(search: string) {
  const params = new URLSearchParams(search)
  const requestedThread = params.get('thread')
  const thread = (requestedThread && threadById.get(requestedThread)) || threads[0]
  const requestedPassage = params.get('passage')
  const passageId = requestedPassage && thread.nodeIds.includes(requestedPassage)
    ? requestedPassage
    : thread.nodeIds[0]

  return { threadId: thread.id, passageId }
}

export function validateContent() {
  const errors: string[] = []
  const nodeIds = new Set(nodes.map((node) => node.id))
  const connectionIds = new Set(connections.map((connection) => connection.id))

  for (const connection of connections) {
    if (!nodeIds.has(connection.source)) errors.push(`${connection.id}: missing source ${connection.source}`)
    if (!nodeIds.has(connection.target)) errors.push(`${connection.id}: missing target ${connection.target}`)
  }

  for (const thread of threads) {
    for (const nodeId of thread.nodeIds) {
      if (!nodeIds.has(nodeId)) errors.push(`${thread.id}: missing node ${nodeId}`)
    }
    for (const connectionId of thread.connectionIds) {
      if (!connectionIds.has(connectionId)) errors.push(`${thread.id}: missing connection ${connectionId}`)
      const connection = connectionById.get(connectionId)
      if (connection && (!thread.nodeIds.includes(connection.source) || !thread.nodeIds.includes(connection.target))) {
        errors.push(`${thread.id}: connection ${connectionId} leaves thread`)
      }
    }
    if (!thread.nodeIds.length) errors.push(`${thread.id}: empty thread`)
  }

  return errors
}
