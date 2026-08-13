import Stage from "@/components/Stage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import echpochmarik from "@/assets/echpochmarik.png";
import { APPEAR, appearDelay } from "@/lib/appear";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <Stage>
      <Card className={cn(APPEAR)} style={appearDelay(0)}>
        <CardHeader>
          <img
            src={echpochmarik}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-xl"
          />
          <CardTitle className="text-lg">Эчпочмарик</CardTitle>
          <CardDescription>
            Помощник для синков: выбирает, кто говорит, и держит порядок
            выступлений.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            На синке команды крутите колесо — следующий спикер выпадает
            случайно, без споров и «ну давай ты». На синке рабочей группы
            Эчпочмарик перемешивает состав и ставит срочные темы первыми, чтобы
            важное не уехало в конец встречи. Для продактов — тот же ритуал, но
            со своим составом.
          </p>
          <p>Меньше возни с очередью, больше времени на сам разговор.</p>
        </CardContent>
      </Card>
    </Stage>
  );
}
