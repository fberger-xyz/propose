import { SupportedChains } from '@/enums'
import { AggregatedSafeData } from '@/interfaces'
import { create } from 'zustand'

export const useSafesStore = create<{
    // wallet
    currentChainId: SupportedChains
    currentWalletAddress: string

    // app data
    applicationData: { chainId: SupportedChains; safes: AggregatedSafeData[] }[]

    // set
    actions: {
        setCurrentChainId: (currentChainId: SupportedChains) => void
        setCurrentWalletAddress: (currentWalletAddress: string) => void
        setApplicationData: (data: { chainId: SupportedChains; safes: AggregatedSafeData[] }[]) => void
    }

    // get
    computeds: Record<string, () => void>
}>((set) => ({
    // wallet
    currentChainId: SupportedChains.ETH,
    currentWalletAddress: '',

    // app data
    applicationData: [],

    // set
    actions: {
        setCurrentChainId: (currentChainId) => set(() => ({ currentChainId })),
        setCurrentWalletAddress: (currentWalletAddress) => set(() => ({ currentWalletAddress })),
        setApplicationData: (applicationData) => set(() => ({ applicationData })),
    },

    // get
    computeds: {},
}))
