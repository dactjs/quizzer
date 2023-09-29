export function isEqual<T extends Record<string, unknown>>(
  obj1: T,
  obj2: T
): boolean {
  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 === "object" && typeof obj2 === "object") {
    if (obj1 === null || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  return Object.is(obj1, obj2);
}
