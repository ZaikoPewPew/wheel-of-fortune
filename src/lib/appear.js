export const APPEAR =
  "animate-in fade-in slide-in-from-top-3 fill-mode-backwards duration-500 ease-out motion-reduce:animate-none";

export function appearDelay(index, { step = 45, cap = 14, base = 0 } = {}) {
  return { animationDelay: `${base + Math.min(index, cap) * step}ms` };
}
