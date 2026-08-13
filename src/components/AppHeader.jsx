import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import HeaderTimer from "@/components/HeaderTimer";
import ThemeToggle from "@/components/ThemeToggle";
import echpochmarik from "@/assets/echpochmarik.png";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

export default function AppHeader({
  direction,
  activeTeam,
  activeGroupId,
  onGoHome,
  onSelectTeam,
  onSelectGroup,
  onSelectProducts,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5">
        <button
          type="button"
          onClick={onGoHome}
          aria-label="На главную"
          className={cn(
            "-ml-1.5 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 font-heading text-sm font-medium tracking-tight hover:bg-muted",
            APPEAR,
          )}
          style={appearDelay(0)}
        >
          <img
            src={echpochmarik}
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
          Эчпочмарик
        </button>
        <div className="flex items-center gap-2">
          <span className={APPEAR} style={appearDelay(1)}>
            <HeaderTimer />
          </span>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger
                className={cn(direction === "teams" && "bg-muted", APPEAR)}
                style={appearDelay(2)}
              >
                Синки команд
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarRadioGroup
                  value={direction === "teams" ? activeTeam : ""}
                >
                  {TEAM_SYNC_TEAMS.map((team, i) => (
                    <MenubarRadioItem
                      key={team.id}
                      value={team.id}
                      className={APPEAR}
                      style={appearDelay(i)}
                      onClick={() => onSelectTeam(team.id)}
                    >
                      {team.label}
                    </MenubarRadioItem>
                  ))}
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger
                className={cn(direction === "groups" && "bg-muted", APPEAR)}
                style={appearDelay(3)}
              >
                Синки РГ
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarRadioGroup
                  value={direction === "groups" ? activeGroupId : ""}
                >
                  {WORK_GROUPS.map((group, i) => (
                    <MenubarRadioItem
                      key={group.id}
                      value={group.id}
                      className={APPEAR}
                      style={appearDelay(i)}
                      onClick={() => onSelectGroup(group.id)}
                    >
                      {group.name}
                    </MenubarRadioItem>
                  ))}
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger
                className={cn(direction === "other" && "bg-muted", APPEAR)}
                style={appearDelay(4)}
                onClick={onSelectProducts}
              >
                Синки продактов
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
