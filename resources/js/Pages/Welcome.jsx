import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth, all_translations = {}, locale: initialLocale = 'fr' }) {
    const [clientLocale, setClientLocale] = useState(initialLocale);

    useEffect(() => {
        setClientLocale(initialLocale);
    }, [initialLocale]);

    const t = (key) => {
        const dict = all_translations?.[clientLocale] || {};
        return dict[key] || key;
    };

    const switchLanguage = (lang) => {
        setClientLocale(lang);
        router.post(route('language.store'), { locale: lang }, { 
            preserveScroll: true, 
            preserveState: true 
        });
    };

    return (
        <>
            <Head title={t('Bienvenue sur Pulse')} />
            
            <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden relative selection:bg-violet-500 selection:text-white">
                
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Navbar */}
                <nav className="relative z-50 h-24 flex items-center justify-between px-6 sm:px-12 max-w-screen-xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl shadow-xl">P</div>
                        <span className="text-2xl font-black tracking-tighter font-display">Pulse</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 gap-1">
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

                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-black uppercase tracking-widest hover:text-violet-500 transition-colors">{t('Dashboard')}</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="hidden sm:block text-sm font-black uppercase tracking-widest hover:text-violet-500 transition-colors">{t('Connexion')}</Link>
                                <Link href={route('register')} className="px-6 sm:px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                    {t('Inscription')}
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 pt-20 pb-32 px-6 max-w-screen-xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-10 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                            {t('Le Hub Social de ton Campus')}
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-8xl font-black tracking-tighter font-display leading-[0.9] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {t('L’énergie du')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500">
                            {t('campus.')}
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {t('Connectez-vous avec les étudiants qui partagent vos passions, organisez vos activités et découvrez votre prochain binôme d’étude.')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link href={route('register')} className="px-12 py-5 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95 transition-all">
                            {t('Commencer l’aventure')}
                        </Link>
                        <Link href={route('login')} className="px-12 py-5 rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 text-slate-900 dark:text-white text-base font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                            {t('Déjà inscrit ?')}
                        </Link>
                    </div>

                    {/* App Preview Mockup */}
                    <div className="mt-32 w-full max-w-5xl relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent z-20 pointer-events-none h-64 bottom-0 top-auto"></div>
                        <div className="rounded-[3rem] overflow-hidden border-8 border-slate-100 dark:border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.1)] bg-slate-50 dark:bg-slate-900/50 backdrop-blur-3xl aspect-video relative group">
                            <img 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                alt="Pulse Community"
                            />
                        </div>
                    </div>
                </main>

                {/* Features Grid */}
                <section className="relative z-10 py-32 px-6 max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Jumelage intelligent', desc: 'Notre algorithme te propose des étudiants avec les mêmes intérêts et programmes.', icon: '⚡' },
                            { title: 'Stories Campus', desc: 'Partage tes moments forts de la journée avec tout ton réseau étudiant.', icon: '📸' },
                            { title: 'Groupes d’études', desc: 'Crée tes propres cercles privés pour collaborer sur tes projets de fin de session.', icon: '🎓' }
                        ].map((feature, i) => (
                            <div key={i} className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:translate-y-[-10px] transition-all">
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{t(feature.title)}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t(feature.desc)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="relative z-10 py-20 px-6 text-center border-t border-slate-100 dark:border-slate-900">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        &copy; {new Date().getFullYear()} Pulse Platform — Cegep Trois-Rivières
                    </p>
                </footer>
            </div>

            
        </>
    );
}
