# 말씀의 결

삶과 믿음의 질문에서 시작해 성경 본문과 복음의 의미를 쉬운 말로 살펴보는 한국어 학습 웹앱입니다. 질문 해설, 성경 본문, 개념 풀이, 출처 자료를 연결하고, 이야기를 따라가거나 본문 관계와 해석의 층위를 직접 움직여 보는 학습 경험을 제공합니다.

지식 위키는 OKF 형식의 Markdown 문서와 YAML 메타데이터를 원본으로 삼습니다. 현재 위키 문서는 229개(공개 228개·조사 대기 1개)이며, 질문 14개, 성경 본문 84개, 읽기 경로 11개, 책과 함께 읽기 6개, 본문 관계 52개, 학습 경험 11개, 개념 18개와 저자·참고 자료로 구성됩니다. 문서 수와 공개 상태는 인덱스에서 다시 생성됩니다.

## 시작하기

Node.js 22와 npm을 사용합니다.

```bash
npm ci
npm run dev
```

개발 서버는 성경 본문 전문을 내려받지 않으며 네트워크나 LLM 서비스 없이 로컬 위키를 정적 데이터로 변환합니다. 성경 구절 전문은 대한성서공회에 연결해 읽을 수 있습니다.

## 검사와 빌드

```bash
npm run content:check  # 공개 문서의 출처·링크·학습 데이터 검사
npm test               # 단위 및 컴포넌트 테스트
npm run build          # 콘텐츠 생성, TypeScript 검사, 정적 사이트 빌드
npm run check          # 콘텐츠 검사, 수집기·앱 테스트, 빌드
npm run test:browser   # 배포 빌드의 데스크톱·모바일 조작 검사
npm run wiki:lint      # 연결 공백·기한·조사 대기 점검
```

생성된 `src/generated/content.json`과 `dist/`는 저장소에 넣지 않습니다. `npm run content:build` 또는 `npm run build`가 위키에서 다시 만듭니다.

## 지식 위키 편집

공개 콘텐츠는 `wiki/` 아래 Markdown 문서에서 편집합니다. 제목, 문서 종류, 공개 여부, 출처, 생성 정보 등을 YAML frontmatter에 두고 본문에는 읽을 수 있는 설명과 내부 링크를 작성합니다. 자세한 수집·요약·검사 절차는 [위키 작업 흐름](docs/WIKI-WORKFLOW.md)을 참고하세요. 출처 조사 범위와 실제 확인 수준은 [조사 기록](docs/RESEARCH.md)에 있습니다.

웹 출처를 수집할 때는 초안 참고 문서와 접근 메타데이터를 만들 수 있습니다.

```bash
npm run wiki:ingest -- --url https://example.org/article --id source-slug --title "자료 제목" --related questions/acceptance,concepts/grace
```

수집기는 자료의 해시와 접근 상태를 `raw/ingest-catalog.json`에 기록하고, 응답 원문은 Git에 포함되지 않는 `raw/snapshots/`에 보존합니다. 생성된 참고 문서는 초안이므로 직접 읽고 요약한 뒤 관련 질문·개념과 근거를 대조해야 공개할 수 있습니다.

문서 수정 뒤 인덱스와 갱신 기록을 업데이트할 수 있습니다. 명령 뒤의 문장은 갱신 기록에 추가됩니다.

```bash
npm run wiki:sync -- "질문 문서의 출처 요약과 관련 링크를 갱신했다."
```

## 책과 함께 읽기

`?view=library`에서 사사기, 로마서 두 과정, 갈라디아서, 성경 전체 이야기, 자녀 됨과 공동체를 세 번에 걸쳐 읽는 여섯 과정을 고를 수 있습니다. 과정은 성경 본문·대화·작은 실천·직접 탐색을 연결합니다. 원자료의 목차를 그대로 재현하는 대신 이 사이트에서 구성한 읽기 안내입니다.

설치된 Logos 자료 7종의 서지를 확인했습니다. 실제 본문 일부, 원서 공개 샘플, 목차·소개 확인 범위를 각 참고 문서와 [Logos 조사 기록](docs/LOGOS-RESEARCH.md)에 구분했습니다. 책 안내의 Logos 링크는 해당 책이 설치된 기기에서 열립니다. 본문 전문과 개인 계정 정보는 저장소에 넣지 않습니다.

## 주소 호환

새 문서는 `?doc=<public_id>`와 선택적 `&state=<상태>`로 공유합니다. 이전 주소의 `?passage=<legacy_id>`와 `?thread=<legacy_id>`도 계속 열리며, 예전 본문·주제 ID는 새 문서로 연결됩니다. 기존 공유 링크를 열면 새 읽기 화면에서 이어 읽을 수 있습니다.

## 배포

`main` 브랜치에 푸시하거나 Actions에서 수동 실행하면 GitHub Actions가 `npm run check`를 통과한 뒤 `dist/`를 GitHub Pages에 배포합니다. 저장소 Settings → Pages의 배포 소스가 GitHub Actions로 설정되어 있어야 합니다. 콘텐츠 검사와 데스크톱·모바일 브라우저 검사 모두 통과해야 배포됩니다. 현재 공개 주소는 <https://dong-ha.github.io/BIBE/> 입니다.
