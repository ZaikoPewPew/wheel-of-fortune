import { useEffect, useState } from "react";
import { WORK_GROUPS } from "@/data/workGroups";
import { LS } from "@/lib/storage";
import { TEAM_SYNC_TEAMS } from "@/lib/teams";

export const paths = {
  home: "/",
  team: (id) => `/teams/${id}`,
  group: (id) => `/groups/${id}`,
  products: "/products",
};

export function getBase() {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

export function toHref(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBase()}${normalized}`;
}

export function getPathname() {
  const base = getBase();
  let path = window.location.pathname;
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length);
  }
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

export function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { page: "home", path: paths.home };
  }

  if (parts[0] === "teams") {
    const id = parts[1];
    if (TEAM_SYNC_TEAMS.some((team) => team.id === id)) {
      return { page: "teams", teamId: id, path: paths.team(id) };
    }
    const last = LS.get("wof2_activeTeam", TEAM_SYNC_TEAMS[0].id);
    const teamId = TEAM_SYNC_TEAMS.some((team) => team.id === last)
      ? last
      : TEAM_SYNC_TEAMS[0].id;
    return {
      page: "teams",
      teamId,
      path: paths.team(teamId),
      redirect: true,
    };
  }

  if (parts[0] === "groups") {
    const id = parts[1];
    if (WORK_GROUPS.some((group) => group.id === id)) {
      return { page: "groups", groupId: id, path: paths.group(id) };
    }
    const last = LS.get("wof2_wg_activeGroup", WORK_GROUPS[0].id);
    const groupId = WORK_GROUPS.some((group) => group.id === last)
      ? last
      : WORK_GROUPS[0].id;
    return {
      page: "groups",
      groupId,
      path: paths.group(groupId),
      redirect: true,
    };
  }

  if (parts[0] === "products") {
    return { page: "products", path: paths.products };
  }

  return { page: "home", path: paths.home, redirect: true };
}

export function navigate(path, { replace = false } = {}) {
  const href = toHref(path);
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === href) return;
  if (replace) window.history.replaceState({}, "", href);
  else window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute() {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const onPop = () => setPathname(getPathname());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const route = parseRoute(pathname);

  useEffect(() => {
    if (route.redirect) navigate(route.path, { replace: true });
  }, [route.redirect, route.path]);

  return route;
}
