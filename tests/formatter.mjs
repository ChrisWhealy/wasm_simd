import * as FMT from "../utils/format.mjs"
import { toReversed } from "../utils/array.mjs"
import {
  assert,
  float32TestValues,
  float64TestValues,
} from "../utils/test.mjs"

Uint8Array.prototype.toReversed = toReversed
Uint16Array.prototype.toReversed = toReversed
Uint32Array.prototype.toReversed = toReversed
BigUint64Array.prototype.toReversed = toReversed
Int8Array.prototype.toReversed = toReversed
Int16Array.prototype.toReversed = toReversed
Int32Array.prototype.toReversed = toReversed
BigInt64Array.prototype.toReversed = toReversed

Float32Array.prototype.toReversed = toReversed
Float64Array.prototype.toReversed = toReversed

const u8Array = new Uint8Array([0xFF, 0xFE, 0xFD, 0xFC, 0xFB, 0xFA, 0xF9, 0xF8, 0xF7, 0xF6, 0xF5, 0xF4, 0xF3, 0xF2, 0xF1, 0xF0])
const i16Array = new Int16Array([0xFFFE, 0xFDFC, 0xFBFA, 0xF9F8, 0xF7F6, 0xF5F4, 0xF3F2, 0xF1F0])
const i32Array = new Int32Array([0xFFFEFDFC, 0xFBFAF9F8, 0xF7F6F5F4, 0xF3F2F1F0])
const i64Array = new BigInt64Array([0xFFFEFDFCFBFAF9F8n, 0xF7F6F5F4F3F2F1F0n])

// const testFormat = () => {
//   let i8AsHexStr = FMT.numFormatters.get('i8')
//   let i16AsHexStr = FMT.numFormatters.get('i16')
//   let i32AsHexStr = FMT.numFormatters.get('i32')

//   // Signed range
//   for (let i = -128; i < 128; i++) {
//     console.log(`${i} = ${i8AsHexStr(i)}`)
//     console.log(`${i << 8} = ${i16AsHexStr(i << 8)}`)
//     console.log(`${i << 24} = ${i32AsHexStr(i << 24)}`)
//   }
// }

const testSimpleEq = () => {
  let assert_eq = assert('formatter', 'SIMPLE_EQ')
  let genFnName = FMT.genFunctionNameForGroup('simple_eq')

  let t = 'i8'
  assert_eq(genFnName(t, 'should_pass', null), { value: 0x0A, type: t }, 0x0A)
  assert_eq(genFnName(t, 'should_fail', null), { value: 0x0A, type: t }, 0x0B)

  t = 'i16'
  assert_eq(genFnName(t, 'should_pass', null), { value: 0x0D0A, type: t }, 0x0D0A)
  assert_eq(genFnName(t, 'should_fail', null), { value: 0x0D0A, type: t }, 0x0D0B)

  t = 'i32'
  assert_eq(genFnName(t, 'should_pass', null), { value: 0xDEADBEEF, type: t }, 0xDEADBEEF)
  assert_eq(genFnName(t, 'should_fail', null), { value: 0xDEADBEEF, type: t }, 0xCAFED00D)

  t = 'i64'
  assert_eq(genFnName(t, 'should_pass', null), { value: 0xDEADBEEFDEADBEEFn, type: t }, 0xDEADBEEFDEADBEEFn)
  assert_eq(genFnName(t, 'should_fail', null), { value: 0xDEADBEEFDEADBEEFn, type: t }, 0xCAFED00DCAFED00Dn)

  t = 'f32'
  assert_eq(genFnName(t, 'should_pass', null), { value: float32TestValues[0], type: t }, float32TestValues[0])
  assert_eq(genFnName(t, 'should_fail', null), { value: float32TestValues[0], type: t }, float32TestValues[1])

  t = 'f64'
  assert_eq(genFnName(t, 'should_pass', null), { value: float64TestValues[0], type: t }, float64TestValues[0])
  assert_eq(genFnName(t, 'should_fail', null), { value: float64TestValues[0], type: t }, float64TestValues[1])
}

const testPointwiseEq = () => {
  let assert_pointwise_eq = assert('formatter', 'POINTWISE_EQ')
  let genFnName = FMT.genFunctionNameForGroup('pointwise_eq')

  let t = 'i8'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: u8Array, type: 'i8' }, u8Array)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: u8Array, type: 'i8' }, u8Array.toReversed())

  t = 'i16'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: i16Array, type: 'i16' }, i16Array)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: i16Array, type: 'i16' }, i16Array.toReversed())

  t = 'i32'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: i32Array, type: 'i32' }, i32Array)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: i32Array, type: 'i32' }, i32Array.toReversed())

  t = 'i64'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: i64Array, type: 'i64' }, i64Array)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: i64Array, type: 'i64' }, i64Array.toReversed())

  t = 'f32'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: float32TestValues, type: 'f32' }, float32TestValues)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: float32TestValues, type: 'f32' }, float32TestValues.toReversed())

  t = 'f64'
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: float64TestValues, type: 'f64' }, float64TestValues)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: float64TestValues, type: 'f64' }, float64TestValues.toReversed())
}

// testFormat()
testSimpleEq()
testPointwiseEq()
