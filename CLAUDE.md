# suefl — TOEFL 학습 사이트

혼자 쓰는 TOEFL 학습용 단일 HTML 웹앱. 빌드 도구 없음, 의존성 없음.
`index.html` 파일 하나가 전부다.

## 파일 구조

```
C:\Claude\suefl\
  index.html          # 사이트 전체 (HTML+CSS+JS 한 파일)
  builtin.js          # 사이트 기본 제공 문제 ('기본' 라벨로 모두에게 보임)
  imports\            # 교재에서 변환한 문제 JSON들 (개인 가져오기용)
    t2-1.json ~ t2-5.json, w-task2-20days.json
  CLAUDE.md           # 이 문서
```

`index.html`과 `builtin.js`는 **함께 배포**해야 함 (폴더째 드래그).

## 배포

1. `index.html` (또는 `builtin.js`) 수정
2. 검증: 브라우저에서 실제로 열어 콘솔 에러 0건 확인
   - ⚠️ 이 PC에 node가 없어서 예전 문법 검사 명령은 못 씀
   - 로컬 서버: `python -m http.server 8000` → `http://127.0.0.1:8000/index.html`
3. https://app.netlify.com/projects/suefl → Deploys 탭에 **폴더째 드래그 앤 드롭**
   - ⚠️ `index.html` 파일 하나만 끌면 `builtin.js`가 빠져서 기본 문제가 안 보임
   - 끌 것: `index.html` + `builtin.js`가 든 폴더
4. 사이트: https://suefl.netlify.app

Netlify CLI/API 자동 배포는 안 됨. 수동 드래그만 가능.
배포 이력은 Netlify Deploys 탭에 남아서 언제든 이전 버전으로 롤백 가능.

## 버전 관리

git 저장소임 (2026-08-24부터). 수정 전 임시 백업 대신 커밋으로 이력을 남길 것.
원격(GitHub)은 아직 없음 — 노트북이 고장나면 변환 작업이 사라지므로 언젠가 연결 필요.

## 사이트 구조

상단 탭: 단어 / 리딩 / 리스닝 / 라이팅 / 스피킹 / 모의고사 / 메모 모음 / 진도

각 영역 안에:
- 맨 위 `buildAddPanel(kind, label, formBuilder)` — 문제 추가 (직접작성 / 사진 / JSON 탭)
- 그 아래 `taskSubtabs(key, list, rerender)` — Task 1/2/3 선택 버튼, 고른 것만 표시
- 그 아래 문제 목록

우측 상단 햄버거 → 설정 드로어 (API 키, 계정 동기화)

### 핵심 함수

| 함수 | 역할 |
|---|---|
| `buildAddPanel` | 통합 추가 패널. `ADD_PANEL` 전역에 열림/탭/메시지 상태 보존 |
| `taskSubtabs` / `curTask` | Task 유형 선택. `TASK_SEL` 전역 |
| `renderExamQuestions` | 리딩·리스닝 공용 문제풀이. `opts.onQuestion` 콜백으로 문제별 스크립트 전환 |
| `renderAnalysisView` | 필기(분석) 화면. 형광펜·밑줄·네모박스·메모 |
| `flattenExtracted` / `piecesToFragment` | 서식 span 평탄화. 중첩 span 깨짐 방지의 핵심 |
| `mergeSyncPayload` | 클라우드 병합 (덮어쓰기 아님) |
| `markDeleted` / `dropDeleted` | 삭제 툼스톤 |
| `importData` / `runImportText` | JSON 가져오기 |
| `runExport` | JSON 내보내기 |
| `renderMock` | 모의고사. 설정 → 진행 → 결과를 `MOCK` 전역 상태로 전환 |
| `buildMockUnits` | 뽑은 문제를 푸는 단위로 펼침 (리딩·리스닝은 문항 단위) |

### 모의고사

`MOCK_PLANS`에 영역별 기본 문항 수와 제한 시간이 있음.
⚠ **이 기본값은 TOEFL Essentials를 참고해 잡은 추정치**라 공식 시험과 다를 수 있음.
사용자가 설정 화면에서 고칠 수 있고 `toeflMockCfg`에 저장됨.
공식 문항 수를 확인하면 `MOCK_PLANS`를 고칠 것.

- 출제 범위는 지금 켜둔 라벨(`LABEL_FILTER`)을 그대로 따름
- 리딩·리스닝은 자동 채점, 라이팅·스피킹은 작성/녹음만 남김
- 시간이 끝나면 자동 제출

### 데이터 (localStorage)

| 키 | 내용 |
|---|---|
| `toeflData` | 단어·리딩·리스닝·라이팅·스피킹 문제 |
| `toeflProgress` | 진도. `{readingScores:{id:{answers:[{selected,correct}]}}, ...}` |
| `toeflNotes` | 자유 메모장 |
| `toeflAnnotations` | 필기(형광펜·메모) HTML |
| `toeflDeleted` | 삭제 툼스톤 `{id: ISO날짜}`, 180일 후 정리 |
| `toeflMockCfg` | 모의고사 구성(문항 수·시간)과 마지막에 고른 영역 |
| `toeflLabelFilter` | 체크한 라벨 목록 (null이면 전체) |
| `toeflApiKey` | Anthropic API 키 |
| `toeflSbSession` | Supabase 세션 |
| `toeflLastSync` | 마지막 동기화 시각 |

## 클라우드 동기화 (Supabase)

