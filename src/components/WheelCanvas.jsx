import { useCallback, useEffect, useRef } from "react";
import { APPEAR, appearDelay } from "@/lib/appear";
import { COLORS, WHEEL_SIZE } from "@/lib/teams";
import { cn } from "@/lib/utils";

function drawWheel(ctx, rotation, participants) {
  const n = participants.length;
  if (n === 0) return;

  const cx = WHEEL_SIZE / 2;
  const cy = WHEEL_SIZE / 2;
  const r = WHEEL_SIZE / 2 - 12;
  const slice = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = "#171717";
  ctx.fill();
  ctx.restore();

  for (let i = 0; i < n; i++) {
    const start = rotation + i * slice;
    const end = start + slice;
    const [c1, c2] = COLORS[i % COLORS.length];
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, c2);
    grad.addColorStop(1, c1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fafafa";
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 3;
    const fontSize = Math.min(15, Math.max(9, 200 / n));
    ctx.font = `500 ${fontSize}px "Geist Variable", Geist, sans-serif`;
    const name =
      participants[i].length > 17
        ? participants[i].slice(0, 16) + "…"
        : participants[i];
    ctx.fillText(name, r - 16, fontSize / 3);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#e5e5e5";
  ctx.shadowColor = "rgba(0,0,0,0.16)";
  ctx.shadowBlur = 4;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export default function WheelCanvas({ participants, rotation }) {
  const canvasRef = useRef(null);

  const paint = useCallback(
    (ctx, rot) => drawWheel(ctx, rot, participants),
    [participants],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paint(canvas.getContext("2d"), rotation);
  }, [paint, rotation]);

  return (
    <div
      className={cn(
        "relative aspect-square w-[min(92vw,360px)] lg:w-[560px]",
        APPEAR,
      )}
      style={appearDelay(1)}
    >
      <div
        aria-hidden
        className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-0.5 border-x-8 border-t-[18px] border-x-transparent border-t-primary"
      />
      <canvas
        ref={canvasRef}
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        className="size-full rounded-full ring-1 ring-border"
      />
    </div>
  );
}
