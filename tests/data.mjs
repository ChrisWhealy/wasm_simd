// Warning: When retrieved from a Float32Array, the various Math constants will have been rounded
// to a 23-bit mantissa and thus will no longer exactly equal the original value
//
// Beware!   (new Float32Array([Math.PI]))[0] === Math.PI   // false
export const float32TestValues = new Float32Array([Math.PI, Math.E, Math.SQRT2, Math.LOG10E])
export const float64TestValues = new Float64Array([Math.PI, Math.E, Math.SQRT2, Math.LOG10E])
export const simdDatatypes = (m => {
  m.set('i8', 0xff)
  m.set('i16', 0x0a0b)
  m.set('i32', 0xdeadbeef)
  m.set('i64', 0x0001020304050607n)
  m.set('f32', float32TestValues[0])
  m.set('f64', float64TestValues[1])

  return m
})(new Map())

export const u8ArrayBottomUp = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
export const u8ArrayEvens = new Uint8Array([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30])
export const u8ArrayEvensfrom0x60 = new Uint8Array([0x60, 0x62, 0x64, 0x66, 0x68, 0x6A, 0x6C, 0x6E, 0x70, 0x72, 0x74, 0x76, 0x78, 0x7A, 0x7C, 0x7E])
export const u8ArrayShuffled = new Uint8Array([0x00, 0xF1, 0x02, 0xF3, 0x04, 0xF5, 0x06, 0xF7, 0x08, 0xF9, 0x0A, 0xFB, 0x0C, 0xFD, 0x0E, 0xFF])
export const u8ArrayTopDown = new Uint8Array([255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 244, 243, 242, 241, 240])
export const u8SwizzleIndices = new Uint8Array([3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8, 15, 14, 13, 12])

export const u16ArrayLowEvens = new Uint16Array([0, 2, 4, 6, 8, 10, 12, 14])
export const u16ArrayHighEvens = new Uint16Array([16, 18, 20, 22, 24, 26, 28, 30])
export const u16ArrayEvenPairs = new Uint16Array([0x0200, 0x0604, 0x0A08, 0x0E0C, 0x1210, 0x1614, 0x1A18, 0x1E1C])
export const u16ArrayFrom0x60 = new Uint16Array([0x6360, 0x6764, 0x6B68, 0x6F6C, 0x7370, 0x7774, 0x7B78, 0x7F7C])
export const u16ArrayFrom0xe0 = new Uint16Array([0xE000, 0xE200, 0xE400, 0xE600, 0xE800, 0xEA00, 0xEC00, 0xEE00])
export const u16ArrayTopDown = new Uint16Array([0xFEFF, 0xFCFD, 0xFAFB, 0xF8F9, 0xF6F7, 0xF4F5, 0xF2F3, 0xF0F1])

export const i16ArrayNegLowEvens = new Int16Array([0, -2, -4, -6, -8, -10, -12, -14])
export const i16ArrayNegHighEvens = new Int16Array([-16, -18, -20, -22, -24, -26, -28, -30])

export const u32ArrayEvens = new Uint32Array([0x06040200, 0x0E0C0A08, 0x16141210, 0x1E1C1A18])
export const u32ArrayOdds = new Uint32Array([0x67656360, 0x6F6D6B68, 0x77757370, 0x7F7D7B78])
export const u32ArrayTopDown = new Uint32Array([0xFCFDFEFF, 0xF8F9FAFB, 0xF4F5F6F7, 0xF0F1F2F3])

export const u32ArrayLowEvens = new Uint32Array([0, 2, 4, 6])
export const u32ArrayHighEvens = new Uint32Array([8, 10, 12, 14])
export const i32ArrayNegLowEvens = new Int32Array([0, -2, -4, -6])
export const i32ArrayNegHighEvens = new Int32Array([-8, -10, -12, -14])

export const u64ArrayEvens = new BigUint64Array([0x0E0C0A0806040200n, 0x1E1C1A1816141210n])
export const u64ArrayOddsFrom0x60 = new BigUint64Array([0x6F6D6B6967656360n, 0x7F7D7B7977757370n])
export const u64ArrayTopDown = new BigUint64Array([0xF8F9FAFBFCFDFEFFn, 0xF0F1F2F3F4F5F6F7n])

export const u64ArrayLowEvens = new BigUint64Array([0n, 2n])
export const u64ArrayHighEvens = new BigUint64Array([4n, 6n])
export const i64ArrayNegLowEvens = new BigInt64Array([0n, -2n])
export const i64ArrayNegHighEvens = new BigInt64Array([-4n, -6n])

export const i16Data = [0xFFFE, 0xFDFC, 0xFBFA, 0xF9F8, 0xF7F6, 0xF5F4, 0xF3F2, 0xF1F0]
export const i32Data = [0xFFFEFDFC, 0xFBFAF9F8, 0xF7F6F5F4, 0xF3F2F1F0]
export const i64Data = [0xFFFEFDFCFBFAF9F8n, 0xF7F6F5F4F3F2F1F0n]

export const u8DataSplat = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
export const i16DataSplat = [0xFFFE, 0xFFFE, 0xFFFE, 0xFFFE, 0xFFFE, 0xFFFE, 0xFFFE, 0xFFFE]
export const i32DataSplat = [0xFFFEFDFC, 0xFFFEFDFC, 0xFFFEFDFC, 0xFFFEFDFC]
export const i64DataSplat = [0xFFFEFDFCFBFAF9F8n, 0xFFFEFDFCFBFAF9F8n]

export const f32DataSplat = [float32TestValues[0], float32TestValues[0], float32TestValues[0], float32TestValues[0]]
export const f64DataSplat = [float64TestValues[0], float64TestValues[0]]

export const u32ArrayDotResult = new Int32Array([1, 13, 41, 85])
