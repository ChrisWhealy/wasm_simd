export const FLOAT_ACCEPTABLE_TOLERANCE = 0.00000009
export const isFloat = maybeFloat => typeof maybeFloat !== "bigint" && !isNaN(maybeFloat) && !Number.isInteger(maybeFloat)

export const abs = (n1, n2) => {
  let t = n1 - n2
  return t > 0 ? t : t * BigInt(-1)
}
