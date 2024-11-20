'use client'

import { cn } from '@/utils'
import { useAccount, useSwitchChain } from 'wagmi'
import Image from 'next/image'

export function NetworkSwitcher() {
    const { chain } = useAccount()
    const { chains, error, switchChain } = useSwitchChain()

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
                <p className="text-light-hover">chains</p>
                <div className="w-full border-b border-light-hover" />
            </div>
            <div className="flex items-start gap-2.5">
                {chains
                    .filter((chain) => chain)
                    .map((supportedChain) => (
                        <button
                            key={supportedChain.id}
                            className={cn('flex gap-3 rounded-md border px-2.5 py-2 transition-all duration-100', {
                                'text-primary bg-light-hover border-primary': chain?.id === supportedChain.id,
                                'text-inactive hover:text-primary border-light-hover': chain?.id !== supportedChain.id,
                                // 'border-very-light-hover': isPending,
                            })}
                            onClick={() => switchChain({ chainId: supportedChain.id })}
                        >
                            <Image
                                src={`https://safe-transaction-assets.safe.global/chains/${supportedChain.id}/chain_logo.png`}
                                width={24}
                                height={24}
                                alt={supportedChain.name}
                            />
                        </button>
                    ))}
            </div>
            {error?.message && (
                <div className="flex flex-col border-l border-inactive pl-2">
                    <p className="text-red-500">Error</p>
                    <p className="">{error?.message}</p>
                </div>
            )}
        </div>
    )
}
