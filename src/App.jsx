import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import HistoryCard from "@/components/HistoryCard";
import HomePage from "@/components/HomePage";
import ParticipantsCard from "@/components/ParticipantsCard";
import Stage from "@/components/Stage";
import WheelCanvas from "@/components/WheelCanvas";
import WinnerResult from "@/components/WinnerResult";
import WorkGroups from "@/components/WorkGroups";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { LS, TODAY, TIME_NOW, easeOut } from "@/lib/storage";
import {
  TEAMS,
  WINNER_MEME_IMAGE,
  emptyTeamMap,
  getWinnerVisual,
  preloadWinnerMeme,
} from "@/lib/teams";
import { cn } from "@/lib/utils";

export default function WheelOfFortune() {
  const [direction, setDirection] = useState("home");
  const [activeTeam, setActiveTeam] = useState(() =>
    LS.get("wof2_activeTeam", "acquiring"),
  );
  const [activeGroupId, setActiveGroupId] = useState(() =>
    LS.get("wof2_wg_activeGroup", WORK_GROUPS[0].id),
  );
  const [fixedEnabledByTeam, setFixedEnabledByTeam] = useState(() =>
    LS.get(
      "wof2_fixedEnabledByTeam",
      emptyTeamMap((list) => Object.fromEntries(list.map((p) => [p, true]))),
    ),
  );
  const [historyByTeam, setHistoryByTeam] = useState(() =>
    LS.get("wof2_historyByTeam", emptyTeamMap([])),
  );
  const [spinning, setSpinning] = useState(false);
  const [rotationByTeam, setRotationByTeam] = useState(() =>
    LS.get("wof2_rotationByTeam", emptyTeamMap(0)),
  );
  const [winner, setWinner] = useState(null);
  const [winnerTeamId, setWinnerTeamId] = useState(null);
  const [stage, setStage] = useState("setup");
  const spinRef = useRef(null);
  const startRotation = useRef(0);

  const currentTeam = TEAMS.find((t) => t.id === activeTeam) || TEAMS[0];
  const fixedEnabled = fixedEnabledByTeam[currentTeam.id] || {};
  const history = historyByTeam[currentTeam.id] || [];
  const rotation = rotationByTeam[currentTeam.id] || 0;

  useEffect(() => {
    preloadWinnerMeme().catch(() => {});
  }, []);

  useEffect(() => {
    LS.set("wof2_direction", direction);
  }, [direction]);
  useEffect(() => {
    LS.set("wof2_activeTeam", activeTeam);
  }, [activeTeam]);
  useEffect(() => {
    LS.set("wof2_wg_activeGroup", activeGroupId);
  }, [activeGroupId]);
  useEffect(() => {
    LS.set("wof2_fixedEnabledByTeam", fixedEnabledByTeam);
  }, [fixedEnabledByTeam]);
  useEffect(() => {
    LS.set("wof2_historyByTeam", historyByTeam);
  }, [historyByTeam]);
  useEffect(() => {
    LS.set("wof2_rotationByTeam", rotationByTeam);
  }, [rotationByTeam]);

  useEffect(() => {
    setFixedEnabledByTeam((prev) => {
      const next = { ...prev };
      TEAMS.forEach((team) => {
        const map = { ...(next[team.id] || {}) };
        let changed = false;
        team.fixed.forEach((p) => {
          if (!(p in map)) {
            map[p] = true;
            changed = true;
          }
        });
        if (changed) next[team.id] = map;
      });
      return next;
    });
  }, []);

  const resetWheelFlow = () => {
    if (spinRef.current) cancelAnimationFrame(spinRef.current);
    setSpinning(false);
    setWinner(null);
    setWinnerTeamId(null);
    setStage("setup");
  };

  const goHome = () => {
    resetWheelFlow();
    setDirection("home");
  };

  const selectTeam = (id) => {
    setActiveTeam(id);
    setDirection("teams");
    resetWheelFlow();
  };

  const selectGroup = (id) => {
    setActiveGroupId(id);
    setDirection("groups");
    resetWheelFlow();
  };

  const selectProducts = () => {
    setActiveTeam("products");
    setDirection("other");
    resetWheelFlow();
  };

  const participants = currentTeam.fixed.filter((p) => fixedEnabled[p]);
  const n = participants.length;

  const spin = () => {
    if (spinning || n < 2) return;
    setWinner(null);
    setWinnerTeamId(null);
    const totalSpin = 2400 + Math.random() * 1800;
    const duration = 4200 + Math.random() * 800;
    const startTime = performance.now();
    startRotation.current = rotation;
    setSpinning(true);
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const currentRot =
        startRotation.current + (totalSpin * eased * Math.PI) / 180;
      setRotationByTeam((prev) => ({
        ...prev,
        [currentTeam.id]: currentRot,
      }));
      if (progress < 1) {
        spinRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const slice = (2 * Math.PI) / n;
        const normalized =
          ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointer = (3 * Math.PI) / 2;
        const angle =
          (((pointer - normalized) % (2 * Math.PI)) + 2 * Math.PI) %
          (2 * Math.PI);
        const idx = Math.floor(angle / slice) % n;
        setTimeout(() => {
          const winnerName = participants[idx];
          const entry = {
            winner: winnerName,
            date: TODAY(),
            time: TIME_NOW(),
            team: currentTeam.id,
          };
          setWinner(winnerName);
          setWinnerTeamId(currentTeam.id);
          setHistoryByTeam((prev) => ({
            ...prev,
            [currentTeam.id]: [...(prev[currentTeam.id] || []), entry],
          }));
          setStage("result");
        }, 300);
      }
    };
    spinRef.current = requestAnimationFrame(animate);
  };

  const toggleFixed = (name) =>
    setFixedEnabledByTeam((prev) => ({
      ...prev,
      [currentTeam.id]: {
        ...(prev[currentTeam.id] || {}),
        [name]: !prev[currentTeam.id]?.[name],
      },
    }));

  const clearHistory = () => {
    setHistoryByTeam((prev) => ({ ...prev, [currentTeam.id]: [] }));
  };

  const winnerVisual = getWinnerVisual(winnerTeamId, winner);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <img
        src={WINNER_MEME_IMAGE}
        alt=""
        aria-hidden
        className="pointer-events-none absolute size-0 overflow-hidden opacity-0"
        fetchPriority="high"
      />

      <AppHeader
        direction={direction}
        activeTeam={activeTeam}
        activeGroupId={activeGroupId}
        onGoHome={goHome}
        onSelectTeam={selectTeam}
        onSelectGroup={selectGroup}
        onSelectProducts={selectProducts}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-5 pt-20 pb-12">
        {direction === "home" ? (
          <HomePage />
        ) : direction === "groups" ? (
          <WorkGroups groupId={activeGroupId} />
        ) : stage === "setup" ? (
          <Stage key={`${activeTeam}-setup`}>
            <div
              className={cn(
                "mb-3 flex items-center justify-between gap-3 px-1",
                APPEAR,
              )}
              style={appearDelay(0)}
            >
              <p className="min-w-0 truncate text-sm text-muted-foreground">
                {currentTeam.label}
              </p>
              <Badge className="border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400">
                {n} из {currentTeam.fixed.length}
              </Badge>
            </div>
            <ParticipantsCard
              currentTeam={currentTeam}
              fixedEnabled={fixedEnabled}
              onToggleFixed={toggleFixed}
            />
            <Button
              type="button"
              size="lg"
              className={cn("mt-3 h-11 w-full", APPEAR)}
              style={appearDelay(currentTeam.fixed.length, { base: 45 })}
              onClick={() => setStage("spin")}
              disabled={n < 2}
            >
              К колесу
              <ArrowRight />
            </Button>
            {n < 2 && (
              <p
                className={cn(
                  "mt-2 text-center text-xs text-muted-foreground",
                  APPEAR,
                )}
              >
                Нужно минимум двое участников
              </p>
            )}
          </Stage>
        ) : stage === "spin" ? (
          <Stage key={`${activeTeam}-spin`} wide>
            <div
              className={cn(
                "relative mb-4 flex w-full items-center justify-center self-stretch",
                APPEAR,
              )}
              style={appearDelay(0)}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-0"
                onClick={() => setStage("setup")}
                disabled={spinning}
              >
                <ArrowLeft />
                Состав
              </Button>
              <p className="text-sm font-medium">{currentTeam.label}</p>
            </div>
            <WheelCanvas participants={participants} rotation={rotation} />
            <Button
              type="button"
              size="lg"
              className={cn(
                "mt-7 h-11 px-8 text-base motion-reduce:transition-none",
                APPEAR,
              )}
              style={appearDelay(2)}
              onClick={spin}
              disabled={spinning || n < 2}
            >
              {spinning ? "Крутится…" : "Крутить"}
            </Button>
          </Stage>
        ) : (
          <Stage key={`${activeTeam}-result`}>
            <WinnerResult
              winner={winner}
              visual={winnerVisual}
              onAgain={() => {
                setWinner(null);
                setWinnerTeamId(null);
                setStage("spin");
              }}
              onEdit={() => {
                setWinner(null);
                setWinnerTeamId(null);
                setStage("setup");
              }}
            />
            <div className={cn("mt-6 w-full", APPEAR)} style={appearDelay(4)}>
              <HistoryCard history={history} onClear={clearHistory} />
            </div>
          </Stage>
        )}
      </main>
    </div>
  );
}
