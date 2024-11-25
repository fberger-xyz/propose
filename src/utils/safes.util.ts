import { SupportedChains } from '@/enums'
import { AggregatedSafeData } from '@/interfaces'

export const NewAggregatedSafeData = (chainId: SupportedChains, address: string): AggregatedSafeData => ({
    // meta
    chainId,
    address,
    alsoDeployedOnChains: [],

    // raw
    generalDetails: undefined,
    proposerDetails: undefined,
    safeCreation: undefined,
    balances: [],

    // helpers
    isCurrentWalletSigner: false,
    isCurrentWalletProposer: false,
    isCurrentWalletDellegators: false,

    // txs
    historicsTxs: [],
    pendingTxs: [],

    // debank
    debank: undefined,
})
