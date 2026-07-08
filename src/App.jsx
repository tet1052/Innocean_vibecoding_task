import React, { useState, useMemo } from 'react';
import {
  Lightbulb, Palette, Target, Megaphone, BarChart3, Cpu, MessageCircle,
  PartyPopper, Users, Wallet, Heart, Dumbbell, GraduationCap, Bot,
  ChevronRight, RotateCcw, Flag, MapPin, Sparkles, AlertTriangle, Flame, Eye,
} from 'lucide-react';

/* ---------------------------------- 토큰 ---------------------------------- */
const C = {
  bg: '#EFF2E9',
  card: '#FFFFFF',
  ink: '#24312C',
  inkSoft: '#66766C',
  coral: '#F1654A',
  coralSoft: '#FCE3DC',
  gold: '#E3A73B',
  goldSoft: '#FBEBD3',
  teal: '#2F6B5E',
  tealSoft: '#DCE9E2',
  rose: '#D98BA0',
  roseSoft: '#F6E1E7',
  trail: '#C99A6B',
  trailBg: '#E3DCC8',
};

const FONT_DISPLAY = "'Do Hyeon', sans-serif";
const FONT_BODY = "'Gothic A1', sans-serif";

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));

/* ------------------------------- 데이터 정의 ------------------------------- */
const JOB_CATEGORIES = [
  { id: 'planning', label: '기획', icon: Lightbulb, color: C.coral, soft: C.coralSoft, baseHealth: 66, baseStability: 62, blurb: '캠페인의 뼈대를 세우는 사람' },
  { id: 'production', label: '제작', icon: Palette, color: C.rose, soft: C.roseSoft, baseHealth: 64, baseStability: 58, blurb: '아이디어를 눈에 보이게 만드는 사람' },
  { id: 'strategy', label: '전략', icon: Target, color: C.teal, soft: C.tealSoft, baseHealth: 68, baseStability: 65, blurb: '브랜드의 다음 수를 그리는 사람' },
  { id: 'media', label: '미디어', icon: Megaphone, color: C.gold, soft: C.goldSoft, baseHealth: 60, baseStability: 48, blurb: '메시지가 닿을 자리를 고르는 사람' },
  { id: 'data', label: '데이터', icon: BarChart3, color: C.teal, soft: C.tealSoft, baseHealth: 62, baseStability: 55, blurb: '숫자 속 신호를 찾는 사람' },
  { id: 'digital', label: '디지털', icon: Cpu, color: C.coral, soft: C.coralSoft, baseHealth: 63, baseStability: 50, blurb: '새 플랫폼에 먼저 발 딛는 사람' },
  { id: 'social', label: '소셜', icon: MessageCircle, color: C.rose, soft: C.roseSoft, baseHealth: 58, baseStability: 45, blurb: '오늘의 대화를 만드는 사람' },
  { id: 'promotion', label: '프로모션', icon: PartyPopper, color: C.gold, soft: C.goldSoft, baseHealth: 61, baseStability: 52, blurb: '현장의 순간을 설계하는 사람' },
  { id: 'hr', label: '인사', icon: Users, color: C.teal, soft: C.tealSoft, baseHealth: 70, baseStability: 68, blurb: '사람과 사람을 잇는 사람' },
  { id: 'finance', label: '재무', icon: Wallet, color: C.coral, soft: C.coralSoft, baseHealth: 65, baseStability: 60, blurb: '숫자로 조직을 지키는 사람' },
];

const SCENARIOS = [
  { id: 'optimistic', label: '낙관 시나리오', mult: 1.15, desc: 'AI는 도구, 사람이 방향을 정한다' },
  { id: 'baseline', label: '기준 시나리오', mult: 1.0, desc: '변화와 적응이 함께 오는 흐름' },
  { id: 'pessimistic', label: '비관 시나리오', mult: 0.85, desc: '변화가 사람보다 빠르게 온다' },
];

const TAG_META = {
  hold: { label: '관망·현상유지', icon: Eye, color: C.gold },
  invest: { label: '커리어 투자', icon: GraduationCap, color: C.teal },
  bold: { label: '과감한 승부수', icon: Flame, color: C.coral },
  care: { label: '건강 챙기기', icon: Heart, color: C.rose },
};

// 매 라운드 항상 추가로 켜고 끌 수 있는 건강 액션 — AI 시나리오와 무관하게 항상 동일하게 작동
const HEALTH_ACTION = {
  tag: 'care',
  label: '이번에도 나를 챙긴다',
  desc: '바쁜 와중에도 짧게라도 쉬는 시간을 사수한다',
  dHealth: 6,
  dStability: -2,
};

