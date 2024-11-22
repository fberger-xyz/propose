import HeaderButton from './HeaderButton'
import { AppPagePaths } from '@/enums'
import { cn } from '@/utils'
import ThemeSwitcher from './ThemeSwitcher'
import { ConnectOrDisconnect } from '../rabbyKit/ConnectOrDisconnect'

export default async function Header(props: { className?: string }) {
    return (
        <div className={cn('z-40 fixed top-0 flex justify-center items-center w-full', props.className)}>
            <div className="relative flex h-14 w-full items-center justify-between gap-5 border-b border-very-light-hover bg-background px-4 text-base backdrop-blur-md sm:my-2 sm:h-fit sm:max-w-[450px] sm:justify-between sm:rounded-md sm:border-transparent sm:bg-transparent sm:p-2 sm:text-lg">
                {/* <!-- eslint-disable-next-line --> */}
                <div className="bg-background/10 absolute inset-0 rounded-sm" />
                <div className="z-50 flex gap-0.5 sm:gap-1 lg:gap-2">
                    {(Object.values(AppPagePaths) as AppPagePaths[])
                        .filter((path) => path.split('/').length < 3)
                        .map((path) => (
                            <HeaderButton key={path} pagePath={path} />
                        ))}
                </div>
                <ConnectOrDisconnect />
                <ThemeSwitcher />
            </div>
        </div>
    )
}
