import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized. Please log in to access this resource.' }, { status: 401 })
    return NextResponse.json({ message: 'Session is valid', data: { user: session.user } })
}
