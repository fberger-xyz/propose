import { extractErrorMessage, generateResponseBody } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'ethers'
import { ListOfSafesFromDelegateEndpoint } from '@/interfaces'
import { SUPPORTED_CHAINS } from '@/config/chains.config'
import { SupportedChains } from '@/enums'

// https://nextjs.org/docs/14/app/building-your-application/routing/route-handlers#dynamic-route-segments
// https://docs.safe.global/core-api/transaction-service-guides/delegates
// https://safe-transaction-base.safe.global/#/delegates/delegates_list_2

export async function GET(_: NextRequest, { params }: { params: { chain: string; proposerAddress: string } }) {
    // prepare response
    const responseBody = generateResponseBody<ListOfSafesFromDelegateEndpoint>()

    // validate chain
    const chain = params.chain
    if (!chain || !(Number(chain) in SupportedChains)) {
        responseBody.error = `'chain' is required and must be a supported chain`
        return NextResponse.json(responseBody, { status: 400 })
    }
    const chainConfig = SUPPORTED_CHAINS[Number(chain) as SupportedChains]

    // validate proposerAddress
    const proposerAddress = params.proposerAddress
    if (!proposerAddress || !isAddress(proposerAddress)) {
        responseBody.error = `'proposerAddress' is required and must be a valid evm address`
        return NextResponse.json(responseBody, { status: 400 })
    }

    // prepare request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds timeout
    const url = `${chainConfig.transactionService.url}/api/v2/delegates/?delegate=${proposerAddress}`

    // request
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            cache: 'no-store',
        })
        clearTimeout(timeoutId)
        if (!response.ok) {
            responseBody.error = `Error fetching ${url}`
            return NextResponse.json(responseBody, { status: response.status })
        }
        responseBody.data = await response.json()
        responseBody.success = true
        return NextResponse.json(responseBody, { status: 200 })
    } catch (error) {
        console.error('Fetch Error:', error)
        responseBody.error = extractErrorMessage(error)
        return NextResponse.json(responseBody, { status: 200 })
    }
}
