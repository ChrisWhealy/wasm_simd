const IDIOT = v => v
const successIcon = '✅'
const failureIcon = '❌'

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
      fn = bitLen => val => `0x${val.toString(base).padStart(bitLen >>> 2, '0')}`
      break

    default:
  }

  return fn
}

const u8AsChar = u8 => u8 < 32 ? '⚬' : String.fromCharCode(u8)
const charBlock = ([...u8vals]) => u8vals.reduce((acc, u8) => acc += u8AsChar(u8), "")

const binToStr = formatAsBase(2)
const u8AsBinStr = binToStr()
const i32AsBinStr = i32 =>
  u8AsBinStr(i32 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 8 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 16 & 0x000000FF) + ' ' +
  u8AsBinStr(i32 >>> 24)

const hexToStr = formatAsBase(16)

const numFormatters = new Map()
numFormatters.set('i8', hexToStr(8))
numFormatters.set('i16', hexToStr(16))
numFormatters.set('i32', hexToStr(32))
numFormatters.set('i64', hexToStr(64))
numFormatters.set('f32', n => n.toLocaleString("fullwide", { useGrouping: false, maximumSignificantDigits: 20 }))
numFormatters.set('f64', n => n.toLocaleString("fullwide", { useGrouping: false, maximumSignificantDigits: 30 }))

const formatArrayOf = type => {
  let formatFn = numFormatters.get(type)

  return arr => {
    let arrayOfStr = arr.reduce((acc, b) => (_ => acc)(acc.push(formatFn(b))), [])
    return `[${arrayOfStr.join(',')}]`
  }
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
    'Expected array length', expected.value, IDIOT,
    'Received array length', received, IDIOT
  )

export const errSimpleEq = (testPrefix, expectedPrefix, expected, receivedPrefix, received) =>
  formatErrMsg(
    testPrefix,
    expectedPrefix, expected.value, numFormatters.get(expected.type),
    receivedPrefix, received.value, numFormatters.get(expected.type)
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
