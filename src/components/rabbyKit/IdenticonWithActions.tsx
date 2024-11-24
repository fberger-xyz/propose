'use client'

import Image from 'next/image'
import { copyToClipboard, shortenAddress } from '@/utils'
import toast from 'react-hot-toast'
import { toastStyle } from '@/config/toasts.config'
import { Tooltip } from '@nextui-org/tooltip' // https://nextui.org/docs/components/tooltip
import { SupportedChains } from '@/enums'
import { useState } from 'react'
import { blo } from 'blo'

export function IdenticonWithActions(props: { chain?: SupportedChains; address: string }) {
    const [copyText, setCopyText] = useState('Copy wallet address')
    return (
        <div className="flex w-fit items-center gap-2.5 rounded-sm bg-light-hover px-2.5 py-2 text-base hover:bg-light-hover">
            <div className="flex items-center gap-2">
                <Tooltip
                    closeDelay={500}
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
                        <Image alt={props.address} src={blo(props.address as `0x${string}`)} width={18} height={18} className="rounded-md" />
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}
