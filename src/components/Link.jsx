import { forwardRef } from "react";
import { navigate, toHref } from "@/lib/routes";

const Link = forwardRef(function Link(
  { to, replace = false, onClick, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      href={toHref(to)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(to, { replace });
      }}
      {...props}
    >
      {children}
    </a>
  );
});

export default Link;