- URL/anon key는 `SB_DEFAULT_URL` / `SB_DEFAULT_KEY`로 파일에 내장됨 (프로젝트: suefl, 도쿄)
- anon key는 공개돼도 안전 — RLS로 각자 자기 행만 접근
- 테이블 `user_data(user_id uuid PK, data jsonb, updated_at timestamptz)`
- 이메일 로그인 + 구글 OAuth
- **병합 방식**: 양쪽 항목이 모두 살아남고, 삭제는 툼스톤으로 전파
- 자동: 저장 시 1.5초 뒤 업로드 / 페이지 열 때·포커스 시·30초마다 다운로드
- ⚠️ Cowork 아티팩트 안에서는 외부 fetch가 막혀서 로그인 불가. 실제 사이트에서만 작동

## AI 기능

`pickAiTask(prompt, data)` 우선순위: 사용자 API 키 → Cowork 브릿지 → (미구현) 공용 프록시

- 라이팅 AI 첨삭 (TOEFL 공식 기준 4항목 채점)
- 단어 뜻·유의어·예문 자동완성
- 모델: 기능별로 다름 (`MODEL_FAST` / `MODEL_SMART` 상수)
  - 단어 자동완성·연결 테스트 → `claude-haiku-4-5` (1회 1원 미만)
  - 라이팅 AI 첨삭 → `claude-sonnet-5` (1회 10원 안팎, 판단이 필요한 작업이라 상향)
  - `callClaudeDirect(prompt, apiKey, model, maxTokens)` — 인자 생략 시 Haiku
- ⚠️ 공용 프록시(`callClaudeShared`)는 `/.netlify/functions/claude-proxy`를 부르는데 **그 함수가 없음**. 즉 본인 API 키가 필수
- API 키는 로그인 계정 따라 기기 간 동기화됨

## 교재 → JSON 변환 작업 (진행 중)

원본: `Hackers Listening.pdf` (612p, 스캔 이미지, 텍스트 레이어 없음)
※ 이 PDF는 Cowork 세션 업로드 파일이라 Claude Code에는 없음. 필요하면 사용자에게 다시 요청할 것.

### ⚠️ 반드시 지킬 것

1. **PDF는 1~3페이지씩 잘라서 읽을 것.** 20페이지 묶음으로 읽으면 내용이 제대로 안 들어오는데, 그걸 모르고 그럴듯한 내용을 지어낸 사고가 실제로 있었음 (TASK2-1 스크립트 8개 전부 창작, 정답 16개 중 7개 오답).
2. **만든 뒤 반드시 책 정답표와 기계적으로 대조할 것.** 파이썬으로 A/B/C/D를 인덱스로 변환해 전수 비교.
3. **정답을 확인 못 하면 그 문제는 빼기.** 추측 금지.

### JSON 형식

```json
{"listening":[{
  "taskType":"conversation",
  "title":"TASK2-1 Main Topic/Purpose Hackers Test (p.90-93)",
  "script":"",
  "questions":[{
    "q":"01. [Main Topic] What is the conversation mainly about?",
    "opts":["...","...","...","..."],
    "answer":1,
    "explanation":"정답 (B) ... 남자가 \"...\"라고 말해요.",
    "script":"[01-02] Listen to a conversation. (M-Am / W-Au)\nM: ...\nW: ..."
  }]
}]}
```

규칙:
- 지문이 여러 개면 항목 레벨 `script`는 `""`로 두고, 문제마다 `script` 부여 (합본 만들지 말 것)
- 지문이 하나면 반대로 항목 레벨에만
- 제목에 책 페이지 번호 포함
- 질문 앞에 번호와 유형: `"01. [Main Topic] ..."`
- Practice는 제외, **Hackers Test만** 변환

### 진행 상황

| 범위 | 상태 |
|---|---|
| TASK1 (문장 응답형) | 제외 (문항 270개라 사용자가 건너뛰기로 결정) |
| TASK2-1 주제/목적 (p.90-93) | ✅ `imports/t2-1.json` |
| TASK2-2 Suggestion/Offer (p.98-101) | ✅ `imports/t2-2.json` |
| TASK2-3 Problem (p.106-109) | ✅ `imports/t2-3.json` |
| TASK2-4 Do Next (p.114-117) | ✅ `imports/t2-4.json` |
| TASK2-5 Detail (p.122-125) | ✅ `imports/t2-5.json` |
| **TASK2-6 Intention/Attitude (p.130-133)** | ⬜ **다음 차례** |
| TASK2-7 Inference (p.138-141) | ⬜ |
| TASK2 Section II 주제별 3종 (p.144-169) | ⬜ |
| TASK3 (p.174-241) | ⬜ |
| TASK4 (p.246-355) | ⬜ |
| 실전모의고사 1·2 (p.356-382) | ⬜ |

책 구조: 문제는 앞쪽, 정답·스크립트·해설은 뒤쪽(413p~) 별도 섹션. PDF 페이지 번호 = 책 페이지 번호.

## 코딩 규칙

- ES5 스타일 (`var`, `function`). 화살표 함수·let/const 안 씀
- 들여쓰기 거의 없이 한 줄씩 (기존 스타일 유지)
- `el('<div>...</div>')` 헬퍼로 DOM 생성
- `alert()` / `confirm()` / `prompt()` 쓰지 말 것 — Cowork 아티팩트에서 막힘. 두 번 클릭 확인 패턴이나 인라인 메시지로 대체
- **HTML 요소는 반드시 `<script>` 앞에 둘 것.** 뒤에 두면 초기화가 통째로 죽음 (실제로 겪음)
- 수정 후 검증: 문법 검사 + `getElementById` 참조 id가 전부 HTML에 있는지 확인

## 사용자 정보

- 한국어로 대화. 다정한 말투
- 설명은 짧게. 불필요한 서론·요약 없이
