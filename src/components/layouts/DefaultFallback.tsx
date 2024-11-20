import PageWrapper from '../common/PageWrapper'

export default function DefaultFallback() {
    return (
        <div className="h-full overflow-scroll">
            <PageWrapper className="gap-5">
                <div className="flex size-full items-center justify-center">
                    <p className="text-orange-500">App loading...</p>
                </div>
            </PageWrapper>
        </div>
    )
}
