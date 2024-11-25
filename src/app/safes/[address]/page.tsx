import PageWrapper from '@/components/common/PageWrapper'

export default async function Page({ params }: { params: Promise<{ address: string }> }) {
    const address = (await params).address

    return (
        <PageWrapper className="mb-10 gap-5">
            <div>PAGE TO BE CODED</div>
            <div>safe address: {address}</div>
        </PageWrapper>
    )
}
