const GEN_ID_BASE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GEN_ID_LENGTH = 64
export const genId = () => {
    const now = Date.now().toString(36)
    const len = GEN_ID_LENGTH - now.length
    const mapper = GEN_ID_BASE.split('').sort(() => 0.5 - Math.random())
    const arr = Array(len).fill('').map(s => s + mapper[GEN_ID_BASE.length * Math.random() >> 0])
    arr.splice((len / 2) >> 0, 0, now)
    return ('' + arr.join('')).slice(0, len)
}