import { genFunctionNameForGroup } from '../utils/format.mjs'
import { assert } from '../utils/test.mjs'
import {
  float32TestValues,
  float64TestValues,
} from '../tests/data.mjs'

const testExtractLane = wasmExports => {
  let wasmMem8u = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem8s = new Int8Array(wasmExports.memory.buffer)
  let wasmMem16u = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem16s = new Int16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Int32Array(wasmExports.memory.buffer)
  let wasmMem64i = new BigInt64Array(wasmExports.memory.buffer)

  let assert_eq = assert('extract_lane', 'SIMPLE_EQ')
  let genFnName = genFunctionNameForGroup('extract_lane')

  for (let i8 = 0; i8 < 16; i8++) {
    let fnName1 = genFnName(i8, 'i8', false)
    let fnName2 = genFnName(i8, 'i8', true)

    assert_eq(fnName1, { value: wasmMem8u[i8], type: 'i8' }, wasmExports[fnName1]())
    assert_eq(fnName2, { value: wasmMem8s[i8 + 16], type: 'i8' }, wasmExports[fnName2]())
  }

  for (let i16 = 16; i16 < 24; i16++) {
    let idx = i16 - 16
    let fnName1 = genFnName(idx, 'i16', false)
    let fnName2 = genFnName(idx, 'i16', true)

    assert_eq(fnName1, { value: wasmMem16u[i16], type: 'i16' }, wasmExports[fnName1]())
    assert_eq(fnName2, { value: wasmMem16s[i16 + 8], type: 'i16' }, wasmExports[fnName2]())
  }

  for (let i32 = 16; i32 < 20; i32++) {
    let idx = i32 - 16
    let fnName1 = genFnName(idx, 'i32', null)
    let fnName2 = genFnName(idx, 'f32', null)

    assert_eq(fnName1, { value: wasmMem32[i32], type: 'i32' }, wasmExports[fnName1]())
    assert_eq(fnName2, { value: float32TestValues[idx], type: 'f32' }, wasmExports[fnName2]())
  }

  for (let i64 = 12; i64 < 14; i64++) {
    let idx = i64 - 12
    let fnName1 = genFnName(idx, 'i64', null)
    let fnName2 = genFnName(idx, 'f64', null)

    assert_eq(fnName1, { value: wasmMem64i[i64], type: 'i64' }, wasmExports[fnName1]())
    assert_eq(fnName2, { value: float64TestValues[idx], type: 'f64' }, wasmExports[fnName2]())
  }
}

export default testExtractLane
