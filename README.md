# AI 커리어 여정 시뮬레이터 — 배포 가이드

## 0. 이 프로젝트는 무엇인가요?
Vite + React로 만든 정적 웹앱입니다. `npm run build`로 빌드하면 `dist` 폴더에
순수 HTML/JS/CSS가 나오고, 이걸 Vercel이 호스팅합니다.

---

## 방법 A. GitHub + Vercel (가장 추천, 이후 계속 수정하기 편함)

1. **압축을 풀고** 터미널에서 이 폴더로 이동합니다.
2. 로컬에서 먼저 확인하고 싶다면:
   ```bash
   npm install
   npm run dev
   ```
   터미널에 뜨는 주소(보통 http://localhost:5173)로 접속해서 플레이해보세요.
3. GitHub에 새 저장소를 만들고 이 폴더를 push합니다.
   ```bash
   git init
   git add .
   git commit -m "career survival simulator"
   git branch -M main
   git remote add origin <내 GitHub 저장소 주소>
   git push -u origin main
   ```
4. [vercel.com](https://vercel.com) 로그인 → **Add New → Project** → 방금 만든
   GitHub 저장소 Import.
5. Vercel이 Vite 프로젝트를 자동으로 인식합니다 (Framework Preset: Vite,
   Build Command: `npm run build`, Output Directory: `dist`). 그대로 **Deploy** 클릭.
6. 1분 정도 후 `xxx.vercel.app` 주소가 발급됩니다. 이 주소로 팀원과 공유하면 됩니다.

이후 코드를 수정하고 다시 push만 하면 Vercel이 자동으로 재배포합니다.

---

## 방법 B. Vercel CLI로 한 번에 배포 (GitHub 없이 바로)

1. Node.js가 설치되어 있어야 합니다 (18 이상 권장).
2. 터미널에서 이 폴더로 이동한 뒤:
   ```bash
   npm install
   npx vercel
   ```
3. 처음이면 브라우저로 Vercel 로그인 창이 뜹니다. 로그인 후 터미널의 질문에
   기본값(Enter)으로 답해도 됩니다.
4. 완료되면 미리보기 주소가 나옵니다. 정식 주소로 배포하려면:
   ```bash
   npx vercel --prod
   ```

---

## 자주 겪는 문제

- **`npm install`에서 에러가 난다** → Node.js 버전을 18 이상으로 올려보세요.
- **화면에 폰트가 다르게 보인다** → `src/App.jsx` 상단 `@import url(...)`가
  Google Fonts를 불러오는데, 사내망에서 외부 폰트 CDN이 막혀있으면 기본 서체로
  보일 수 있습니다. 실제 서비스 환경에선 대부분 문제 없습니다.
- **아이콘이 하나도 안 보인다** → `npm install`이 제대로 끝났는지, `lucide-react`가
  `node_modules`에 설치됐는지 확인해보세요.

## 다음에 내용을 더 수정하고 싶다면
`src/App.jsx` 파일 하나에 전체 로직/디자인이 들어있습니다. 직무 데이터, 색상,
선택지 문구 등은 파일 상단의 `JOB_CATEGORIES`, `C`(색상), `CHOICES`를 고치면 됩니다.
