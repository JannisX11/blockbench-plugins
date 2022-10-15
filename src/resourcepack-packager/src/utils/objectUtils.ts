export function hardDefineProperty(
  object: object,
  property: string,
  value: any
) {
  Object.defineProperty(object, property, {
    value,
    writable: true,
    configurable: true
  });
}

export function hardObtainProperty(object: object, property: string) {
  return Object.entries(object).find(([name]) => name === property)?.[1];
}
