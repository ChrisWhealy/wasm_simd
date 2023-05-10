import {
  u8ArrayTopDown,
  u16ArrayTopDown,
  u32ArrayTopDown,
  u64ArrayTopDown,
} from "./data.mjs"
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testSubtract = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem64 = new BigUint64Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('subtract', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('sub')

  // Create two v128 vectors of i8 data
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8[i] = 0xFF
    wasmMem8[i + 16] = i - 0x0200
  }

  let fnName = genFnName('', 'i8', null)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)
  assert_pointwise_eq(fnName, { value: u8ArrayTopDown, type: 'i8' }, wasmMem8.slice(offset1, offset1 + len1))

  fnName = genFnName('', 'i16', null)
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset2 >>> 1
  let i16len = len2 >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayTopDown, type: 'i16' }, wasmMem16.slice(i16offset, i16offset + i16len))

  fnName = genFnName('', 'i32', null)
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset3 >>> 2
  let i32len = len3 >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayTopDown, type: 'i32' }, wasmMem32.slice(i32offset, i32offset + i32len))

  fnName = genFnName('', 'i64', null)
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset4 >>> 3
  let i64len = len4 >>> 3
  assert_pointwise_eq(fnName, { value: u64ArrayTopDown, type: 'i64' }, wasmMem64.slice(i64offset, i64offset + i64len))
}

export default testSubtract
