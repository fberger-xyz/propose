/**
 * signer
 */

import { SupportedChains } from '@/enums'

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

/**
 * aggregation
 */

export interface AggregatedSafeData {
    // meta
    chainId: SupportedChains
    address: string
    alsoDeployedOnChains: SupportedChains[]

    // raw
    generalDetails?: DetailsForSafe
    proposerDetails?: {
        safe: string
        delegate: string
        delegator: string
        label: string
        expiryDate: null
    }

    // helpers
    isCurrentWalletSigner: boolean
    isCurrentWalletProposer: boolean
    isCurrentWalletDellegators: boolean

    // txs
    historicsTxs: unknown[]
    pendingTxs: unknown[]

    // debank
    debank: unknown
}
