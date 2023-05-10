import { assert } from "../utils/test.mjs"
import { u8ArrayShuffled } from "./data.mjs"

const testShuffle = wasmExports => {
  let wasmMem8 = new Uint8Array(wasmExports.memory.buffer)
  let assert_pointwise_eq = assert('shuffle', 'POINTWISE_EQ')

  // Shuffle using hardcoded immediate mode indices
  let [offset, len] = wasmExports.shuffle()
  assert_pointwise_eq('shuffle', { value: u8ArrayShuffled, type: 'i8' }, wasmMem8.slice(offset, offset + len))
}

export default testShuffle
