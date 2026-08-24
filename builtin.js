/* ============================================================
   기본 제공 문제 (BUILTIN)
   ------------------------------------------------------------
   여기 넣은 문제는 사이트에 접속하는 모든 사람에게 '기본' 라벨로 보입니다.
   개인 데이터(localStorage)가 아니라 코드라서:
     - 저장 공간(5MB)을 차지하지 않아요
     - 이용자가 지우거나 고칠 수 없어요 (라벨 필터로 숨기기만 가능)
     - 풀이 기록·메모·형광펜은 평소처럼 각자 저장돼요
   반영하려면 이 파일과 index.html이 함께 배포돼야 해요 (폴더째 드래그).

   ⚠️ 교재를 그대로 옮긴 내용은 넣지 마세요. 개인 학습용으로 변환한 것과
      공개 사이트로 배포하는 것은 다릅니다. 직접 만든 변형 문제만 넣어주세요.

   id는 비워두면 자동으로 붙습니다. 직접 쓸 거면 다른 문제와 겹치지 않게,
   'bi-'로 시작하는 이름을 권해요 (예: "bi-read-notice-01").
   ============================================================ */

window.BUILTIN_QUESTIONS = {

  /* ---------- 리딩 ----------
     taskType: 'completeWords' | 'dailyLife' | 'academic'
     completeWords는 빈칸을 [[답]] 으로 표시해요. */
  reading: [
    {
      taskType: 'dailyLife',
      title: '기숙사 세탁실 공지 (변형)',
      passage: 'NOTICE: Laundry Room Renovation\n\nThe laundry room on the first floor of Ashford Hall will be closed from March 3 to March 14 for the installation of new washing machines. During this period, residents may use the facilities in Bell Hall, which will extend its hours to 6 A.M.–midnight. A shuttle will run between the two buildings every 30 minutes after 8 P.M.\n\nWe apologize for the inconvenience.\n— Residence Life Office',
      questions: [
        {
          q: '01. [Main Topic] What is the notice mainly about?',
          opts: [
            'A temporary closure of a laundry facility',
            'A permanent move to another building',
            'An increase in laundry fees',
            'A new shuttle route for commuters'
          ],
          answer: 0,
          explanation: '정답 (A). 첫 문장에서 세탁실이 3월 3일부터 14일까지 세탁기 교체를 위해 닫힌다고 알리고 있어요. 셔틀과 벨홀 이용은 그 기간의 대안일 뿐, 공지의 핵심은 임시 폐쇄예요.'
        },
        {
          q: '02. [Detail] What will happen at Bell Hall during the renovation?',
          opts: [
            'It will also be renovated.',
            'It will open for longer hours.',
            'It will charge residents a fee.',
            'It will limit access to residents of Ashford Hall.'
          ],
          answer: 1,
          explanation: '정답 (B). "which will extend its hours to 6 A.M.–midnight" — 벨홀이 운영 시간을 늘린다고 했어요. 셔틀 운행은 오후 8시 이후이지 이용 제한이 아니에요.'
        }
      ]
    }
  ],

  /* ---------- 리스닝 ----------
     taskType: 'chooseResponse' | 'conversation' | 'announcement' | 'academicTalk'
     대본은 "M:" / "W:" 로 화자를 나누면 남녀 목소리로 재생돼요.
     맨 앞 안내 문장은 내레이터가 읽습니다. */
  listening: [
    {
      taskType: 'conversation',
      title: '수강 신청 변경 문의 (변형)',
      script: '',
      questions: [
        {
          q: '01. [Main Topic] What is the conversation mainly about?',
          opts: [
            'Choosing a topic for a research paper',
            'Switching into a different section of a course',
            'Applying for a teaching assistant position',
            'Requesting an extension on an assignment'
          ],
          answer: 1,
          explanation: '정답 (B). 학생이 "I was hoping to move into the Tuesday section"이라고 말하며 다른 분반으로 옮기고 싶다고 해요. 대화 전체가 그 가능 여부를 다뤄요.',
          script: 'Listen to a conversation between a student and a department advisor.\nW: Excuse me, do you have a minute? I have a question about my statistics class.\nM: Sure, come in. What is it?\nW: I am registered for the Thursday afternoon section, but it conflicts with my lab. I was hoping to move into the Tuesday section.\nM: Let me check. The Tuesday section has two seats left, so that should be possible. But you will need your lab instructor to confirm the conflict in writing.\nW: Oh, I did not know that. Can I email it to you?\nM: That works. Send it today and I can process the change before registration closes on Friday.'
        },
        {
          q: '02. [Do Next] What will the woman most likely do next?',
          opts: [
            'Drop the statistics course',
            'Attend the Thursday section one more time',
            'Get written confirmation from her lab instructor',
            'Wait until registration reopens next semester'
          ],
          answer: 2,
          explanation: '정답 (C). 조언자가 "you will need your lab instructor to confirm the conflict in writing"이라고 했고, 학생이 이메일로 보내겠다고 했어요. 다음 행동은 확인서를 받는 것이에요.',
          script: 'Listen to a conversation between a student and a department advisor.\nW: Excuse me, do you have a minute? I have a question about my statistics class.\nM: Sure, come in. What is it?\nW: I am registered for the Thursday afternoon section, but it conflicts with my lab. I was hoping to move into the Tuesday section.\nM: Let me check. The Tuesday section has two seats left, so that should be possible. But you will need your lab instructor to confirm the conflict in writing.\nW: Oh, I did not know that. Can I email it to you?\nM: That works. Send it today and I can process the change before registration closes on Friday.'
        }
      ]
    }
  ],

  /* ---------- 라이팅 ----------
     buildSentence: words 배열 (완성된 문장을 단어로 쪼갠 것)
     email / discussion: prompt 또는 professorPrompt + refs
     sample 필드에 모범답안을 넣을 수 있어요. */
  writing: {
    buildSentence: [],
    email: [],
    discussion: []
  },

  /* ---------- 스피킹 ----------
     taskType: 'listenRepeat' (sentence) | 'interview' (prompt, prep, resp) */
  speaking: []

};