// 근속연차 기준 5개의 '커리어 모멘텀' — 매 순간이 "AI로 인해 이 직무가 계속 가능한가"를 묻는다
const CAREER_MOMENTS = [
  {
    offset: 2,
    title: 'AI 툴 첫 도입',
    situation: (job) => `회사가 ${job.label} 업무에 처음으로 생성형 AI 툴을 도입하기 시작했다. 다들 반신반의하는 분위기다.`,
    options: [
      { tag: 'hold', label: '일단 지켜본다', desc: '무리해서 먼저 나서지 않고 상황을 지켜본다', dHealth: 6, dStability: -6 },
      { tag: 'invest', label: '가장 먼저 배워서 익숙해진다', desc: '업무 시간을 쪼개 새 툴 사용법을 익힌다', dHealth: -4, dStability: 8 },
      { tag: 'bold', label: '개인 브랜드부터 먼저 쌓는다', desc: '회사 밖에서 AI 활용 노하우를 먼저 알린다', dHealth: -3, dStability: 5 },
    ],
  },
  {
    offset: 4,
    title: 'AI 잘 쓰는 후배의 등장',
    situation: (job) => `AI 툴을 능숙하게 다루는 후배가 들어오면서, 내 ${job.label} 업무 상당 부분을 빠르게 처리하기 시작했다.`,
    options: [
      { tag: 'hold', label: '내 경험치로 승부한다', desc: 'AI가 대체 못할 연차의 감각에 집중한다', dHealth: 4, dStability: -3 },
      { tag: 'invest', label: '후배에게 AI 활용법을 배운다', desc: '자존심을 내려놓고 후배에게 묻는다', dHealth: -3, dStability: 9 },
      { tag: 'bold', label: '이직 제안을 받아들인다', desc: '이 판을 떠나 새로운 곳에서 다시 시작한다', dHealth: 3, dStability: -7 },
    ],
  },
  {
    offset: 6,
    title: 'AI 전환을 이끄는 자리',
    situation: (job) => `팀장 자리가 제안됐다. 조건은 하나, 팀의 AI 전환을 이끄는 것. ${job.label} 실무를 계속할지, AI 전환 리더가 될지 갈림길에 섰다.`,
    options: [
      { tag: 'invest', label: 'AI 전환 리더가 된다', desc: '팀의 AI 도입 전체를 설계하고 이끈다', dHealth: -6, dStability: 10 },
      { tag: 'hold', label: '실무 전문가로 남는다', desc: 'AI 여부와 상관없이 내 실력으로 승부한다', dHealth: 5, dStability: 1 },
      { tag: 'bold', label: '팀장 대행만 맡는다', desc: '책임은 지되 방향 결정은 유보한다', dHealth: -3, dStability: 2 },
    ],
  },
  {
    offset: 9,
    title: 'AI발 구조조정',
    situation: (job) => `경영진이 AI 자동화로 ${job.label} 팀 인원을 줄이는 안을 검토하기 시작했다.`,
    options: [
      { tag: 'invest', label: '팀 내 AI 전문가로 자리매김한다', desc: '팀 안에서 AI를 가장 잘 다루는 사람이 된다', dHealth: -3, dStability: 11 },
      { tag: 'bold', label: 'AI 활용 프리랜서로 독립한다', desc: '이 기회에 회사 밖 생존을 준비한다', dHealth: 2, dStability: -5 },
      { tag: 'hold', label: '버티며 상황을 지켜본다', desc: '일단 조용히 자리를 지킨다', dHealth: -6, dStability: -5 },
    ],
  },
  {
    offset: 13,
    title: 'AI 네이티브 시대의 업계 재편',
    situation: (job) => `클라이언트들이 자체 AI 툴로 캠페인을 직접 만들기 시작하며, 대행사와 ${job.label}의 존재 이유 자체가 도마 위에 올랐다.`,
    options: [
      { tag: 'invest', label: 'AI 시대형 조직을 설계하는 임원이 된다', desc: '조직 구조 자체를 다시 짠다', dHealth: -7, dStability: 9 },
      { tag: 'bold', label: 'AI 네이티브 스튜디오를 차린다', desc: '리스크를 안고 내 이름을 건다', dHealth: -3, dStability: -4 },
      { tag: 'hold', label: '지금 방식 그대로 남는다', desc: '익숙한 방식을 그대로 지킨다', dHealth: 6, dStability: -2 },
    ],
  },
];

