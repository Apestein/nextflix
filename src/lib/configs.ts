export const PLANS = [
  {
    id: "0",
    name: "free",
    price: 0,
    description: "Free Video Stream",
  },
  {
    // id: "price_1Nd71XBrDYSkolG53ADLYQXk",
    id: "price_1NeEIZBrDYSkolG5bjbEmccv",
    name: "basic",
    price: 5,
    description: "Basic Video Stream",
  },
  {
    // id: "price_1Nd71ABrDYSkolG5kiBRhIHv",
    id: "price_1NeE60BrDYSkolG5PidpmNHW",
    name: "standard",
    price: 10,
    description: "Standard Video Stream",
  },
  {
    id: "price_1Nd71XBrDYSkolG53ADLYQXk",
    name: "premium",
    price: 20,
    description: "Premium Video Stream",
  },
] as const

const tupleMap = <
  const T extends readonly Record<string, unknown>[],
  Key extends keyof T[number],
>(
  input: T,
  key: Key,
): { [k in keyof T]: T[k][Key] } => {
  return input.map((row) => row[key as never]) as never
}
export const planTuple = tupleMap(PLANS, "name")
