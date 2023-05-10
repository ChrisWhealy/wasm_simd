import { genFunctionNameForGroup } from '../utils/format.mjs'
import { assert } from '../utils/test.mjs'
import {
  float32TestValues,
  float64TestValues,
} from '../tests/data.mjs'

const testReplaceLane = wasmExports => {
  let wasmMem8u = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem16u = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32u = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem32f = new Float32Array(wasmExports.memory.buffer)
  let wasmMem64u = new BigUint64Array(wasmExports.memory.buffer)
  let wasmMem64f = new Float64Array(wasmExports.memory.buffer)

  let assert_eq = assert('replace_lane', 'SIMPLE_EQ')
  let genFnName = genFunctionNameForGroup('replace_lane')

  for (let i8 = 0; i8 < 16; i8++) {
    let fnName = genFnName(i8, 'i8', null)
    let [offset, _len] = wasmExports[fnName](0xff)

    assert_eq(fnName, { value: 0xff, type: 'i8' }, wasmMem8u[offset + i8])
  }

  for (let i16 = 0; i16 < 8; i16++) {
    let fnName = genFnName(i16, 'i16', null)
    let [offset, _len] = wasmExports[fnName](0xffff)
    let i16offset = offset >>> 1

    assert_eq(fnName, { value: 0xffff, type: 'i16' }, wasmMem16u[i16offset + i16])
  }

  for (let i32 = 0; i32 < 4; i32++) {
    let fnName = genFnName(i32, 'i32', null)
    let [offset, _len] = wasmExports[fnName](0xffffffff)
    let i32offset = offset >>> 2

    assert_eq(fnName, { value: 0xffffffff, type: 'i32' }, wasmMem32u[i32offset + i32])
  }

  for (let i64 = 0; i64 < 2; i64++) {
    let fnName = genFnName(i64, 'i64', null)
    let [offset, _len] = wasmExports[fnName](0xffffffffffffffffn)
    let i64offset = offset >>> 3

    assert_eq(fnName, { value: 0xffffffffffffffffn, type: 'i64' }, wasmMem64u[i64offset + i64])
  }

  for (let f32 = 0; f32 < 4; f32++) {
    let fnName = genFnName(f32, 'f32', null)
    let [offset, _len] = wasmExports[fnName](float32TestValues[0])
    let f32offset = offset >>> 2

    assert_eq(fnName, { value: float32TestValues[0], type: 'f32' }, wasmMem32f[f32offset + f32])
  }

  for (let f64 = 0; f64 < 2; f64++) {
    let fnName = genFnName(f64, 'f64', null)
    let [offset, _len] = wasmExports[fnName](float64TestValues[0])
    let f64offset = offset >>> 3

    assert_eq(fnName, { value: float64TestValues[0], type: 'f64' }, wasmMem64f[f64offset + f64])
  }
}

export default testReplaceLane
