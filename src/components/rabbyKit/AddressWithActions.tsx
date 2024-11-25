'use client'

import Image from 'next/image'
import { cn, copyToClipboard, shortenAddress } from '@/utils'
import toast from 'react-hot-toast'
import { toastStyle } from '@/config/toasts.config'
import IconWrapper from '../common/IconWrapper'
import LinkWrapper from '../common/LinkWrapper'
import SvgMapper from '../common/SvgMapper'
import { Tooltip } from '@nextui-org/tooltip' // https://nextui.org/docs/components/tooltip
import { IconIds, SupportedChains } from '@/enums'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { blo } from 'blo'
import { useSafesStore } from '@/stores/safes.store'

// todo better bg tooltips
export function AddressWithActions({
    showChain = false,
    showAddress = true,
    ...props
}: {
    chain?: SupportedChains
    address: string
    showChain?: boolean
    showAddress?: boolean
    showDebank?: boolean
    isMultisig?: boolean
}) {
    const account = useAccount()
    const { isHoveringLoggedWallet } = useSafesStore()
    const shortAddress = shortenAddress(String(props.address))
    const [copied, setCopied] = useState(false)
    const [copyText, setCopyText] = useState('Copy wallet address')
    const { actions } = useSafesStore()
    return (
        <div
            className={cn(
                'flex w-fit items-center gap-2.5 rounded-sm border border-transparent bg-very-light-hover px-2 py-1.5 text-base',
                { 'border-primary': isHoveringLoggedWallet && account.address && account.address === props.address },
                { 'hover:border-light-hover': !account.address || account.address !== props.address },
            )}
            onMouseEnter={() => (account.address && account.address === props.address ? actions.setIsHoveringLoggedWallet(true) : null)}
            onMouseLeave={() => (account.address && account.address === props.address ? actions.setIsHoveringLoggedWallet(false) : null)}
        >
            {props.chain && showChain && (
                <Image
                    src={`https://safe-transaction-assets.safe.global/chains/${props.chain}/chain_logo.png`}
                    width={20}
                    height={20}
                    alt={SUPPORTED_CHAINS[props.chain].gnosisPrefix}
                />
            )}
            <Tooltip
                showArrow
                content={<p className="rounded-md border border-light-hover bg-very-light-hover px-3 py-0.5 text-default">{props.address}</p>}
            >
                <Image
                    alt={props.address}
                    src={blo(props.address as `0x${string}`)}
                    width={20}
                    height={20}
                    // className="rounded-sm border-2 border-primary"
                />
            </Tooltip>
            {showAddress ? (
                account.address && account.address === props.address ? (
                    // text-primary
                    <p className="text-sm font-bold">
                        <span className="text-inactive">0x</span>
                        {shortAddress.slice(2, shortAddress.length)}
                    </p>
                ) : (
                    <p className="text-sm font-bold">
                        {props.chain && props.isMultisig && <span className="text-inactive">{SUPPORTED_CHAINS[props.chain].gnosisPrefix}:</span>}
                        <span className="text-inactive">0x</span>
                        {shortAddress.slice(2, shortAddress.length)}
                    </p>
                )
            ) : null}
            <div className="flex items-center gap-2">
                <Tooltip
                    showArrow
                    content={
                        <p className="flex items-center gap-2 rounded-md border border-light-hover bg-very-light-hover px-3 py-0.5 text-default">
                            {copyText}
                        </p>
                    }
                >
                    <button
                        onClick={() => {
                            copyToClipboard(String(props.address))
                            setCopyText('Address copied')
                            setCopied(true)
                            toast.success(`Address copied`, { style: toastStyle })
                            setTimeout(() => {
                                setCopied(false)
                                setCopyText('Copy wallet address')
                            }, 1000)
                        }}
                        className="cursor-copy text-inactive hover:text-default"
                    >
                        {copied ? (
                            <IconWrapper icon={IconIds.CHECKMARK} className="size-4 text-primary" />
                        ) : (
                            <IconWrapper icon={IconIds.COPY} className="size-4" />
                        )}
                    </button>
                </Tooltip>
                {props.showDebank && (
                    <Tooltip
                        showArrow
                        content={
                            <div className="flex items-center gap-2 rounded-md border border-light-hover bg-very-light-hover px-3 py-0.5 text-default">
                                <p>Watch in Debank</p>
                                <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-4" />
                            </div>
                        }
                    >
                        <div className="flex cursor-alias items-center">
                            <LinkWrapper
                                href={`https://debank.com/profile/${props.address}`}
                                target="_blank"
                                className="opacity-50 hover:opacity-100"
                            >
                                <SvgMapper icon={IconIds.DEBANK} className="size-4 grayscale hover:grayscale-0" />
                            </LinkWrapper>
                        </div>
                    </Tooltip>
                )}
                {props.chain && props.isMultisig && (
                    <Tooltip
                        showArrow
                        content={
                            <div className="flex items-center gap-2 rounded-md border border-light-hover bg-very-light-hover px-3 py-0.5 text-default">
                                <p>Open in Safe</p>
                                <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-4" />
                            </div>
                        }
                    >
                        <div className="flex items-center">
                            <LinkWrapper
                                href={`https://app.safe.global/balances?safe=${SUPPORTED_CHAINS[props.chain].gnosisPrefix}:${props.address}`}
                                target="_blank"
                                className="cursor-alias opacity-50 hover:opacity-100"
                            >
                                <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-4" />
                            </LinkWrapper>
                        </div>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}
