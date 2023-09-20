export function getShortUUID(id: string): string {
  return `#-${id.slice(-5).toUpperCase()}`;
}

export default getShortUUID;
