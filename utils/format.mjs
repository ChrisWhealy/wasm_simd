export const successIcon = '✅'
export const failureIcon = '❌'

const formatAsBase = base => {
  let fn = () => { }

  switch (base) {
    case 2:
      // Return a function that formats a single byte as a binary string
      fn = () => val => val.toString(base).padStart(8, '0')
      break

    case 16:
      // Return a function that formats `bitLen` bits as a hexadecimal string
      // bitLen must be a multiple of 8
      fn = bitLen => val => val.toString(base).padStart(bitLen >>> 2, '0')
      break

    default:
  }

  return fn
}

export const genFunctionNameForGroup = testGroup =>
  (suffix, dt, isSigned) =>
    `${testGroup}${suffix === '' ? '' : `_${suffix}`}${dt === '' ? '' : `_${dt}`}${isSigned === null ? '' : isSigned ? '_s' : '_u'}`

export const formatNumber = n => n.toLocaleString("fullwide", { useGrouping: false, maximumSignificantDigits: 20 })
export const formatNumArray = (arr, formatFn) => arr.reduce((acc, b) => (_ => acc)(acc.push(formatFn(b))), []).join(' ')

const u8AsChar = u8 => u8 < 32 ? '⚬' : String.fromCharCode(u8)
export const charBlock = ([...u8vals]) => u8vals.reduce((acc, u8) => acc += u8AsChar(u8), "")

const binToStr = formatAsBase(2)
export const u8AsBinStr = binToStr()
export const i32AsBinStr = i32 =>
  u8AsBinStr(i32 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 8 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 16 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 24)

const hexToStr = formatAsBase(16)
export const i8AsHexStr = hexToStr(8)
export const i16AsHexStr = hexToStr(16)
export const i32AsHexStr = hexToStr(32)
export const i64AsHexStr = hexToStr(64)
