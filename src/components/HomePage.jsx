import { ArrowRight, ArrowUpRight, Briefcase, Dices, Users } from "lucide-react";
import Link from "@/components/Link";
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
import { paths } from "@/lib/routes";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "teams",
    to: paths.team(TEAM_SYNC_TEAMS[0].id),
    icon: Dices,
    title: "Синки команд",
    description:
      "Колесо выбирает следующего спикера — без споров и «ну давай ты».",
    meta: TEAM_SYNC_TEAMS.map((team) => team.label).join(" · "),
  },
  {
    id: "groups",
    to: paths.group(WORK_GROUPS[0].id),
    icon: Users,
    title: "Синки РГ",
    description:
      "Перемешивает состав и ставит срочные темы первыми, чтобы важное не уехало в конец.",
    meta: `${WORK_GROUPS.length} рабочих групп`,
  },
  {
    id: "products",
    to: paths.products,
    icon: Briefcase,
    title: "Синки продактов",
    description: "Тот же ритуал, но со своим составом.",
    meta: "Продакты",
  },
];

export default function HomePage() {
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
          <Button asChild>
            <Link to={paths.team(TEAM_SYNC_TEAMS[0].id)}>
              Синки команд
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={paths.group(WORK_GROUPS[0].id)}>Синки РГ</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10 grid w-full gap-3 sm:mt-12 sm:grid-cols-3">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              to={section.to}
              className={cn("block rounded-xl", APPEAR)}
              style={appearDelay(i + 1)}
            >
              <Card className="h-full py-5 transition-colors hover:bg-muted/50">
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
            </Link>
          );
        })}
      </section>

      <section className="mt-10 grid w-full gap-8 sm:mt-12 sm:grid-cols-3">
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(4)}>
          <h2 className="px-1 text-xs font-medium text-muted-foreground">
            Синки команд
          </h2>
          {TEAM_SYNC_TEAMS.map((team) => (
            <Link
              key={team.id}
              to={paths.team(team.id)}
              className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5 text-sm hover:bg-muted"
            >
              <span>{team.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                /teams/{team.id}
              </span>
            </Link>
          ))}
        </div>
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(5)}>
          <h2 className="px-1 text-xs font-medium text-muted-foreground">
            Синки РГ
          </h2>
          {WORK_GROUPS.map((group) => (
            <Link
              key={group.id}
              to={paths.group(group.id)}
              className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5 text-sm hover:bg-muted"
            >
              <span className="min-w-0 truncate">{group.name}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                /groups/{group.id}
              </span>
            </Link>
          ))}
        </div>
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(6)}>
          <h2 className="px-1 text-xs font-medium text-muted-foreground">
            Другое
          </h2>
          <Link
            to={paths.products}
            className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5 text-sm hover:bg-muted"
          >
            <span>Продакты</span>
            <span className="font-mono text-xs text-muted-foreground">
              /products
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
