import { AppPagePaths, IconIds, SupportedChains } from '../enums'

export interface InterfaceAppLink {
    name: string
    path: AppPagePaths
    icon?: IconIds
    auth: boolean
    description?: string
    sublinks: InterfaceAppLink[]
}

export interface APIResponse<Data> {
    data?: Data
    error: string
}

export interface SupportedChainConfig {
    id: SupportedChains
    index: number
    name: string
    gnosisPrefix: string
    transactionService: {
        url: string
    }
}
