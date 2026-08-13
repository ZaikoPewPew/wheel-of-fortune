import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TODAY } from "@/lib/storage";
import { APPEAR, appearDelay } from "@/lib/appear";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function labelDate(d) {
  const today = TODAY();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  if (d === today) return "Сегодня";
  if (d === yStr) return "Вчера";
  return d;
}

function HistoryList({ history }) {
  const byDate = {};
  [...history].reverse().forEach((entry) => {
    if (!byDate[entry.date]) byDate[entry.date] = [];
    byDate[entry.date].push(entry);
  });
  const dates = Object.keys(byDate);

  if (dates.length === 0) {
    return (
      <p
        className={cn(
          "py-8 text-center text-sm text-muted-foreground",
          APPEAR,
        )}
      >
        История пока пуста
      </p>
    );
  }

  let row = 0;

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date} className="space-y-1">
          <div
            className={cn(
              "text-xs font-medium tracking-wide text-muted-foreground uppercase",
              APPEAR,
            )}
            style={appearDelay(row++)}
          >
            {labelDate(date)}
          </div>
          <Separator />
          {byDate[date].map((entry, i) => (
            <div
              key={`${entry.time}-${entry.winner}-${i}`}
              className={cn(
                "flex items-center gap-3 rounded-md px-1 py-1.5",
                APPEAR,
              )}
              style={appearDelay(row++)}
            >
              <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
                {entry.time}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {entry.winner}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HistoryCard({ history, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className={open ? "border-b" : undefined}>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-2 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <CardTitle className="flex items-center gap-2">
            История
            {history.length > 0 && (
              <Badge variant="secondary" className={APPEAR}>
                {history.length}
              </Badge>
            )}
          </CardTitle>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
        {open && history.length > 0 && (
          <CardAction className={APPEAR}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Очистить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Очистить историю?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вся история розыгрышей для этой команды будет удалена.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onClear}>
                    Очистить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        )}
      </CardHeader>
      {open && (
        <CardContent>
          <ScrollArea className="h-60 pr-3">
            <HistoryList history={history} />
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
