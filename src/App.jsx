import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = [
  ["#FF6B6B", "#FF8E8E"],
  ["#FFE66D", "#FFD93D"],
  ["#6BCB77", "#4D9E57"],
  ["#4D96FF", "#2979FF"],
  ["#FF9A3C", "#FF7700"],
  ["#C77DFF", "#9B5DE5"],
  ["#F72585", "#C9184A"],
  ["#00F5D4", "#00BBF9"],
  ["#FEE440", "#F15BB5"],
  ["#00BBF9", "#006494"],
  ["#FF6B6B", "#FF8E8E"],
  ["#6BCB77", "#4D9E57"],
  ["#FFE66D", "#FFD93D"],
];

const FIXED_PARTICIPANTS = [
  "Александр Козловский",
  "Владислав Кургузов",
  "Виктория Кистова",
  "Денис Орехов",
  "Роман Булаткин",
  "Александра Матвеева",
  "Алина Сунгатуллина",
  "Николай Турков",
  "Алёна Конышева",
  "Илона Коско",
];

// ─── localStorage helpers ───────────────────────────────────────────────────
const LS = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const TODAY = () => new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
const TIME_NOW = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

// ─── Confetti ────────────────────────────────────────────────────────────────
function FunConfetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 220 }, (_, i) => {
      const isEmoji = i < 35;
      return {
        x: Math.random() * canvas.width, y: -40 - Math.random() * 200,
        w: 8 + Math.random() * 10, h: 6 + Math.random() * 6,
        color: `hsl(${Math.random() * 360},90%,60%)`,
        vx: (Math.random() - 0.5) * 5, vy: 2 + Math.random() * 5,
        angle: Math.random() * 360, spin: (Math.random() - 0.5) * 7,
        opacity: 1, isEmoji,
        emoji: ["🍑","🫶","💖","✨"][Math.floor(Math.random()*4)],
        fontSize: 22 + Math.random() * 18,
      };
    });
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.07;
        if (frame > 110) p.opacity -= 0.009;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        if (p.isEmoji) {
          ctx.font = `${p.fontSize}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.rotate((p.angle * Math.PI) / 180); ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.rotate((p.angle * Math.PI) / 180); ctx.fillStyle = p.color;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        }
        ctx.restore();
      });
      const alive = pieces.filter(p => p.opacity > 0 && p.y < canvas.height + 80);
      pieces.length = 0; pieces.push(...alive);
      if (pieces.length > 0) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);
  return <canvas ref={canvasRef} style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:9999 }} />;
}

// ─── History Panel ───────────────────────────────────────────────────────────
function HistoryPanel({ history }) {
  // Group by date
  const byDate = {};
  [...history].reverse().forEach(entry => {
    if (!byDate[entry.date]) byDate[entry.date] = [];
    byDate[entry.date].push(entry);
  });
  const dates = Object.keys(byDate);

  const labelDate = (d) => {
    const today = TODAY();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toLocaleDateString("ru-RU", { day:"2-digit", month:"2-digit", year:"numeric" });
    if (d === today) return "Сегодня";
    if (d === yStr) return "Вчера";
    return d;
  };

  if (dates.length === 0) {
    return <div className="empty-hint" style={{padding:"24px 0"}}>История пока пуста 🕊️</div>;
  }

  return (
    <div className="history-list">
      {dates.map(date => (
        <div key={date} className="history-group">
          <div className="history-date-label">{labelDate(date)}</div>
          {byDate[date].map((entry, i) => (
            <div key={i} className="history-entry">
              <span className="history-time">{entry.time}</span>
              <span className="history-name">{entry.winner}</span>
              <span className="history-sob">😭</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function WheelOfFortune() {
  const [fixedEnabled, setFixedEnabled] = useState(() =>
    LS.get("wof_fixedEnabled", Object.fromEntries(FIXED_PARTICIPANTS.map(p => [p, true])))
  );
  const [customParticipants, setCustomParticipants] = useState(() => LS.get("wof_custom", []));
  const [history, setHistory] = useState(() => LS.get("wof_history", []));
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(() => LS.get("wof_rotation", 0));
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("default");
  const spinRef = useRef(null);
  const startRotation = useRef(0);
  const canvasRef = useRef(null);

  // Persist state on change
  useEffect(() => { LS.set("wof_fixedEnabled", fixedEnabled); }, [fixedEnabled]);
  useEffect(() => { LS.set("wof_custom", customParticipants); }, [customParticipants]);
  useEffect(() => { LS.set("wof_history", history); }, [history]);
  useEffect(() => { LS.set("wof_rotation", rotation); }, [rotation]);

  // Ensure new fixed participants default to enabled if not yet in stored state
  useEffect(() => {
    setFixedEnabled(prev => {
      const updated = { ...prev };
      let changed = false;
      FIXED_PARTICIPANTS.forEach(p => { if (!(p in updated)) { updated[p] = true; changed = true; } });
      return changed ? updated : prev;
    });
  }, []);

  const activeFixed = FIXED_PARTICIPANTS.filter(p => fixedEnabled[p]);
  const participants = [...activeFixed, ...customParticipants];
  const n = participants.length;

  const drawWheel = useCallback((ctx, rot) => {
    if (n === 0) return;
    const cx = 240, cy = 240, r = 220;
    const slice = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, 480, 480);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 35;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#111"; ctx.fill(); ctx.restore();
    for (let i = 0; i < n; i++) {
      const start = rot + i * slice, end = start + slice;
      const [c1, c2] = COLORS[i % COLORS.length];
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, c2); grad.addColorStop(1, c1);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end);
      ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + slice / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 4;
      const fontSize = Math.min(14, Math.max(8, 165 / n));
      ctx.font = `bold ${fontSize}px 'Nunito', sans-serif`;
      const name = participants[i].length > 17 ? participants[i].slice(0, 16) + "…" : participants[i];
      ctx.fillText(name, r - 14, fontSize / 3); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    const cg = ctx.createRadialGradient(cx-5, cy-5, 2, cx, cy, 22);
    cg.addColorStop(0, "#fff"); cg.addColorStop(1, "#ccc");
    ctx.fillStyle = cg; ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 8;
    ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 2; ctx.stroke();
  }, [participants, n]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawWheel(canvas.getContext("2d"), rotation);
  }, [drawWheel, rotation]);

  const spin = () => {
    if (spinning || n < 2) return;
    setWinner(null); setShowWinner(false); setShowConfetti(false);
    const totalSpin = 2400 + Math.random() * 1800;
    const duration = 4200 + Math.random() * 800;
    const startTime = performance.now();
    startRotation.current = rotation;
    setSpinning(true);
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const currentRot = startRotation.current + (totalSpin * eased * Math.PI) / 180;
      setRotation(currentRot);
      if (progress < 1) {
        spinRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const slice = (2 * Math.PI) / n;
        const normalized = ((currentRot % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
        const pointer = (3 * Math.PI) / 2;
        const angle = ((pointer - normalized) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
        const idx = Math.floor(angle / slice) % n;
        setTimeout(() => {
          const winnerName = participants[idx];
          const entry = { winner: winnerName, date: TODAY(), time: TIME_NOW() };
          setWinner(winnerName);
          setShowWinner(true);
          setHistory(prev => [...prev, entry]);
          setConfettiKey(k => k + 1);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }, 300);
      }
    };
    spinRef.current = requestAnimationFrame(animate);
  };

  const addCustom = () => {
    const name = input.trim();
    if (!name || participants.includes(name) || customParticipants.length >= 5) return;
    setCustomParticipants(prev => [...prev, name]);
    setInput("");
  };
  const removeCustom = (i) => setCustomParticipants(prev => prev.filter((_, idx) => idx !== i));
  const toggleFixed = (name) => setFixedEnabled(prev => ({ ...prev, [name]: !prev[name] }));
  const clearHistory = () => { if (confirm("Очистить всю историю?")) setHistory([]); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d1a; }
        .app {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 20%, #1a0a2e 0%, #0d0d1a 60%, #00111a 100%);
          display: flex; flex-direction: column; align-items: center;
          padding: 32px 16px 48px; font-family: 'Nunito', sans-serif;
        }
        .title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(1.1rem, 3vw, 1.8rem); font-weight: 900;
          background: linear-gradient(90deg, #FFE66D, #FF6B6B, #C77DFF, #4D96FF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 32px; text-align: center;
        }
        .main {
          display: flex; flex-wrap: wrap; gap: 32px;
          justify-content: center; align-items: flex-start;
          width: 100%; max-width: 1100px;
        }
        .wheel-section { display: flex; flex-direction: column; align-items: center; }
        .wheel-wrap {
          position: relative; width: 480px; height: 480px;
          filter: drop-shadow(0 0 40px rgba(180,100,255,0.3));
        }
        .pointer {
          position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 14px solid transparent; border-right: 14px solid transparent;
          border-top: 36px solid #FFE66D;
          filter: drop-shadow(0 4px 8px rgba(255,230,109,0.7)); z-index: 10;
        }
        .spin-btn {
          margin-top: 28px; padding: 16px 52px;
          font-family: 'Unbounded', sans-serif; font-size: 1rem; font-weight: 700;
          border: none; border-radius: 50px; cursor: pointer;
          background: linear-gradient(135deg, #FFE66D 0%, #FF6B6B 50%, #C77DFF 100%);
          color: #1a0a2e; letter-spacing: 0.5px;
          box-shadow: 0 0 30px rgba(255,107,107,0.4), 0 4px 20px rgba(0,0,0,0.4);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .spin-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 0 50px rgba(255,107,107,0.6),0 6px 28px rgba(0,0,0,0.5); }
        .spin-btn:active:not(:disabled) { transform: scale(0.97); }
        .spin-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Panels */
        .panels-col { display: flex; flex-direction: column; gap: 16px; width: 300px; }
        .panel {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden; backdrop-filter: blur(12px);
        }
        .tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .tab-btn {
          flex: 1; padding: 12px 6px; background: none; border: none; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 0.72rem; font-weight: 700;
          color: rgba(255,255,255,0.4); letter-spacing: 0.6px; text-transform: uppercase;
          transition: all 0.2s; border-bottom: 2px solid transparent;
        }
        .tab-btn.active { color: #fff; border-bottom: 2px solid #C77DFF; background: rgba(199,125,255,0.06); }
        .tab-content { padding: 18px; }

        .select-all-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .mini-btn {
          flex: 1; padding: 6px 0; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          color: rgba(255,255,255,0.55); font-size: 0.73rem; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer; transition: all 0.15s;
        }
        .mini-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .fixed-list { display: flex; flex-direction: column; gap: 3px; }
        .fixed-item {
          display: flex; align-items: center; gap: 9px; padding: 7px 10px;
          border-radius: 10px; cursor: pointer; transition: background 0.15s; user-select: none;
        }
        .fixed-item:hover { background: rgba(255,255,255,0.06); }
        .fixed-item.off { opacity: 0.35; }
        .toggle {
          width: 30px; height: 17px; border-radius: 9px; position: relative;
          transition: background 0.2s; flex-shrink: 0;
        }
        .toggle.on { background: linear-gradient(90deg, #6BCB77, #4D9E57); }
        .toggle.off { background: rgba(255,255,255,0.12); }
        .toggle::after {
          content:''; position: absolute; width: 13px; height: 13px;
          border-radius: 50%; background: #fff; top: 2px; transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .toggle.on::after { left: 15px; }
        .toggle.off::after { left: 2px; }
        .cdot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .fname {
          flex: 1; color: #fff; font-size: 0.82rem; font-weight: 600;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .count-hint { font-size: 0.7rem; color: rgba(255,255,255,0.25); text-align: right; margin-top: 10px; }

        .add-row { display: flex; gap: 8px; margin-bottom: 14px; }
        .add-input {
          flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 9px 12px; color: #fff; font-size: 0.88rem;
          font-family: 'Nunito', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .add-input::placeholder { color: rgba(255,255,255,0.3); }
        .add-input:focus { border-color: rgba(199,125,255,0.5); }
        .add-btn {
          background: linear-gradient(135deg, #C77DFF, #4D96FF);
          border: none; border-radius: 10px; width: 38px; height: 38px;
          color: #fff; font-size: 1.3rem; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .add-btn:hover { opacity: 0.85; transform: scale(1.06); }
        .add-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .custom-list { display: flex; flex-direction: column; gap: 6px; }
        .custom-item {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.05); border-radius: 10px; padding: 8px 12px;
        }
        .cname { flex: 1; color: #fff; font-size: 0.88rem; font-weight: 600; }
        .del-btn {
          background: none; border: none; color: rgba(255,100,100,0.5); font-size: 1rem;
          cursor: pointer; padding: 2px 4px; line-height: 1; transition: color 0.15s, transform 0.15s;
        }
        .del-btn:hover { color: #FF6B6B; transform: scale(1.2); }
        .empty-hint { color: rgba(255,255,255,0.25); font-size: 0.85rem; text-align: center; }

        /* History */
        .history-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
        .history-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px 0; margin-bottom: 14px;
        }
        .history-title {
          font-family: 'Unbounded', sans-serif; font-size: 0.72rem; font-weight: 700;
          color: rgba(255,255,255,0.45); letter-spacing: 2px; text-transform: uppercase;
        }
        .clear-btn {
          background: none; border: none; color: rgba(255,100,100,0.4); font-size: 0.72rem;
          font-family: 'Nunito', sans-serif; cursor: pointer; transition: color 0.15s;
          font-weight: 700; letter-spacing: 0.5px;
        }
        .clear-btn:hover { color: #FF6B6B; }
        .history-scroll { max-height: 240px; overflow-y: auto; padding: 0 18px 16px; }
        .history-scroll::-webkit-scrollbar { width: 4px; }
        .history-scroll::-webkit-scrollbar-track { background: transparent; }
        .history-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .history-group { margin-bottom: 14px; }
        .history-date-label {
          font-family: 'Unbounded', sans-serif; font-size: 0.62rem; font-weight: 700;
          color: rgba(199,125,255,0.7); letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 6px; padding-bottom: 4px;
          border-bottom: 1px solid rgba(199,125,255,0.12);
        }
        .history-entry {
          display: flex; align-items: center; gap: 8px; padding: 6px 8px;
          border-radius: 8px; transition: background 0.15s;
        }
        .history-entry:hover { background: rgba(255,255,255,0.04); }
        .history-time { color: rgba(255,255,255,0.28); font-size: 0.72rem; font-weight: 600; min-width: 38px; }
        .history-name { flex: 1; color: rgba(255,255,255,0.85); font-size: 0.84rem; font-weight: 700; }
        .history-sob { font-size: 0.9rem; }

        /* Winner modal */
        .winner-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.72);
          backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
          z-index: 9000; animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .winner-card {
          background: linear-gradient(135deg, #1a0a2e, #0d1a2e);
          border: 2px solid rgba(255,100,100,0.35); border-radius: 24px;
          padding: 44px 52px; text-align: center;
          box-shadow: 0 0 80px rgba(255,80,80,0.2), 0 0 160px rgba(200,50,50,0.1);
          animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
          max-width: 420px; width: 90%;
        }
        @keyframes popIn { from { transform:scale(0.6);opacity:0 } to { transform:scale(1);opacity:1 } }
        .cry { font-size: 3.5rem; margin-bottom: 12px; display: block; }
        .wlabel {
          font-family: 'Unbounded', sans-serif; font-size: 0.68rem; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(255,160,80,0.7); margin-bottom: 10px;
        }
        .wname {
          font-family: 'Unbounded', sans-serif; font-size: clamp(1.3rem,4vw,2rem); font-weight: 900;
          background: linear-gradient(90deg, #FF6B6B, #FFE66D);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 8px; word-break: break-word;
        }
        .wsub { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-bottom: 28px; font-style: italic; }
        .close-btn {
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px; padding: 12px 32px; color: rgba(255,255,255,0.65);
          font-size: 0.9rem; font-family: 'Nunito', sans-serif; font-weight: 700;
          cursor: pointer; transition: all 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        @media (max-width: 560px) {
          .wheel-wrap { width: 320px; height: 320px; }
          .wheel-wrap canvas { width: 320px !important; height: 320px !important; }
          .panels-col { width: 100%; }
        }
      `}</style>

      <div className="app">
        <h1 className="title">🎡 Колесо Фортуны</h1>
        <div className="main">

          {/* Wheel */}
          <div className="wheel-section">
            <div className="wheel-wrap">
              <div className="pointer" />
              <canvas ref={canvasRef} width={480} height={480} />
            </div>
            <button className="spin-btn" onClick={spin} disabled={spinning || n < 2}>
              {spinning ? "Крутится... 🌀" : "🎲 КРУТИТЬКИ!"}
            </button>
          </div>

          {/* Right column: participants + history */}
          <div className="panels-col">

            {/* Participants panel */}
            <div className="panel">
              <div className="tabs">
                <button className={`tab-btn ${activeTab==="default"?"active":""}`} onClick={() => setActiveTab("default")}>👥 Дефолтные</button>
                <button className={`tab-btn ${activeTab==="custom"?"active":""}`} onClick={() => setActiveTab("custom")}>✏️ Свои</button>
              </div>
              <div className="tab-content">
                {activeTab === "default" && (
                  <>
                    <div className="select-all-row">
                      <button className="mini-btn" onClick={() => setFixedEnabled(Object.fromEntries(FIXED_PARTICIPANTS.map(p=>[p,true])))}>Все вкл</button>
                      <button className="mini-btn" onClick={() => setFixedEnabled(Object.fromEntries(FIXED_PARTICIPANTS.map(p=>[p,false])))}>Все выкл</button>
                    </div>
                    <div className="fixed-list">
                      {FIXED_PARTICIPANTS.map((p, i) => {
                        const on = fixedEnabled[p];
                        return (
                          <div key={p} className={`fixed-item ${on?"":"off"}`} onClick={() => toggleFixed(p)}>
                            <div className={`toggle ${on?"on":"off"}`} />
                            <div className="cdot" style={{ background: on ? COLORS[i%COLORS.length][0] : "rgba(255,255,255,0.18)" }} />
                            <span className="fname">{p}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="count-hint">{activeFixed.length} / {FIXED_PARTICIPANTS.length} активны</div>
                  </>
                )}
                {activeTab === "custom" && (
                  <>
                    <div className="add-row">
                      <input className="add-input" placeholder="Имя участника..." value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key==="Enter" && addCustom()} maxLength={20} />
                      <button className="add-btn" onClick={addCustom} disabled={!input.trim() || customParticipants.length >= 5}>+</button>
                    </div>
                    <div className="custom-list">
                      {customParticipants.length === 0 && <div className="empty-hint">Нет своих участников</div>}
                      {customParticipants.map((p, i) => (
                        <div className="custom-item" key={p}>
                          <div className="cdot" style={{ background: COLORS[(activeFixed.length+i)%COLORS.length][0] }} />
                          <span className="cname">{p}</span>
                          <button className="del-btn" onClick={() => removeCustom(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="count-hint">{customParticipants.length} / 5 участников</div>
                  </>
                )}
              </div>
            </div>

            {/* History panel */}
            <div className="history-panel">
              <div className="history-header">
                <div className="history-title">📜 История</div>
                {history.length > 0 && <button className="clear-btn" onClick={clearHistory}>очистить</button>}
              </div>
              <div className="history-scroll">
                <HistoryPanel history={history} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {showConfetti && <FunConfetti key={confettiKey} active={showConfetti} />}

      {showWinner && winner && (
        <div className="winner-overlay" onClick={() => setShowWinner(false)}>
          <div className="winner-card" onClick={e => e.stopPropagation()}>
            <span className="cry">😭</span>
            <div className="wlabel">Соболезнуем...</div>
            <div className="wname">{winner}</div>
            <div className="wsub">С новым годом 🎄</div>
            <button className="close-btn" onClick={() => setShowWinner(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}
