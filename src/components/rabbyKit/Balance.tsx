'use client'

import { useAccount, useBalance } from 'wagmi'
import { stringify } from '@/utils'

export function Balance() {
    return <AccountBalance />
}

export function AccountBalance() {
    const { address } = useAccount()
    const { data, error, isLoading, isPending } = useBalance({ address })
    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
                <p className="text-light-hover">balance</p>
                <div className="w-full border-b border-light-hover" />
            </div>
            {isLoading || isPending ? <p className="text-orange-500">Loading balance...</p> : <p>{stringify(data)}</p>}
            {error?.message && (
                <div className="flex flex-col border-l border-inactive pl-2">
                    <p className="text-red-500">Error</p>
                    <p className="">{error?.message}</p>
                </div>
            )}
        </div>
    )
}
