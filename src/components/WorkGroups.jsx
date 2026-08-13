import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Flame, Shuffle } from "lucide-react";
import Stage from "@/components/Stage";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { LS } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const SHUFFLE_MS = 2800;

function defaultEnabled() {
  return Object.fromEntries(
    WORK_GROUPS.map((g) => [
      g.id,
      Object.fromEntries(g.members.map((m) => [m.name, true])),
    ]),
  );
}

function defaultCritical() {
  return Object.fromEntries(
    WORK_GROUPS.map((g) => [
      g.id,
      Object.fromEntries(g.members.map((m) => [m.name, false])),
    ]),
  );
}

function defaultOrder() {
  return Object.fromEntries(WORK_GROUPS.map((g) => [g.id, []]));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function leadLabel(leads) {
  return leads.map((l) => l.name).join(", ");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function urgentLabel(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} срочная тема`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} срочных темы`;
  }
  return `${n} срочных тем`;
}

function slotTransform(i) {
  if (i === 0) return "translate(-50%, -50%)";
  return `translate(-50%, -50%) translateY(${i * 4}px) rotate(${(i - 1) * 1.4}deg)`;
}

function animateTo(el, keyframes, options) {
  for (const anim of el.getAnimations()) {
    try {
      anim.commitStyles();
    } catch {
      /* ignore */
    }
    anim.cancel();
  }
  return el.animate(keyframes, options);
}

