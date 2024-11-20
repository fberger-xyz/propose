'use client'

import { useBlockNumber } from 'wagmi'

export function BlockNumber() {
    const { data, error, isLoading, isPending } = useBlockNumber({ watch: true })
    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
                <p className="text-light-hover">block</p>
                <div className="w-full border-b border-light-hover" />
            </div>
            {isLoading || isPending ? <p className="text-orange-500">Loading block...</p> : <p>{data?.toString()}</p>}
            {error?.message && (
                <div className="flex flex-col border-l border-inactive pl-2">
                    <p className="text-red-500">Error</p>
                    <p className="">{error?.message}</p>
                </div>
            )}
        </div>
    )
}
