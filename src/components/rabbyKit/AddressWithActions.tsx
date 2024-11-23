'use client'

import Image from 'next/image'
import { copyToClipboard, shortenAddress } from '@/utils'
import toast from 'react-hot-toast'
import { toastStyle } from '@/config/toasts.config'
import IconWrapper from '../common/IconWrapper'
import LinkWrapper from '../common/LinkWrapper'
import SvgMapper from '../common/SvgMapper'
import { Tooltip } from '@nextui-org/tooltip' // https://nextui.org/docs/components/tooltip
import { IconIds, SupportedChains } from '@/enums'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { useState } from 'react'

export function AddressWithActions(props: { chain?: SupportedChains; address: string }) {
    const [copyText, setCopyText] = useState('Copy wallet address')
    return (
        <div className="flex items-center gap-2.5 rounded-sm bg-light-hover px-2.5 py-1 text-base hover:bg-light-hover">
            {props.chain && (
                <Image
                    src={`https://safe-transaction-assets.safe.global/chains/${props.chain}/chain_logo.png`}
                    width={20}
                    height={20}
                    alt={SUPPORTED_CHAINS[props.chain].gnosisPrefix}
                />
            )}
            <p>{shortenAddress(String(props.address))}</p>
            <div className="flex items-center gap-2">
                <Tooltip
                    closeDelay={500}
                    // shouldCloseOnBlur={false}
                    content={<p className="rounded-md border border-light-hover bg-background px-3 py-0.5 text-default">{copyText}</p>}
                >
                    <button
                        onClick={() => {
                            copyToClipboard(String(props.address))
                            setCopyText('Address copied')
                            toast.success(`Address ${shortenAddress(String(props.address))} copied`, { style: toastStyle })
                            setTimeout(() => setCopyText('Copy wallet address'), 1000)
                        }}
                        className="text-inactive hover:text-default"
                    >
                        <IconWrapper icon={IconIds.CARBON_COPY} className="size-4" />
                    </button>
                </Tooltip>
                <Tooltip
                    closeDelay={0}
                    content={
                        <div className="flex items-center gap-2 rounded-md border border-light-hover bg-background px-3 py-0.5 text-default">
                            <p>Watch in Debank</p>
                            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-4" />
                        </div>
                    }
                >
                    <div className="flex items-center">
                        <LinkWrapper href={`https://debank.com/profile/${props.address}`} target="_blank" className="opacity-50 hover:opacity-100">
                            <SvgMapper icon={IconIds.DEBANK} className="size-4 grayscale hover:grayscale-0" />
                        </LinkWrapper>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
