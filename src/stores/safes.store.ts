import { SupportedChains } from '@/enums'
import { AggregatedSafeData } from '@/interfaces'
import { create } from 'zustand'

export const useSafesStore = create<{
    // ui
    isHoveringLoggedWallet: boolean

    // wallet
    currentChainId: SupportedChains
    currentWalletAddress: string

    // app data
    applicationData: { chainId: SupportedChains; safes: AggregatedSafeData[] }[]

    // set
    actions: {
        setIsHoveringLoggedWallet: (isHoveringLoggedWallet: boolean) => void
        setCurrentChainId: (currentChainId: SupportedChains) => void
        setCurrentWalletAddress: (currentWalletAddress: string) => void
        setApplicationData: (data: { chainId: SupportedChains; safes: AggregatedSafeData[] }[]) => void
    }

    // get
    computeds: Record<string, () => void>
}>((set) => ({
    isHoveringLoggedWallet: false,

    // wallet
    currentChainId: SupportedChains.ETH,
    currentWalletAddress: '',

    // app data
    applicationData: [],

    // set
    actions: {
        setIsHoveringLoggedWallet: (isHoveringLoggedWallet) => set(() => ({ isHoveringLoggedWallet })),
        setCurrentChainId: (currentChainId) => set(() => ({ currentChainId })),
        setCurrentWalletAddress: (currentWalletAddress) => set(() => ({ currentWalletAddress })),
        setApplicationData: (applicationData) => set(() => ({ applicationData })),
    },

    // get
    computeds: {},
}))
