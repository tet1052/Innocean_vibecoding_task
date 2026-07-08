import React, { useState, useMemo } from 'react';
import {
  Lightbulb, Palette, Target, Megaphone, BarChart3, Cpu, MessageCircle,
  PartyPopper, Users, Wallet, Heart, Dumbbell, GraduationCap, Bot,
  ChevronRight, RotateCcw, Flag, MapPin, Sparkles,
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

const CHOICES = [
  { id: 'health', label: '건강·웰빙 우선', icon: Heart, dHealth: 8, dStability: -2, desc: '충분한 휴식과 마음 관리에 시간을 쓴다' },
  { id: 'exercise', label: '운동 습관 강화', icon: Dumbbell, dHealth: 6, dStability: 1, desc: '체력을 기반 삼아 일하는 방식을 바꾼다' },
  { id: 'learning', label: '재교육·학습 투자', icon: GraduationCap, dHealth: -3, dStability: 7, desc: '새 역량을 배우는 데 시간을 쓴다' },
  { id: 'ai', label: 'AI 툴 적극 활용', icon: Bot, dHealth: -1, dStability: 9, desc: '업무 방식 자체를 AI 중심으로 바꾼다' },
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

const HEALTH_TIP = '짧더라도 쉬는 시간을 루틴으로 만들어보세요. 업무 강도가 계속 높다면 팀장님과 먼저 상의해보는 것도 방법입니다.';
const STABILITY_TIP = '루틴 업무 중 하나를 골라 AI 툴로 대체해보는 작은 실험부터 시작해보세요.';

function moodFromStats(health, stability) {
  const avg = (health + stability) / 2;
  if (avg >= 65) return 'happy';
  if (avg < 45) return 'tired';
  return 'neutral';
}

function buildRecommendations(job, stats, log) {
  const recs = [];
  recs.push(
    stats.health <= stats.stability
      ? { icon: Heart, text: HEALTH_TIP }
      : { icon: Bot, text: STABILITY_TIP }
  );
  recs.push({ icon: job.icon, text: `[${job.label}] ${JOB_AI_TIP[job.id]}` });
  const pickedIds = new Set(log.map((c) => c.id));
  const missing = CHOICES.find((c) => !pickedIds.has(c.id));
  recs.push(
    missing
      ? { icon: missing.icon, text: `이번엔 '${missing.label}'을 한 번도 선택하지 않았어요. 다음 판엔 넣어보면 결과가 달라질 거예요.` }
      : { icon: Sparkles, text: '5단계 동안 네 가지 방향을 골고루 선택했어요. 균형 잡힌 여정이었습니다.' }
  );
  return recs;
}

const initialForm = {
  name: '',
  age: 30,
  gender: '',
  job: 'planning',
  scenario: 'baseline',
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

      {/* 아이템 (선택한 방향에 따라 하나씩 추가됨) */}
      {accessories.includes('exercise') && (
        <rect x="56" y="60" width="88" height="13" rx="6.5" fill="#fff" stroke={color} strokeWidth="3" />
      )}
      {accessories.includes('learning') && (
        <g transform="translate(68,16)">
          <path d="M0,9 L32,0 L64,9 L32,18 Z" fill="#24312C" />
          <rect x="29" y="9" width="6" height="13" fill="#24312C" />
          <circle cx="32" cy="24" r="2.4" fill="#24312C" />
        </g>
      )}
      {accessories.includes('ai') && (
        <g>
          <line x1="128" y1="34" x2="132" y2="16" stroke="#24312C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="133" cy="13" r="5" fill="#E3A73B" />
        </g>
      )}
      {accessories.includes('health') && (
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
  const [round, setRound] = useState(0); // 0~4
  const [stats, setStats] = useState({ health: 60, stability: 55 });
  const [startStats, setStartStats] = useState({ health: 60, stability: 55 });
  const [log, setLog] = useState([]);

  const job = useMemo(() => JOB_CATEGORIES.find((j) => j.id === form.job), [form.job]);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === form.scenario), [form.scenario]);
  const accessories = useMemo(() => Array.from(new Set(log.map((c) => c.id))), [log]);
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
        (form.weeklyHours - 40) * 0.15
    );
    setStats({ health: h, stability: s });
    setStartStats({ health: h, stability: s });
    setRound(0);
    setLog([]);
    setStep(1);
  }

  function chooseOption(choice) {
    const dh = choice.dHealth * scenario.mult;
    const ds = choice.dStability * scenario.mult;
    const next = { health: clamp(stats.health + dh), stability: clamp(stats.stability + ds) };
    setStats(next);
    setLog((l) => [...l, choice]);
    if (round + 1 >= 5) {
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
  }

  const sustainability = Math.round((stats.health + stats.stability) / 2);
  const workAge = form.age + Math.round((sustainability / 100) * 45);

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
            5번의 선택으로 완성되는, 나만의 커리어 여정
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

            <div className="grid grid-cols-2 gap-4 mb-5">
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

        {/* -------------------- STEP 1: 5단계 시뮬레이션 -------------------- */}
        {step === 1 && (
          <div className="rounded-3xl p-6" style={{ background: C.card, boxShadow: '0 8px 30px rgba(36,49,44,0.06)' }}>
            <TrailMap totalSteps={5} currentIndex={round} accentColor={job.color} />

            <div className="text-center my-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: job.soft, color: job.color }}
              >
                {round + 1} / 5 단계
              </span>
            </div>

            <div className="flex items-center justify-center mb-4">
              <Mascot color={job.color} mood={mood} accessories={accessories} size={110} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBar label="건강" value={stats.health} color={C.rose} />
              <StatBar label="직업 안정성" value={stats.stability} color={C.teal} />
            </div>

            <p className="text-center mb-4" style={{ fontSize: 14, color: C.inkSoft }}>
              이번 단계, 무엇에 시간을 쓸까요?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHOICES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => chooseOption(c)}
                  className="text-left p-4 rounded-2xl flex items-start gap-3"
                  style={{ border: `1px solid ${C.trailBg}`, background: '#fff' }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 40, height: 40, background: C.bg, color: job.color }}
                  >
                    <c.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
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
              <div style={{ fontSize: 13, color: C.inkSoft }}>{form.name}님의 예상 근로 가능 연령</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: job.color, lineHeight: 1.1 }}>
                {workAge}<span style={{ fontSize: 22 }}>세</span>
              </div>
              <div style={{ fontSize: 13, color: C.inkSoft }}>
                현재 {form.age}세 · {job.label} · 지속가능성 점수 {sustainability}점
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
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>나의 5단계 선택 일지</div>
              <div className="flex flex-wrap gap-2">
                {log.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{ background: '#fff', border: `1px solid ${C.trailBg}` }}
                  >
                    <c.icon size={12} color={job.color} />
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ background: C.tealSoft }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: C.teal }}>추천 액션</div>
              <div className="flex flex-col gap-2">
                {buildRecommendations(job, stats, log).map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <r.icon size={15} color={C.teal} className="shrink-0 mt-0.5" />
                    <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-2xl mb-6" style={{ background: C.goldSoft }}>
              <Sparkles size={16} color={C.gold} className="shrink-0 mt-0.5" />
              <p style={{ fontSize: 11.5, color: '#7A5A1E', lineHeight: 1.5 }}>
                이 결과는 실제 역학·노동 통계가 아니라, 게임 진행을 위해 설계된 참고용 추정치입니다.
                직무별 기준값은 공개 데이터를 참고한 상대적 추정치이며, 향후 실제 데이터로 교체할 수 있습니다.
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
