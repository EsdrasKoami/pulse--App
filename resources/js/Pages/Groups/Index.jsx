import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ groups = [] }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const userGroups = (groups || []).filter(g => g.type === 'private');
    const categoryGroups = (groups || []).filter(g => g.type === 'category');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                    {t('Espaces & Groupes')}
                </h2>
            }
        >
            <Head title={t('Groupes de Jumelage')} />

            <div className="relative min-h-screen py-8 bg-slate-50/30 dark:bg-slate-950/30">
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Premium Hero Section */}
                    <div className="relative overflow-hidden rounded-[3rem] glass-premium border border-white/20 shadow-2xl animate-fade-in-up mb-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-sky-500/20 z-0"></div>
                        <div className="relative z-10 px-8 py-16 sm:py-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase border border-violet-500/20">
                                {t('Collaboration & Partage')}
                            </span>
                            <h3 className="mb-6 text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                                {t('Créez votre propre')} <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">{t('Cercle')}</span>
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-xl mx-auto mb-10">
                                {t("Organisez vos sessions d'étude ou vos projets en créant un groupe privé avec vos connexions.")}
                            </p>

                            <Link
                                href={route('groups.create')}
                                className="group/btn relative inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                {t('Créer un Groupe Privé')}
                                <div className="absolute inset-0 rounded-2xl bg-violet-500 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {/* User Created Groups Section */}
                        {userGroups.length > 0 && (
                            <section className="space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-fuchsia-400">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                        {t('Mes Groupes Privés')}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {userGroups.map((group) => (
                                        <Link
                                            href={`/groups/${group.id}`}
                                            key={group.id}
                                            className="group relative h-48 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-violet-500/30"
                                        >
                                            <div className="relative h-full flex flex-col justify-between p-6 z-10">
                                                <div className="flex justify-between items-start">
                                                    <div className="h-12 w-12 rounded-2xl bg-rev p-0.5 shadow-lg">
                                                        <div className="h-full w-full rounded-[0.9rem] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                                            {group.avatar ? (
                                                                <img src={group.avatar} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-lg font-black text-violet-600">{group.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1.5 rounded-full">
                                                        {group.member_count} {group.member_count > 1 ? t('membres') : t('membre')}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{group.name}</h3>
                                                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{t('Privé')} • {t('Actif')}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Interest Categories Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-fuchsia-400">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </span>
                                    {t('Découvrir par Intérêts')}
                                </h4>
                            </div>

                            {categoryGroups.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                                    {categoryGroups.map((group) => (
                                        <Link
                                            href={route('groups.show', group.id)}
                                            key={group.id}
                                            className="group relative h-56 rounded-[2.5rem] overflow-hidden glass-premium border border-white/20 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-violet-500/20"
                                        >
                                            <div
                                                className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                                                style={{ background: `linear-gradient(135deg, hsl(${group.hue}, 70%, 50%), hsl(${(group.hue + 40) % 360}, 80%, 40%))` }}
                                            ></div>

                                            <div className="relative h-full flex flex-col justify-between p-6 z-10">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-xl border border-white/30">
                                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                    <span className="bg-slate-900/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10">
                                                        {group.member_count} {group.member_count > 1 ? t('membres') : t('membre')}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transform group-hover:translate-x-1 transition-transform duration-300">{group.name}</h3>
                                                    <div className="flex items-center gap-2 mt-2 text-violet-600 dark:text-white/80 text-xs font-black opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                        <span>{t('Explorer les profils')}</span>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-premium rounded-[3rem] p-20 text-center border border-white/20 shadow-inner">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('Aucune catégorie découverte')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold">{t('Complétez votre profil avec des intérêts pour voir plus de groupes.')}</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
