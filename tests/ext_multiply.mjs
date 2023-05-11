import {
  u16ArrayLowEvens,
  u16ArrayHighEvens,
  i16ArrayNegLowEvens,
  i16ArrayNegHighEvens,
  u32ArrayLowEvens,
  u32ArrayHighEvens,
  i32ArrayNegLowEvens,
  i32ArrayNegHighEvens,
  u64ArrayLowEvens,
  u64ArrayHighEvens,
  i64ArrayNegLowEvens,
  i64ArrayNegHighEvens,
} from "./data.mjs"
import { genFunctionNameForGroup } from "../utils/format.mjs"
import { assert } from "../utils/test.mjs"

const testExtMultiply = wasmExports => {
  let assert_pointwise_eq = assert('extended_multiply', 'POINTWISE_EQ')
  let genFnName = genFunctionNameForGroup('extmul')

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i8x16 -> i16x8 Low/High unsigned
  let wasmMem8u = new Uint8Array(wasmExports.memory.buffer)
  let wasmMem8i = new Int8Array(wasmExports.memory.buffer)

  let wasmMem16u = new Uint16Array(wasmExports.memory.buffer)
  let wasmMem16i = new Int16Array(wasmExports.memory.buffer)

  // Write two v128 vectors of i8 data starting at byte offset 0x0200
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8u[i] = i - 0x0200
    wasmMem8u[i + 16] = 0x02
  }

  let fnName = genFnName('low', 'i8', false)
  let [offset1, len1] = wasmExports[fnName](0x0200, 0x0210)
  let i16offset = offset1 >>> 1
  let i16len = len1 >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayLowEvens, type: 'i16' }, wasmMem16u.slice(i16offset, i16offset + i16len))

  fnName = genFnName('high', 'i8', false)
  let [offset2, len2] = wasmExports[fnName](0x0200, 0x0210)
  i16offset = offset2 >>> 1
  i16len = len2 >>> 1
  assert_pointwise_eq(fnName, { value: u16ArrayHighEvens, type: 'i16' }, wasmMem16u.slice(i16offset, i16offset + i16len))

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i8x16 -> i16x8 Low/High signed

  // Populate first input vector with negative numbers
  for (let i = 0x0200; i < 0x0210; i++) {
    wasmMem8i[i] = -(i - 0x0200)
  }

  fnName = genFnName('low', 'i8', true)
  let [offset3, len3] = wasmExports[fnName](0x0200, 0x0210)
  i16offset = offset3 >>> 1
  i16len = len3 >>> 1
  assert_pointwise_eq(fnName, { value: i16ArrayNegLowEvens, type: 'i16' }, wasmMem16i.slice(i16offset, i16offset + i16len))

  fnName = genFnName('high', 'i8', true)
  let [offset4, len4] = wasmExports[fnName](0x0200, 0x0210)
  i16offset = offset4 >>> 1
  i16len = len4 >>> 1
  assert_pointwise_eq(fnName, { value: i16ArrayNegHighEvens, type: 'i16' }, wasmMem16i.slice(i16offset, i16offset + i16len))

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i16x8 -> i32x4 Low/High unsigned
  let wasmMem32u = new Uint32Array(wasmExports.memory.buffer)
  let wasmMem32i = new Int32Array(wasmExports.memory.buffer)

  // Write two v128 vectors of i16 data starting at byte offset 0x0200
  for (let i = 0x0100; i < 0x0108; i++) {
    wasmMem16u[i] = i - 0x0100
    wasmMem16u[i + 8] = 0x02
  }

  fnName = genFnName('low', 'i16', false)
  let [offset5, len5] = wasmExports[fnName](0x0200, 0x0210)
  let i32offset = offset5 >>> 2
  let i32len = len5 >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayLowEvens, type: 'i32' }, wasmMem32u.slice(i32offset, i32offset + i32len))

  fnName = genFnName('high', 'i16', false)
  let [offset6, len6] = wasmExports[fnName](0x0200, 0x0210)
  i32offset = offset6 >>> 2
  i32len = len6 >>> 2
  assert_pointwise_eq(fnName, { value: u32ArrayHighEvens, type: 'i32' }, wasmMem32u.slice(i32offset, i32offset + i32len))

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i16x8 -> i32x4 Low/High signed

  // Populate first input vector with negative numbers
  for (let i = 0x0100; i < 0x0108; i++) {
    wasmMem16i[i] = -(i - 0x0100)
  }

  fnName = genFnName('low', 'i16', true)
  let [offset7, len7] = wasmExports[fnName](0x0200, 0x0210)
  i32offset = offset7 >>> 2
  i32len = len7 >>> 2
  assert_pointwise_eq(fnName, { value: i32ArrayNegLowEvens, type: 'i32' }, wasmMem32i.slice(i32offset, i32offset + i32len))

  fnName = genFnName('high', 'i16', true)
  let [offset8, len8] = wasmExports[fnName](0x0200, 0x0210)
  i32offset = offset8 >>> 2
  i32len = len8 >>> 2
  assert_pointwise_eq(fnName, { value: i32ArrayNegHighEvens, type: 'i32' }, wasmMem32i.slice(i32offset, i32offset + i32len))

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i32x4 -> i64x2 Low/High unsigned
  let wasmMem64u = new BigUint64Array(wasmExports.memory.buffer)
  let wasmMem64i = new BigInt64Array(wasmExports.memory.buffer)

  // Write two v128 vectors of i32 data starting at byte offset 0x0200
  for (let i = 0x0080; i < 0x0084; i++) {
    wasmMem32u[i] = i - 0x0080
    wasmMem32u[i + 4] = 0x02
  }

  fnName = genFnName('low', 'i32', false)
  let [offset9, len9] = wasmExports[fnName](0x0200, 0x0210)
  let i64offset = offset9 >>> 3
  let i64len = len9 >>> 3
  assert_pointwise_eq(fnName, { value: u64ArrayLowEvens, type: 'i64' }, wasmMem64u.slice(i64offset, i64offset + i64len))

  fnName = genFnName('high', 'i32', false)
  let [offset10, len10] = wasmExports[fnName](0x0200, 0x0210)
  i64offset = offset10 >>> 3
  i64len = len10 >>> 3
  assert_pointwise_eq(fnName, { value: u64ArrayHighEvens, type: 'i64' }, wasmMem64u.slice(i64offset, i64offset + i64len))

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // i32x4 -> i64x2 Low/High signed

  // Populate first input vector with negative numbers
  for (let i = 0x0080; i < 0x0084; i++) {
    wasmMem32i[i] = -(i - 0x0080)
  }

  fnName = genFnName('low', 'i32', true)
  let [offset11, len11] = wasmExports[fnName](0x0200, 0x0210)
  i64offset = offset11 >>> 3
  i64len = len11 >>> 3
  assert_pointwise_eq(fnName, { value: i64ArrayNegLowEvens, type: 'i64' }, wasmMem64i.slice(i64offset, i64offset + i64len))

  fnName = genFnName('high', 'i32', true)
  let [offset12, len12] = wasmExports[fnName](0x0200, 0x0210)
  i64offset = offset12 >>> 3
  i64len = len12 >>> 3
  assert_pointwise_eq(fnName, { value: i64ArrayNegHighEvens, type: 'i64' }, wasmMem64i.slice(i64offset, i64offset + i64len))
}

export default testExtMultiply
