# GAUDIA — Next.js 프로젝트

## 🚀 주말 세팅 순서 (30분이면 완료!)

### Step 1. Node.js 설치
nodejs.org → LTS 버전 다운로드 → 설치

확인:
```bash
node -v   # v20.x.x 나오면 성공
npm -v    # 10.x.x 나오면 성공
```

---

### Step 2. Cursor 설치
cursor.com → Download → GitHub 계정으로 로그인

---

### Step 3. 이 폴더를 Cursor로 열기
Cursor → File → Open Folder → 이 폴더 선택

---

### Step 4. 패키지 설치
Cursor 상단 → Terminal → New Terminal

```bash
npm install
```

---

### Step 5. 환경변수 설정
1. `.env.example` 파일을 복사해서 `.env.local` 로 이름 변경
2. `.env.local` 파일 열기
3. Supabase 대시보드에서 값 복사해서 붙여넣기

```
Supabase 대시보드 → Project Settings → API
→ Project URL 복사
→ anon public 복사
```

---

### Step 6. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 **http://localhost:3000** 접속 → GAUDIA 화면 확인!

---

### Step 7. Supabase 카카오 로그인 설정
Supabase 대시보드 → Authentication → Providers → Kakao 활성화

카카오 개발자 콘솔(developers.kakao.com)에서:
1. 앱 생성 → REST API 키 복사
2. Redirect URI 추가:
   `https://[프로젝트ID].supabase.co/auth/v1/callback`

Supabase Kakao 설정에:
- Client ID: REST API 키 붙여넣기
- Client Secret: 카카오 앱 → 보안 → Client Secret 값

---

### Step 8. Vercel 재배포
GitHub에 push → Vercel 자동 배포

---

## 📁 파일 구조

```
src/
├── app/
│   ├── auth/callback/route.ts  ← 카카오 로그인 콜백
│   ├── login/page.tsx          ← 로그인 페이지
│   ├── page.tsx                ← 메인 홈 (토픽 목록)
│   ├── layout.tsx              ← 루트 레이아웃
│   └── globals.css             ← 글로벌 스타일
├── components/
│   └── layout/
│       ├── Navbar.tsx          ← 상단 네비게이션
│       └── BottomNav.tsx       ← 하단 모바일 탭
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← 브라우저용 Supabase
│   │   └── server.ts           ← 서버용 Supabase
│   └── points.ts               ← 포인트 처리 함수
├── types/
│   └── database.ts             ← TypeScript 타입 정의
└── middleware.ts                ← 로그인 체크
```

---

## ⚠️ 주의사항
- `.env.local` 파일은 절대 GitHub에 올리면 안 됩니다
- `.gitignore`에 이미 포함되어 있습니다
