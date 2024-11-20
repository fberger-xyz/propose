'use client'

import PageWrapper from '@/components/common/PageWrapper'
import Demo from '@/components/Demo'
import { toastStyle } from '@/config/toasts.config'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Page() {
    const searchParams = useSearchParams()
    const unauthorized = searchParams.get('unauthorized') ?? ''
    if (unauthorized === 'true') toast.error('You must Sign-in With Ethereum', { style: toastStyle })
    return (
        <PageWrapper className="mb-10 gap-5">
            <Demo />
        </PageWrapper>
    )
}
