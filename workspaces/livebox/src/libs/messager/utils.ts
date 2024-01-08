const GEN_ID_BASE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GEN_ID_LENGTH = 32
export const genId = () => {
    const now = Date.now().toString(36)
    const len = GEN_ID_LENGTH - now.length
    const mapper = GEN_ID_BASE.split('').sort(() => 0.5 - Math.random())
    const arr = Array(len).fill('').map(s => s + mapper[GEN_ID_BASE.length * Math.random() >> 0])
    arr.splice((len / 2) >> 0, 0, now)
    return ('' + arr.join('')).slice(0, len)
}


// const isObject = (v: any): v is Record<string, any> => Object.prototype.toString.call(v) === '[object Object]'
// const isString = (v: any): v is string => typeof v === 'string'
// const isMessage = (msg: any): msg is TMessage => {
//     if (!isObject(msg)) {
//         return false
//     }
//     return msg.sender && isString(msg.sender) && msg.target && isString(msg.target) && msg.command && isString(msg.command)
// }

// const m = <T extends Messager>(maker: TCoreMaker, cls: new (config: TMessagerConfig & TMessagerCoreConfig) => T) => {
//     return (config: TMessagerConfig) => {
//         return new cls({ ...config, core: maker(config) })
//     }
// }