const JOB_AI_TIP = {
  planning: '레퍼런스 리서치와 초안 작성에 생성형 AI를 붙여, 기획안 초안 속도를 높여보세요.',
  production: 'AI 이미지·카피 초안 툴로 시안 배리에이션을 더 빠르게 늘려보세요.',
  strategy: 'AI로 경쟁사·시장 리서치를 요약하는 워크플로우를 만들어보세요.',
  media: 'AI 기반 매체 최적화·입찰 자동화 기능을 먼저 써보고 익혀두세요.',
  data: '리포트 초안을 생성형 AI로 요약해보는 루틴을 시도해보세요.',
  digital: '새로 나온 AI 제작·운영 툴을 가장 먼저 써보고 팀에 공유해보세요.',
  social: 'AI 콘텐츠 소재 실험 주기를 지금보다 짧게 가져가보세요.',
  promotion: 'AI로 현장 반응을 예측·분석하는 실험을 더해보세요.',
  hr: 'AI 기반 채용·온보딩 자동화를 검토해보세요.',
  finance: 'AI로 반복되는 정산·리포트 업무를 자동화해보세요.',
};

const searchUrl = (base, q) => `${base}${encodeURIComponent(q)}`;
const youtubeSearch = (q) => searchUrl('https://www.youtube.com/results?search_query=', q);
const googleSearch = (q) => searchUrl('https://www.google.com/search?q=', q);

function moodFromStats(health, stability) {
  const avg = (health + stability) / 2;
  if (avg >= 65) return 'happy';
  if (avg < 45) return 'tired';
  return 'neutral';
}

function buildRecommendations(job, stats, log) {
  const recs = [];

  // 1. 더 약한 축을 기준으로 한 실질적 컨텐츠 연결
  if (stats.health <= stats.stability) {
    recs.push({
      icon: Heart,
      text: '건강 회복이 우선이에요. 하루 10분이라도 홈트레이닝을 루틴으로 만들어보세요.',
      href: youtubeSearch('직장인 홈트레이닝 10분'),
      linkLabel: '운동 영상 찾아보기 →',
    });
  } else {
    recs.push({
      icon: Bot,
      text: `[${job.label}] ${JOB_AI_TIP[job.id]}`,
      href: youtubeSearch(`${job.label} 업무 AI 활용법`),
      linkLabel: '관련 영상 찾아보기 →',
    });
  }

  // 2. 직무 특화 AI 활용 학습 자료 연결
  recs.push({
    icon: job.icon,
    text: `${job.label} 직무에 특화된 AI 활용 사례를 더 찾아보세요.`,
    href: googleSearch(`${job.label} 업무 AI 활용 사례`),
    linkLabel: '자료 찾아보기 →',
  });

  // 3. 커리어 개발 자료 연결
  recs.push({
    icon: GraduationCap,
    text: '장기적인 커리어 로드맵도 한 번씩 점검해보면 좋아요.',
    href: googleSearch(`${job.label} 커리어 로드맵`),
    linkLabel: '커리어 자료 찾아보기 →',
  });

  // 4. 이번 판에 시도하지 않은 '주 대응 성향'에 대한 리플레이 유도
  const pickedTags = new Set(log.map((c) => c.tag));
  const missingTag = ['hold', 'invest', 'bold'].find((t) => !pickedTags.has(t));
  if (missingTag) {
    recs.push({
      icon: TAG_META[missingTag].icon,
      text: `이번엔 '${TAG_META[missingTag].label}' 성향의 대응을 한 번도 안 했어요. 다음 판엔 넣어보면 결과가 꽤 달라질 거예요.`,
    });
  } else {
    recs.push({ icon: Sparkles, text: '다섯 번의 갈림길에서 세 가지 대응 성향을 골고루 선택했어요. 균형 잡힌 여정이었습니다.' });
  }

  // 5. 건강 챙기기 액션을 실제로 활용했는지에 대한 피드백
  const careCount = log.filter((c) => c.tag === 'care').length;
  if (careCount === 0) {
    recs.push({
      icon: Heart,
      text: '5번의 갈림길 동안 "이번에도 나를 챙긴다"를 한 번도 켜지 않았어요. 큰 결정 중에도 최소한의 회복 시간은 챙겨보세요.',
      href: youtubeSearch('직장인 홈트레이닝 10분'),
      linkLabel: '운동 영상 찾아보기 →',
    });
  } else if (careCount >= 4) {
    recs.push({ icon: Heart, text: '거의 매번 나를 챙기는 선택을 함께했네요. 회복 습관은 꽤 탄탄해 보여요.' });
  }

  return recs;
}

const RETIREMENT_AGE = 60; // 현행 법정 정년(고령자고용법 제19조) 기준. 65세 연장은 2026년 기준 입법 논의 중, 미확정.

