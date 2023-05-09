import { startWasmModule } from "./utils/wasm.mjs"
import { assert } from "./utils/test.mjs"

const wasmFilePath = "./bin/f32.wasm"

// Storing Math.PI in an F32Array then reading it back does not return Math.PI, but 3.1415927410125732
const piRounded = (new Float32Array([Math.PI]))[0]

const expectPi = { value: Math.PI, type: 'f32' }
const expectPiImprecise = { value: Math.PI, type: 'f32' }
const expectPiRounded = { value: piRounded, type: 'f32' }

startWasmModule(wasmFilePath)
  .then(
    ({ exports }) => {
      let assert_eq = assert('Floating point tests', 'SIMPLE_EQ')
      let wasmMem32f = new Float32Array(exports.memory.buffer)

      wasmMem32f[0] = Math.PI    // JavaScript's value of π
      wasmMem32f[1] = piRounded  // The imprecise value of π

      // Reading Math.PI back from an F32 or F64 array gives different results
      let f32Array = new Float32Array([Math.PI])
      let f64Array = new Float64Array([Math.PI])
      assert_eq('f32_from_array_precise', expectPi, f32Array[0])
      assert_eq('f32_from_array_imprecise', expectPiImprecise, f32Array[0])
      assert_eq('f64_from_array', { value: Math.PI, type: 'f64' }, f64Array[0])

      // Transporting certain float values between JS and WASM also gives different result
      assert_eq('f32_wasm_echo_precise', expectPi, exports.f32_echo(Math.PI))
      assert_eq('f32_wasm_echo_imprecise', expectPiRounded, exports.f32_echo(piRounded))

      assert_eq('f32_wasm_hardcoded', expectPi, exports.f32_hardcoded())

      assert_eq('f32_from_shared_memory_precise', expectPi, exports.f32_from_memory(0))
      assert_eq('f32_from_shared_memory_imprecise', expectPiRounded, exports.f32_from_memory(4))
    }
  )
