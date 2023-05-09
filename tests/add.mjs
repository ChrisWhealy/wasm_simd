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

  // Addition without overflow
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)

  assert_pointwise_eq(
    fnName,
    {
      value: new Uint8Array([0x00, 0x02, 0x04, 0x06, 0x08, 0x0A, 0x0C, 0x0E, 0x10, 0x12, 0x14, 0x16, 0x18, 0x1A, 0x1C, 0x1E]),
      type: 'i8'
    },
    wasmMem8.slice(offset1, offset1 + len1)
  )

  // Addition with ignored overflow
  let [offset1o, len1o] = wasmExports[fnName](0x00C0, 0x00D0)

  assert_pointwise_eq(
    fnName,
    {
      value: new Uint8Array([0x60, 0x62, 0x64, 0x66, 0x68, 0x6A, 0x6C, 0x6E, 0x70, 0x72, 0x74, 0x76, 0x78, 0x7A, 0x7C, 0x7E]),
      type: 'i8'
    },
    wasmMem8.slice(offset1o, offset1o + len1o)
  )

  fnName = genFnName('', 'i16', null)

  // Addition without overflow
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset2 >>> 1
  let i16len = len2 >>> 1

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint16Array([0x0200, 0x0604, 0x0A08, 0x0E0C, 0x1210, 0x1614, 0x1A18, 0x1E1C]),
      type: 'i16'
    },
    wasmMem16.slice(i16offset, i16offset + i16len)
  )

  // Addition with ignored overflow
  let [offset2o, len2o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i16offseto = offset2o >>> 1
  let i16leno = len2o >>> 1

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint16Array([0x6360, 0x6764, 0x6B68, 0x6F6C, 0x7370, 0x7774, 0x7B78, 0x7F7C]),
      type: 'i16'
    },
    wasmMem16.slice(i16offseto, i16offseto + i16leno)
  )

  fnName = genFnName('', 'i32', null)

  // Addition without overflow
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset3 >>> 2
  let i32len = len3 >>> 2

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint32Array([0x06040200, 0x0E0C0A08, 0x16141210, 0x1E1C1A18]),
      type: 'i32'
    },
    wasmMem32.slice(i32offset, i32offset + i32len)
  )

  // Addition with ignored overflow
  let [offset3o, len3o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i32offseto = offset3o >>> 2
  let i32leno = len3o >>> 2

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new Uint32Array([0x67656360, 0x6F6D6B68, 0x77757370, 0x7F7D7B78]),
      type: 'i32'
    },
    wasmMem32.slice(i32offseto, i32offseto + i32leno)
  )

  fnName = genFnName('', 'i64', null)

  // Addition without overflow
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset4 >>> 3
  let i64len = len4 >>> 3

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new BigUint64Array([0x0E0C0A0806040200n, 0x1E1C1A1816141210n]),
      type: 'i64'
    },
    wasmMem64.slice(i64offset, i64offset + i64len)
  )

  // Addition with ignored overflow
  let [offset4o, len4o] = wasmExports[fnName](0x00C0, 0x00D0)
  let i64offseto = offset4o >>> 3
  let i64leno = len4o >>> 3

  assert_pointwise_eq(
    fnName,
    // Expected data must be supplied in little-endian form!
    {
      value: new BigUint64Array([0x6F6D6B6967656360n, 0x7F7D7B7977757370n]),
      type: 'i64'
    },
    wasmMem64.slice(i64offseto, i64offseto + i64leno)
  )
}

export default testAdd
