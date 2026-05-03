import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const SettingTile = ({ href, icon, title, description, accent = 'slate' }) => (
    <Link
        href={href}
        className="group flex items-center justify-between p-7 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500 active:scale-[0.98]"
    >
        <div className="flex items-center gap-6">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900`}>
                {icon}
            </div>
            <div>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{title}</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{description}</p>
            </div>
        </div>
        <div className="text-slate-200 dark:text-slate-800 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </Link>
);

export default function Edit() {
    const { auth, translations = {} } = usePage().props;
    const user = auth.user;
    const t = (key) => translations[key] || key;

    return (
        <AuthenticatedLayout>
            <Head title={t('Profil — Pulse')} />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 pb-32">

                {/* Profile identity card */}
                <div className="flex items-center gap-6 mb-12 px-2">
                    <div className="relative">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.75rem] object-cover border-4 border-white dark:border-black shadow-xl"
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                            {user.name}
                        </h1>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                            {user.programme || t('Étudiant.e Pulse')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6 px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">{t('Paramètres')}</p>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
                </div>

                {/* Tiles */}
                <div className="space-y-4">
                    <SettingTile
                        href={route('profile.bio')}
                        title={t('Identité & Bio')}
                        description={t('Nom, programme, photo, intérêts')}
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />

                    <SettingTile
                        href={route('profile.security')}
                        title={t('Sécurité')}
                        description={t('Mot de passe et accès au compte')}
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                    />

                    <SettingTile
                        href={route('profile.danger')}
                        title={t('Compte')}
                        description={t('Supprimer définitivement votre compte')}
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    />
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `.font-display { font-family: 'Outfit', sans-serif; }` }} />
        </AuthenticatedLayout>
    );
}
