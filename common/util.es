const escapeRegExp = (str) => {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}

export const generateRandomString = function(length) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array.apply(null, {length}).map(() => ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))).join('')
}

export const throwError = (message) => {
  throw new Error(`[hexo-tag-aplayer] ${message}`)
}

export const clone = (object) => {
  return JSON.parse(JSON.stringify(object))
}

export const extractOptionValue = (pair) => {
  return pair.slice(pair.indexOf(':') + 1)
}

export const removeAll = (target, find) => {
  return target.replace(new RegExp(escapeRegExp(find), 'g'), '')
}