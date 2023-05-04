import * as FMT from "./format.mjs"
import * as CMP from "./compare.mjs"
import * as MATH from "./math.mjs"

export const assert = (testGroup, testType) => {
  switch (testType) {
    case "ONE_TO_MANY_EQ": {
      let prefixLen = testGroup.length + 5
      let expectedPrefix = 'Expected: '.padStart(prefixLen, ' ')
      let receivedPrefix = 'Received: '.padStart(prefixLen, ' ')
      let diffPrefix = 'Difference: '.padStart(prefixLen, ' ')

      return (testName, expected, received) => {
        let testPrefix = `${testGroup}: ${testName}`
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
        let testPrefix = `${testGroup}: ${testName}`

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
        let testPrefix = `${testGroup}: ${testName}`
        let formatter = (expected.type === 'f32' || expected.type === 'f64') ? FMT.formatNumber : FMT[`${expected.type}AsHexStr`]
        let body = `${expectedPrefix}${formatter(expected.value)}\n${receivedPrefix}${formatter(received)}`

        let diff = expected.type === 'i64' ? MATH.abs(expected.value, received) : Math.abs(expected.value - received)

        // Assume the test passes
        let msg = `✅ ${testGroup}: ${testName} passed`
        let logFn = 'log'

        if (expected.value !== received) {
          // Deal with floating point weirdness
          msg = (expected.type === 'f32' || expected.type === 'f64')
            ? diff > MATH.FLOAT_ACCEPTABLE_TOLERANCE
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


/***
 * The host environment and the WASM module must have shared knowledge of the memory map
 *
 * 0000-000F 16 x 8-bit unsigned integers
 * 0010-001F 16 x 8-bit signed integers
 * 0020-002F  8 x 16-bit unsigned integers
 * 0030-003F  8 x 16-bit signed integers
 * 0040-004F  4 x 32-bit signed integers
 * 0050-005F  4 x 32-bit floats
 * 0060-006F  2 x 64-bit signed integers
 * 0070-007F  2 x 64-bit floats
 */
export const initialiseSharedMemory = wasmMemoryBuffer => {
  // 0000-000F   8-bit unsigned integers
  // 0010-001F   8-bit signed integers
  let wasmMem8 = new Uint8Array(wasmMemoryBuffer)

  for (let i8 = 0; i8 < 16; i8++) {
    wasmMem8[i8] = i8
    wasmMem8[i8 + 16] = i8 | 0x80  // Flip sign bit
  }

  // 0020-002F  16-bit unsigned integers
  // 0030-003F  16-bit signed integers
  let wasmMem16 = new Uint16Array(wasmMemoryBuffer)

  for (let i16 = 16; i16 < 24; i16++) {
    wasmMem16[i16] = i16 - 16
    wasmMem16[i16 + 8] = (i16 - 16) | 0x8000  // Flip sign bit
  }

  // * 0040-004F  32-bit signed integers
  // * 0050-005F  32-bit floats
  let wasmMem32i = new Uint32Array(wasmMemoryBuffer)
  let wasmMem32f = new Float32Array(wasmMemoryBuffer)

  for (let i32 = 16; i32 < 20; i32++) {
    wasmMem32i[i32] = i32 - 16
    wasmMem32f[i32 + 4] = float32TestValues[i32 - 16]
  }

  // * 0060-006F  32-bit signed integers
  // * 0070-007F  32-bit floats
  let wasmMem64i = new BigInt64Array(wasmMemoryBuffer)
  let wasmMem64f = new Float64Array(wasmMemoryBuffer)

  for (let i64 = 12; i64 < 14; i64++) {
    wasmMem64i[i64] = BigInt(i64 - 12)
    wasmMem64f[i64 + 2] = float64TestValues[i64 - 12]
  }

  // * 0080-008F  16, 8-bit swizzle indices [0x0F..0x00]
  for (let i = 128; i < 144; i++) {
    wasmMem8[i] = 15 - (i - 128)
  }

  // * 0090-009F  Arbitrary v128 data
  wasmMem32i[36] = 0xDEADBEEF  // Dead Beef
  wasmMem32i[37] = 0xCAFED00D  // Cafe dood
  wasmMem32i[38] = 0xBADDECAF  // Bad Decaf
  wasmMem32i[39] = 0x0DDC15C0  // Odd Cisco
}

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
