import { usePage, router } from '@inertiajs/react';

/**
 * Powerful Translation Hook
 * Leverages Inertia's global state to provide reactive translations
 * without the risk of Context-related crashes.
 */
export function useTranslation() {
    const { all_translations = {}, locale = 'fr' } = usePage().props;

    const t = (key) => {
        const dict = all_translations?.[locale] || {};
        return dict[key] || key;
    };

    const switchLanguage = (newLocale) => {
        router.post(route('language.store'), { locale: newLocale }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return { locale, t, switchLanguage };
}

// Keep an empty provider for backward compatibility if needed, 
// but it's no longer necessary for 't' to work.
export function LanguageProvider({ children }) {
    return <>{children}</>;
}
