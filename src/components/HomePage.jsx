import Link from "@/components/Link";
import echpochmarik from "@/assets/echpochmarik.png";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { paths } from "@/lib/routes";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

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
      </section>

      <section className="mt-10 grid w-full gap-8 sm:mt-12 sm:grid-cols-3">
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(1)}>
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
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(2)}>
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
        <div className={cn("flex flex-col gap-1", APPEAR)} style={appearDelay(3)}>
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
