import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NavLink from '@/Components/NavLink';
import NotificationPanel from '@/Components/NotificationPanel';
import { useTranslation } from '@/Contexts/LanguageContext';

export default function AuthenticatedLayout({ header, children, hideNavigation = false }) {
    const { auth, notifications, flash } = usePage().props;
    const { locale: clientLocale, t, switchLanguage } = useTranslation();
    const user = auth.user;
    const unreadNotificationsCount = notifications?.unread_count ?? 0;

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return true;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const [showFlash, setShowFlash] = useState(false);
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white transition-colors duration-500 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* Flash Messages */}
            {showFlash && (flash?.success || flash?.error) && (
                <div className="fixed top-24 right-6 z-[100] animate-fade-in-up">
                    <div className={`px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-2xl border flex items-center gap-4 ${flash.success ? 'bg-white/90 dark:bg-slate-900/90 border-emerald-500/20 text-emerald-600' : 'bg-white/90 dark:bg-slate-900/90 border-rose-500/20 text-rose-600'}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${flash.success ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            {flash.success ? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                        </div>
                        <p className="font-black text-[13px] tracking-tight">{flash.success || flash.error}</p>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-900 h-20 transform-gpu isolation-isolate">
                <div className="mx-auto max-w-screen-xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all">
                            <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl shadow-lg shadow-slate-900/10 dark:shadow-white/5">P</div>
                            <span className="font-display text-2xl font-black tracking-tighter">Pulse</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>{t('Flux')}</NavLink>
                            <NavLink href={route('connections.index')} active={route().current('connections.index')}>{t('Réseau')}</NavLink>
                            <NavLink href={route('events.index')} active={route().current('events.*')}>{t('Événements')}</NavLink>
                            <NavLink href={route('groups.index')} active={route().current('groups.*')}>{t('Espaces')}</NavLink>
                            <NavLink href={route('messages.index')} active={route().current('messages.*')}>{t('Messages')}</NavLink>
                            
                            {user.is_admin && (
                                <NavLink href={route('admin.dashboard')} active={route().current('admin.*')}>
                                    <span className="text-violet-500 dark:text-violet-400 font-black">{t('Administrateur')}</span>
                                </NavLink>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">

                        <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-1 gap-1">
                            <button 
                                onClick={() => switchLanguage('fr')} 
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${clientLocale === 'fr' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                FR
                            </button>
                            <button 
                                onClick={() => switchLanguage('en')} 
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${clientLocale === 'en' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button onClick={toggleDarkMode} className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            {isDarkMode ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                        </button>

                        <div className="hidden md:block">
                            <NotificationPanel />
                        </div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="h-9 w-9 rounded-full object-cover border-2 border-transparent group-hover:border-slate-900 dark:group-hover:border-white transition-colors" />
                                    <svg className="h-4 w-4 text-slate-300 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                {user.is_admin && (
                                    <Dropdown.Link href={route('admin.dashboard')}>{t('Panel Admin')}</Dropdown.Link>
                                )}
                                <Dropdown.Link href={route('profile.edit')}>{t('Mon Profil')}</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">{t('Déconnexion')}</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {/* Header Content */}
            {header && (
                <div className="bg-white dark:bg-black py-6 sm:py-10">
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Main View */}
            <main className={`flex-1 ${hideNavigation ? '' : 'pb-32'}`}>
                {children}
            </main>

            {/* Mobile Nav Bar */}
            {!hideNavigation && (
                <div className="md:hidden fixed bottom-6 left-6 right-6 h-[76px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 z-[100] border border-white/20 dark:border-white/5">
                    {[
                        { route: 'dashboard', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
                        { route: 'connections.index', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
                        { route: 'events.index', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
                        { route: 'notifications.index', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />, badge: unreadNotificationsCount },
                        { route: 'messages.index', icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
                    ].map((item, id) => (
                        <Link key={id} href={route(item.route)} className={`relative flex flex-col items-center justify-center h-12 w-12 rounded-2xl transition-all active:scale-75 ${route().current(item.route) ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800' : 'text-slate-400'}`}>
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{item.icon}</svg>
                            {item.badge > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white border-2 border-white dark:border-slate-900">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                    {/* Floating Profile Button for Mobile */}
                    <Link href={route('profile.edit')} className={`h-12 w-12 rounded-full overflow-hidden border-2 transition-all active:scale-75 ${route().current('profile.edit') ? 'border-slate-900 dark:border-white' : 'border-white/20'}`}>
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="h-full w-full object-cover" />
                    </Link>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .font-display { font-family: 'Outfit', sans-serif; }
            `}} />
        </div>
    );
}
