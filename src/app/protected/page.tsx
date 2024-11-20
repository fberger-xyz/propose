import PageWrapper from '@/components/common/PageWrapper'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/?unauthorized=true')
    }

    return (
        <PageWrapper className="mb-10 gap-5">
            <h1>Protected page</h1>
        </PageWrapper>
    )
}
