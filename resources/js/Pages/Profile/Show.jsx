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

            <style>{`
                .prof-header {
                    position: relative;
                    height: 180px;
                    background: linear-gradient(150deg, #3f5efb 0%, #1c3cb0 55%, #042C53 100%);
                    border-radius: 20px 20px 0 0;
                    margin-bottom: 60px; /* space for avatar overlap */
                }
                .prof-header::after {
                    content: ''; position: absolute; inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 26px 26px; pointer-events: none;
                }
                .prof-avatar-wrap {
                    position: absolute;
                    bottom: -50px; left: 30px;
                    z-index: 10;
                }
                .prof-avatar {
                    width: 120px; height: 120px;
                    border-radius: 50%;
                    border: 4px solid #fff;
                    background: #fff;
                    object-fit: cover;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
                }
                .prof-actions {
                    position: absolute;
                    bottom: -35px; right: 30px;
                    z-index: 10;
                }
                .prof-btn-edit {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: #fff; border: 1.5px solid #dde3f0;
                    color: #1a2f6f; font-weight: 600; font-size: 0.85rem;
                    padding: 8px 16px; border-radius: 999px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    transition: all 0.2s;
                }
                .prof-btn-edit:hover {
                    border-color: #4361ee; color: #4361ee;
                    transform: translateY(-1px);
                }

                @media (max-width: 600px) {
                    .prof-avatar-wrap { left: 50%; transform: translateX(-50%); bottom: -60px; }
                    .prof-header { margin-bottom: 80px; border-radius: 0; }
                    .prof-actions { bottom: -60px; right: 50%; transform: translateX(50%); width: 100%; text-align: center; margin-top: 15px; position: static; }
                }

                .prof-card {
                    background: #fff;
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(67,97,238,0.05);
                    border: 1px solid rgba(221,227,240,0.8);
                    overflow: hidden;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .prof-chip {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 5px 12px; border-radius: 999px;
                    background: #f0f3ff; border: 1px solid #dde3f0;
                    color: #4361ee; font-size: 0.82rem; font-weight: 600;
                }
            `}</style>

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="prof-card">

                        {/* Cover & Avatar */}
                        <div className="prof-header">
                            <div className="prof-avatar-wrap">
                                <img src={avatarUrl} alt={user.name} className="prof-avatar" />
                            </div>
                            <div className="hidden sm:block prof-actions">
                                {isOwnProfile ? (
                                    <Link href={route('profile.edit')} className="prof-btn-edit">
                                        ✏️ {t('Modifier le profil')}
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowReportModal(true)} className="prof-btn-edit !text-amber-600 !border-amber-200 hover:!bg-amber-50">
                                            ⚠️ {t('Signaler')}
                                        </button>
                                        <button onClick={() => setShowBlockModal(true)} className={`prof-btn-edit ${isBlocked ? '!text-emerald-600 !border-emerald-200 hover:!bg-emerald-50' : '!text-rose-600 !border-rose-200 hover:!bg-rose-50'}`}>
                                            {isBlocked ? `✅ ${t('Débloquer')}` : `🚫 ${t('Bloquer')}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="sm:hidden text-center mt-4 mb-2">
                            {isOwnProfile ? (
                                <Link href={route('profile.edit')} className="prof-btn-edit">
                                    ✏️ {t('Modifier')}
                                </Link>
                            ) : (
                                <div className="flex justify-center gap-2 px-4">
                                    <button onClick={() => setShowReportModal(true)} className="prof-btn-edit !text-amber-600 !border-amber-200">
                                        ⚠️ {t('Signaler')}
                                    </button>
                                    <button onClick={() => setShowBlockModal(true)} className={`prof-btn-edit ${isBlocked ? '!text-emerald-600 !border-emerald-200' : '!text-rose-600 !border-rose-200'}`}>
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
                                                            <span key={interest.id} className="prof-chip">
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

            <style dangerouslySetInnerHTML={{ __html: `.font-display { font-family: 'Outfit', sans-serif; }` }} />
        </AuthenticatedLayout>
    );
}
