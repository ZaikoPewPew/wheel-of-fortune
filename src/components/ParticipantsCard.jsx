import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { APPEAR, appearDelay } from "@/lib/appear";
import { cn } from "@/lib/utils";

export default function ParticipantsCard({
  currentTeam,
  fixedEnabled,
  onToggleFixed,
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex max-h-[min(420px,calc(100svh-22rem))] flex-col gap-0.5 overflow-y-auto">
          {currentTeam.fixed.map((name, i) => {
            const on = !!fixedEnabled[name];
            return (
              <label
                key={name}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50",
                  APPEAR,
                )}
                style={appearDelay(i, { base: 45 })}
              >
                <Switch
                  checked={on}
                  onCheckedChange={() => onToggleFixed(name)}
                />
                <span
                  className={
                    on
                      ? "min-w-0 flex-1 truncate text-sm font-medium"
                      : "min-w-0 flex-1 truncate text-sm text-muted-foreground"
                  }
                >
                  {name}
                </span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
