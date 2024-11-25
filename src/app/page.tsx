'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { root } from '@/config/app.config'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { toastStyle } from '@/config/toasts.config'
import { SupportedChains } from '@/enums'
import { AggregatedSafeData, DetailsForSafe, ListOfSafesFromDelegateEndpoint, ListSafesForSigner, SafeBalance, SafeCreation } from '@/interfaces'
import { useQueries } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { useSafesStore } from '@/stores/safes.store'
import { NewAggregatedSafeData } from '@/utils'
import MySafes from '@/components/app/MySafes'

export default function Page() {
    /**
     * log unauthorized if needed
     */

    const searchParams = useSearchParams()
    const unauthorized = searchParams.get('unauthorized') ?? ''
    const account = useAccount()
    if (unauthorized === 'true' && !account?.address) toast.error('You must Sign-in With Ethereum', { style: toastStyle })
    const { actions } = useSafesStore()

    /**
     * test
     */

    const [applicationDataQuery] = useQueries({
        queries: [
            {
                queryKey: ['applicationDataQuery', account.address],
                queryFn: async () => {
                    // prepare
                    const debug = false
                    // const chains = Object.values(SUPPORTED_CHAINS)
                    const chains = [SUPPORTED_CHAINS[42161]]
                    const applicationData: { chainId: SupportedChains; safes: AggregatedSafeData[] }[] = []

                    // ensure wallet is logged
                    if (!account?.address) return applicationData

                    // debug
                    if (debug) console.log({ chains })

                    /**
                     * for each chain
                     */

                    for (let chainIndex = 0; chainIndex < chains.length; chainIndex++) {
                        // ui
                        toast.success(`Loading safes on ${SUPPORTED_CHAINS[chains[chainIndex].id].name}`, { style: toastStyle })

                        // prepare
                        applicationData.push({ chainId: chains[chainIndex].id, safes: [] })
                        const chainIdIndex = applicationData.findIndex((_chain) => _chain.chainId === chains[chainIndex].id)

                        // 1. list safes with address as signer
                        const asSignerEndpoint = `${root}/api/chains/${chains[chainIndex].id}/signers/${account?.address}/safes`
                        const safesWithSigner = await fetch(asSignerEndpoint)
                        if (!safesWithSigner.ok) throw new Error((await safesWithSigner.json()).error)
                        const safesWithSignerJson = (await safesWithSigner.json()) as { data: ListSafesForSigner }

                        // store safes where wallet signs
                        for (let asSignerIndex = 0; asSignerIndex < safesWithSignerJson.data.safes.length; asSignerIndex++) {
                            const toPush = NewAggregatedSafeData(chains[chainIndex].id, safesWithSignerJson.data.safes[asSignerIndex])
                            toPush.isCurrentWalletSigner = true
                            applicationData[chainIdIndex].safes.push(toPush)
                        }

                        // 2. list safes with address as proposer
                        const asProposerEndpoint = `${root}/api/chains/${chains[chainIndex].id}/proposers/${account?.address}/safes`
                        const safesWithProposerReponse = await fetch(asProposerEndpoint)
                        if (!safesWithProposerReponse.ok) throw new Error((await safesWithProposerReponse.json()).error)
                        const safesWithProposerJson = (await safesWithProposerReponse.json()) as { data: ListOfSafesFromDelegateEndpoint }

                        // store safes where wallet proposes
                        for (let asProposerIndex = 0; asProposerIndex < safesWithProposerJson.data.results.length; asProposerIndex++) {
                            const { safe: safeAddress, delegate, delegator } = safesWithProposerJson.data.results[asProposerIndex]
                            let safeIndex = applicationData[chainIdIndex].safes.findIndex((safe) => safe.address === safeAddress)
                            if (safeIndex < 0) {
                                const toPush = NewAggregatedSafeData(chains[chainIndex].id, safeAddress)
                                applicationData[chainIdIndex].safes.push(toPush)
                                safeIndex = applicationData[chainIdIndex].safes.findIndex((safe) => safe.address === safeAddress)
                            }
                            applicationData[chainIdIndex].safes[safeIndex].proposerDetails = safesWithProposerJson.data.results[asProposerIndex]
                            applicationData[chainIdIndex].safes[safeIndex].isCurrentWalletProposer = account.address === delegate
                            applicationData[chainIdIndex].safes[safeIndex].isCurrentWalletDellegators = account.address === delegator
                        }
                    }

                    /**
                     * for each safe
                     */

                    for (let chainIndex = 0; chainIndex < applicationData.length; chainIndex++) {
                        toast(`Fetch safe details`, { style: toastStyle })
                        for (let safeIndex = 0; safeIndex < applicationData[chainIndex]?.safes.length; safeIndex++) {
                            // fetch details
                            const safeAddress = applicationData[chainIndex]?.safes[safeIndex].address
                            const detailsEndpoint = `${root}/api/chains/${applicationData[chainIndex].chainId}/safes/${safeAddress}/details`
                            const detailsReponse = await fetch(detailsEndpoint)
                            if (!detailsReponse.ok) throw new Error((await detailsReponse.json()).error)
                            const safeDetailsJson = (await detailsReponse.json()) as { data: DetailsForSafe }
                            applicationData[chainIndex].safes[safeIndex].generalDetails = safeDetailsJson.data

                            // fetch creation
                            const creationEndpoint = `${root}/api/chains/${applicationData[chainIndex].chainId}/safes/${safeAddress}/creation`
                            const creationReponse = await fetch(creationEndpoint)
                            if (!creationReponse.ok) throw new Error((await creationReponse.json()).error)
                            const safeCreationJson = (await creationReponse.json()) as { data: SafeCreation }
                            applicationData[chainIndex].safes[safeIndex].safeCreation = safeCreationJson.data

                            // fetch balances
                            const balancesEndpoint = `${root}/api/chains/${applicationData[chainIndex].chainId}/safes/${safeAddress}/balances`
                            const balancesResponse = await fetch(balancesEndpoint)
                            if (!balancesResponse.ok) throw new Error((await balancesResponse.json()).error)
                            const safeBalancesJson = (await balancesResponse.json()) as { data: SafeBalance[] }
                            applicationData[chainIndex].safes[safeIndex].balances = safeBalancesJson.data
                        }
                    }

                    // debug
                    if (debug) console.log('applicationDataQuery', { applicationData })

                    // ui
                    toast.success(`Loaded safes`, { duration: 2000, style: toastStyle })

                    // store
                    actions.setApplicationData(applicationData)

                    // end
                    return applicationData
                },
                retry: false,
                refetchOnWindowFocus: false,
            },
        ],
    })

    return (
        <PageWrapper>
            {account.address ? (
                <div className="flex flex-col gap-6">
                    <section className="flex flex-col gap-3">
                        <div className="flex w-full items-center gap-2">
                            <p className="text-lg font-bold text-primary">My funds</p>
                            <div className="grow border-b border-dashed border-light-hover" />
                            <p className="text-sm">Net worth: 0$</p>
                        </div>
                        {applicationDataQuery.isLoading ? <p>Loading...</p> : <MySafes />}
                    </section>

                    <section className="flex flex-col gap-3">
                        <div className="flex w-full items-center gap-2">
                            <p className="text-lg font-bold text-primary">FAQ</p>
                            <div className="grow border-b border-dashed border-light-hover" />
                        </div>
                        {[
                            { value: 'Where tf are my funds ?', answers: ['Recall this page is just a simple frontend wrapper over pseudonym data'] },
                            { value: 'Are my funds secured ?', answers: [] },
                            { value: 'Am I being rightfully advised ?', answers: [] },
                            { value: 'How can I withdraw my funds if need be ?', answers: [] },
                            { value: 'Where is support', answers: [] },
                        ].map((question) => (
                            <button className="flex flex-col rounded-sm border border-very-light-hover px-2 py-1 text-inactive hover:text-default">
                                <p>{question.value}</p>
                            </button>
                        ))}
                    </section>
                </div>
            ) : (
                <p>Click on Connect</p>
            )}
        </PageWrapper>
    )
}
