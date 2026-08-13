import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APPEAR, appearDelay } from "@/lib/appear";
import { LS } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const THEME_KEY = "wof2_theme";

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const stored = LS.get(THEME_KEY, "dark");
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    applyTheme(theme);
    LS.set(THEME_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className={cn(
        "h-8 w-8 bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted",
        APPEAR,
      )}
      style={appearDelay(5)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