const ENDING_TIERS = [
  { min: 0, title: '위태로운 생존', desc: '이번 5번의 갈림길, 아슬아슬하게 버텨냈다' },
  { min: 40, title: '적응하는 커리어', desc: '흔들렸지만 균형을 찾아갔다' },
  { min: 70, title: '단단해진 커리어', desc: '변화 속에서도 자리를 지켜냈다' },
];

function getEndingTier(sustainability) {
  return [...ENDING_TIERS].reverse().find((t) => sustainability >= t.min);
}

const initialForm = {
  name: '',
  age: 30,
  gender: '',
  job: 'planning',
  scenario: 'baseline',
  tenureYears: 3,
  weeklyHours: 45,
  subjectiveHealth: 3,
  exerciseFreq: 3,
  mentalHealth: 3,
  aiUsage: 3,
  retrainWill: 3,
};

/* --------------------------------- 부품들 --------------------------------- */
function StepDots({ current }) {
  const steps = ['정보 입력', '시뮬레이션', '최종 리포트'];
  return (
    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
            style={{
              background: i === current ? C.ink : '#fff',
              color: i === current ? '#fff' : C.inkSoft,
              border: `1px solid ${i === current ? C.ink : C.trailBg}`,
              fontFamily: FONT_BODY,
              fontWeight: 700,
            }}
          >
            <span>{i + 1}</span>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={14} color={C.trail} />
          )}
        </div>
      ))}
    </div>
  );
}

function TrailMap({ totalSteps, currentIndex, accentColor, labels }) {
  const width = 760;
  const height = 130;
  const points = Array.from({ length: totalSteps }, (_, i) => {
    const x = 50 + i * ((width - 100) / Math.max(1, totalSteps - 1));
    const y = 65 + Math.sin(i * 1.35) * 28;
    return { x, y };
  });
  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 130 }}>
      <path
        d={`M0,${height} Q${width * 0.25},${height - 34} ${width * 0.5},${height} T${width},${height} L${width},${height} L0,${height} Z`}
        fill={C.trailBg}
        opacity="0.55"
      />
      {/* 구름 두어개 */}
      <circle cx={width * 0.15} cy={22} r="10" fill="#fff" opacity="0.9" />
      <circle cx={width * 0.15 + 14} cy={26} r="7" fill="#fff" opacity="0.9" />
      <circle cx={width * 0.82} cy={18} r="8" fill="#fff" opacity="0.9" />
      <circle cx={width * 0.82 + 12} cy={22} r="6" fill="#fff" opacity="0.9" />

      <path d={pathD} fill="none" stroke={C.trail} strokeWidth="4" strokeDasharray="1 12" strokeLinecap="round" />

      {points.map((p, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isCurrent ? 16 : 11}
              fill={done ? accentColor : '#fff'}
              stroke={C.trail}
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={done ? '#fff' : C.inkSoft}
              style={{ fontFamily: FONT_BODY }}
            >
              {i + 1}
            </text>
            {labels && (
              <text
                x={p.x}
                y={p.y + (isCurrent ? 30 : 24)}
                textAnchor="middle"
                fontSize="10"
                fill={C.inkSoft}
                style={{ fontFamily: FONT_BODY }}
              >
                {labels[i]}
              </text>
            )}
            {isCurrent && (
              <g transform={`translate(${p.x - 5}, ${p.y - 34})`}>
                <Flag size={16} color={accentColor} strokeWidth={2.5} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function LabeledSlider({ label, value, onChange, min = 1, max = 5, leftLabel, rightLabel, accent }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.ink, fontSize: 14 }}>{label}</span>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: accent, color: '#fff', fontFamily: FONT_BODY }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs mt-1" style={{ color: C.inkSoft, fontFamily: FONT_BODY }}>
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

function StatBar({ label, value, color, deltaText }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.ink, fontSize: 14 }}>{label}</span>
        <span style={{ fontFamily: FONT_DISPLAY, color, fontSize: 18 }}>
          {Math.round(value)}
          {deltaText && <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkSoft, marginLeft: 6 }}>{deltaText}</span>}
        </span>
      </div>
      <div className="w-full rounded-full" style={{ background: '#EDEBE0', height: 10 }}>
        <div
          className="rounded-full"
          style={{ width: `${clamp(value)}%`, background: color, height: 10, transition: 'width 0.5s ease' }}
        />
      </div>
    </div>
  );
}

