import * as FMT from "./format.mjs"
import * as CMP from "./compare.mjs"

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

        let { logFn, msg } = (expected.value === received)
          ? FMT.testSuccess(testPrefix)
          : FMT.errSimpleEq(testPrefix, expectedPrefix, expected, receivedPrefix, received)

        console[logFn](msg)
      }
    }
  }
}
