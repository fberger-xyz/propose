'use client'

import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useSignMessage } from 'wagmi'
import Button from '../common/Button'
import { APP_METADATA } from '@/config/app.config'
import { AppPagePaths, IconIds } from '@/enums'
import IconWrapper from '../common/IconWrapper'

export default function SiweWrapper() {
    const { signMessageAsync, error: signMessageError } = useSignMessage()
    const { address, chain } = useAccount()
    const { data: session, status } = useSession()

    const handleSignIn = async () => {
        try {
            // 1. get random nonce from API
            const nonce = await getCsrfToken()

            // 2. create SIWE message with pre-fetched nonce and sign with wallet
            const siweMessage = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: `Sign in with Ethereum to ${APP_METADATA.SITE_NAME}.`,
                uri: window.location.origin,
                version: '1',
                chainId: chain?.id,
                nonce,
            })

            // 3. prepare the message to sign
            const preparedMessage = siweMessage.prepareMessage()

            // 4. sign message
            const signature = await signMessageAsync({ message: preparedMessage })

            // 5. initiate sign in flow
            signIn('credentials', {
                message: JSON.stringify(siweMessage),
                redirect: false,
                signature,
                callbackUrl: `${APP_METADATA.SITE_URL}${AppPagePaths.PROTECTED}`,
            })
        } catch (error) {
            window.alert(error)
        }
    }

    const handleSignOut = async () => {
        try {
            signOut()
        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
                <p className="text-light-hover">siwe</p>
                <div className="w-full border-b border-light-hover" />
            </div>
            <div className="flex flex-col gap-2.5">
                {/* disconnect */}
                {/* {isConnected && (
                    <button
                        className="group flex w-fit items-center gap-3 rounded-md bg-light-hover px-2.5 py-1.5 hover:bg-light-hover"
                        onClick={() => handleDisconnect()}
                    >
                        <p className="font-bold">Disconnect Wallet</p>
                        <IconWrapper icon={IconIds.DISCONNECT} className="size-5 text-inactive group-hover:text-red-600" />
                    </button>
                )} */}

                {/* status */}
                <p>session status = {status}</p>

                {/* siwe */}
                {!session ? (
                    <button
                        className="flex w-fit items-center gap-3 rounded-md bg-very-light-hover px-2.5 py-1.5 text-inactive hover:bg-light-hover hover:text-default"
                        onClick={() => handleSignIn()}
                    >
                        <div className="size-2 rounded-full bg-inactive" />
                        <p className="font-bold">Sign-In With Ethereum</p>
                        <IconWrapper icon={IconIds.WALLET} className="size-5" />
                    </button>
                ) : (
                    <>
                        <pre className="bg-light-hover p-2 text-xs">{JSON.stringify({ session }, null, 2)}</pre>
                        <Button onClickFn={() => handleSignOut()} text="Sign-out" />
                    </>
                )}
            </div>
            {signMessageError?.message && (
                <div className="flex flex-col border-l border-inactive pl-2">
                    <p className="text-red-500">Error: signMessageError</p>
                    <p className="">{signMessageError?.message}</p>
                </div>
            )}
        </div>
    )
}
