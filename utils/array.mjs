// Polyfill for subclasses of TypedArray to provide a toReversed() method
export const toReversed = function () {
  return this.reduceRight((acc, el) => (_ => acc)(acc.push(el)), [])
}
