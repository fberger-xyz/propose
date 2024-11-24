'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { root } from '@/config/app.config'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { toastStyle } from '@/config/toasts.config'
import { SupportedChains } from '@/enums'
import { AggregatedSafeData, DetailsForSafe, ListOfSafesFromDelegateEndpoint, ListSafesForSigner } from '@/interfaces'
import { useQueries } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { AddressWithActions } from '@/components/rabbyKit/AddressWithActions'
import { useSafesStore } from '@/stores/safes.store'
import { NewAggregatedSafeData } from '@/utils'
import Button from '@/components/common/Button'
import { IdenticonWithActions } from '@/components/rabbyKit/IdenticonWithActions'

export default function Page() {
    /**
     * log unauthorized if needed
     */

    const searchParams = useSearchParams()
    const unauthorized = searchParams.get('unauthorized') ?? ''
    const account = useAccount()
    if (unauthorized === 'true' && !account?.address) toast.error('You must Sign-in With Ethereum', { style: toastStyle })
    const { applicationData, actions } = useSafesStore()

    /**
     * test
     */

    // const [applicationDataQuery] =
    useQueries({
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
                        toast.success(`Loading safes on chainId=${SUPPORTED_CHAINS[chains[chainIndex].id].name}`, { style: toastStyle })

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
                        for (let safeIndex = 0; safeIndex < applicationData[chainIndex]?.safes.length; safeIndex++) {
                            // fetch details
                            const safeAddress = applicationData[chainIndex]?.safes[safeIndex].address
                            const endpoint = `${root}/api/chains/${applicationData[chainIndex].chainId}/safes/${safeAddress}/details`
                            const safesDetailsReponse = await fetch(endpoint)
                            if (!safesDetailsReponse.ok) throw new Error((await safesDetailsReponse.json()).error)
                            const safeDetailsJson = (await safesDetailsReponse.json()) as { data: DetailsForSafe }
                            applicationData[chainIndex].safes[safeIndex].generalDetails = safeDetailsJson.data
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
        <PageWrapper className="mb-10 gap-5">
            {account.address ? (
                <div className="flex w-full flex-col gap-4">
                    {/* header */}
                    <div className="flex w-full items-baseline gap-4">
                        <p className="text-lg font-bold text-primary">Key metrics</p>
                        <div className="grow border-b border-dashed border-light-hover" />
                    </div>
                    <p>AUM, P&L 24h/wtd/mtd/qtd/ltd</p>

                    {/* header */}
                    <div className="flex w-full items-baseline gap-4">
                        <p className="text-lg font-bold text-primary">My safes</p>
                        <div className="grow border-b border-dashed border-light-hover" />
                    </div>

                    {/* safes */}
                    {applicationData.length ? (
                        applicationData.some((chain) => chain.safes.length) ? (
                            // chains
                            applicationData
                                .filter((chain) => chain.safes.length)
                                .map((chain) => (
                                    <div key={chain.chainId} className="flex flex-col gap-2 px-2">
                                        {/* <div className="flex w-full items-center gap-4">
                                                <p className="text-sm text-inactive">{SUPPORTED_CHAINS[chain.chainId].name}</p>
                                                <div className="grow border-b border-dashed border-light-hover" />
                                            </div> */}

                                        {/* safes */}
                                        <div className="flex flex-wrap gap-3">
                                            {chain.safes.map((safe) => (
                                                <div key={safe.address} className="flex flex-col rounded-md border border-light-hover">
                                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                                        <div className="flex w-full justify-between">
                                                            <p className="text-xs text-inactive">Address</p>
                                                            {/* <p className="text-xs text-inactive">{SUPPORTED_CHAINS[safe.chainId].name}</p> */}
                                                        </div>
                                                        <AddressWithActions chain={chain.chainId} address={safe.address} />
                                                    </div>
                                                    {safe.generalDetails && (
                                                        <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                                            <div className="flex w-full justify-between">
                                                                <p className="text-xs text-inactive">
                                                                    {safe.generalDetails.owners.length} signer
                                                                    {safe.generalDetails.owners.length > 1 ? 's' : ''}
                                                                </p>
                                                                <p className="text-xs text-inactive">
                                                                    {safe.generalDetails.threshold}/{safe.generalDetails.owners.length} threshold
                                                                </p>
                                                            </div>
                                                            {safe.generalDetails.owners.length > 1 ? (
                                                                <div className="flex justify-end gap-2">
                                                                    {safe.generalDetails.owners.map((owner) => (
                                                                        <IdenticonWithActions
                                                                            key={owner}
                                                                            // chain={chain.chainId}
                                                                            address={owner}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                safe.generalDetails.owners.map((owner) => (
                                                                    <AddressWithActions
                                                                        key={owner}
                                                                        // chain={chain.chainId}
                                                                        address={owner}
                                                                    />
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                                        <p className="text-xs text-inactive">Net worth</p>
                                                        <p className="text-xs text-secondary">100K$</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                                        <p className="text-xs text-inactive">Proposer</p>
                                                        {safe.proposerDetails?.delegate ? (
                                                            <AddressWithActions
                                                                // chain={chain.chainId}
                                                                address={safe.proposerDetails?.delegate ?? ''}
                                                            />
                                                        ) : (
                                                            <p className="text-xs text-secondary">No proposer set</p>
                                                        )}
                                                    </div>
                                                    <div className="flex size-full items-end justify-end px-3 py-2">
                                                        <Button text="Manage" className="text-sm" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p>Not a signer of any safe</p>
                        )
                    ) : (
                        <p>No data</p>
                    )}

                    {/* header */}
                    <div className="flex w-full items-baseline gap-4">
                        <p className="text-lg font-bold text-primary">Todo</p>
                        <div className="grow border-b border-dashed border-light-hover" />
                    </div>
                    <p>Fetch balances</p>
                </div>
            ) : (
                <p>Click on Connect</p>
            )}
        </PageWrapper>
    )
}
