import {
  u16ArrayEvens,
  u16ArrayFrom0xe0,
} from "./data.mjs"
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testMultiply = wasmExports => {
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem64 = new BigUint64Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('multiply', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('mul')

  // Write two v128 vectors of i16 data starting at byte offset 0x0200
  for (let i = 0x0100; i < 0x0108; i++) {
    wasmMem16[i] = i - 0x0100
    wasmMem16[i + 8] = 0x0002
  }

  // Multiplication without overflow
  let fnName = genFnName('', 'i16', null)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset1 >>> 1
  let i16len = len1 >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayEvens, type: 'i16' }, wasmMem16.slice(i16offset, i16offset + i16len))

  // Multiplication with ignored overflow
  for (let i = 0x0100; i < 0x0108; i++) {
    wasmMem16[i] = i - 0x10
    wasmMem16[i + 8] = 0x0200
  }

  let [offset1o, len1o] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset1o = offset1o >>> 1
  let i16len1o = len1o >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayFrom0xe0, type: 'i16' }, wasmMem16.slice(i16offset1o, i16offset1o + i16len1o))
}

export default testMultiply
