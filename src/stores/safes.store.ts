import { SupportedChains } from '@/enums'
import { DetailsForSafe, ListOfSafesFromDelegateEndpoint, ListSafesForSigner } from '@/interfaces'
import { uniquePredicate } from '@/utils'
import { create } from 'zustand'

export const useSafesStore = create<{
    // wallet
    currentChainId: SupportedChains
    currentWalletAddress: string

    // raw data from gnosis
    safesWithAddressAsSignerOrProposer: {
        chainId: SupportedChains
        safes: { asSigner: ListSafesForSigner; asProposer: ListOfSafesFromDelegateEndpoint }
    }[]
    safesDetails: { chainId: SupportedChains; safes: { address: string; details: DetailsForSafe }[] }[]

    // set
    actions: {
        setCurrentChainId: (currentChainId: SupportedChains) => void
        setCurrentWalletAddress: (currentWalletAddress: string) => void
        setSafesWithAddressAsSignerOrProposer: (
            data: { chainId: SupportedChains; safes: { asSigner: ListSafesForSigner; asProposer: ListOfSafesFromDelegateEndpoint } }[],
        ) => void
        setSafesDetails: (data: { chainId: SupportedChains; safes: { address: string; details: DetailsForSafe }[] }[]) => void
    }

    // get
    computeds: {
        getSafesByChains: () => { chainId: SupportedChains; safes: string[] }[]
        getApplicationData: () => {
            // meta
            chain: SupportedChains
            address: string

            // config
            signers: string[]
            proposers: string[]
            delegators: string[]

            // helpers
            isCurrentWalletSigner: boolean
            isCurrentWalletProposer: boolean
            isCurrentWalletDellegators: boolean

            // historic
            historicsTxs: unknown[]
            pendingTxs: unknown[]

            // debank
            debank: unknown
        }[]
    }
}>((set, get) => ({
    // wallet
    currentChainId: SupportedChains.ETH,
    currentWalletAddress: '',

    // raw data
    safesWithAddressAsSigner: [],
    safesWithAddressAsProposer: [],
    safesWithAddressAsSignerOrProposer: [],
    safesDetails: [],

    // set
    actions: {
        setCurrentChainId: (currentChainId) => set(() => ({ currentChainId })),
        setCurrentWalletAddress: (currentWalletAddress) => set(() => ({ currentWalletAddress })),
        setSafesWithAddressAsSignerOrProposer: (safesWithAddressAsSignerOrProposer) => set(() => ({ safesWithAddressAsSignerOrProposer })),
        setSafesDetails: (safesDetails) => set(() => ({ safesDetails })),
    },

    // get
    computeds: {
        getSafesByChains: () => {
            const data: { chainId: SupportedChains; safes: string[] }[] = []
            const localSafesWithAddressAsSignerOrProposer = get().safesWithAddressAsSignerOrProposer

            // for each chain
            for (let chainIndex = 0; chainIndex < localSafesWithAddressAsSignerOrProposer.length; chainIndex++) {
                // ease access
                const { chainId, safes } = localSafesWithAddressAsSignerOrProposer[chainIndex]

                // prepare
                let dataChainIdIndex = data.findIndex((chain) => chain.chainId === chainId)
                if (dataChainIdIndex < 0) {
                    data.push({ chainId, safes: [] })
                    dataChainIdIndex = data.findIndex((chain) => chain.chainId === chainId)
                }

                // get all vaults
                const safesAsSigner = safes.asSigner.safes
                const safesAsProposer = safes.asProposer.results.map((result) => result.safe)
                const uniqSafes = [...data[dataChainIdIndex].safes, ...safesAsSigner, ...safesAsProposer].filter(uniquePredicate)
                data[dataChainIdIndex].safes = uniqSafes
            }

            // end
            return data
        },
        getApplicationData: () => [],
    },
}))
