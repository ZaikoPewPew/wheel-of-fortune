import { cn } from "@/lib/utils";

export default function Stage({ children, className, wide = false }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col",
        wide ? "max-w-[560px] items-center" : "max-w-[440px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
