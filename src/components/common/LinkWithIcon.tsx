import IconWrapper from '@/components/common/IconWrapper'
import { IconIds } from '@/enums'
import LinkWrapper from './LinkWrapper'

export default function LinkWithIcon({ children, href }: { href: string; children?: React.ReactNode }) {
    return (
        <LinkWrapper
            href={href}
            className="group flex w-fit items-center gap-2 rounded-md bg-very-light-hover px-1 hover:bg-light-hover hover:text-primary"
            target="_blank"
        >
            {children}
            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="size-3.5 text-inactive group-hover:text-primary" />
        </LinkWrapper>
    )
}
