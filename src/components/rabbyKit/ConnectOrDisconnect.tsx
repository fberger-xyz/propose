'use client'

import { BaseError, useAccount, useConnect, useDisconnect, useConfig } from 'wagmi'
import { useEffect, useRef } from 'react'
import { createModal } from '@rabby-wallet/rabbykit'
import { useTheme } from 'next-themes'
import { AppThemes, IconIds } from '@/enums'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcutArgs'
import { shortenAddress } from '@/utils'
import toast from 'react-hot-toast'
import { toastStyle } from '@/config/toasts.config'
import IconWrapper from '../common/IconWrapper'
import { signOut } from 'next-auth/react'

export function ConnectOrDisconnect() {
    const account = useAccount()
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
        if (account.status === 'connected') toast.success(`Connected wallet ${shortenAddress(account.address)}`, { style: toastStyle })
        // else if (account.status === 'connecting') toast('Connecting...', { style: toastStyle })
        // else if (account.status === 'disconnected') toast('Disconnected', { style: toastStyle })
    }, [account.status])
    useEffect(() => {
        if (error) toast.error(`Wallet error: ${(error as BaseError).shortMessage}`, { style: toastStyle })
    }, [error])
    useKeyboardShortcut({
        key: 'Escape',
        onKeyPressed: () => rabbyKitRef.current?.close(),
    })

    return account.isConnecting ? (
        <button className="z-50 flex items-center gap-2.5 rounded-md bg-very-light-hover px-2.5 py-0.5 hover:bg-light-hover">
            <div className="size-2 rounded-full bg-orange-400" />
            <p className="text-inactive">Connecting</p>
            <IconWrapper icon={IconIds.LOADING} className="size-4 text-orange-400" />
        </button>
    ) : account.isConnected ? (
        <button
            className="group z-50 flex items-center gap-2.5 rounded-md bg-light-hover px-2.5 py-0.5 hover:bg-light-hover"
            onClick={async () => {
                try {
                    await disconnect()
                    await signOut()
                } catch (error) {
                    window.alert({ error })
                }
            }}
        >
            <div className="size-2 rounded-full bg-green-500" />
            <p className="">{shortenAddress(String(account.address))}</p>
            <IconWrapper icon={IconIds.DISCONNECT} className="size-5 text-inactive group-hover:text-red-600" />
        </button>
    ) : (
        <button
            className="z-50 flex items-center gap-2.5 rounded-md bg-very-light-hover px-2.5 py-0.5 text-inactive hover:bg-light-hover hover:text-default"
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
