export function enumChoices(enumObject: object): string[] {
  return Object.values(enumObject as Record<string, unknown>).map((value) => `${value}`);
}