function Mascot({ color, mood = 'neutral', accessories = [], size = 120 }) {
  const eyeY = 80;
  const mouthPaths = {
    happy: 'M80,102 Q100,118 120,102',
    neutral: 'M86,104 Q100,110 114,104',
    tired: 'M86,106 Q100,101 114,106',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <ellipse cx="100" cy="182" rx="52" ry="9" fill="#000" opacity="0.06" />

      {/* 귀 */}
      <circle cx="62" cy="50" r="17" fill={color} />
      <circle cx="138" cy="50" r="17" fill={color} />
      <circle cx="62" cy="50" r="8" fill="#fff" opacity="0.45" />
      <circle cx="138" cy="50" r="8" fill="#fff" opacity="0.45" />

      {/* 몸 */}
      <ellipse cx="100" cy="116" rx="72" ry="60" fill={color} />
      <ellipse cx="100" cy="136" rx="44" ry="32" fill="#fff" opacity="0.3" />

      {/* 볼터치 */}
      <circle cx="58" cy="114" r="10" fill="#fff" opacity="0.45" />
      <circle cx="142" cy="114" r="10" fill="#fff" opacity="0.45" />

      {/* 눈 */}
      {mood === 'tired' ? (
        <>
          <path d="M72,80 Q80,88 88,80" stroke="#24312C" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M112,80 Q120,88 128,80" stroke="#24312C" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="80" cy={eyeY} r="7" fill="#24312C" />
          <circle cx="120" cy={eyeY} r="7" fill="#24312C" />
          <circle cx="82.5" cy={eyeY - 2.5} r="2.2" fill="#fff" />
          <circle cx="122.5" cy={eyeY - 2.5} r="2.2" fill="#fff" />
        </>
      )}

      {/* 입 */}
      <path d={mouthPaths[mood]} stroke="#24312C" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* 아이템 (선택한 성향에 따라 하나씩 추가됨) */}
      {accessories.includes('invest') && (
        <g transform="translate(68,16)">
          <path d="M0,9 L32,0 L64,9 L32,18 Z" fill="#24312C" />
          <rect x="29" y="9" width="6" height="13" fill="#24312C" />
          <circle cx="32" cy="24" r="2.4" fill="#24312C" />
        </g>
      )}
      {accessories.includes('bold') && (
        <g>
          <line x1="128" y1="34" x2="132" y2="16" stroke="#24312C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="133" cy="13" r="5" fill="#E3A73B" />
        </g>
      )}
      {accessories.includes('care') && (
        <path
          d="M150,90 C146,83 137,88 141,96 C144,102 150,107 150,107 C150,107 156,102 159,96 C163,88 154,83 150,90 Z"
          fill="#F1654A"
        />
      )}
    </svg>
  );
}

