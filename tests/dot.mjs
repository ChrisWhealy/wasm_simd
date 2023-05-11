import { u32ArrayDotResult } from "./data.mjs"
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testDot = wasmExports => {
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('dot_product', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('dot')

  // Write two v128 vectors of i16 data starting at byte offset 0x0200
  for (let i = 0x0100; i < 0x0108; i++) {
    wasmMem16[i] = i - 0x0100
    wasmMem16[i + 8] = i - 0x0100
  }

  // Addition without overflow
  let fnName = genFnName('', 'i16', null)
  let [offset, len] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset >>> 2
  let i32len = len >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayDotResult, type: 'i32' }, wasmMem32.slice(i32offset, i32offset + i32len))
}

export default testDot
