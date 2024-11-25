'use client'

import Image from 'next/image'
import { BaseError, useAccount, useConnect, useDisconnect, useConfig } from 'wagmi'
import { useEffect, useRef } from 'react'
import { createModal } from '@rabby-wallet/rabbykit'
import { useTheme } from 'next-themes'
import { AppThemes, IconIds } from '@/enums'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcutArgs'
import { copyToClipboard, shortenAddress } from '@/utils'
import toast from 'react-hot-toast'
import { toastStyle } from '@/config/toasts.config'
import IconWrapper from '../common/IconWrapper'
import { signOut } from 'next-auth/react'
import { Tooltip } from '@nextui-org/tooltip' // https://nextui.org/docs/components/tooltip
import { blo } from 'blo'

export function ConnectOrDisconnect() {
    const account = useAccount()
    const shortAddress = shortenAddress(String(account.address))
    const { error } = useConnect()
    const { disconnect } = useDisconnect()
    const { resolvedTheme } = useTheme()
    const rabbyKitRef = useRef<ReturnType<typeof createModal>>()
    const config = useConfig()

    useEffect(() => {
        if (!rabbyKitRef.current) {
            rabbyKitRef.current = createModal({
                showWalletConnect: true,
                wagmi: config,
                customButtons: [],
                language: 'en',
                theme: (resolvedTheme ?? 'dark') as AppThemes,
                // themeVariables https://rabbykit.rabby.io/docs/theming#themevariables
            })
        }
    }, [config])
    useEffect(() => {
        if (account.status === 'connected') toast.success('Connected wallet', { style: toastStyle })
    }, [account.status])
    useEffect(() => {
        if (error) toast.error(`Wallet error: ${(error as BaseError).shortMessage}`, { style: toastStyle })
    }, [error])
    useKeyboardShortcut({
        key: 'Escape',
        onKeyPressed: () => rabbyKitRef.current?.close(),
    })

    return account.isConnecting ? (
        <button className="z-50 flex items-center gap-3 rounded-sm bg-very-light-hover px-2.5 py-1 hover:bg-light-hover">
            <div className="size-2 rounded-full bg-orange-400" />
            <p className="text-inactive">Connecting</p>
            <IconWrapper icon={IconIds.LOADING} className="size-4 text-orange-400" />
        </button>
    ) : account.isConnected ? (
        <div className="z-50 flex items-center gap-3 rounded-sm bg-light-hover px-2.5 py-1 hover:bg-light-hover">
            {/* <div className="size-2 rounded-full bg-green-500" /> */}
            <Image
                alt={String(account.address)}
                src={blo(account.address as `0x${string}`)}
                width={20}
                height={20}
                className="hidden rounded-sm md:flex"
            />
            {/* text-primary */}
            <p className="font-bold">
                <span className="text-inactive">0x</span>
                {shortAddress.slice(2, shortAddress.length)}
            </p>
            <div className="flex items-center gap-2">
                <Tooltip
                    showArrow={true}
                    content={<p className="rounded-md border border-light-hover bg-background px-3 py-0.5 text-default">Copy wallet address</p>}
                >
                    <button
                        onClick={() => {
                            copyToClipboard(String(account.address))
                            toast.success(`Address ${shortAddress} copied`, { style: toastStyle })
                        }}
                        className="hidden text-inactive hover:text-default sm:flex"
                    >
                        <IconWrapper icon={IconIds.CARBON_COPY} className="size-4" />
                    </button>
                </Tooltip>
                {/* <Tooltip
                    showArrow={true}
                    content={<p className="rounded-md border border-light-hover bg-background px-3 py-0.5 text-default">Watch in Debank</p>}
                >
                    <div className="hidden items-center sm:flex">
                        <LinkWrapper href={`https://debank.com/profile/${account.address}`} target="_blank" className="opacity-50 hover:opacity-100">
                            <SvgMapper icon={IconIds.DEBANK} className="size-4 grayscale hover:grayscale-0" />
                        </LinkWrapper>
                    </div>
                </Tooltip> */}
                <Tooltip
                    showArrow={true}
                    content={<p className="rounded-md border border-light-hover bg-background px-3 py-0.5 text-default">Disconnect wallet</p>}
                >
                    <button
                        onClick={async () => {
                            try {
                                await disconnect()
                                await signOut()
                            } catch (error) {
                                window.alert({ error })
                            }
                        }}
                        className="text-inactive hover:text-default"
                    >
                        <IconWrapper icon={IconIds.DISCONNECT} className="size-5" />
                    </button>
                </Tooltip>
            </div>
        </div>
    ) : (
        <button
            className="z-50 flex items-center gap-3 rounded-sm bg-very-light-hover px-2.5 py-1 text-inactive hover:bg-light-hover hover:text-default"
            onClick={() => rabbyKitRef.current?.open()}
        >
            <div className="size-2 rounded-full bg-inactive" />
            <p className="">Connect</p>
            <IconWrapper icon={IconIds.WALLET} className="size-4" />
        </button>
    )
}

{
    /* {error && <div>{(error as BaseError).shortMessage}</div>} */
}
