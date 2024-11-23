/**
 * signer
 */

export interface ListSafesForSigner {
    safes: string[]
}

/**
 * proposer
 */

export interface ListOfSafesFromDelegateEndpoint {
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

/**
 * details
 */

export interface DetailsForSafe {
    address: string
    nonce: number
    threshold: number
    owners: string[]
    masterCopy: string
    modules: unknown[]
    fallbackHandler: string
    guard: string
    version: string
}
