import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children }) {
    const { locale: initialLocale = 'fr' } = usePage().props;
    const [clientLocale, setClientLocale] = useState(initialLocale);

    useEffect(() => {
        setClientLocale(initialLocale);
    }, [initialLocale]);

    const switchLanguage = (lang) => {
        setClientLocale(lang);
        router.post(route('language.store'), { locale: lang }, { preserveScroll: true, preserveState: true });
    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-6 font-sans transition-colors duration-500 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* Minimalist Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-slate-50 dark:bg-slate-900/20 rounded-full blur-[120px] -z-10"></div>

            <div className="w-full max-w-md flex flex-col items-center animate-fade-in-up">
                <div className="mb-12 flex items-center justify-between w-full">
                    <Link href="/" className="flex items-center gap-4 transition-all hover:scale-105 active:scale-95 duration-500">
                        <div className="h-14 w-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black text-3xl shadow-2xl shadow-slate-900/10 dark:shadow-white/5">
                            P
                        </div>
                        <span className="font-display text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Pulse</span>
                    </Link>

                    <button
                        onClick={() => switchLanguage(clientLocale === 'fr' ? 'en' : 'fr')}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-black uppercase text-xs w-10 text-center"
                    >
                        {clientLocale.toUpperCase()}
                    </button>
                </div>

                <div className="w-full bg-white dark:bg-slate-950 p-10 sm:p-12 shadow-2xl shadow-slate-900/5 dark:shadow-none rounded-[3rem] border border-slate-100 dark:border-slate-900">
                    {children}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] leading-loose">
                        © 2026 Pulse — Plateforme Sociale <br />
                        Épurée • Minimaliste • Premium
                    </p>
                </div>
            </div>

            
        </div>
    );
}
