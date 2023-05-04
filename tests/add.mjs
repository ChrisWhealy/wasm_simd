import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testAdd = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem64 = new BigUint64Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('add', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('add')

  // Create two v128 vectors of i8 data
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8[i] = i - 0x0200
    wasmMem8[i + 16] = i - 0x0200
  }

  let fnName = genFnName('', 'i8', null)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)

  assert_pointwise_eq(
    fnName,
    new Uint8Array([0x00, 0x02, 0x04, 0x06, 0x08, 0x0A, 0x0C, 0x0E, 0x10, 0x12, 0x14, 0x16, 0x18, 0x1A, 0x1C, 0x1E]),
    wasmMem8.slice(offset1, offset1 + len1)
  )

  fnName = genFnName('', 'i16', null)
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset2 >>> 1
  let i16len = len2 >>> 1

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    new Uint16Array([0x0200, 0x0604, 0x0A08, 0x0E0C, 0x1210, 0x1614, 0x1A18, 0x1E1C]),
    wasmMem16.slice(i16offset, i16offset + i16len)
  )

  fnName = genFnName('', 'i32', null)
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset3 >>> 2
  let i32len = len3 >>> 2

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    new Uint32Array([0x06040200, 0x0E0C0A08, 0x16141210, 0x1E1C1A18]),
    wasmMem32.slice(i32offset, i32offset + i32len)
  )

  fnName = genFnName('', 'i64', null)
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset4 >>> 3
  let i64len = len4 >>> 3

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    new BigUint64Array([0x0E0C0A0806040200n, 0x1E1C1A1816141210n]),
    wasmMem64.slice(i64offset, i64offset + i64len)
  )
}

export default testAdd
