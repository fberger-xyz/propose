'use client'

import { APP_METADATA } from '@/config/app.config'
import { useAccount } from 'wagmi'

export function Connected({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount()
    if (!isConnected)
        return (
            <div className="my-10 flex size-full flex-col items-center justify-center gap-10">
                <p className="text-inactive">{APP_METADATA.SITE_DESCRIPTION}</p>
                <p>Click on 'Connect' ⬆️</p>
            </div>
        )
    return <>{children}</>
}
