import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ReportModal from '@/Components/ReportModal';

export default function Show({ user, isOwnProfile, isBlocked, hasBlockedMe }) {
    const { translations = {}, locale = 'fr' } = usePage().props;
    const t = (key) => translations[key] || key;

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleBlock = () => {
        setProcessing(true);
        router.post(route(isBlocked ? 'users.unblock' : 'users.block', user.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowBlockModal(false);
            }
        });
    };

    const handleReport = (reason) => {
        setProcessing(true);
        router.post(route('report.store'), {
            reported_id: user.id,
            reportable_id: user.id,
            reportable_type: 'App\\Models\\User',
            reason: reason
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowReportModal(false);
            }
        });
    };

    const avatarUrl = user.avatar
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom || user.name)}&color=4361ee&background=e8eef9&size=200`;

    // Group interests by category
    const groupedInterests = user.interests?.reduce((acc, interest) => {
        if (!acc[interest.category]) acc[interest.category] = [];
        acc[interest.category].push(interest);
        return acc;
    }, {}) || {};

    const CATEGORY_LABELS = {
        arts: { label: t('Arts & Créativité'), icon: '🎨' },
        sports: { label: t('Sports'), icon: '⚽' },
        jeux: { label: t('Jeux'), icon: '🎲' },
        gaming: { label: t('Gaming'), icon: '🎮' },
        autres: { label: t('Autres'), icon: '✨' },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 group"
                        title={t('Retour')}
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-display font-black leading-tight text-white drop-shadow-md">
                        {isOwnProfile ? t('Mon Profil') : user.name}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('Mon Profil')} — Jumelage@CEGEPTR`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-900/5 overflow-hidden max-w-3xl mx-auto">

                        {/* Cover & Avatar */}
                        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
                            <div className="absolute -bottom-12 left-6 sm:left-10 z-10">
                                <img src={avatarUrl} alt={user.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] border-[6px] border-white dark:border-slate-900 object-cover bg-white dark:bg-slate-800 shadow-2xl" />
                            </div>
                            <div className="hidden sm:block absolute -bottom-8 right-6 sm:right-10 z-10">
                                {isOwnProfile ? (
                                    <Link href={route('profile.edit')} className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:border-indigo-500 transition-all active:scale-95">
                                        ✏️ {t('Modifier le profil')}
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowReportModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-600 text-xs font-black uppercase tracking-widest shadow-xl hover:bg-amber-50 transition-all active:scale-95">
                                            ⚠️ {t('Signaler')}
                                        </button>
                                        <button onClick={() => setShowBlockModal(true)} className={`inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isBlocked ? 'border-emerald-100 text-emerald-600 hover:bg-emerald-50' : 'border-rose-100 text-rose-600 hover:bg-rose-50'}`}>
                                            {isBlocked ? `✅ ${t('Débloquer')}` : `🚫 ${t('Bloquer')}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="sm:hidden text-center mt-16 mb-4">
                            {isOwnProfile ? (
                                <Link href={route('profile.edit')} className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest shadow-lg">
                                    ✏️ {t('Modifier')}
                                </Link>
                            ) : (
                                <div className="flex justify-center gap-2 px-4">
                                    <button onClick={() => setShowReportModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-amber-100 rounded-2xl text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                        ⚠️ {t('Signaler')}
                                    </button>
                                    <button onClick={() => setShowBlockModal(true)} className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-2xl text-[10px] font-black uppercase tracking-widest ${isBlocked ? 'border-emerald-100 text-emerald-600' : 'border-rose-100 text-rose-600'}`}>
                                        {isBlocked ? `✅ ${t('Débloquer')}` : `🚫 ${t('Bloquer')}`}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="px-6 sm:px-10 pb-10">
                            {isBlocked && (
                                <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] flex items-center justify-between gap-4 animate-fade-in-up">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-rose-900 dark:text-rose-200 font-black text-sm">{t('Utilisateur bloqué')}</p>
                                            <p className="text-rose-600 dark:text-rose-400/70 text-[11px] font-bold uppercase tracking-wider">{t('Vous ne voyez plus ses publications')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowBlockModal(true)} className="px-4 py-2 bg-white dark:bg-rose-900/40 text-rose-600 dark:text-rose-200 font-black text-[11px] rounded-xl border border-rose-200 dark:border-rose-800 hover:bg-rose-50 transition-all active:scale-95 uppercase tracking-widest">
                                        {t('Débloquer')}
                                    </button>
                                </div>
                            )}

                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Syne'] tracking-tight">
                                {user.prenom} {user.nom}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                {user.programme && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                                        🎓 {user.programme}
                                    </span>
                                )}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${user.visibility === 'public' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                    {user.visibility === 'public' ? `🌍 ${t('Profil public')}` : `🕵️ ${t('Profil anonyme')}`}
                                </span>
                            </div>

                            {user.bio && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{t('À propos')}</h3>
                                    <p className="text-slate-700 leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {user.bio}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                    {t("Centres d'intérêts")} ({user.interests?.length || 0})
                                </h3>

                                {Object.keys(groupedInterests).length === 0 ? (
                                    <p className="text-slate-500 italic text-sm">{t('Aucun intérêt sélectionné.')}</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {Object.entries(groupedInterests).map(([cat, items]) => {
                                            const meta = CATEGORY_LABELS[cat] || { label: cat, icon: '•' };
                                            return (
                                                <div key={cat}>
                                                    <p className="text-slate-600 font-semibold mb-3 text-sm flex items-center gap-2">
                                                        {meta.icon} {meta.label}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {items.map(interest => (
                                                            <span key={interest.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
                                                                <span>{interest.icon}</span> {interest.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onConfirm={handleBlock}
                processing={processing}
                variant={isBlocked ? 'warning' : 'danger'}
                title={isBlocked ? t('Débloquer l\'utilisateur') : t('Bloquer l\'utilisateur')}
                message={isBlocked
                    ? t('Êtes-vous sûr de vouloir débloquer cet utilisateur ? Il pourra à nouveau voir votre profil et interagir avec vous.')
                    : t('En bloquant cet utilisateur, il ne pourra plus voir votre profil, vos publications ou vous envoyer de messages.')
                }
                confirmLabel={isBlocked ? t('Débloquer') : t('Bloquer')}
            />

            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                onConfirm={handleReport}
                processing={processing}
                title={t('Signaler cet utilisateur')}
            />

            
        </AuthenticatedLayout>
    );
}
