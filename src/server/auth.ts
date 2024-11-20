// source https://github.com/BowTiedLaplace/nextjs14-siwe/blob/main/src/server/auth.ts

import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'

interface ExtendedSession extends DefaultSession {
    user: {
        id: string
        // ...other properties
        // role: UserRole;
    } & DefaultSession['user']
}

// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    callbacks: {
        // token.sub will refer to the id of the wallet address
        session: ({ session, token }) =>
            ({
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                },
            }) as ExtendedSession & { user: { id: string } },
    },
    providers: [
        CredentialsProvider({
            name: 'Ethereum',
            type: 'credentials',
            credentials: {
                message: {
                    label: 'Message',
                    type: 'text',
                    placeholder: '0x0',
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                    placeholder: '0x0',
                },
            },
            authorize: async (credentials, req) => {
                try {
                    const debug = false
                    const siwe = new SiweMessage(JSON.parse(credentials!.message ?? '{}') as Partial<SiweMessage>)
                    const nonce = await getCsrfToken({ req: { headers: req.headers } })
                    const fields = await siwe.verify({ signature: credentials?.signature ?? '' })
                    if (debug) console.log(`nonce`, nonce)
                    if (debug) console.log(`fields.data.nonce`, fields.data.nonce)
                    if (fields.data.nonce !== nonce) return null

                    // Check if user exists
                    // let user = await prisma.user.findUnique({
                    //     where: {
                    //         address: fields.data.address,
                    //     },
                    // })

                    // Create new user if doesn't exist
                    // if (!user) {
                    //     user = await prisma.user.create({
                    //         data: {
                    //             address: fields.data.address,
                    //         },
                    //     })

                    //     await prisma.account.create({
                    //         data: {
                    //             userId: user.id,
                    //             type: 'credentials',
                    //             provider: 'Ethereum',
                    //             providerAccountId: fields.data.address,
                    //         },
                    //     })
                    // }

                    return {
                        id: siwe.address, // address
                        // id: user.id, // or id from database
                    }
                } catch (error) {
                    console.log('error in authOptions')
                    console.error({ error })
                    return null
                }
            },
        }),
    ],
}

export const getServerAuthSession = async () => {
    return getServerSession(authOptions)
}
