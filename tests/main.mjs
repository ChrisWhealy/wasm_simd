import { startWasmModule } from "../utils/wasm.mjs"
import {
  initialiseSharedMemory,
  simdDatatypes,
} from '../utils/test.mjs'

import testSplat from './splat.mjs'
import testExtractLane from './extract_lane.mjs'
import testReplaceLane from './replace_lane.mjs'
import testSwizzle from './swizzle.mjs'
import testShuffle from './shuffle.mjs'
import testAdd from './add.mjs'
import testSubtract from './subtract.mjs'

const wasmFilePath = "./bin/simd.wasm"

startWasmModule(wasmFilePath)
  .then(
    ({ exports }) => {
      initialiseSharedMemory(exports.memory.buffer)

      // testSplat(exports)
      // testSwizzle(exports)
      // testShuffle(exports)
      // testExtractLane(exports)
      // testReplaceLane(exports)
      testAdd(exports)
      testSubtract(exports)
    }
  )
