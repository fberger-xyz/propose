'use client'

import { useAccount, useEnsName } from 'wagmi'
import LinkWrapper from '../common/LinkWrapper'
import { IconIds } from '@/enums'
import SvgMapper from '../common/SvgMapper'
import IconWrapper from '../common/IconWrapper'

export function Account() {
    const { address } = useAccount()
    const { data: ensName, error, isLoading, isPending } = useEnsName({ address })
    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
                <p className="text-light-hover">account</p>
                <div className="w-full border-b border-light-hover" />
            </div>
            {isLoading || isPending ? (
                <p className="text-orange-500">Loading account...</p>
            ) : (
                <div className="flex flex-col gap-2">
                    <p>{ensName ? `${ensName} -> ${address}` : address}</p>
                    <LinkWrapper
                        target="_blank"
                        className="group flex w-fit items-center gap-3 rounded-md border border-light-hover p-2"
                        href={`https://debank.com/profile/${address}`}
                    >
                        <SvgMapper icon={IconIds.DEBANK} className="size-5 text-inactive" />
                        <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-5 text-light-hover group-hover:text-primary" />
                    </LinkWrapper>
                </div>
            )}
            {error?.message && (
                <div className="flex flex-col border-l border-inactive pl-2">
                    <p className="text-red-500">Error</p>
                    <p className="">{error?.message}</p>
                </div>
            )}
        </div>
    )
}
