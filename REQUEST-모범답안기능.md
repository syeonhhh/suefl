# 개발 요청: 라이팅 문제에 모범답안 표시 기능

## 배경

교재(Hackers Writing)에서 변환한 라이팅 문제 JSON에 **모범답안**이 `sample` 필드로 이미 들어있다.
현재 사이트는 이 필드를 저장은 하지만 화면에 전혀 보여주지 않는다. 이걸 볼 수 있게 해달라.

예시 데이터 — `imports/w-task2-20days.json`:

```json
{"writing":{"email":[{
  "title":"TASK2 Day 01 교환학생 프로그램 문의 (p.322)",
  "prompt":"You are interested in joining your university's international exchange program...",
  "sample":"Dear Ms. Peterson,\n\nI hope this email finds you well. My name is Jane Smith..."
}]}}
```

## 요구사항

### 1. `sample` 필드 보존

- `importData()`의 writing 처리부는 이미 모든 키를 복사하므로 그대로 통과함 (확인 완료)
- `buildEmailForm` 등 라이팅 추가·수정 폼에 **모범답안 입력란(textarea)** 추가
- 수정 폼 저장 시 `sample` 유실되지 않게 할 것 (`base.sample||''` 패턴)

### 2. 연습 화면에 "모범답안 보기" 버튼

`renderWritingPractice(item, typeKey, promptText)` / `renderDiscussionPractice(item)` 안,
"✨ AI 첨삭 받기" 버튼 옆에 배치.

- `item.sample`이 없으면 버튼 자체를 만들지 말 것
- 누르면 답안 아래에 모범답안 박스를 펼침 (다시 누르면 접힘)
- 박스 스타일은 기존 해설 박스와 동일하게: `background:var(--accent-bg); border-radius:8px; padding:10px 12px;` + `white-space:pre-line`
- **답안을 쓰기 전에 정답을 보는 걸 살짝 막아줄 것**: 작성한 글자수가 50자 미만이면 버튼 대신
  "먼저 직접 써본 뒤에 보는 걸 권해요. 그래도 볼까요?" 안내를 띄우고 한 번 더 눌러야 열리게
  (두 번 클릭 확인 패턴 — 기존 `sync-pull` 버튼과 동일한 방식)

### 3. 목록에 표시

라이팅 목록 항목에서 모범답안이 있는 문제는 제목 옆에 `<span class="pill accent">모범답안</span>` 배지 표시.

## 지켜야 할 규칙 (CLAUDE.md와 동일)

- ES5 스타일 (`var`, `function`). 화살표 함수·let/const 금지
- `el('<div>...</div>')` 헬퍼로 DOM 생성
- `alert()` / `confirm()` / `prompt()` 금지 → 인라인 메시지나 두 번 클릭 확인으로
- HTML 요소는 반드시 `<script>` 앞에
- 수정 후 검증:
  ```bash
  node -e "new Function(require('fs').readFileSync('index.html','utf8').replace(/^[\s\S]*?<script>/,'').replace(/<\/script>[\s\S]*$/,''))" && echo OK
  ```
  그리고 `getElementById` 참조 id가 전부 HTML에 존재하는지 확인

## 테스트 방법

1. 설정 드로어 없이, 라이팅 탭 → Task 2 → 상단 "+ 추가" → JSON 탭
2. `imports/w-task2-20days.json` 붙여넣고 가져오기 → 20개 추가되는지 확인
3. 아무 문제나 "연습하기" → 모범답안 버튼 동작 확인 (50자 미만일 때 경고 → 두 번째 클릭에 열림)
4. 목록에 "모범답안" 배지 뜨는지 확인
