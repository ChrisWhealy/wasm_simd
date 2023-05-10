import { startWasmModule } from "../utils/wasm.mjs"
import { initialiseSharedMemory } from '../utils/memory.mjs'
import { toReversed } from "../utils/array.mjs"

import testSplat from './splat.mjs'
import testExtractLane from './extract_lane.mjs'
import testReplaceLane from './replace_lane.mjs'
import testSwizzle from './swizzle.mjs'
import testShuffle from './shuffle.mjs'
import testAdd from './add.mjs'
import testSubtract from './subtract.mjs'
import testMultiply from './multiply.mjs'


// Polyfill the TypedArray subclasses
Uint8Array.prototype.toReversed = toReversed
Uint16Array.prototype.toReversed = toReversed
Uint32Array.prototype.toReversed = toReversed
BigUint64Array.prototype.toReversed = toReversed
Int8Array.prototype.toReversed = toReversed
Int16Array.prototype.toReversed = toReversed
Int32Array.prototype.toReversed = toReversed
BigInt64Array.prototype.toReversed = toReversed

Float32Array.prototype.toReversed = toReversed
Float64Array.prototype.toReversed = toReversed

const wasmFilePath = "./bin/simd.wasm"

const SEPARATOR = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *"
const genHeader = msg => {
  let padWidth = msg.length + Math.ceil(SEPARATOR.length / 2 - msg.length / 2)
  return `${SEPARATOR}\n${msg.padStart(padWidth, ' ')}\n${SEPARATOR}`
}

startWasmModule(wasmFilePath)
  .then(
    ({ exports }) => {
      initialiseSharedMemory(exports.memory.buffer)

      console.log(genHeader('Construct SIMD Values'))
      testSplat(exports)
      testSwizzle(exports)
      testShuffle(exports)

      console.log(genHeader('Access Vector Lanes'))
      testExtractLane(exports)
      testReplaceLane(exports)

      console.log(genHeader('Integer Arithmetic'))
      testAdd(exports)
      testSubtract(exports)
      testMultiply(exports)
    }
  )
