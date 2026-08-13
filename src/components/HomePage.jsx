import { ArrowRight, ArrowUpRight, Briefcase, Dices, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import echpochmarik from "@/assets/echpochmarik.png";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "teams",
    icon: Dices,
    title: "Синки команд",
    description:
      "Колесо выбирает следующего спикера — без споров и «ну давай ты».",
    meta: TEAM_SYNC_TEAMS.map((team) => team.label).join(" · "),
  },
  {
    id: "groups",
    icon: Users,
    title: "Синки РГ",
    description:
      "Перемешивает состав и ставит срочные темы первыми, чтобы важное не уехало в конец.",
    meta: `${WORK_GROUPS.length} рабочих групп`,
  },
  {
    id: "products",
    icon: Briefcase,
    title: "Синки продактов",
    description: "Тот же ритуал, но со своим составом.",
    meta: "Продакты",
  },
];

export default function HomePage({
  onSelectTeam,
  onSelectGroup,
  onSelectProducts,
}) {
  const openSection = (id) => {
    if (id === "teams") onSelectTeam(TEAM_SYNC_TEAMS[0].id);
    else if (id === "groups") onSelectGroup(WORK_GROUPS[0].id);
    else onSelectProducts();
  };

  return (
    <div className="flex w-full max-w-[860px] flex-col items-center">
      <section
        className={cn("flex flex-col items-center text-center", APPEAR)}
        style={appearDelay(0)}
      >
        <img
          src={echpochmarik}
          alt="Эчпочмарик"
          width={128}
          height={128}
          className="size-24 rounded-full bg-black ring-1 ring-foreground/10 sm:size-32"
        />
        <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          Эчпочмарик
        </h1>
        <p className="mt-3 max-w-[26rem] text-base text-muted-foreground text-balance sm:text-[1.05rem]">
          Помощник для синков. Выбирает, кто говорит, и держит порядок
          выступлений.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={() => openSection("teams")}>
            Синки команд
            <ArrowRight />
          </Button>
          <Button variant="outline" onClick={() => openSection("groups")}>
            Синки РГ
          </Button>
        </div>
      </section>

      <section className="mt-10 grid w-full gap-3 sm:mt-12 sm:grid-cols-3">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={() => openSection(section.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openSection(section.id);
                }
              }}
              className={cn(
                "cursor-pointer py-5 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50",
                APPEAR,
              )}
              style={appearDelay(i + 1)}
            >
              <CardHeader className="gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-[15px]">{section.title}</CardTitle>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {section.description}
                </CardDescription>
                <p className="pt-1 text-xs text-muted-foreground">
                  {section.meta}
                </p>
              </CardHeader>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
