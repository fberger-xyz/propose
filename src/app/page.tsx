'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { root } from '@/config/app.config'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { toastStyle } from '@/config/toasts.config'
import { SupportedChains } from '@/enums'
import { DetailsForSafe, ListOfSafesFromDelegateEndpoint, ListSafesForSigner } from '@/interfaces'
import { useQueries } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { AddressWithActions } from '@/components/rabbyKit/AddressWithActions'
import { useSafesStore } from '@/stores/safes.store'
import { shortenAddress } from '@/utils'

export default function Page() {
    /**
     * log unauthorized if needed
     */

    const searchParams = useSearchParams()
    const unauthorized = searchParams.get('unauthorized') ?? ''
    const account = useAccount()
    if (unauthorized === 'true' && !account?.address) toast.error('You must Sign-in With Ethereum', { style: toastStyle })
    const { actions, computeds } = useSafesStore()

    /**
     * test
     */

    const [safesWithAddressAsSignerOrProposerQuery, safesDetailsQuery] = useQueries({
        queries: [
            {
                queryKey: ['safesWithAddressAsSignerOrProposerQuery', account.address],
                queryFn: async () => {
                    // prepare
                    const debug = false
                    const chains = Object.values(SUPPORTED_CHAINS)
                    const data: {
                        chainId: SupportedChains
                        safes: { asSigner: ListSafesForSigner; asProposer: ListOfSafesFromDelegateEndpoint }
                    }[] = []

                    // ensure wallet is logged
                    if (!account?.address) return data

                    // debug
                    if (debug) console.log({ chains })

                    // for each chain...
                    for (let chainIndex = 0; chainIndex < chains.length; chainIndex++) {
                        // list safes with address as signer
                        const asSignerEndpoint = `${root}/api/chains/${chains[chainIndex].id}/signers/${account?.address}/safes`
                        const safesWithSigner = await fetch(asSignerEndpoint)
                        if (!safesWithSigner.ok) throw new Error((await safesWithSigner.json()).error)
                        const safesWithSignerJson = (await safesWithSigner.json()) as { data: ListSafesForSigner }

                        // list safes with address as proposer
                        const asProposerEndpoint = `${root}/api/chains/${chains[chainIndex].id}/proposers/${account?.address}/safes`
                        const safesWithProposerReponse = await fetch(asProposerEndpoint)
                        if (!safesWithProposerReponse.ok) throw new Error((await safesWithProposerReponse.json()).error)
                        const safesWithProposerJson = (await safesWithProposerReponse.json()) as { data: ListOfSafesFromDelegateEndpoint }

                        // store result
                        data.push({
                            chainId: chains[chainIndex].id,
                            safes: { asSigner: safesWithSignerJson.data, asProposer: safesWithProposerJson.data },
                        })
                    }

                    // debug
                    if (debug) console.log('safesWithAddressAsSignerOrProposerQuery', { data })

                    // ui
                    toast.success(`Listed safes where ${shortenAddress(account.address)} is a signer or proposer`, {
                        duration: 2000,
                        style: { minWidth: '450px', ...toastStyle },
                    })

                    // store
                    actions.setSafesWithAddressAsSignerOrProposer(data)

                    // end
                    return data
                },
                retry: false,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['safesDetailsQuery', account.address, computeds.getSafesByChains().length],
                queryFn: async () => {
                    // prepare
                    const debug = false
                    const data: { chainId: SupportedChains; safes: { address: string; details: DetailsForSafe }[] }[] = []
                    const safesByChains = computeds.getSafesByChains()

                    // ensure wallet is logged
                    if (!safesByChains.length) return data

                    // for each chain...
                    for (let chainIndex = 0; chainIndex < safesByChains.length; chainIndex++) {
                        // prepare
                        const safes: { address: string; details: DetailsForSafe }[] = []

                        // for each safe
                        for (let safeIndex = 0; safeIndex < safesByChains[chainIndex].safes.length; safeIndex++) {
                            // fetch details
                            const safeAddress = safesByChains[chainIndex].safes[safeIndex]
                            const endpoint = `${root}/api/chains/${safesByChains[chainIndex].chainId}/safes/${safeAddress}/details`
                            const safesDetailsReponse = await fetch(endpoint)
                            if (!safesDetailsReponse.ok) throw new Error((await safesDetailsReponse.json()).error)
                            const safeDetailsJson = (await safesDetailsReponse.json()) as { data: DetailsForSafe }

                            // store
                            safes.push({ address: safeAddress, details: safeDetailsJson.data })
                        }

                        // store
                        data.push({ chainId: safesByChains[chainIndex].chainId, safes })
                    }

                    // debug
                    if (debug) console.log('safesDetailsQuery', { data })

                    // ui
                    toast.success(`Loaded safes details`, { duration: 2000, style: toastStyle })

                    // store
                    actions.setSafesDetails(data)

                    // end
                    return data
                },
                // retry: false,
                refetchOnWindowFocus: false,
            },
        ],
    })

    return (
        <PageWrapper className="mb-10 gap-5">
            {account.address ? (
                <div className="flex w-full flex-col gap-6">
                    {/* signer */}
                    <div className="flex w-full flex-col gap-2">
                        <p className="text-lg font-bold text-primary">Safes where I sign</p>
                        {safesWithAddressAsSignerOrProposerQuery.data?.length ? (
                            safesWithAddressAsSignerOrProposerQuery.data.some((chain) => chain.safes?.asSigner.safes.length) ? (
                                // chains
                                safesWithAddressAsSignerOrProposerQuery.data
                                    .filter((chain) => chain.safes?.asSigner.safes.length)
                                    .map((chain) => (
                                        <div key={chain.chainId} className="flex flex-col gap-2 px-2">
                                            <div className="flex w-full items-center gap-4">
                                                <p className="text-sm text-inactive">{SUPPORTED_CHAINS[chain.chainId].name}</p>
                                                <div className="grow border-b border-dashed border-light-hover" />
                                            </div>

                                            {/* safes */}
                                            <div className="flex flex-wrap gap-3">
                                                {chain.safes.asSigner.safes.map((safe, safeIndex) => (
                                                    <div key={safe} className="flex flex-col gap-1 rounded-md border border-light-hover p-2">
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                            <AddressWithActions chain={chain.chainId} address={safe} />
                                                        </div>
                                                        {/* <button
                                                            onClick={() => {
                                                                copyToClipboard(String(safe))
                                                                toast.success(`Address ${shortenAddress(String(safe))} copied`, {
                                                                    style: toastStyle,
                                                                })
                                                            }}
                                                            className="text-inactive hover:text-default"
                                                        >
                                                            <IconWrapper icon={IconIds.CARBON_COPY} className="size-4" />
                                                        </button>
                                                        <p className="text-sm">Manage</p> */}
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
                    </div>

                    {/* proposer */}
                    <div className="flex w-full flex-col gap-2">
                        <p className="text-lg font-bold text-primary">Safes where I propose</p>
                        {safesWithAddressAsSignerOrProposerQuery.data?.length ? (
                            safesWithAddressAsSignerOrProposerQuery.data.some((chain) => chain.safes?.asProposer.results.length) ? (
                                // chains
                                safesWithAddressAsSignerOrProposerQuery.data
                                    .filter((chain) => chain.safes?.asProposer.results.length)
                                    .map((chain) => (
                                        <div key={chain.chainId} className="flex flex-col gap-2 px-2">
                                            <div className="flex w-full items-center gap-4">
                                                <p className="text-sm text-inactive">{SUPPORTED_CHAINS[chain.chainId].name}</p>
                                                <div className="grow border-b border-dashed border-light-hover" />
                                            </div>

                                            {/* safes */}
                                            <div className="flex flex-wrap gap-3">
                                                {chain.safes.asProposer.results.map((safe, safeIndex) => (
                                                    <div key={safe.safe} className="flex flex-col gap-1 rounded-md border border-light-hover p-2">
                                                        <p className="pl-4 text-xs">Safe</p>
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                            <AddressWithActions chain={chain.chainId} address={safe.safe} />
                                                        </div>
                                                        <div className="my-2 w-full border-b border-dashed border-inactive" />
                                                        <p className="pl-4 text-xs">Proposer</p>
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                            <AddressWithActions chain={chain.chainId} address={safe.delegate} />
                                                        </div>
                                                        <div className="my-2 w-full border-b border-dashed border-inactive" />
                                                        <p className="pl-4 text-xs">Delegator</p>
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                            <AddressWithActions chain={chain.chainId} address={safe.delegator} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>Not a proposer of any safe</p>
                            )
                        ) : (
                            <p>No data</p>
                        )}
                    </div>

                    {/* details */}
                    <div className="flex w-full flex-col gap-2">
                        <p className="text-lg font-bold text-primary">Details [debug]</p>
                        <pre className="text-xs">{JSON.stringify(safesDetailsQuery.data, null, 2)}</pre>
                    </div>
                </div>
            ) : (
                <p>Click on Connect</p>
            )}
        </PageWrapper>
    )
}
