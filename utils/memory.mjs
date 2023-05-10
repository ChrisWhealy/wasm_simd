import {
  float32TestValues,
  float64TestValues
} from "../tests/data.mjs"

/***
 * The host environment and the WASM module must have shared knowledge of the memory map
 *
 * 0000-000F 16 x 8-bit unsigned integers
 * 0010-001F 16 x 8-bit signed integers
 * 0020-002F  8 x 16-bit unsigned integers
 * 0030-003F  8 x 16-bit signed integers
 * 0040-004F  4 x 32-bit signed integers
 * 0050-005F  4 x 32-bit floats
 * 0060-006F  2 x 64-bit signed integers
 * 0070-007F  2 x 64-bit floats
 * 0080-008F 16 x i8 swizzle indices
 * 0090-009F Arbitrary v128 data
 * 00A0-00AF 1st Shuffle arg data
 * 00B0-00BF 2nd Shuffle arg data
 * 00C0-00CF Values that will overflow when added/multiplied etc
 * 00D0-00DF Values that will overflow when added/multiplied etc
 */
export const initialiseSharedMemory = wasmMemoryBuffer => {
  // 0000-000F   8-bit unsigned integers
  // 0010-001F   8-bit signed integers
  //
  // 0000-000F  0x00010203 0x04050607 0x08090A0B 0x0C0D0E0F
  // 0010-001F  0x80818283 0x84858687 0x88898A8B 0x8C8D8E8F
  let wasmMem8u = new Uint8Array(wasmMemoryBuffer)

  for (let i8 = 0; i8 < 16; i8++) {
    wasmMem8u[i8] = i8
    wasmMem8u[i8 + 16] = i8 | 0x80  // Flip sign bit
  }

  // 0020-002F  16-bit unsigned integers
  // 0030-003F  16-bit signed integers
  //
  // 0020-002F  0x00000001 0x00020003 0x00040005 0x00060007
  // 0030-003F  0x80008001 0x80028003 0x80048005 0x80068007
  let wasmMem16 = new Uint16Array(wasmMemoryBuffer)

  for (let i16 = 16; i16 < 24; i16++) {
    wasmMem16[i16] = i16 - 16
    wasmMem16[i16 + 8] = (i16 - 16) | 0x8000  // Flip sign bit
  }

  // 0040-004F  32-bit signed integers
  // 0050-005F  32-bit floats
  //
  // 0040-004F  0x00000001 0x00000002 0x00000003 0x00000004
  // 0050-005F  Math.PI    Math.E     Math.SQRT2 Math.LOG10E
  let wasmMem32i = new Uint32Array(wasmMemoryBuffer)
  let wasmMem32f = new Float32Array(wasmMemoryBuffer)

  for (let i32 = 16; i32 < 20; i32++) {
    wasmMem32i[i32] = i32 - 16
    wasmMem32f[i32 + 4] = float32TestValues[i32 - 16]
  }

  // 0060-006F  64-bit signed integers
  // 0070-007F  64-bit floats
  //
  // 0060-006F  0x000000000000001 0x0000000000000002
  // 0070-007F  Math.PI           Math.E
  let wasmMem64i = new BigInt64Array(wasmMemoryBuffer)
  let wasmMem64f = new Float64Array(wasmMemoryBuffer)

  for (let i64 = 12; i64 < 14; i64++) {
    wasmMem64i[i64] = BigInt(i64 - 12)
    wasmMem64f[i64 + 2] = float64TestValues[i64 - 12]
  }

  // 0080-008F  16, 8-bit swizzle indices [0x0F..0x00]
  //
  // 0080-008F  0x0F0E0D0C 0x0B0A0908 0x07060504 0x03020100
  for (let i = 128; i < 144; i++) {
    wasmMem8u[i] = 15 - (i - 128)
  }

  // 0090-009F  Arbitrary v128 data
  wasmMem32i[36] = 0xDEADBEEF  // Dead Beef
  wasmMem32i[37] = 0xCAFED00D  // Cafe dood
  wasmMem32i[38] = 0xBADDECAF  // Bad Decaf
  wasmMem32i[39] = 0x0DDC15C0  // Odd Cisco

  // 00A0-00AF  1st Shuffle arg data
  // 00B0-00BF  2nd Shuffle arg data
  //
  // 00A0-00AF  0x00010203 0x04050607 0x08090A0B 0x0C0D0E0F
  // 00B0-00BF  0x80818283 0x84858687 0x88898A8B 0x8C8D8E8F
  for (let i = 160; i < 176; i++) {
    wasmMem8u[i] = i - 160
    wasmMem8u[i + 16] = i + 80  // Switch senior bits to 1111
  }

  // 00C0-00CF  Values that will overflow when added/multiplied
  // 00D0-00DF  Values that will overflow when added/multiplied
  //
  // 00C0-00CF  0x70717273 0x74757677 0x78797A7B 0x7C7D7E7F
  // 00D0-00DF  0xF0F1F2F3 0xF4F5F6F7 0xF8FFFAFB 0xFCFDFEFF
  for (let i = 192; i < 208; i++) {
    wasmMem8u[i] = 112 + (i - 192)       // Set senior bits to 0111
    wasmMem8u[i + 16] = 240 + (i - 192)  // Set senior bits to 1111
  }
}

/***
 * Return a memory overlay appropriate to the required datatype
 */
export const typedArrayForMemoryBuffer = wasmMemBuffer =>
  dt => {
    let wasmMem = null
    let scaleFactor = 0

    switch (dt) {
      case 'i8':
        wasmMem = new Uint8Array(wasmMemBuffer)
        break

      case 'i16':
        wasmMem = new Uint16Array(wasmMemBuffer)
        scaleFactor = 1
        break

      case 'i32':
        wasmMem = new Uint32Array(wasmMemBuffer)
        scaleFactor = 2
        break

      case 'i64':
        wasmMem = new BigInt64Array(wasmMemBuffer)
        scaleFactor = 3
        break

      case 'f32':
        wasmMem = new Float32Array(wasmMemBuffer)
        scaleFactor = 2
        break

      case 'f64':
        wasmMem = new Float64Array(wasmMemBuffer)
        scaleFactor = 3
        break
    }

    return { wasmMem, scaleFactor }
  }
