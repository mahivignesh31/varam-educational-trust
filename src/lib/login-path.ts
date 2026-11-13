export function loginPath(next?: string) {
  if (!next || !next.startsWith("/lms") || next.startsWith("//")) return "/login";
  return `/login?next=${encodeURIComponent(next)}`;
}
