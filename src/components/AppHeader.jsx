import { useRef, useState } from "react";
import { Check, Menu } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "@/components/Link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HeaderTimer from "@/components/HeaderTimer";
import ThemeToggle from "@/components/ThemeToggle";
import echpochmarik from "@/assets/echpochmarik.png";
import { WORK_GROUPS } from "@/data/workGroups";
import { APPEAR, appearDelay } from "@/lib/appear";
import { navigate, paths } from "@/lib/routes";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

const MENU_CLOSE_DELAY = 120;

function MobileNavItem({ selected, to, onSelect, children }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-left text-sm",
        selected ? "bg-muted font-medium" : "hover:bg-muted/50",
      )}
      onClick={onSelect}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {selected && <Check className="size-4 shrink-0" />}
    </Link>
  );
}

function MobileNav({ direction, activeTeam, activeGroupId }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Открыть меню"
          className="h-8 w-8 bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)] gap-0">
        <SheetHeader className="pr-12">
          <SheetTitle>Навигация</SheetTitle>
          <SheetDescription>Синки команд, рабочих групп и продактов</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <section className="flex flex-col gap-1">
            <h3 className="px-2 text-xs font-medium text-muted-foreground">
              Синки команд
            </h3>
            {TEAM_SYNC_TEAMS.map((team) => (
              <MobileNavItem
                key={team.id}
                to={paths.team(team.id)}
                selected={direction === "teams" && activeTeam === team.id}
                onSelect={close}
              >
                {team.label}
              </MobileNavItem>
            ))}
          </section>
          <Separator />
          <section className="flex flex-col gap-1">
            <h3 className="px-2 text-xs font-medium text-muted-foreground">
              Синки РГ
            </h3>
            {WORK_GROUPS.map((group) => (
              <MobileNavItem
                key={group.id}
                to={paths.group(group.id)}
                selected={direction === "groups" && activeGroupId === group.id}
                onSelect={close}
              >
                {group.name}
              </MobileNavItem>
            ))}
          </section>
          <Separator />
          <section className="flex flex-col gap-1">
            <MobileNavItem
              to={paths.products}
              selected={direction === "products"}
              onSelect={close}
            >
              Синки продактов
            </MobileNavItem>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AppHeader({ direction, activeTeam, activeGroupId }) {
  const [openMenu, setOpenMenu] = useState("");
  const closeTimer = useRef(null);

  const open = (value) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(value);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(""), MENU_CLOSE_DELAY);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5">
        <Link
          to={paths.home}
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
            className="size-6 rounded-full bg-black"
          />
          Эчпочмарик
        </Link>
        <div className="flex items-center gap-2">
          <span className={APPEAR} style={appearDelay(1)}>
            <HeaderTimer />
          </span>
          <div className="hidden md:block">
            <Menubar value={openMenu} onValueChange={setOpenMenu} modal={false}>
              <MenubarMenu value="teams">
                <MenubarTrigger
                  className={cn(direction === "teams" && "bg-muted", APPEAR)}
                  style={appearDelay(2)}
                  onPointerEnter={() => open("teams")}
                  onPointerLeave={scheduleClose}
                >
                  Синки команд
                </MenubarTrigger>
                <MenubarContent
                  align="end"
                  onPointerEnter={() => open("teams")}
                  onPointerLeave={scheduleClose}
                >
                  <MenubarRadioGroup
                    value={direction === "teams" ? activeTeam : ""}
                  >
                    {TEAM_SYNC_TEAMS.map((team, i) => (
                      <MenubarRadioItem
                        key={team.id}
                        value={team.id}
                        className={APPEAR}
                        style={appearDelay(i)}
                        onClick={() => navigate(paths.team(team.id))}
                      >
                        {team.label}
                      </MenubarRadioItem>
                    ))}
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu value="groups">
                <MenubarTrigger
                  className={cn(direction === "groups" && "bg-muted", APPEAR)}
                  style={appearDelay(3)}
                  onPointerEnter={() => open("groups")}
                  onPointerLeave={scheduleClose}
                >
                  Синки РГ
                </MenubarTrigger>
                <MenubarContent
                  align="end"
                  onPointerEnter={() => open("groups")}
                  onPointerLeave={scheduleClose}
                >
                  <MenubarRadioGroup
                    value={direction === "groups" ? activeGroupId : ""}
                  >
                    {WORK_GROUPS.map((group, i) => (
                      <MenubarRadioItem
                        key={group.id}
                        value={group.id}
                        className={APPEAR}
                        style={appearDelay(i)}
                        onClick={() => navigate(paths.group(group.id))}
                      >
                        {group.name}
                      </MenubarRadioItem>
                    ))}
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu value="products">
                <MenubarTrigger
                  className={cn(direction === "products" && "bg-muted", APPEAR)}
                  style={appearDelay(4)}
                  onClick={() => navigate(paths.products)}
                  onPointerEnter={scheduleClose}
                >
                  Синки продактов
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
          </div>
          <MobileNav
            direction={direction}
            activeTeam={activeTeam}
            activeGroupId={activeGroupId}
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
