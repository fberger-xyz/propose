import { SupportedChains } from '@/enums'
import { SupportedChainConfig } from '@/interfaces'

// refer to https://docs.safe.global/core-api/api-overview
export const SUPPORTED_CHAINS: Record<SupportedChains, SupportedChainConfig> = {
    [SupportedChains.ETH]: {
        index: 1,
        id: SupportedChains.ETH,
        name: 'Ethereum',
        gnosisPrefix: 'eth',
        transactionService: {
            url: 'https://safe-transaction-mainnet.safe.global',
        },
    },
    [SupportedChains.ARBITRUM]: {
        index: 2,
        id: SupportedChains.ARBITRUM,
        name: 'Arbitrum',
        gnosisPrefix: 'arb1',
        transactionService: {
            url: 'https://safe-transaction-arbitrum.safe.global',
        },
    },
    [SupportedChains.BASE]: {
        index: 3,
        id: SupportedChains.BASE,
        name: 'Base',
        gnosisPrefix: 'base',
        transactionService: {
            url: 'https://safe-transaction-base.safe.global',
        },
    },
    [SupportedChains.GNOSIS]: {
        index: 4,
        id: SupportedChains.GNOSIS,
        name: 'Gnosis',
        gnosisPrefix: 'gno',
        transactionService: {
            url: 'https://safe-transaction-gnosis-chain.safe.global',
        },
    },
}
