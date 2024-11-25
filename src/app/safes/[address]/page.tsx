import PageWrapper from '@/components/common/PageWrapper'

export default async function Page({ params }: { params: Promise<{ address: string }> }) {
    const address = (await params).address

    return (
        <PageWrapper className="mb-10 gap-5">
            <div>address: {address}</div>
        </PageWrapper>
    )
}
