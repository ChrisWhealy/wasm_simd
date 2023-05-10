import {
  u8SwizzleIndices,
  u8ArrayBottomUp,
} from './data.mjs'
import { assert } from "../utils/test.mjs"

const testSwizzle = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('swizzle', 'POINTWISE_EQ')

  // Swizzle using hardcoded immediate mode indices
  let [u8offset1, u8len1] = wasmExports.swizzle_im()
  assert_pointwise_eq('swizzle_im', { value: u8SwizzleIndices, type: 'i8' }, wasmMem8.slice(u8offset1, u8offset1 + u8len1))

  // Swizzle passing in a pointer to the indices
  // The swizzle indices have been prefilled by function initialiseSharedMemory()
  let [u8offset2, u8len2] = wasmExports.swizzle_var()
  assert_pointwise_eq('swizzle_var', { value: u8ArrayBottomUp.toReversed(), type: 'i8' }, wasmMem8.slice(u8offset2, u8offset2 + u8len2))
}

export default testSwizzle
