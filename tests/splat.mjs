import { typedArrayForMemoryBuffer } from "../utils/memory.mjs"
import { assert } from "../utils/test.mjs"
import { simdDatatypes } from "../tests/data.mjs"

const testSplat = wasmExports => {
  let assert_one_to_many_eq = assert('splat', 'ONE_TO_MANY_EQ')
  let wasmMemBufferForType = typedArrayForMemoryBuffer(wasmExports.memory.buffer)

  simdDatatypes.forEach((testVal, dt) => {
    let fnName = `splat_${dt}`
    let { wasmMem, scaleFactor } = wasmMemBufferForType(dt)
    let [offset, len] = wasmExports[fnName](testVal)

    offset = offset >>> scaleFactor
    len = len >>> scaleFactor

    assert_one_to_many_eq(
      fnName,
      { value: testVal, type: dt },
      wasmMem.slice(offset, offset + len)
    )
  })

}

export default testSplat
