const IDIOT = v => v
const successIcon = '✅'
const failureIcon = '❌'

const bigIntAbs = n => n < 0 ? -n : n

// Format a single byte as a binary string
const formatAsBinaryStr = b => b.toString(2).padStart(8, '0')

// Format `bitLen` bits as a hexadecimal string where bitLen is a multiple of 8
const formatAsHexStr = bitLen => {
  let ceil = Math.pow(2, bitLen)
  let digits = bitLen >>> 2

  // Ensure that we always return the unsigned representation of v
  return v => `0x${((v < 0) ? ceil + v : v).toString(16).padStart(digits, '0')}`
}
const formatAsBigHexStr = bitLen => {
  let ceil = 2 << bitLen

  // Ensure that we always return the unsigned representation of v
  return v => `0x${((v < 0) ? BigInt(ceil) - v : v).toString(16).padStart(bitLen >>> 2, '0')}`
}

const u8AsChar = u8 => u8 < 32 ? '⚬' : String.fromCharCode(u8)
const charBlock = ([...u8vals]) => u8vals.reduce((acc, u8) => acc += u8AsChar(u8), "")

const i32AsBinStr = i32 =>
  formatAsBinaryStr(i32 & 0x000000FF) + ' ' +
  formatAsBinaryStr(i32 >>> 8 & 0x000000FF) + ' ' +
  formatAsBinaryStr(i32 >>> 16 & 0x000000FF) + ' ' +
  formatAsBinaryStr(i32 >>> 24)

const formatOpts = digits => ({ useGrouping: false, maximumSignificantDigits: Math.min(digits, 21) })

export const numFormatters = new Map()
// Hex conversion always ignores the sign, in spite of the fact that these datatypes are identified as i8 or i16 etc
numFormatters.set('i8', formatAsHexStr(8))
numFormatters.set('i16', formatAsHexStr(16))
numFormatters.set('i32', formatAsHexStr(32))
numFormatters.set('i64', formatAsBigHexStr(64))
numFormatters.set('f32', n => n.toLocaleString("fullwide", formatOpts(16)))
numFormatters.set('f64', n => n.toLocaleString("fullwide", formatOpts(21)))

const formatArrayOf = type => {
  let formatFn = numFormatters.get(type)

  return arr => `[${arr.reduce((acc, b) => (_ => acc)(acc.push(formatFn(b))), []).join(', ')}]`
}

const formatErrMsg = (
  testPrefix,
  expectedPrefix, expectedValue, formatFn1,
  receivedPrefix, receivedValue, formatFn2
) => ({
  logFn: 'error',
  msg: `${failureIcon} ${testPrefix} failed\n${expectedPrefix}${formatFn1(expectedValue)}\n${receivedPrefix}${formatFn2(receivedValue)}`
})

export const genFunctionNameForGroup = testGroup =>
  (suffix, dt, isSigned) =>
    `${testGroup}${suffix === '' ? '' : `_${suffix}`}${dt === '' ? '' : `_${dt}`}${isSigned === null ? '' : isSigned ? '_s' : '_u'}`

export const testSuccess = testPrefix => ({
  logFn: 'log',
  msg: `${successIcon} ${testPrefix} passed`
})

export const errLengthMismatch = (testPrefix, expected, received) =>
  formatErrMsg(
    testPrefix,
    'Expected array of length', expected.value, IDIOT,
    'Received array of length', received, IDIOT
  )

export const errSimpleEq = (testPrefix, expectedPrefix, expected, receivedPrefix, received) =>
  formatErrMsg(
    testPrefix,
    expectedPrefix, expected.value, numFormatters.get(expected.type),
    receivedPrefix, received, numFormatters.get(expected.type)
  )

export const errOneToMany = (testPrefix, expectedPrefix, expected, receivedPrefix, received) =>
  formatErrMsg(
    testPrefix,
    expectedPrefix, expected.value, numFormatters.get(expected.type),
    receivedPrefix, formatArrayOf(expected.type)(received), IDIOT
  )

export const errPointwise = (testPrefix, expectedPrefix, expected, receivedPrefix, received) =>
  (formatFn => formatErrMsg(
    testPrefix,
    expectedPrefix, formatFn(expected.value), IDIOT,
    receivedPrefix, formatFn(received), IDIOT
  ))(formatArrayOf(expected.type))
