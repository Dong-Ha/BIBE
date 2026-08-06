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
  {
    id: 'jn-1-14',
    reference: '요한복음 1:14–18',
    eyebrow: '성육신의 절정',
    title: '우리 가운데 거하신 말씀',
    summary: '영원한 말씀이 육신이 되어 우리 가운데 거하시며 은혜와 진리가 충만한 하나님의 영광을 보이신다.',
    observation: '“거하시매”는 장막을 치다는 뜻을 품고 있으며, 보이지 않는 하나님을 아들이 알려 주신다는 결론으로 서문을 완성한다.',
    x: 808,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '중보자는 참 하나님이며 참 사람이다',
      summary: '성자는 신성을 버리지 않고 온전한 인성을 취하셨다. 그러므로 그리스도는 하나님을 완전하게 계시하시고 우리를 하나님과 화목하게 하는 유일한 중보자가 되신다.',
      scripture: ['빌립보서 2:6–8', '골로새서 1:19–20', '히브리서 2:14–18'],
      confessions: [
        { document: '벨직 신앙고백', section: '제18–19조', summary: '그리스도의 성육신과 두 본성의 연합', url: confessionUrls.belgic },
      ],
    },
  },
  {
    id: 'jn-5-24',
    reference: '요한복음 5:24–29',
    eyebrow: '현재와 미래의 생명',
    title: '사망에서 생명으로 옮겨진 사람',
    summary: '예수의 말씀을 듣고 보내신 이를 믿는 사람은 이미 영생을 얻었으며 마지막 날 생명의 부활을 기다린다.',
    observation: '현재형의 “영생을 얻었고”와 미래의 무덤에서 나올 때가 나란히 놓여, 생명이 이미 시작되었지만 아직 완성되지 않았음을 보여준다.',
    x: 565,
    y: 116,
    externalUrl: bibleUrl,
    lens: {
      title: '영생은 지금 시작되어 부활로 완성된다',
      summary: '믿는 자는 그리스도 안에서 이미 정죄를 면하고 새 생명에 참여한다. 이 은혜는 몸의 부활과 영화에 이를 때까지 하나님의 약속으로 보존된다.',
      scripture: ['로마서 8:1, 11', '골로새서 3:1–4'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제32장', summary: '죽음 이후의 상태와 마지막 부활', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-11-25',
    reference: '요한복음 11:25–27',
    eyebrow: '무덤 앞의 선언',
    title: '나는 부활이요 생명이다',
    summary: '예수는 부활을 먼 미래의 사건으로만 말하지 않고 부활과 생명이신 자기 자신을 믿으라고 마르다를 부르신다.',
    observation: '“마지막 날”에 대한 마르다의 고백에 예수의 “나는 …이다” 선언이 응답하며, 부활의 소망을 예수의 인격에 집중시킨다.',
    x: 674,
    y: 310,
    externalUrl: bibleUrl,
    lens: {
      title: '부활의 소망은 그리스도와의 연합에 있다',
      summary: '성도의 생명은 죽음을 이긴 그리스도 안에 감추어져 있다. 몸은 죽어도 그분과의 연합이 끊어지지 않으며 마지막 날 그의 부활에 참여한다.',
      scripture: ['고린도전서 15:20–23', '골로새서 3:3–4'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제57문', summary: '몸의 부활이 주는 위로', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'jn-6-14',
    reference: '요한복음 6:1–15',
    eyebrow: '광야의 표적',
    title: '오천 명을 먹이신 떡',
    summary: '예수는 적은 떡과 물고기로 큰 무리를 배불리 먹이고 남은 조각까지 거두게 하신다.',
    observation: '유월절과 산, 광야의 식사라는 배경은 출애굽을 떠올리지만, 무리는 표적이 가리키는 분보다 정치적 왕을 기대한다.',
    x: 332,
    y: 94,
    externalUrl: bibleUrl,
    lens: {
      title: '표적의 선물보다 주시는 분을 보아야 한다',
      summary: '그리스도는 필요를 채우시는 왕이지만 세속적 기대를 만족시키는 도구가 아니다. 표적은 생명의 떡이신 그분을 믿고 영원한 양식을 받도록 부른다.',
      scripture: ['출애굽기 16:4–5', '요한복음 6:32–35'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제125문', summary: '일용할 양식을 아버지께 의지하는 기도', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'jn-11-43',
    reference: '요한복음 11:38–44',
    eyebrow: '일곱째 표적',
    title: '나사로야, 나오라',
    summary: '예수의 큰 음성에 죽은 나사로가 무덤에서 나오며, 생명을 주는 아들의 권세가 공개적으로 드러난다.',
    observation: '죽은 지 나흘 된 상태와 닫힌 무덤이 강조된 뒤 예수의 한마디가 죽음을 뒤집어, 표적의 크기보다 말씀의 권세를 부각한다.',
    x: 574,
    y: 274,
    externalUrl: bibleUrl,
    lens: {
      title: '효력 있는 부르심은 죽은 자를 살린다',
      summary: '나사로가 자신을 먼저 깨울 수 없었듯 죄로 죽은 마음도 하나님의 부르심으로 살아난다. 복음의 외적 선포와 함께 성령이 생명을 주실 때 사람이 믿음으로 나온다.',
      scripture: ['에베소서 2:1–5', '로마서 4:17'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제10장 1항', summary: '말씀과 성령으로 이루시는 유효한 부르심', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'ps-23-1',
    reference: '시편 23:1–4',
    eyebrow: '시편의 목자',
    title: '부족함이 없게 하시는 목자',
    summary: '다윗은 여호와를 자신을 먹이고 인도하며 죽음의 골짜기에서도 함께하시는 목자로 노래한다.',
    observation: '목자의 공급과 인도는 환경이 평온할 때뿐 아니라 사망의 음침한 골짜기에서도 변하지 않는 임재로 묘사된다.',
    x: 92,
    y: 282,
    externalUrl: bibleUrl,
    lens: {
      title: '언약의 목자는 끝까지 동행한다',
      summary: '성도의 안전은 위험이 사라지는 데 있지 않고 목자가 함께하시는 데 있다. 하나님의 선하심은 자기 백성을 인도하고 보존하여 마침내 그의 집에 이르게 한다.',
      scripture: ['이사야 40:10–11', '베드로전서 5:4'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제17장', summary: '성도의 견인에 관하여', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-10-27',
    reference: '요한복음 10:27–30',
    eyebrow: '목자의 보존',
    title: '아무도 빼앗지 못하는 양',
    summary: '예수의 양은 그의 음성을 듣고 따르며, 아들과 아버지의 손 안에서 영원한 생명을 누린다.',
    observation: '양의 안전은 자신의 손아귀보다 그들을 알고 붙드시는 아들과 아버지의 손에 반복해서 근거한다.',
    x: 804,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '구원을 시작하신 분이 끝까지 지키신다',
      summary: '성도의 견인은 흔들리지 않는 인간 의지의 성취가 아니라 택하시고 구속하신 삼위 하나님의 보존이다. 참된 양은 그 은혜 안에서 목자의 음성을 듣고 따른다.',
      scripture: ['로마서 8:31–39', '빌립보서 1:6'],
      confessions: [
        { document: '도르트 신조', section: '제5교리, 제3·8항', summary: '성도의 보존과 견인은 하나님의 신실하심에 달림', url: confessionUrls.dort },
      ],
    },
  },
  {
    id: 'jn-2-4',
    reference: '요한복음 2:1–5',
    eyebrow: '처음 언급된 때',
    title: '내 때가 아직 이르지 않았다',
    summary: '가나 혼인 잔치에서 예수는 자신의 때가 아직 이르지 않았다고 말하면서도 첫 표적을 향해 나아가신다.',
    observation: '일상적인 부족함 속에서 처음 등장한 “때”는 이후 예수의 죽음과 영광을 가리키는 책 전체의 시간 표지가 된다.',
    x: 92,
    y: 278,
    externalUrl: bibleUrl,
    lens: {
      title: '그리스도는 아버지의 때에 순종하신다',
      summary: '예수의 사역은 사람의 요구나 우연한 상황이 아니라 아버지께 받은 구속 계획을 따라 진행된다. 중보자의 순종은 처음부터 십자가의 때를 향한다.',
      scripture: ['갈라디아서 4:4–5', '히브리서 10:7'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제8장 1·4항', summary: '영원한 구원 계획과 중보자의 자발적 순종', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-13-1',
    reference: '요한복음 13:1–5',
    eyebrow: '고별의 문턱',
    title: '자기 사람들을 끝까지 사랑하시다',
    summary: '자기 때가 이른 줄 아신 예수는 제자들의 발을 씻기며 십자가로 향하는 사랑을 행동으로 보이신다.',
    observation: '“때가 이른 줄”과 “끝까지 사랑”이 함께 놓이면서 영광의 시간이 지배가 아니라 낮아져 섬기는 사랑으로 표현된다.',
    x: 594,
    y: 286,
    externalUrl: bibleUrl,
    lens: {
      title: '왕의 영광은 종의 사랑으로 드러난다',
      summary: '그리스도는 자기 백성을 사랑하여 가장 낮은 자리와 십자가의 수치를 감당하셨다. 교회의 섬김은 구원을 얻는 조건이 아니라 먼저 받은 사랑을 닮는 열매다.',
      scripture: ['빌립보서 2:5–8', '요한일서 4:10–11'],
      confessions: [
        { document: '벨직 신앙고백', section: '제24조', summary: '선행은 구원의 공로가 아니라 믿음의 열매', url: confessionUrls.belgic },
      ],
    },
  },
  {
    id: 'jn-17-1',
    reference: '요한복음 17:1–5',
    eyebrow: '아들의 기도',
    title: '아들을 영화롭게 하소서',
    summary: '예수는 때가 이르렀음을 선언하고 십자가를 앞두고 아버지께 서로의 영광과 백성의 영생을 위해 기도한다.',
    observation: '영광은 창세 전 아버지와 함께 누리던 관계, 맡겨진 일을 완수하는 십자가, 백성에게 주는 영생을 하나로 묶는다.',
    x: 810,
    y: 198,
    externalUrl: bibleUrl,
    lens: {
      title: '구원은 삼위 하나님의 영광을 나타낸다',
      summary: '아버지는 아들에게 백성을 주시고 아들은 맡은 일을 이루어 영생을 주신다. 구원은 인간을 중심에 두는 계획이 아니라 죄인을 살리며 하나님의 영광을 드러내는 언약적 사역이다.',
      scripture: ['에베소서 1:3–14', '요한복음 17:24'],
      confessions: [
        { document: '도르트 신조', section: '제2교리, 제8항', summary: '성부의 뜻에 따른 성자의 확실한 구속', url: confessionUrls.dort },
      ],
    },
  },
  {
    id: '1ki-8-27',
    reference: '열왕기상 8:27–30',
    eyebrow: '성전 봉헌',
    title: '하늘도 감당하지 못하는 하나님',
    summary: '솔로몬은 성전을 봉헌하면서도 하늘과 하늘들의 하늘조차 하나님을 모실 수 없음을 고백하고 그곳을 향한 기도를 들어 달라고 간구한다.',
    observation: '성전은 하나님을 가두는 건물이 아니라 이름을 두시겠다는 약속과 백성의 기도가 만나는 언약적 표지로 제시된다.',
    x: 334,
    y: 86,
    externalUrl: bibleUrl,
    lens: {
      title: '하나님은 약속으로 자기 백성 가운데 거하신다',
      summary: '무한하신 하나님은 건물에 제한되지 않지만 은혜로 정하신 방식 안에서 백성을 만나신다. 옛 성전의 약속은 임마누엘이신 그리스도 안에서 충만히 성취된다.',
      scripture: ['이사야 66:1–2', '사도행전 7:48–50'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제21장 1항', summary: '하나님이 정하신 방식에 따른 예배', url: confessionUrls.westminster },
      ],
    },
  },
  {
    id: 'jn-4-21',
    reference: '요한복음 4:21–24',
    eyebrow: '예배의 새 자리',
    title: '영과 진리로 드리는 예배',
    summary: '예수는 예배가 특정 산이나 예루살렘에 묶이지 않고 영과 진리 안에서 아버지께 드려질 때가 온다고 선언한다.',
    observation: '장소를 둘러싼 질문이 “때가 이른다”는 선언을 통해 예배자의 정체와 하나님의 본성에 맞는 예배로 전환된다.',
    x: 804,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '그리스도 안에서 하나님께 나아간다',
      summary: '새 언약의 예배는 거룩한 장소의 효력보다 그리스도의 중보와 성령의 역사에 의지한다. 교회는 말씀에 응답하여 아버지께 참된 예배를 드린다.',
      scripture: ['히브리서 10:19–22', '에베소서 2:18'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제96문', summary: '하나님의 말씀에 따라 드리는 예배', url: confessionUrls.heidelberg },
      ],
    },
  },
  {
    id: 'isa-52-13',
    reference: '이사야 52:13–53:12',
    eyebrow: '고난받는 종의 노래',
    title: '우리의 허물을 짊어진 종',
    summary: '멸시와 고난을 받는 여호와의 종이 많은 사람의 죄를 담당하고 마침내 높임을 받는다.',
    observation: '종의 결백과 사람들의 허물이 대조되고, “우리”의 죄와 평화를 위해 종이 대신 고난받았다는 진술이 반복된다.',
    x: 92,
    y: 202,
    externalUrl: bibleUrl,
    lens: {
      title: '구원은 대속하시는 종의 사역에 달려 있다',
      summary: '죄인은 자신의 값을 치러 하나님께 돌아가는 것이 아니다. 그리스도께서 자기 백성의 죄책과 형벌을 담당하시고 의를 이루셔서 화목의 길을 여신다.',
      scripture: ['사도행전 8:32–35', '베드로전서 2:22–25'],
      confessions: [
        { document: '벨직 신앙고백', section: '제21조', summary: '그리스도께서 우리를 위해 이루신 완전한 속죄', url: confessionUrls.belgic },
      ],
    },
    study: {
      context: '이사야의 네 번째 종의 노래다. 52장의 높아질 종에 대한 선언이 53장의 멸시와 죽음으로 이어졌다가, 다시 많은 사람을 의롭게 하고 몫을 얻는 결말로 돌아온다.',
      questions: [
        '종의 결백을 나타내는 표현과 “우리”의 허물을 나타내는 표현은 어떻게 대조되는가?',
        '종이 받는 고난의 원인을 본문은 누구의 죄에서 찾는가?',
        '낮아짐에서 높아짐으로 바뀌는 지점은 어디이며, 그 전환을 누가 이루는가?',
      ],
      caution: '이 본문을 고난을 견디는 일반적인 모범으로만 축소하지 않는다. 중심에는 죄 없는 종이 다른 이들의 죄를 대신 담당하는 대표적이고 대속적인 사역이 있다.',
    },
  },
  {
    id: 'jn-1-29',
    reference: '요한복음 1:29–34',
    eyebrow: '세례 요한의 증언',
    title: '세상의 죄를 지고 가는 어린양',
    summary: '세례 요한은 예수를 세상의 죄를 지고 가는 하나님의 어린양이자 성령으로 세례 베푸는 하나님의 아들로 증언한다.',
    observation: '예수의 공적 사역이 시작되기 전에 “어린양”, “성령”, “하나님의 아들”이라는 호칭이 그의 죽음과 사역의 방향을 미리 제시한다.',
    x: 282,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '하나님이 친히 속죄의 제물을 주신다',
      summary: '그리스도는 죄인이 하나님께 가져간 제물이 아니라 하나님이 보내신 어린양이다. 그의 단번의 희생이 죄를 제거하며 성령은 그 구속의 유익을 자기 백성에게 적용하신다.',
      scripture: ['출애굽기 12:3–13', '베드로전서 1:18–19', '히브리서 9:26'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제40문', summary: '하나님의 공의가 요구한 그리스도의 죽음', url: confessionUrls.heidelberg },
      ],
    },
    study: {
      context: '요한복음은 예수의 세례 장면을 직접 서술하기보다 세례 요한의 증언으로 소개한다. 어린양에 대한 선언과 성령이 머무는 표징이 함께 놓여 예수의 죽음과 성령을 주시는 사역을 처음부터 연결한다.',
      questions: [
        '세례 요한이 두 번 사용하는 “보라”는 독자의 시선을 어디에 머물게 하는가?',
        '어린양이 죄를 “지고 간다”는 표현은 예수의 사역을 어떻게 설명하는가?',
        '어린양, 성령으로 세례 베푸는 이, 하나님의 아들이라는 호칭은 서로 어떤 그림을 만드는가?',
      ],
      caution: '“어린양”의 배경을 유월절, 희생 제사, 이사야의 종 가운데 하나로만 단정하지 않는다. 여러 성경적 배경이 함께 예수의 정체와 죽음을 풍성하게 비춘다.',
    },
  },
  {
    id: 'jn-19-16',
    reference: '요한복음 19:16–37',
    eyebrow: '십자가의 완성',
    title: '다 이루신 왕',
    summary: '유대인의 왕이라는 죄패 아래 십자가에 달리신 예수는 맡은 일을 마치시고 죽으시며, 그 죽음에서도 성경이 성취된다.',
    observation: '왕이라는 칭호, 나뉜 옷, 마침의 선언, 꺾이지 않은 뼈와 찔린 옆구리가 한 장면에 모여 십자가를 성경 성취의 절정으로 제시한다.',
    x: 458,
    y: 244,
    externalUrl: bibleUrl,
    lens: {
      title: '십자가에서 구속의 일이 완성된다',
      summary: '그리스도는 수동적인 희생자가 아니라 아버지께 받은 사명을 끝까지 이루신 중보자다. 그의 순종과 희생은 반복해 보충할 필요가 없는 완전하고 충분한 속죄다.',
      scripture: ['시편 22:16–18', '스가랴 12:10', '히브리서 10:10–14'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제8장 5항', summary: '그리스도의 완전한 순종과 희생이 이룬 화목', url: confessionUrls.westminster },
      ],
    },
    study: {
      context: '빌라도의 재판에서 반복된 왕의 언어가 십자가 위 죄패로 이어진다. 공생애 내내 기다려 온 “때”와 예수께서 이루실 “일”이 죽음의 순간에 마침내 완성된다.',
      questions: [
        '사람들이 조롱의 뜻으로 사용한 “유대인의 왕”이라는 칭호를 서술자는 어떻게 참된 선언으로 뒤집는가?',
        '예수의 죽음 전후에 반복되는 성경 성취의 표지는 무엇인가?',
        '예수가 자기 죽음의 순간에도 주도적으로 행동한다는 사실은 어떤 표현에서 드러나는가?',
      ],
      caution: '수난 서사를 특정 민족 전체에 대한 비난으로 읽지 않는다. 본문은 유대 지도자와 로마 권력의 실제 책임을 드러내면서도, 십자가의 궁극적인 원인을 모든 인간의 죄와 하나님의 구원 계획 안에서 보게 한다.',
    },
  },
  {
    id: 'jn-20-1',
    reference: '요한복음 20:1–18',
    eyebrow: '부활의 아침',
    title: '동산에서 다시 시작된 생명',
    summary: '빈 무덤 앞에서 울던 막달라 마리아는 부활하신 예수의 부르심을 듣고 제자들에게 주를 보았다고 전한다.',
    observation: '주의 첫날, 동산, 어둠에서 시작한 장면은 빈 무덤과 이름을 부르는 예수의 음성을 지나 증언을 품고 달려가는 장면으로 바뀐다.',
    x: 650,
    y: 88,
    externalUrl: bibleUrl,
    lens: {
      title: '그리스도의 부활은 새 창조의 시작이다',
      summary: '부활은 제자들의 기억 속에서 예수가 계속 살아 있다는 뜻이 아니라 죽음을 이긴 몸의 부활이다. 성도는 부활하신 그리스도와 연합하여 새 생명과 장차 올 부활의 보증을 받는다.',
      scripture: ['고린도전서 15:20–23', '베드로전서 1:3–5'],
      confessions: [
        { document: '하이델베르크 요리문답', section: '제45문', summary: '그리스도의 부활이 주는 의와 새 생명과 부활의 보증', url: confessionUrls.heidelberg },
      ],
    },
    study: {
      context: '안식 후 첫날의 빈 무덤 이야기는 사랑받는 제자의 믿음과 아직 깨닫지 못한 제자들의 상태를 지나 마리아와 부활하신 예수의 만남에 집중한다. 개인적인 부르심은 곧 공동체를 향한 증언의 사명으로 이어진다.',
      questions: [
        '어둠, 동산, 첫날이라는 배경은 요한복음 앞부분의 어떤 장면과 주제를 떠올리게 하는가?',
        '마리아가 예수를 알아보게 되는 결정적인 계기는 무엇인가?',
        '예수는 마리아에게 부활의 기쁨을 혼자 간직하는 대신 무엇을 하도록 보내시는가?',
      ],
      caution: '새 창조의 모티프는 본문의 역사적 부활을 대신하는 상징이 아니다. 빈 무덤과 부활하신 예수의 실제 나타나심 위에서 창조 언어가 새로운 의미를 얻는다.',
    },
  },
  {
    id: 'jn-20-24',
    reference: '요한복음 20:24–29',
    eyebrow: '도마의 고백',
    title: '나의 주, 나의 하나님',
    summary: '보아야 믿겠다고 말한 도마는 부활하신 예수를 만나 자신의 주와 하나님으로 고백하고, 예수는 보지 않고 믿는 사람의 복을 선언한다.',
    observation: '도마의 불신은 상처를 확인하려는 요구로 표현되지만, 예수와의 만남 뒤에는 복음서에서 가장 직접적인 신앙고백 가운데 하나로 전환된다.',
    x: 812,
    y: 244,
    externalUrl: bibleUrl,
    lens: {
      title: '믿음은 사도적 증언을 통해 그리스도를 붙든다',
      summary: '오늘의 교회는 도마처럼 부활하신 예수를 눈으로 보지 않지만 성령이 기록된 말씀을 통해 참된 확신을 주신다. 구원하는 믿음은 막연한 낙관이 아니라 주와 하나님이신 그리스도께 자신을 맡기는 것이다.',
      scripture: ['요한복음 20:30–31', '베드로전서 1:8–9', '고린도후서 5:7'],
      confessions: [
        { document: '웨스트민스터 신앙고백', section: '제14장 1–2항', summary: '말씀의 사역으로 생겨 그리스도를 받아들이는 구원하는 믿음', url: confessionUrls.westminster },
      ],
    },
    study: {
      context: '도마의 장면은 복음서의 기록 목적 바로 앞에 놓인다. 직접 보고 믿게 된 도마와 기록된 표적을 통해 믿게 될 후대 독자가 연결되며, 서문의 “말씀은 하나님”이라는 선언은 도마의 고백에서 인격적인 신앙으로 되돌아온다.',
      questions: [
        '도마가 제시한 믿음의 조건은 예수를 만난 뒤 어떤 고백으로 바뀌는가?',
        '예수는 도마의 요구를 아시면서도 그를 어떤 방향으로 부르시는가?',
        '“보지 않고 믿는 사람”이라는 선언은 바로 뒤의 기록 목적과 어떻게 연결되는가?',
      ],
      caution: '도마를 질문했다는 이유만으로 조롱하거나, 반대로 의심 자체를 믿음보다 우월하게 여기지 않는다. 본문은 의심하는 사람을 찾아오신 은혜와 사도적 증언을 신뢰하도록 부르는 말씀을 함께 보여 준다.',
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
  { id: 'word-incarnation', source: 'jn-1-1', target: 'jn-1-14', type: '발전', label: '말씀이 육신이 됨', explanation: '태초부터 계신 말씀의 정체가 우리 가운데 거하신 성육신에서 역사 안에 드러난다.' },
  { id: 'life-present', source: 'jn-3-3', target: 'jn-5-24', type: '발전', label: '거듭남에서 현재의 영생으로', explanation: '위로부터 난 새 생명은 믿는 사람이 이미 사망에서 생명으로 옮겨진 현실로 설명된다.' },
  { id: 'life-resurrection', source: 'jn-5-24', target: 'jn-11-25', type: '성취', label: '생명의 약속과 부활의 주', explanation: '현재 시작된 영생과 마지막 부활의 약속이 부활과 생명이신 예수의 선언에 집중된다.' },
  { id: 'sign-bread', source: 'jn-2-11', target: 'jn-6-14', type: '반복', label: '영광을 보이는 표적', explanation: '가나에서 시작된 표적은 광야의 식탁에서 예수의 풍성한 공급과 정체를 다시 드러낸다.' },
  { id: 'sign-lazarus', source: 'jn-6-14', target: 'jn-11-43', type: '발전', label: '양식에서 생명으로', explanation: '무리를 먹인 표적에서 죽은 이를 부르는 표적으로 나아가 생명을 주는 권세가 선명해진다.' },
  { id: 'sign-written-purpose', source: 'jn-11-43', target: 'jn-20-31', type: '평행', label: '표적과 믿음의 갈림길', explanation: '나사로의 표적이 믿음과 적대를 함께 일으키며 기록된 표적의 목적을 극적으로 보여준다.' },
  { id: 'shepherd-psalm', source: 'ps-23-1', target: 'ezk-34-11', type: '발전', label: '개인의 고백에서 언약의 약속으로', explanation: '시편의 목자 고백이 흩어진 백성을 친히 찾겠다는 예언의 약속으로 확장된다.' },
  { id: 'shepherd-kept', source: 'jn-10-11', target: 'jn-10-27', type: '발전', label: '목숨을 주고 끝까지 지킴', explanation: '양을 위해 죽는 선한 목자는 그들에게 영생을 주고 아무도 빼앗지 못하게 붙드신다.' },
  { id: 'hour-first', source: 'jn-2-4', target: 'jn-7-30', type: '반복', label: '아직 이르지 않은 때', explanation: '가나에서 처음 언급된 때가 적대가 커지는 중에도 아직 오지 않은 시간으로 반복된다.' },
  { id: 'hour-love', source: 'jn-12-23', target: 'jn-13-1', type: '발전', label: '영광의 때와 끝까지 사랑', explanation: '십자가의 영광이 제자들의 발을 씻고 자기 사람들을 끝까지 사랑하는 섬김으로 펼쳐진다.' },
  { id: 'hour-prayer', source: 'jn-13-1', target: 'jn-17-1', type: '성취', label: '때를 아는 사랑과 기도', explanation: '때를 아시는 예수의 섬김이 맡은 일을 완수하고 영광을 구하는 아들의 기도로 절정에 이른다.' },
  { id: 'temple-house', source: 'ex-40-34', target: '1ki-8-27', type: '발전', label: '성막에서 성전으로', explanation: '광야 성막에 임한 영광이 예루살렘 성전의 봉헌과 하나님의 이름을 두신 약속으로 이어진다.' },
  { id: 'temple-worship', source: 'jn-2-19', target: 'jn-4-21', type: '발전', label: '성전의 몸에서 새 예배로', explanation: '그리스도의 몸이 참 성전으로 제시된 뒤 예배는 장소를 넘어 영과 진리 안에서 드려진다.' },
  { id: 'cross-servant-lamb', source: 'isa-52-13', target: 'jn-1-29', type: '성취', label: '죄를 담당하는 종과 어린양', explanation: '많은 사람의 죄를 담당하는 종의 약속이 세상의 죄를 지고 가는 하나님의 어린양을 향한다.' },
  { id: 'cross-lamb-finished', source: 'jn-1-29', target: 'jn-19-16', type: '성취', label: '어린양의 사역이 완성됨', explanation: '처음부터 죄를 지고 갈 어린양으로 소개된 예수의 사명이 십자가에서 성경을 이루는 죽음으로 완성된다.' },
  { id: 'cross-death-morning', source: 'jn-19-16', target: 'jn-20-1', type: '대조', label: '죽음에서 부활의 아침으로', explanation: '무덤에 장사된 예수의 죽음이 주의 첫날 빈 무덤과 부활하신 주의 나타나심으로 뒤집힌다.' },
  { id: 'cross-witness-confession', source: 'jn-20-1', target: 'jn-20-24', type: '발전', label: '부활의 증언에서 믿음의 고백으로', explanation: '마리아와 제자들의 증언을 거부하던 도마가 부활하신 예수를 주와 하나님으로 고백하게 된다.' },
]

export const threads: Thread[] = [
  { id: 'word', number: '01', name: '말씀과 계시', shortName: '말씀', premise: '창조의 말씀이 육신을 입고 하나님을 알리신다.', color: '#8f4438', nodeIds: ['jn-1-1', 'gen-1-1', 'jn-1-5', 'jn-1-14'], connectionIds: ['word-genesis', 'word-light', 'word-incarnation'] },
  { id: 'light', number: '02', name: '빛과 어둠', shortName: '빛', premise: '빛은 예수의 정체를 밝히고 인간의 사랑을 드러낸다.', color: '#b17b2a', nodeIds: ['gen-1-1', 'jn-1-5', 'jn-3-19', 'jn-8-12', 'jn-12-35'], connectionIds: ['light-creation', 'light-judgment', 'light-i-am', 'light-last-call'] },
  { id: 'life', number: '03', name: '생명과 중생', shortName: '생명', premise: '위로부터 주시는 생명이 현재의 영생과 마지막 부활로 이어진다.', color: '#56705d', nodeIds: ['ezk-36-25', 'jn-3-3', 'jn-5-24', 'jn-11-25', 'jn-20-31'], connectionIds: ['newbirth-ezekiel', 'life-present', 'life-resurrection', 'newbirth-purpose'] },
  { id: 'sign', number: '04', name: '표적과 믿음', shortName: '표적', premise: '표적은 공급과 생명의 권세를 통해 그리스도의 영광을 가리킨다.', color: '#65558f', nodeIds: ['jn-2-11', 'jn-6-14', 'jn-11-43', 'jn-20-31'], connectionIds: ['sign-bread', 'sign-lazarus', 'sign-written-purpose', 'sign-purpose'] },
  { id: 'shepherd', number: '05', name: '선한 목자와 언약', shortName: '목자', premise: '언약의 목자가 자기 양을 찾아 목숨을 내어 주고 끝까지 지킨다.', color: '#53747d', nodeIds: ['ps-23-1', 'ezk-34-11', 'jn-10-11', 'jn-10-27'], connectionIds: ['shepherd-psalm', 'shepherd-promise', 'shepherd-kept'] },
  { id: 'hour', number: '06', name: '때와 영광', shortName: '영광', premise: '아직 이르지 않은 때가 사랑과 십자가와 기도의 영광으로 완성된다.', color: '#985a43', nodeIds: ['jn-2-4', 'jn-7-30', 'jn-12-23', 'jn-13-1', 'jn-17-1'], connectionIds: ['hour-first', 'hour-not-yet', 'hour-love', 'hour-prayer'] },
  { id: 'temple', number: '07', name: '성전과 그리스도', shortName: '성전', premise: '성막과 성전의 임재가 그리스도의 몸과 새 언약의 예배로 이어진다.', color: '#746647', nodeIds: ['ex-40-34', '1ki-8-27', 'jn-2-19', 'jn-4-21'], connectionIds: ['temple-house', 'temple-tabernacle', 'temple-worship'] },
  { id: 'cross', number: '08', name: '십자가와 부활', shortName: '부활', premise: '죄를 담당한 어린양의 죽음이 부활의 새 창조와 믿음의 고백으로 이어진다.', color: '#724b5f', nodeIds: ['isa-52-13', 'jn-1-29', 'jn-19-16', 'jn-20-1', 'jn-20-24'], connectionIds: ['cross-servant-lamb', 'cross-lamb-finished', 'cross-death-morning', 'cross-witness-confession'] },
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
