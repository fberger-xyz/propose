import numeral from 'numeral'

export const shortenAddress = (address: string, chars = 4) => {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}
export const shortenStr = (str: string, max = 20) => {
    if (str.length <= max) return str
    return `${str.slice(0, max - 3).trim()}...`
}
export const prettify = (data: unknown) => JSON.stringify(data, null, 2)

export const formatNumberWithDecimals = (numberAsString: string | number, decimals: number, precision = 1) => {
    try {
        if (!decimals || isNaN(decimals)) return 'error parse bigint'
        return numeral(numberAsString)
            .divide(10 ** decimals)
            .format(`0,0.${Array(precision).fill(0).join('')}a`)
    } catch (error) {
        return JSON.stringify(error)
    }
}

export const stringify: typeof JSON.stringify = (value, replacer, space) =>
    JSON.stringify(
        value,
        (key, value_) => {
            const value = typeof value_ === 'bigint' ? value_.toString() : value_
            return typeof replacer === 'function' ? replacer(key, value) : value
        },
        space,
    )
