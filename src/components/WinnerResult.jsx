import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { APPEAR, appearDelay } from "@/lib/appear";
import { cn } from "@/lib/utils";

export default function WinnerResult({ winner, visual, onAgain, onEdit }) {
  const initials = winner
    ? winner
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex flex-col items-center gap-6 pt-2 text-center">
      {visual?.kind === "meme" ? (
        <img
          src={visual.src}
          alt={winner}
          className={cn(
            "max-h-52 w-auto max-w-[240px] rounded-xl object-contain ring-1 ring-border",
            APPEAR,
          )}
          style={appearDelay(0)}
        />
      ) : (
        <Avatar
          className={cn(
            "size-24 after:hidden data-[size=default]:size-24",
            APPEAR,
          )}
          style={appearDelay(0)}
        >
          {visual?.kind === "avatar" && (
            <AvatarImage src={visual.src} alt={winner} />
          )}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("space-y-1", APPEAR)} style={appearDelay(1)}>
        <p className="text-sm text-muted-foreground">Победитель</p>
        <h2 className="font-heading text-2xl font-medium tracking-tight">
          {winner}
        </h2>
      </div>
      <div
        className={cn("flex w-full flex-col gap-2", APPEAR)}
        style={appearDelay(2)}
      >
        <Button
          type="button"
          size="lg"
          className="h-11 w-full"
          onClick={onAgain}
        >
          Ещё раз
        </Button>
        <Button type="button" variant="ghost" onClick={onEdit}>
          Изменить состав
        </Button>
      </div>
    </div>
  );
}
