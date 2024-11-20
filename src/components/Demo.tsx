'use client'

import { Account } from '@/components/rabbyKit/Account'
import { Balance } from '@/components/rabbyKit/Balance'
import { BlockNumber } from '@/components/rabbyKit/BlockNumber'
import { Connected } from '@/components/rabbyKit/Connected'
import { NetworkSwitcher } from '@/components/rabbyKit/NetworkSwitcher'
import SiweWrapper from './siwe/SiweWrapper'

export default function Demo() {
    return (
        <Connected>
            <NetworkSwitcher />
            <Account />
            <Balance />
            <BlockNumber />
            <SiweWrapper />
            {/* todo next https://docs.login.xyz/integrations/nextauth.js */}
            {/* <hr />
                <h2>Read Contract</h2>
                <ReadContract />
                <hr />
                <h2>Read Contracts</h2>
                <ReadContracts />
                <hr />
                <h2>Read Contracts Infinite</h2>
                <ReadContractsInfinite />
                <hr />
                <h2>Send Transaction</h2>
                <SendTransaction />
                <hr />
                <h2>Send Transaction (Prepared)</h2>
                <SendTransactionPrepared />
                <hr />
                <h2>Sign Message</h2>
                <SignMessage />
                <hr />
                <h2>Sign Typed Data</h2>
                <SignTypedData />
                <hr />
                <h2>Token</h2>
                <Token />
                <hr />
                <h2>Watch Contract Events</h2>
                <WatchContractEvents />
                <hr />
                <h2>Watch Pending Transactions</h2>
                <WatchPendingTransactions />
                <hr />
                <h2>Write Contract</h2>
                <WriteContract />
                <hr />
                <h2>Write Contract (Prepared)</h2>
                <WriteContractPrepared /> */}
        </Connected>
    )
}
