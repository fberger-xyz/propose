/**
 * signer
 */

export interface ListSafesForSigner {
    safes: string[]
}

/**
 * proposer
 */

export interface ListSafesForDelegate {
    count: number
    next: null
    previous: null
    results: {
        safe: string
        delegate: string
        delegator: string
        label: string
        expiryDate: null
    }[]
}
