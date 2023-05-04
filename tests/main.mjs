import { startWasmModule } from "../utils/wasm.mjs"
import {
  initialiseSharedMemory,
  simdDatatypes,
} from '../utils/test.mjs'

import testSplat from './splat.mjs'
import testExtractLane from './extract_lane.mjs'
import testReplaceLane from './replace_lane.mjs'
import testSwizzle from './swizzle.mjs'

const wasmFilePath = "./bin/simd.wasm"

startWasmModule(wasmFilePath)
  .then(
    ({ exports }) => {
      initialiseSharedMemory(exports.memory.buffer)

      testExtractLane(exports)
      testReplaceLane(exports)
      testSwizzle(exports)
      testSplat(exports)
    }
  )
