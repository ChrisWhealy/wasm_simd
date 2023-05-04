import { assert } from "../utils/test.mjs"

const testShuffle = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('shuffle', 'POINTWISE_EQ')

  // Shuffle using hardcoded immediate mode indices
  let [offset, len] = wasmExports.shuffle()

  assert_pointwise_eq(
    'shuffle',
    new Uint8Array([0x00, 0xF1, 0x02, 0xF3, 0x04, 0xF5, 0x06, 0xF7, 0x08, 0xF9, 0x0A, 0xFB, 0x0C, 0xFD, 0x0E, 0xFF]),
    wasmMem8.slice(offset, offset + len)
  )
}

export default testShuffle
