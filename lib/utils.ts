export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function generateFamilyCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
