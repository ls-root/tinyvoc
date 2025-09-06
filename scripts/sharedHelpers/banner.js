// bannerHelpers.js - Banner generators

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

function mkbanner(text, width, sep) {
  const pad = width - text.length
  const l = Math.floor(pad / 2),
    r = Math.ceil(pad / 2)
  return sep.repeat(l) + text + sep.repeat(r)
}
export { mkbanner, mkBannerProgress }
