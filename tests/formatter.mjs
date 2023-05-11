import * as FMT from "../utils/format.mjs"
import {
  u8ArrayTopDown,
  u8DataSplat,
  i16DataSplat,
  i32DataSplat,
  f32DataSplat,
  i64DataSplat,
  f64DataSplat,
  i16Data,
  i32Data,
  i64Data,
} from "./data.mjs"
import {
  assert,
  float32TestValues,
  float64TestValues,
} from "../utils/test.mjs"

const testFormat = () => {
  let i8AsHexStr = FMT.numFormatters.get('i8')
  let i16AsHexStr = FMT.numFormatters.get('i16')
  let i32AsHexStr = FMT.numFormatters.get('i32')

  // Signed range
  for (let i = -128; i < 128; i++) {
    console.log(`${i} = ${i8AsHexStr(i)}`)
    console.log(`${i << 8} = ${i16AsHexStr(i << 8)}`)
    console.log(`${i << 24} = ${i32AsHexStr(i << 24)}`)
  }
}

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
  assert_pointwise_eq(genFnName(t, 'should_pass', null), { value: u8ArrayTopDown, type: 'i8' }, u8ArrayTopDown)
  assert_pointwise_eq(genFnName(t, 'should_fail', null), { value: u8ArrayTopDown, type: 'i8' }, u8ArrayTopDown.toReversed())

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

const testOneToManyEq = () => {
  let assert_one_to_many_eq = assert('formatter', 'ONE_TO_MANY_EQ')
  let genFnName = FMT.genFunctionNameForGroup('one_to_many_eq')

  let t = 'i8'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: 0xFF, type: 'i8' }, u8DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: 0xFF, type: 'i8' }, u8Data)

  t = 'i16'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: 0xFFFE, type: 'i16' }, i16DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: 0xFFFE, type: 'i16' }, i16Data)

  t = 'i32'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: 0xFFFEFDFC, type: 'i32' }, i32DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: 0xFFFEFDFC, type: 'i32' }, i32Data)

  t = 'i64'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: 0xFFFEFDFCFBFAF9F8n, type: 'i64' }, i64DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: 0xFFFEFDFCFBFAF9F8n, type: 'i64' }, i64Data)

  t = 'f32'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: float32TestValues[0], type: 'f32' }, f32DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: float32TestValues[0], type: 'f32' }, float32TestValues)

  t = 'f64'
  assert_one_to_many_eq(genFnName(t, 'should_pass', null), { value: float64TestValues[0], type: 'f64' }, f64DataSplat)
  assert_one_to_many_eq(genFnName(t, 'should_fail', null), { value: float64TestValues[0], type: 'f64' }, float64TestValues)
}

// testFormat()
testSimpleEq()
testPointwiseEq()
testOneToManyEq()
