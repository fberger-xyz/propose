export * from './cn.util'
export * from './error.util'
export * from './date.util'
export * from './format.util'
export * from './requests.util'
export * from './safes.util'

export const copyToClipboard = (value: string) => {
    try {
        navigator.clipboard.writeText(value)
    } catch (error) {
        console.log(error)
    }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const uniquePredicate = (value: unknown, index: number, array: unknown[]) => array.indexOf(value) === index
