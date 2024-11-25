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
 * creation
 */

export interface SafeCreation {
    created: string
    creator: string
    transactionHash: string
    factoryAddress: string
    masterCopy: string
    setupData: string
    saltNonce: null
    dataDecoded: null
    userOperation: null
}

/**
 * balances
 */

export interface SafeBalance {
    tokenAddress: null | string
    token: null | {
        name: string
        symbol: string
        decimals: number
        logoUri: string
    }
    balance: string
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
    safeCreation?: SafeCreation
    balances: SafeBalance[]

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
