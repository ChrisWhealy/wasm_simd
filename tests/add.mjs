import {
  u8ArrayEvens,
  u8ArrayEvensfrom0x60,
  u16ArrayEvenPairs,
  u16ArrayFrom0x60,
  u32ArrayEvens,
  u32ArrayOdds,
  u64ArrayEvens,
  u64ArrayOddsFrom0x60,
} from "./data.mjs"
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testAdd = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem64 = new BigUint64Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('add', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('add')

  // Write two v128 vectors of i8 data starting at offset 0x0200
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8[i] = i - 0x0200
    wasmMem8[i + 16] = i - 0x0200
  }

  // Addition without overflow
  let fnName = genFnName('', 'i8', null)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)
  assert_pointwise_eq(fnName, { value: u8ArrayEvens, type: 'i8' }, wasmMem8.slice(offset1, offset1 + len1))

  // Addition with ignored overflow
  let [offset1o, len1o] = wasmExports[fnName](0x00C0, 0x00D0)
  assert_pointwise_eq(fnName, { value: u8ArrayEvensfrom0x60, type: 'i8' }, wasmMem8.slice(offset1o, offset1o + len1o))

  // Addition without overflow
  fnName = genFnName('', 'i16', null)
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset2 >>> 1
  let i16len = len2 >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayEvenPairs, type: 'i16' }, wasmMem16.slice(i16offset, i16offset + i16len))

  // Addition with ignored overflow
  let [offset2o, len2o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i16offseto = offset2o >>> 1
  let i16leno = len2o >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayFrom0x60, type: 'i16' }, wasmMem16.slice(i16offseto, i16offseto + i16leno))

  // Addition without overflow
  fnName = genFnName('', 'i32', null)
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset3 >>> 2
  let i32len = len3 >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayEvens, type: 'i32' }, wasmMem32.slice(i32offset, i32offset + i32len))

  // Addition with ignored overflow
  let [offset3o, len3o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i32offseto = offset3o >>> 2
  let i32leno = len3o >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayOdds, type: 'i32' }, wasmMem32.slice(i32offseto, i32offseto + i32leno))

  // Addition without overflow
  fnName = genFnName('', 'i64', null)
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset4 >>> 3
  let i64len = len4 >>> 3
  assert_pointwise_eq(fnName, { value: u64ArrayEvens, type: 'i64' }, wasmMem64.slice(i64offset, i64offset + i64len))

  // Addition with ignored overflow
  let [offset4o, len4o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i64offseto = offset4o >>> 3
  let i64leno = len4o >>> 3
  assert_pointwise_eq(fnName, { value: u64ArrayOddsFrom0x60, type: 'i64' }, wasmMem64.slice(i64offseto, i64offseto + i64leno))
}

export default testAdd
