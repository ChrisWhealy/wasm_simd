import { assert } from "../utils/test.mjs"

const testSwizzle = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('swizzle', 'POINTWISE_EQ')

  // Swizzle using hardcoded immediate mode indices
  let [u8offset1, u8len1] = wasmExports.swizzle_im()

  assert_pointwise_eq(
    'swizzle_im',
    {
      value: new Uint8Array([0x03, 0x02, 0x01, 0x00, 0x07, 0x06, 0x05, 0x04, 0x0B, 0x0A, 0x09, 0x08, 0x0F, 0x0E, 0x0D, 0x0C]),
      type: 'i8'
    },
    wasmMem8.slice(u8offset1, u8offset1 + u8len1)
  )

  // Swizzle passing in a pointer to the indices
  // The swizzle indices have been prefilled by function initialiseSharedMemory()
  let [u8offset2, u8len2] = wasmExports.swizzle_var()

  assert_pointwise_eq(
    'swizzle_var',
    {
      value: new Uint8Array([0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00]),
      type: 'i8'
    },
    wasmMem8.slice(u8offset2, u8offset2 + u8len2)
  )
}

export default testSwizzle
