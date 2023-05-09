
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testSubtract = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem16 = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem32 = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem64 = new BigUint64Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('sub', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('sub')

  // Create two v128 vectors of i8 data
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8[i] = 0xFF
    wasmMem8[i + 16] = i - 0x0200
  }

  let fnName = genFnName('', 'i8', null)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)

  assert_pointwise_eq(
    fnName,
    {
      value: new Uint8Array([0xFF, 0xFE, 0xFD, 0xFC, 0xFB, 0xFA, 0xF9, 0xF8, 0xF7, 0xF6, 0xF5, 0xF4, 0xF3, 0xF2, 0xF1, 0xF0]),
      type: 'i8'
    },
    wasmMem8.slice(offset1, offset1 + len1)
  )

  fnName = genFnName('', 'i16', null)
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset2 >>> 1
  let i16len = len2 >>> 1

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint16Array([0xFEFF, 0xFCFD, 0xFAFB, 0xF8F9, 0xF6F7, 0xF4F5, 0xF2F3, 0xF0F1]),
      type: 'i16'
    },
    wasmMem16.slice(i16offset, i16offset + i16len)
  )

  fnName = genFnName('', 'i32', null)
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset3 >>> 2
  let i32len = len3 >>> 2

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint32Array([0xFCFDFEFF, 0xF8F9FAFB, 0xF4F5F6F7, 0xF0F1F2F3]),
      type: 'i32'
    },
    wasmMem32.slice(i32offset, i32offset + i32len)
  )

  fnName = genFnName('', 'i64', null)
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset4 >>> 3
  let i64len = len4 >>> 3

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new BigUint64Array([0xF8F9FAFBFCFDFEFFn, 0xF0F1F2F3F4F5F6F7n]),
      type: 'i64'
    },
    wasmMem64.slice(i64offset, i64offset + i64len)
  )
}

export default testSubtract