/* --------------------------------- 메인 --------------------------------- */
export default function CareerSurvivalGame() {
  const [step, setStep] = useState(0); // 0: 정보입력, 1: 시뮬레이션, 2: 리포트
  const [form, setForm] = useState(initialForm);
  const [round, setRound] = useState(0); // 0~4 (CAREER_MOMENTS 인덱스)
  const [stats, setStats] = useState({ health: 60, stability: 55 });
  const [startStats, setStartStats] = useState({ health: 60, stability: 55 });
  const [log, setLog] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // 이번 라운드에 고른 주 대응
  const [healthOn, setHealthOn] = useState(false); // 이번 라운드에 건강 액션도 켰는지

  const job = useMemo(() => JOB_CATEGORIES.find((j) => j.id === form.job), [form.job]);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === form.scenario), [form.scenario]);
  const accessories = useMemo(() => Array.from(new Set(log.map((c) => c.tag))), [log]);
  const mood = moodFromStats(stats.health, stats.stability);

  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startSimulation() {
    const h = clamp(
      job.baseHealth +
        (form.exerciseFreq - 3) * 2.5 +
        (form.subjectiveHealth - 3) * 3 +
        (form.mentalHealth - 3) * 2 -
        (form.weeklyHours - 40) * 0.3
    );
    const s = clamp(
      job.baseStability +
        (form.aiUsage - 3) * 3 +
        (form.retrainWill - 3) * 3 -
        (form.weeklyHours - 40) * 0.15 +
        (form.tenureYears - 3) * 0.8 // 근속연차가 쌓일수록 기본 안정성에 소폭 가산
    );
    setStats({ health: h, stability: s });
    setStartStats({ health: h, stability: s });
    setRound(0);
    setLog([]);
    setSelectedOption(null);
    setHealthOn(false);
    setStep(1);
  }

  // 주 대응(hold/invest/bold) 하나 + 건강 액션(on/off)을 함께 반영해 확정
  function confirmMoment() {
    if (!selectedOption) return;
    const dh = selectedOption.dHealth * scenario.mult + (healthOn ? HEALTH_ACTION.dHealth : 0);
    const ds = selectedOption.dStability * scenario.mult + (healthOn ? HEALTH_ACTION.dStability : 0);
    const next = { health: clamp(stats.health + dh), stability: clamp(stats.stability + ds) };
    setStats(next);
    setLog((l) => [...l, selectedOption, ...(healthOn ? [HEALTH_ACTION] : [])]);
    setSelectedOption(null);
    setHealthOn(false);
    if (round + 1 >= CAREER_MOMENTS.length) {
      setTimeout(() => setStep(2), 150);
    } else {
      setRound((r) => r + 1);
    }
  }

  function restart() {
    setForm(initialForm);
    setStep(0);
    setRound(0);
    setLog([]);
    setSelectedOption(null);
    setHealthOn(false);
  }

  const sustainability = Math.round((stats.health + stats.stability) / 2);
  // 정년(60세)을 상한으로 두고, 그 이전 조기 이탈 가능성을 함께 보여준다
  const rawWorkAge = form.age + Math.round((sustainability / 100) * 40);
  const workAge = Math.min(RETIREMENT_AGE, rawWorkAge);
  const reachedRetirement = rawWorkAge >= RETIREMENT_AGE;
  const endingTier = getEndingTier(sustainability);
  const currentMoment = CAREER_MOMENTS[round];
  const stageTenure = form.tenureYears + currentMoment.offset;

  return (
    <div
      className="w-full min-h-full"
      style={{ background: C.bg, fontFamily: FONT_BODY, color: C.ink }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Gothic+A1:wght@400;500;600;700;900&display=swap');
        input[type="range"] { height: 6px; border-radius: 999px; background: #E3DCC8; -webkit-appearance: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: currentColor; border: 3px solid #fff; box-shadow: 0 0 0 1px #C99A6B; cursor: pointer; }
      `}</style>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs mb-3"
            style={{ background: C.trailBg, color: '#8A6B45', fontFamily: FONT_BODY, fontWeight: 700 }}
          >
            <MapPin size={12} /> 커리어 여정 시뮬레이터
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.ink, letterSpacing: 0.5 }}>
            AI 시대, 나의 커리어는 얼마나 오래갈까?
          </h1>
          <p style={{ color: C.inkSoft, fontSize: 14, marginTop: 6 }}>
            5번의 커리어 모멘텀, 나는 살아남을 수 있을까?
          </p>
        </div>

        <StepDots current={step} />

        {/* -------------------- STEP 0: 정보 입력 -------------------- */}
        {step === 0 && (
          <div className="rounded-3xl p-6" style={{ background: C.card, boxShadow: '0 8px 30px rgba(36,49,44,0.06)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="flex items-center justify-center rounded-2xl shrink-0"
                style={{ width: 88, height: 88, background: job.soft }}
              >
                <Mascot color={job.color} mood="neutral" accessories={[]} size={80} />
              </div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20 }}>{job.label} 담당자</div>
                <div style={{ color: C.inkSoft, fontSize: 13 }}>{job.blurb}</div>
                <div style={{ color: C.inkSoft, fontSize: 11, marginTop: 2 }}>여정을 시작하면 선택에 따라 캐릭터가 자라나요</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600 }}>이름</label>
                <input
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
                  style={{ border: `1px solid ${C.trailBg}`, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600 }}>나이</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateForm('age', Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
                  style={{ border: `1px solid ${C.trailBg}`, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600 }}>근속연차</label>
                <input
                  type="number"
                  min={0}
                  value={form.tenureYears}
                  onChange={(e) => updateForm('tenureYears', Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
                  style={{ border: `1px solid ${C.trailBg}`, outline: 'none' }}
                />
              </div>
            </div>

            <div className="mb-5">
              <label style={{ fontSize: 13, fontWeight: 600 }}>성별</label>
              <div className="flex gap-2 mt-1">
                {['미선택', '남성', '여성'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateForm('gender', g)}
                    className="flex-1 py-2 rounded-xl text-sm"
                    style={{
                      background: form.gender === g ? C.ink : '#fff',
                      color: form.gender === g ? '#fff' : C.inkSoft,
                      border: `1px solid ${form.gender === g ? C.ink : C.trailBg}`,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label style={{ fontSize: 13, fontWeight: 600 }}>직군 (광고회사 기준)</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                {JOB_CATEGORIES.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => updateForm('job', j.id)}
                    className="flex flex-col items-center gap-1 py-3 rounded-2xl text-xs"
                    style={{
                      background: form.job === j.id ? j.soft : '#fff',
                      border: `2px solid ${form.job === j.id ? j.color : C.trailBg}`,
                      color: C.ink,
                    }}
                  >
                    <j.icon size={20} color={j.color} />
                    <span style={{ fontWeight: 700 }}>{j.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label style={{ fontSize: 13, fontWeight: 600 }}>시나리오</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateForm('scenario', s.id)}
                    className="text-left p-3 rounded-2xl"
                    style={{
                      background: form.scenario === s.id ? C.ink : '#fff',
                      color: form.scenario === s.id ? '#fff' : C.ink,
                      border: `1px solid ${form.scenario === s.id ? C.ink : C.trailBg}`,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{s.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: C.bg }}>
              <LabeledSlider label="주당 노동시간" value={form.weeklyHours} min={20} max={70} onChange={(v) => updateForm('weeklyHours', v)} leftLabel="20시간 · 여유" rightLabel="70시간 · 과로" accent={C.coral} />
              <LabeledSlider label="주관적 건강 상태" value={form.subjectiveHealth} min={1} max={5} onChange={(v) => updateForm('subjectiveHealth', v)} leftLabel="나쁨" rightLabel="좋음" accent={C.rose} />
              <LabeledSlider label="운동 빈도 (주)" value={form.exerciseFreq} min={0} max={7} onChange={(v) => updateForm('exerciseFreq', v)} leftLabel="0회" rightLabel="7회" accent={C.teal} />
              <LabeledSlider label="정신건강 상태" value={form.mentalHealth} min={1} max={5} onChange={(v) => updateForm('mentalHealth', v)} leftLabel="나쁨" rightLabel="좋음" accent={C.rose} />
              <LabeledSlider label="AI 활용 수준" value={form.aiUsage} min={1} max={5} onChange={(v) => updateForm('aiUsage', v)} leftLabel="거의 안 씀" rightLabel="적극 활용" accent={C.gold} />
              <LabeledSlider label="재교육 의지" value={form.retrainWill} min={1} max={5} onChange={(v) => updateForm('retrainWill', v)} leftLabel="낮음" rightLabel="높음" accent={C.gold} />
            </div>

            <button
              onClick={startSimulation}
              disabled={!form.name}
              className="w-full mt-6 py-3 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: form.name ? job.color : C.trailBg,
                color: '#fff',
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                cursor: form.name ? 'pointer' : 'not-allowed',
              }}
            >
              여정 시작하기 <ChevronRight size={18} />
            </button>
            {!form.name && (
              <p className="text-center mt-2 text-xs" style={{ color: C.inkSoft }}>이름을 입력하면 시작할 수 있어요</p>
            )}
          </div>
        )}

        {/* -------------------- STEP 1: 커리어 모멘텀 시뮬레이션 -------------------- */}
        {step === 1 && (
          <div className="rounded-3xl p-6" style={{ background: C.card, boxShadow: '0 8px 30px rgba(36,49,44,0.06)' }}>
            <TrailMap totalSteps={5} currentIndex={round} accentColor={job.color} />

            <div className="text-center my-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: job.soft, color: job.color }}
              >
                모멘텀 {round + 1} / 5 · 근속 {stageTenure}년차
              </span>
            </div>

            <div className="flex items-center justify-center mb-4">
              <Mascot color={job.color} mood={mood} accessories={accessories} size={110} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <StatBar label="건강" value={stats.health} color={C.rose} />
              <StatBar label="직업 안정성" value={stats.stability} color={C.teal} />
            </div>

            {(stats.health < 30 || stats.stability < 30) && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-xs font-bold"
                style={{ background: '#FCE3DC', color: '#B33A2E' }}
              >
                <AlertTriangle size={14} />
                {stats.health < 30 && stats.stability < 30
                  ? '건강과 직업 안정성 모두 위험 수위예요'
                  : stats.health < 30
                  ? '건강이 위험 수위예요'
                  : '직업 안정성이 위험 수위예요'}
              </div>
            )}

            <div
              className="p-5 rounded-2xl mb-5"
              style={{ background: job.soft, border: `1px solid ${job.color}33` }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: job.color, marginBottom: 6 }}>
                {currentMoment.title}
              </div>
              <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}>
                {currentMoment.situation(job)}
              </div>
            </div>

            <p className="text-center mb-4" style={{ fontSize: 14, color: C.inkSoft }}>
              주 대응을 하나 고르고, 건강도 함께 챙길지 정해보세요
            </p>

            <div className="flex flex-col gap-3 mb-4">
              {currentMoment.options.map((opt, i) => {
                const meta = TAG_META[opt.tag];
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(opt)}
                    className="text-left p-4 rounded-2xl flex items-start gap-3"
                    style={{
                      border: `2px solid ${isSelected ? meta.color : C.trailBg}`,
                      background: isSelected ? `${meta.color}14` : '#fff',
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{ width: 40, height: 40, background: C.bg, color: meta.color }}
                    >
                      <meta.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setHealthOn((v) => !v)}
              className="w-full text-left p-4 rounded-2xl flex items-center gap-3 mb-5"
              style={{
                border: `2px solid ${healthOn ? C.rose : C.trailBg}`,
                background: healthOn ? `${C.rose}14` : '#fff',
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 40, height: 40, background: C.roseSoft, color: C.rose }}
              >
                <Heart size={20} />
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>{HEALTH_ACTION.label}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>
                  {HEALTH_ACTION.desc} (건강 +{HEALTH_ACTION.dHealth} · 안정성 {HEALTH_ACTION.dStability})
                </div>
              </div>
              <div
                className="rounded-full shrink-0"
                style={{
                  width: 40,
                  height: 22,
                  background: healthOn ? C.rose : C.trailBg,
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: healthOn ? 20 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }}
                />
              </div>
            </button>

            <button
              onClick={confirmMoment}
              disabled={!selectedOption}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: selectedOption ? job.color : C.trailBg,
                color: '#fff',
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                cursor: selectedOption ? 'pointer' : 'not-allowed',
              }}
            >
              이 선택으로 진행하기 <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* -------------------- STEP 2: 최종 리포트 -------------------- */}
        {step === 2 && (
          <div className="rounded-3xl p-6" style={{ background: C.card, boxShadow: '0 8px 30px rgba(36,49,44,0.06)' }}>
            <TrailMap totalSteps={5} currentIndex={4} accentColor={job.color} />

            <div className="flex items-center justify-center -mt-2 mb-2">
              <Mascot color={job.color} mood={mood} accessories={accessories} size={130} />
            </div>

            <div className="text-center my-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{ background: job.soft, color: job.color }}
              >
                {endingTier.title}
              </span>
              <div style={{ fontSize: 13, color: C.inkSoft }}>
                {form.name}님의 예상 근로 가능 연령
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: job.color, lineHeight: 1.1 }}>
                {workAge}<span style={{ fontSize: 22 }}>세</span>
              </div>
              <div
                className="inline-block px-2.5 py-1 rounded-full text-xs font-bold mt-1"
                style={{
                  background: reachedRetirement ? C.tealSoft : C.coralSoft,
                  color: reachedRetirement ? C.teal : C.coral,
                }}
              >
                {reachedRetirement
                  ? `법정 정년(${RETIREMENT_AGE}세)까지 보장`
                  : `정년보다 ${RETIREMENT_AGE - workAge}년 이른 조기 이탈 예상`}
              </div>
              <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 6 }}>
                현재 {form.age}세 · {job.label} · 지속가능성 점수 {sustainability}점
              </div>
              <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 4, fontStyle: 'italic' }}>
                "{endingTier.desc}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatBar
                label="건강"
                value={stats.health}
                color={C.rose}
                deltaText={`(${startStats.health.toFixed(0)} → ${stats.health.toFixed(0)})`}
              />
              <StatBar
                label="직업 안정성"
                value={stats.stability}
                color={C.teal}
                deltaText={`(${startStats.stability.toFixed(0)} → ${stats.stability.toFixed(0)})`}
              />
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ background: C.bg }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>나의 5개 모멘텀 선택 일지</div>
              <div className="flex flex-wrap gap-2">
                {log.map((c, i) => {
                  const meta = TAG_META[c.tag];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{ background: '#fff', border: `1px solid ${C.trailBg}` }}
                    >
                      <meta.icon size={12} color={job.color} />
                      {c.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ background: C.tealSoft }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: C.teal }}>추천 액션</div>
              <div className="flex flex-col gap-3">
                {buildRecommendations(job, stats, log).map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <r.icon size={15} color={C.teal} className="shrink-0 mt-0.5" />
                    <div>
                      <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>{r.text}</span>
                      {r.href && (
                        <a
                          href={r.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-0.5"
                          style={{ fontSize: 12, color: C.teal, fontWeight: 700, textDecoration: 'underline' }}
                        >
                          {r.linkLabel}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-2xl mb-6" style={{ background: C.goldSoft }}>
              <Sparkles size={16} color={C.gold} className="shrink-0 mt-0.5" />
              <p style={{ fontSize: 11.5, color: '#7A5A1E', lineHeight: 1.5 }}>
                이 시뮬레이션의 커리어 모멘텀과 직무별 기준값은 실제 역학·노동 통계가 아닌, 게임 진행을 위한 참고용 추정치입니다.
                다만 정년 상한선({RETIREMENT_AGE}세)은 실제 법정 정년(고령자고용법 제19조) 기준을 그대로 반영했습니다.
              </p>
            </div>

            <button
              onClick={restart}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2"
              style={{ background: C.ink, color: '#fff', fontFamily: FONT_DISPLAY, fontSize: 16 }}
            >
              <RotateCcw size={16} /> 다시 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
