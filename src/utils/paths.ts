export function withBase(path: string): string {
  if (/^(?:https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.replace(/^\//, '');
  return normalizedPath ? `${normalizedBase}${normalizedPath}` : normalizedBase;
}
