import { AppThemes, IconIds } from '@/enums'

export const APP_METADATA = {
    SITE_AUTHOR: 'fberger.xyz',
    SITE_NAME: 'Propose',
    SITE_DESCRIPTION: 'TBA',
    SITE_URL: 'https://propose.fberger.xyz',
    SOCIALS: {
        X: 'fberger_xyz',
        TELEGRAM: 'fberger_xyz',
        LINKEDIN: 'francis-berger-a2404094',
    },
}

export const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL

export const APP_THEMES: Partial<Record<AppThemes, { index: number; iconId: IconIds }>> = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK },
}