function ShuffleDeck({ members }) {
  const rootRef = useRef(null);
  const deck = members.slice(0, 8);
  const reduceMotion = prefersReducedMotion() || deck.length < 2;

  useEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.children];
    if (els.length < 2) return;

    let cancelled = false;
    let dir = 1;
    let order = els.map((_, i) => i);
    let apexTimer = 0;

    const cycle = () => {
      if (cancelled) return;
      const n = order.length;
      const topIdx = order[0];
      const rest = order.slice(1);
      const el = els[topIdx];

      el.style.zIndex = String(n + 1);

      const out = animateTo(
        el,
        [
          { transform: slotTransform(0), offset: 0 },
          {
            transform: `translate(-50%, -50%) translateX(${dir * 100}px) translateY(-18px) rotate(${dir * 12}deg)`,
            offset: 0.45,
          },
          {
            transform: `translate(-50%, -50%) translateX(${dir * 36}px) translateY(8px) rotate(${dir * 4}deg) scale(0.98)`,
            offset: 0.72,
          },
          { transform: slotTransform(rest.length), offset: 1 },
        ],
        {
          duration: 650,
          easing: "cubic-bezier(0.45, 0, 0.15, 1)",
          fill: "forwards",
        },
      );

      apexTimer = window.setTimeout(() => {
        if (cancelled) return;
        el.style.zIndex = "0";
        rest.forEach((idx, i) => {
          els[idx].style.zIndex = String(n - i);
          animateTo(els[idx], [{ transform: slotTransform(i) }], {
            duration: 360,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          });
        });
      }, 290);

      out.finished.then(
        () => {
          if (cancelled) return;
          order = [...rest, topIdx];
          dir *= -1;
          cycle();
        },
        () => {},
      );
    };

    cycle();

    return () => {
      cancelled = true;
      window.clearTimeout(apexTimer);
      els.forEach((node) => {
        for (const anim of node.getAnimations()) anim.cancel();
      });
    };
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="relative h-64 w-full max-w-[340px] overflow-visible"
    >
      {deck.map((m, i) => (
        <div
          key={m.name}
          className="shuffle-card absolute w-56 rounded-xl bg-card px-4 py-3.5 text-center shadow-lg ring-1 ring-foreground/10"
          style={{
            zIndex: deck.length - i,
            transform: slotTransform(i),
          }}
        >
          <div className="truncate text-sm font-medium">{m.name}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {m.team}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderSlot({ slot, index, animate, done, onToggleDone }) {
  return (
    <li
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 transition-colors duration-200",
        done
          ? "bg-emerald-500/18 ring-emerald-500/35"
          : slot.critical
            ? "bg-orange-500/18 ring-orange-500/35"
            : "bg-card ring-foreground/10 hover:bg-muted/40",
        animate && APPEAR,
      )}
      style={animate ? appearDelay(index, { base: 45 }) : undefined}
      onClick={onToggleDone}
    >
      <span
        className={cn(
          "w-6 shrink-0 text-center text-sm font-medium tabular-nums",
          done
            ? "text-emerald-600"
            : slot.critical
              ? "text-orange-600"
              : "text-muted-foreground",
        )}
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{slot.name}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">
          {slot.team}
        </div>
      </div>
      {done ? (
        <Check className={cn("size-3.5 shrink-0 text-emerald-500", APPEAR)} />
      ) : (
        slot.critical && (
          <Flame
            className={cn(
              "size-3.5 shrink-0 fill-current text-orange-500",
              APPEAR,
            )}
          />
        )
      )}
    </li>
  );
}

export default function WorkGroups({ groupId }) {
  const [activeGroupId, setActiveGroupId] = useState(
    () => groupId || LS.get("wof2_wg_activeGroup", WORK_GROUPS[0].id),
  );
  const [enabledByGroup, setEnabledByGroup] = useState(() =>
    LS.get("wof2_wg_enabled", defaultEnabled()),
  );
  const [criticalByGroup, setCriticalByGroup] = useState(() =>
    LS.get("wof2_wg_critical", defaultCritical()),
  );
  const [orderByGroup, setOrderByGroup] = useState(() =>
    LS.get("wof2_wg_order", defaultOrder()),
  );
  const [stage, setStage] = useState("setup");
  const [shuffleTick, setShuffleTick] = useState(0);
  const [doneByName, setDoneByName] = useState({});
  const shuffleTimer = useRef(null);

  const currentGroup =
    WORK_GROUPS.find((g) => g.id === activeGroupId) || WORK_GROUPS[0];
  const enabled = enabledByGroup[currentGroup.id] || {};
  const critical = criticalByGroup[currentGroup.id] || {};
  const order = orderByGroup[currentGroup.id] || [];
  const present = currentGroup.members.filter((m) => enabled[m.name]);
  const presentCount = present.length;
  const criticalCount = present.filter((m) => critical[m.name]).length;

  useEffect(() => {
    setEnabledByGroup((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const g of WORK_GROUPS) {
        const map = { ...(next[g.id] || {}) };
        for (const m of g.members) {
          if (map[m.name] === undefined) {
            map[m.name] = true;
            changed = true;
          }
        }
        next[g.id] = map;
      }
      return changed ? next : prev;
    });
    setCriticalByGroup((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const g of WORK_GROUPS) {
        const map = { ...(next[g.id] || {}) };
        for (const m of g.members) {
          if (map[m.name] === undefined) {
            map[m.name] = false;
            changed = true;
          }
        }
        next[g.id] = map;
      }
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    if (groupId) setActiveGroupId(groupId);
  }, [groupId]);

  useEffect(() => {
    if (shuffleTimer.current) {
      clearTimeout(shuffleTimer.current);
      shuffleTimer.current = null;
    }
    setStage("setup");
  }, [activeGroupId]);

  useEffect(() => {
    LS.set("wof2_wg_activeGroup", activeGroupId);
  }, [activeGroupId]);
  useEffect(() => {
    LS.set("wof2_wg_enabled", enabledByGroup);
  }, [enabledByGroup]);
  useEffect(() => {
    LS.set("wof2_wg_critical", criticalByGroup);
  }, [criticalByGroup]);
  useEffect(() => {
    LS.set("wof2_wg_order", orderByGroup);
  }, [orderByGroup]);

  useEffect(() => {
    return () => {
      if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
    };
  }, []);

  const toggleEnabled = (name) => {
    const turningOff = !!enabled[name];
    setEnabledByGroup((prev) => ({
      ...prev,
      [currentGroup.id]: {
        ...(prev[currentGroup.id] || {}),
        [name]: !prev[currentGroup.id]?.[name],
      },
    }));
    if (turningOff) {
      setCriticalByGroup((prev) => ({
        ...prev,
        [currentGroup.id]: {
          ...(prev[currentGroup.id] || {}),
          [name]: false,
        },
      }));
    }
  };

  const toggleCritical = (name) => {
    setCriticalByGroup((prev) => ({
      ...prev,
      [currentGroup.id]: {
        ...(prev[currentGroup.id] || {}),
        [name]: !prev[currentGroup.id]?.[name],
      },
    }));
  };

  const shuffleOrder = () => {
    if (present.length === 0) return;
    const crit = shuffle(present.filter((m) => critical[m.name]));
    const rest = shuffle(present.filter((m) => !critical[m.name]));
    const next = [...crit, ...rest].map((m) => ({
      name: m.name,
      team: m.team,
      critical: !!critical[m.name],
    }));
    setOrderByGroup((prev) => ({ ...prev, [currentGroup.id]: next }));
    setDoneByName({});
    setShuffleTick((t) => t + 1);
    setStage("shuffling");
    if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
    shuffleTimer.current = setTimeout(
      () => setStage("result"),
      prefersReducedMotion() ? 0 : SHUFFLE_MS,
    );
  };

  const toggleDone = (name) => {
    setDoneByName((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const backToSetup = () => {
    if (shuffleTimer.current) {
      clearTimeout(shuffleTimer.current);
      shuffleTimer.current = null;
    }
    setStage("setup");
  };

  return (
    <>
      {stage === "setup" && (
        <Stage key="setup">
          <div
            className={cn(
              "mb-3 flex items-center justify-between gap-3 px-1",
              APPEAR,
            )}
            style={appearDelay(0)}
          >
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              Лид —{" "}
              <span className="font-medium text-foreground">
                {leadLabel(currentGroup.leads)}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge className="border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400">
                {presentCount} из {currentGroup.members.length}
              </Badge>
              {criticalCount > 0 && (
                <Badge
                  className={cn(
                    "border-transparent bg-orange-500/15 text-orange-700 dark:text-orange-400",
                    APPEAR,
                  )}
                >
                  {urgentLabel(criticalCount)}
                </Badge>
              )}
            </div>
          </div>

          <Card>
            <CardContent>
              <div className="flex max-h-[min(420px,calc(100svh-22rem))] flex-col gap-0.5 overflow-y-auto">
                  {currentGroup.members.map((m, i) => {
                    const on = !!enabled[m.name];
                    const isCrit = !!critical[m.name];
                    return (
                      <div
                        key={m.name}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50",
                          APPEAR,
                        )}
                        style={appearDelay(i, { base: 45 })}
                        onClick={() => toggleEnabled(m.name)}
                      >
                        <Switch
                          checked={on}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() => toggleEnabled(m.name)}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className={
                              on
                                ? "truncate text-sm font-medium"
                                : "truncate text-sm text-muted-foreground"
                            }
                          >
                            {m.name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {m.team}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant={isCrit ? "secondary" : "ghost"}
                          size="icon-sm"
                          disabled={!on}
                          title={
                            isCrit ? "Тема критичная" : "Пометить как критичную"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCritical(m.name);
                          }}
                        >
                          <Flame
                            className={
                              isCrit ? "fill-current text-orange-500" : ""
                            }
                          />
                          <span className="sr-only">
                            {isCrit
                              ? "Снять критичность"
                              : "Пометить как критичную"}
                          </span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
            </CardContent>
          </Card>

          <Button
            type="button"
            size="lg"
            className={cn(
              "mt-3 h-11 w-full motion-reduce:transition-none",
              APPEAR,
            )}
            style={appearDelay(currentGroup.members.length, { base: 45 })}
            onClick={shuffleOrder}
            disabled={presentCount < 1}
          >
            <Shuffle />
            Перемешать
          </Button>
        </Stage>
      )}

      {stage === "shuffling" && (
        <Stage key="shuffling">
          <div
            className={cn(
              "flex min-h-[320px] items-center justify-center",
              APPEAR,
            )}
          >
            <ShuffleDeck members={present} />
          </div>
        </Stage>
      )}

      {stage === "result" && (
        <Stage key={`result-${shuffleTick}`}>
          <div
            className={cn(
              "mb-3 flex items-center justify-between gap-3 px-1",
              APPEAR,
            )}
            style={appearDelay(0)}
          >
            <Button
              type="button"
              variant="ghost"
              className="-ml-2 h-7 px-2 text-sm font-medium"
              onClick={backToSetup}
            >
              <ArrowLeft />
              Состав
            </Button>
            <p className="text-sm font-medium">Порядок выступлений</p>
          </div>

          <ol className="flex max-h-[min(520px,calc(100svh-16rem))] flex-col gap-2 overflow-y-auto p-0.5">
            {order.map((slot, i) => (
              <OrderSlot
                key={`${shuffleTick}-${slot.name}`}
                slot={slot}
                index={i}
                animate
                done={!!doneByName[slot.name]}
                onToggleDone={() => toggleDone(slot.name)}
              />
            ))}
          </ol>

          <Button
            type="button"
            size="lg"
            className={cn(
              "mt-3 h-11 w-full motion-reduce:transition-none",
              APPEAR,
            )}
            style={appearDelay(order.length, { base: 45 })}
            onClick={shuffleOrder}
          >
            <Shuffle />
            Перемешать снова
          </Button>
        </Stage>
      )}
    </>
  );
}
