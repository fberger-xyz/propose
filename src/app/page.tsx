'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { APP_METADATA } from '@/config/app.config'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { toastStyle } from '@/config/toasts.config'
import { SupportedChains } from '@/enums'
import { ListSafesForDelegate, ListSafesForSigner } from '@/interfaces'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { AddressWithActions } from '@/components/rabbyKit/AddressWithActions'

export default function Page() {
    const searchParams = useSearchParams()
    const unauthorized = searchParams.get('unauthorized') ?? ''
    const account = useAccount()
    if (unauthorized === 'true' && !account?.address) toast.error('You must Sign-in With Ethereum', { style: toastStyle })
    const safesWithSignerQuery = useQuery({
        queryKey: ['safesWithSignerQuery'],
        queryFn: async () => {
            const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
            const chains = Object.values(SUPPORTED_CHAINS)
            const data: { chainId: SupportedChains; data: ListSafesForSigner }[] = []
            for (let chainIndex = 0; chainIndex < chains.length; chainIndex++) {
                const response = await fetch(`${root}/api/signers/${chains[chainIndex].id}/${account?.address}`)
                if (!response.ok) throw new Error((await response.json()).error)
                const json = (await response.json()) as { data: ListSafesForSigner }
                data.push({ chainId: chains[chainIndex].id, data: json.data })
            }
            console.log({ data })
            toast.success('safesWithSignerQuery', { style: toastStyle })
            return data
        },
        retry: false,
        refetchOnWindowFocus: false,
    })
    const safesWithProposerQuery = useQuery({
        queryKey: ['safesWithProposerQuery'],
        queryFn: async () => {
            const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
            const chains = Object.values(SUPPORTED_CHAINS)
            const data: { chainId: SupportedChains; data: ListSafesForDelegate }[] = []
            for (let chainIndex = 0; chainIndex < chains.length; chainIndex++) {
                const response = await fetch(`${root}/api/proposers/${chains[chainIndex].id}/${account?.address}`)
                if (!response.ok) throw new Error((await response.json()).error)
                const json = (await response.json()) as { data: ListSafesForDelegate }
                data.push({ chainId: chains[chainIndex].id, data: json.data })
            }
            console.log({ data })
            toast.success('safesWithProposerQuery', { style: toastStyle })
            return data
        },
        retry: false,
        refetchOnWindowFocus: false,
    })
    return (
        <PageWrapper className="mb-10 gap-5">
            {account.address ? (
                <div className="flex w-full flex-col gap-6">
                    {/* signer */}
                    <div className="flex w-full flex-col gap-2">
                        <p className="text-lg font-bold text-primary">Signer of safes</p>
                        {safesWithSignerQuery.data?.length ? (
                            safesWithSignerQuery.data.some((chain) => chain.data?.safes.length) ? (
                                safesWithSignerQuery.data
                                    .filter((chain) => chain.data?.safes.length)
                                    .map((chain) => (
                                        <div key={chain.chainId} className="flex flex-col gap-2 p-2">
                                            <div className="flex w-full items-center gap-4">
                                                <p className="text-sm text-inactive">{SUPPORTED_CHAINS[chain.chainId].name}</p>
                                                <div className="grow border-b border-dashed border-light-hover" />
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {chain.data.safes.map((safe, safeIndex) => (
                                                    <div key={safe} className="flex items-center gap-1">
                                                        <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                        <AddressWithActions chain={chain.chainId} address={safe} />
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
                        <p className="text-lg font-bold text-primary">Proposer of safes</p>
                        {safesWithProposerQuery.data?.length ? (
                            safesWithProposerQuery.data.some((chain) => chain.data?.results.length) ? (
                                safesWithProposerQuery.data
                                    .filter((chain) => chain.data?.results.length)
                                    .map((chain) => (
                                        <div key={chain.chainId} className="flex flex-col gap-2 p-2">
                                            <div className="flex w-full items-center gap-4">
                                                <p className="text-sm text-inactive">{SUPPORTED_CHAINS[chain.chainId].name}</p>
                                                <div className="grow border-b border-dashed border-light-hover" />
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {chain.data.results.map((safe, safeIndex) => (
                                                    <div key={safe.safe} className="flex items-center gap-1">
                                                        <p className="text-xs text-light-hover">{safeIndex + 1}</p>
                                                        <AddressWithActions key={safe.safe} chain={chain.chainId} address={safe.safe} />
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
                </div>
            ) : (
                <p>Click on Connect</p>
            )}
        </PageWrapper>
    )
}
