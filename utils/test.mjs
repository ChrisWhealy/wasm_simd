import * as FMT from "./format.mjs"
import * as CMP from "./compare.mjs"

// Warning: When retrieved from a Float32Array, the various Math constants will have been rounded
// Therefore
//  (new Float32Array([Math.PI]))[0] === Math.PI   // false
export const float32TestValues = new Float32Array([Math.PI, Math.E, Math.SQRT2, Math.LOG10E])
export const float64TestValues = new Float64Array([Math.PI, Math.E, Math.SQRT2, Math.LOG10E])
export const simdDatatypes = (m => {
  m.set('i8', 0xff)
  m.set('i16', 0x0a0b)
  m.set('i32', 0xdeadbeef)
  m.set('i64', 0x0001020304050607n)
  m.set('f32', float32TestValues[0])
  m.set('f64', float64TestValues[1])

  return m
})(new Map())

export const assert = (testGroup, testType) => {
  switch (testType) {
    case "ONE_TO_MANY_EQ": {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'To be replicated over: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`

        let { logFn, msg } = (received.every(el => el === expected.value))
          ? FMT.testSuccess(testPrefix)
          : FMT.errOneToMany(testPrefix, expectedPrefix, expected, receivedPrefix, received)

        console[logFn](msg)
      }
    }

    case "POINTWISE_EQ": {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`

        let { logFn, msg } = (expected.value.length !== received.length)
          ? FMT.errLengthMismatch(testPrefix, expected.value.length, received.length)
          : (!CMP.arrayEq(expected.value, received))
            ? FMT.errPointwise(testPrefix, expectedPrefix, expected, receivedPrefix, received)
            : FMT.testSuccess(testPrefix)

        console[logFn](msg)
      }
    }

    case "SIMPLE_EQ":
    default: {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`

        let { logFn, msg } = (!expected.value === received)
          ? FMT.errSimpleEq(testPrefix, expectedPrefix, expected, receivedPrefix, received)
          : FMT.testSuccess(testPrefix)

        console[logFn](msg)
      }
    }
  }
}
