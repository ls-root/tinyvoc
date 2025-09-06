// Balken.js costum library for TinyVoc
// by lsroot
// Licsense: GPLv3

const length = 30
const text = "Hello, World"
const filled = 10
const sep = "-"
const fillsep = "="

function mkBannerProgress(text, width, sep, fillsep, fill) {
  const textLen = text.length
  const barLen = width

  const pad = barLen - textLen
  const lpad = Math.floor(pad / 2)
  const rpad = Math.ceil(pad / 2)

  const leftFill = Math.min(fill, lpad)
  const rightFill = Math.max(0, fill - leftFill)

  const left = fillsep.repeat(leftFill) + sep.repeat(lpad - leftFill)
  const right = fillsep.repeat(rightFill) + sep.repeat(rpad - rightFill)

  return left + text + right
}

console.log(mkBanner(text, length, sep, fillsep, filled))
