import { startWasmModule } from "./utils/wasm.mjs"
import {
  startWasmModule,
  u8AsBinStr,
  i32AsBinStr,
  i32AsHexStr,
  i64AsHexStr,
} from "./utils/format.mjs"

const wasmFilePath = "./bin/simd.wasm"

const simdDatatypes = new Map()
simdDatatypes.set('i8', 0xff)
simdDatatypes.set('i16', 0x0a0b)
simdDatatypes.set('i32', 0xdeadbeef)
simdDatatypes.set('i64', 0x0001020304050607n)
simdDatatypes.set('f32', Math.PI)
simdDatatypes.set('f64', Math.E)

const initialiseMem = wasmMem32 => (start, end) => {
  for (let i = start; i < end; i++) {
    wasmMem32[i] = 0x00000000
  }
}

const test_extract_lane_3_signed = (wasmMem32, wasmFn, fnName) => {
  console.group(`WASM ${fnName}`)
  console.log(wasmFn())
  console.groupEnd()
}

startWasmModule(wasmFilePath)
  .then(
    ({ exports }) => {
      let wasmMem32 = new Uint32Array(exports.memory.buffer)
      let initWasmMem32 = initialiseMem(wasmMem32)

      test_swizzle(wasmMem32, exports.swizzle)

      // initWasmMem32(0, 4)
      simdDatatypes.forEach((testVal, dt) => {
        let fnName = `splat_${dt}`
        test_splat(wasmMem32, exports[fnName], fnName, testVal)
      })

      test_extract_lane_3_signed(wasmMem32, exports.extract_lane_3_i8_signed, 'extract_lane_3_i8_signed')
    }
  )
