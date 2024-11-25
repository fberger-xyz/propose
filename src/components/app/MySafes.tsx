'use client'

import Image from 'next/image'
import { AddressWithActions } from '@/components/rabbyKit/AddressWithActions'
import { useSafesStore } from '@/stores/safes.store'
import { cn } from '@/utils'
import LinkWrapper from '@/components/common/LinkWrapper'
import dayjs from 'dayjs'
import { SUPPORTED_CHAINS } from '@/config/chains.config'

export default function MySafes() {
    const { applicationData } = useSafesStore()

    return applicationData.length ? (
        applicationData.some((chain) => chain.safes.length) ? (
            // chains
            applicationData
                .filter((chain) => chain.safes.length)
                .map((chain) => (
                    // for each chain
                    <div key={chain.chainId} className="flex flex-col gap-2 px-2">
                        <div className="flex flex-wrap gap-3">
                            {chain.safes.map((safe, safeIndex) => (
                                // for each safe
                                <div key={safe.address} className="flex min-w-72 flex-col rounded-sm border border-light-hover">
                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                        <div className="flex w-full justify-between">
                                            <p className="text-xs text-inactive">Safe #{safeIndex + 1}</p>
                                            <Image
                                                src={`https://safe-transaction-assets.safe.global/chains/${chain.chainId}/chain_logo.png`}
                                                width={16}
                                                height={16}
                                                alt={SUPPORTED_CHAINS[chain.chainId].gnosisPrefix}
                                            />
                                        </div>
                                        <AddressWithActions chain={chain.chainId} address={safe.address} isMultisig={true} />
                                    </div>
                                    {safe.generalDetails && (
                                        <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                            <div className="flex w-full justify-between">
                                                <p className="text-xs text-inactive">
                                                    {safe.generalDetails.threshold}/{safe.generalDetails.owners.length} signers
                                                </p>
                                            </div>
                                            {safe.generalDetails.owners.length > 1 ? (
                                                <div className="flex gap-2">
                                                    {safe.generalDetails.owners.map((owner) => (
                                                        <AddressWithActions key={owner} address={owner} showAddress={false} />
                                                    ))}
                                                </div>
                                            ) : (
                                                safe.generalDetails.owners.map((owner) => <AddressWithActions key={owner} address={owner} />)
                                            )}
                                        </div>
                                    )}
                                    {safe.generalDetails && safe.safeCreation && (
                                        <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                            <p className="text-xs text-inactive">Activity</p>
                                            <p className="text-xs text-secondary">
                                                Created on {dayjs(safe.safeCreation.created).format('ddd. DD MMM. YYYY')}
                                            </p>
                                            {safe.generalDetails.nonce ? (
                                                <p className="text-xs text-secondary">
                                                    {safe.generalDetails.nonce} transaction{safe.generalDetails.nonce > 1 ? 's' : ''}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-inactive">No transaction</p>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                        <p className="text-xs text-inactive">Net worth</p>
                                        {safe.balances.filter((asset) => asset.token?.name).length ? (
                                            safe.balances.filter((asset) => asset.token?.name).map((asset) => <p key={asset.token?.name}></p>)
                                        ) : (
                                            <p className="text-xs text-inactive">0 K$</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5 border-b border-light-hover px-3 py-2">
                                        <p className="text-xs text-inactive">Proposer</p>
                                        {safe.proposerDetails?.delegate ? (
                                            <AddressWithActions address={safe.proposerDetails?.delegate ?? ''} />
                                        ) : (
                                            <p className="text-xs text-secondary">No proposer set</p>
                                        )}
                                    </div>
                                    <div className="flex size-full items-end justify-end px-3 py-2">
                                        <LinkWrapper
                                            href={`/safes/${safe.address}`}
                                            className={cn(
                                                'bg-very-light-hover rounded-sm px-2 min-w-8 text-center sm:px-2.5 py-1 hover:bg-light-hover border border-transparent hover:border-primary hover:text-primary',
                                            )}
                                        >
                                            <p className="text-sm">Manage</p>
                                        </LinkWrapper>
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
    )
}
