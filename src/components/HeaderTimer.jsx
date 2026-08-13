import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { APPEAR, appearDelay } from "@/lib/appear";
import { cn } from "@/lib/utils";

const DEFAULT_SEC = 5 * 60;
const MAX_MINUTES = 99;
const TIME_SLOT = "00:00:00";
const PRESETS = [
  { label: "1 мин", sec: 60 },
  { label: "5 мин", sec: 300 },
  { label: "10 мин", sec: 600 },
  { label: "15 мин", sec: 900 },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(ms) {
  const total = Math.max(0, ms);
  const totalSec = Math.floor(total / 1000);
  const centiseconds = Math.floor((total % 1000) / 10);
  return `${pad(Math.floor(totalSec / 60))}:${pad(totalSec % 60)}:${pad(centiseconds)}`;
}

function clampDuration(minutes, seconds) {
  const m = Math.min(MAX_MINUTES, Math.max(0, minutes));
  const s = Math.min(59, Math.max(0, seconds));
  return { minutes: m, seconds: s, totalMs: (m * 60 + s) * 1000 };
}

function TimeReadout({ ms, className }) {
  return (
    <span className={cn("relative inline-block tabular-nums", className)}>
      <span className="invisible" aria-hidden="true">
        {TIME_SLOT}
      </span>
      <span className="absolute inset-0">{formatTime(ms)}</span>
    </span>
  );
}

export default function HeaderTimer({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [durationMs, setDurationMs] = useState(DEFAULT_SEC * 1000);
  const [remainingMs, setRemainingMs] = useState(DEFAULT_SEC * 1000);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const endsAtRef = useRef(null);

  const fieldsLocked = status === "running" || status === "finished";
  const displayMs = status === "idle" ? durationMs : remainingMs;
  const presetValue = PRESETS.some((p) => p.sec * 1000 === durationMs)
    ? String(durationMs / 1000)
    : "";

  useEffect(() => {
    if (status !== "running") return undefined;
    let frame = 0;
    const tick = () => {
      const left = Math.max(0, (endsAtRef.current ?? 0) - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        setStatus("finished");
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [status]);

  const applyDuration = (nextMinutes, nextSeconds) => {
    const next = clampDuration(nextMinutes, nextSeconds);
    setMinutes(next.minutes);
    setSeconds(next.seconds);
    setDurationMs(next.totalMs);
    if (status === "idle") setRemainingMs(next.totalMs);
  };

  const start = () => {
    if (durationMs < 1000 && status !== "paused") return;
    const base = status === "paused" ? remainingMs : durationMs;
    if (base < 1) return;
    endsAtRef.current = Date.now() + base;
    setRemainingMs(base);
    setStatus("running");
    setOpen(false);
  };

  const pause = () => {
    const left = Math.max(0, (endsAtRef.current ?? 0) - Date.now());
    setRemainingMs(left);
    setStatus("paused");
  };

  const reset = () => {
    endsAtRef.current = null;
    setStatus("idle");
    setRemainingMs(durationMs);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={status === "finished" ? "destructive" : "outline"}
          size={compact ? "icon" : "sm"}
          aria-label={`Таймер ${formatTime(displayMs)}`}
          className={cn(
            compact
              ? "h-8 w-8"
              : "h-8 w-8 gap-0 px-0 font-medium tabular-nums md:w-auto md:gap-1.5 md:px-2.5",
            status === "finished"
              ? "bg-destructive text-white hover:bg-destructive dark:bg-destructive dark:text-white dark:hover:bg-destructive"
              : "bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted aria-expanded:bg-muted",
            status === "paused" && "text-muted-foreground",
          )}
        >
          <Timer />
          {!compact && (
            <TimeReadout className="hidden md:inline-block" ms={displayMs} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className={APPEAR} style={appearDelay(0)}>
          <DialogTitle>Таймер</DialogTitle>
          <DialogDescription>
            {status === "finished"
              ? "Время вышло"
              : "Выберите длительность и запустите отсчёт"}
          </DialogDescription>
        </DialogHeader>

        <div className={APPEAR} style={appearDelay(1)}>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            className="w-full"
            value={presetValue}
            disabled={fieldsLocked}
            onValueChange={(value) => {
              if (!value) return;
              const total = Number(value);
              applyDuration(Math.floor(total / 60), total % 60);
            }}
          >
            {PRESETS.map((preset) => (
              <ToggleGroupItem
                key={preset.sec}
                value={String(preset.sec)}
                className="flex-1"
              >
                {preset.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div
          className={cn("grid grid-cols-2 gap-2", APPEAR)}
          style={appearDelay(2)}
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Минуты</span>
            <Input
              type="number"
              min={0}
              max={MAX_MINUTES}
              inputMode="numeric"
              disabled={fieldsLocked}
              value={minutes}
              onChange={(e) =>
                applyDuration(Number(e.target.value) || 0, seconds)
              }
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Секунды</span>
            <Input
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              disabled={fieldsLocked}
              value={seconds}
              onChange={(e) =>
                applyDuration(minutes, Number(e.target.value) || 0)
              }
            />
          </label>
        </div>

        <p
          className={cn(
            "text-center font-heading text-2xl tabular-nums",
            APPEAR,
          )}
          style={appearDelay(3)}
        >
          <TimeReadout ms={displayMs} />
        </p>

        <DialogFooter className={APPEAR} style={appearDelay(4)}>
          {status === "idle" && (
            <Button
              type="button"
              className={APPEAR}
              onClick={start}
              disabled={durationMs < 1000}
            >
              Запустить
            </Button>
          )}
          {status === "running" && (
            <>
              <Button
                type="button"
                variant="outline"
                className={APPEAR}
                onClick={reset}
              >
                Сбросить
              </Button>
              <Button type="button" className={APPEAR} onClick={pause}>
                Пауза
              </Button>
            </>
          )}
          {status === "paused" && (
            <>
              <Button
                type="button"
                variant="outline"
                className={APPEAR}
                onClick={reset}
              >
                Сбросить
              </Button>
              <Button type="button" className={APPEAR} onClick={start}>
                Продолжить
              </Button>
            </>
          )}
          {status === "finished" && (
            <Button type="button" onClick={reset} className={APPEAR}>
              Сбросить
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
