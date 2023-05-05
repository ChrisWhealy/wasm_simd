import * as FMT from "./format.mjs"
import * as CMP from "./compare.mjs"
import * as MATH from "./math.mjs"

export const float32TestValues = [Math.PI, Math.E, Math.SQRT2, Math.LOG10E]
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

export const typedArrayForMemoryBuffer = wasmMemBuffer =>
  dt => {
    let wasmMem = null
    let scaleFactor = 0

    switch (dt) {
      case 'i8':
        wasmMem = new Uint8Array(wasmMemBuffer)
        break

      case 'i16':
        wasmMem = new Uint16Array(wasmMemBuffer)
        scaleFactor = 1
        break

      case 'i32':
        wasmMem = new Uint32Array(wasmMemBuffer)
        scaleFactor = 2
        break

      case 'i64':
        wasmMem = new BigInt64Array(wasmMemBuffer)
        scaleFactor = 3
        break

      case 'f32':
        wasmMem = new Float32Array(wasmMemBuffer)
        scaleFactor = 2
        break

      case 'f64':
        wasmMem = new Float64Array(wasmMemBuffer)
        scaleFactor = 3
        break
    }

    return { wasmMem, scaleFactor }
  }

export const assert = (testGroup, testType) => {
  switch (testType) {
    case "ONE_TO_MANY_EQ": {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')
      let diffPrefix = 'Difference: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`
        let formatter = (expected.type === 'f32' || expected.type === 'f64') ? FMT.formatNumber : FMT[`${expected.type}AsHexStr`]

        // Assume the test passes
        let msg = `${FMT.successIcon} ${testPrefix} passed`
        let logFn = 'log'
        let expectedStr = `${expectedPrefix}${formatter(expected.value)}`
        let receivedStr = `${receivedPrefix}${received}`

        // Deal with floating point weirdness
        if (MATH.isFloat(expected.value)) {
          let diff = Math.abs(expected.value - received)

          msg = diff > MATH.FLOAT_ACCEPTABLE_TOLERANCE
            ? `${FMT.failureIcon} ${testPrefix} failed\n${expectedStr}\n${receivedStr}}\n${diffPrefix}${FMT.formatNumber(diff)}`
            : `${FMT.successIcon} ${testPrefix} passed within acceptable floating point tolerance`
        } else if (!received.every(el => el === expected.value)) {
          msg = `${FMT.failureIcon} ${testPrefix} failed\n${expectedStr} to be replicated across ${FMT.formatNumArray(received, formatter)}`
          logFn = 'error'
        }

        console[logFn](msg)
      }
    }

    case "POINTWISE_EQ": {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`

        // Assume the test passes
        let msg = `${FMT.successIcon} ${testPrefix} passed`
        let logFn = 'log'

        if (expected.length !== received.length) {
          msg = `${FMT.failureIcon} ${testPrefix} failed: Expected ${expected.length} elements, received ${received.length}`
          logFn = 'error'
        } else
          if (!CMP.arrayEq(expected, received)) {
            let expectedStr = FMT.formatNumArray(expected, FMT.i8AsHexStr)
            let receivedStr = FMT.formatNumArray(received, FMT.i8AsHexStr)
            msg = `${FMT.failureIcon} ${testPrefix} failed\n${expectedPrefix}${expectedStr}\n${receivedPrefix}${receivedStr}`
            logFn = 'error'
          }

        console[logFn](msg)
      }
    }

    case "SIMPLE_EQ":
    default: {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')
      let diffPrefix = 'Difference: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = (testName === testGroup) ? testGroup : `${testGroup}: ${testName}`
        let formatter = (expected.type === 'f32' || expected.type === 'f64') ? FMT.formatNumber : FMT[`${expected.type}AsHexStr`]
        let body = `${expectedPrefix}${formatter(expected.value)}\n${receivedPrefix}${formatter(received)}`

        let diff = expected.type === 'i64' ? MATH.abs(expected.value, received) : Math.abs(expected.value - received)

        // Assume the test passes
        let msg = `✅ ${testGroup}: ${testName} passed`
        let logFn = 'log'

        if (expected.value !== received) {
          // Deal with floating point weirdness
          msg = (expected.type === 'f32' || expected.type === 'f64')
            ? !!expected.precise || diff > MATH.FLOAT_ACCEPTABLE_TOLERANCE
              ? `${FMT.failureIcon} ${testPrefix} failed\n${body}\n${diffPrefix}${formatter(diff)}`
              : `${FMT.successIcon} ${testPrefix} passed within acceptable floating point tolerance`
            : `${FMT.failureIcon} ${testPrefix} failed\n${body}`
          logFn = 'error'
        }

        console[logFn](msg)
      }
    }
  }
}
