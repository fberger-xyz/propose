'use client'

import { stringify } from '@/utils'
import { parseEther } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

export function SendTransaction() {
    const { data, error, isPending: isLoading, isError, sendTransaction } = useSendTransaction()
    const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash: data })

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const address = formData.get('address') as string
                    const value = formData.get('value') as `${number}`
                    sendTransaction({
                        // @ts-expect-error: to fix later
                        to: address,
                        value: parseEther(value),
                    })
                }}
            >
                <input name="address" placeholder="address" />
                <input name="value" placeholder="value (ether)" />
                <button type="submit">Send</button>
            </form>

            {isLoading && <div>Check wallet...</div>}
            {isPending && <div>Transaction pending...</div>}
            {isSuccess && (
                <>
                    <div>Transaction Hash: {data}</div>
                    <div>
                        Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
                    </div>
                </>
            )}
            {isError && <div>Error: {error?.message}</div>}
        </>
    )
}
