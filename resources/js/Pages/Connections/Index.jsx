import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ConnectionsIndex({ pendingRequests = [], connections = [], suggestions = [] }) {
    const { translations = {}, locale = 'fr' } = usePage().props;
    const t = (key) => translations[key] || key;

    const { flash } = usePage().props;
    const [actionLoading, setActionLoading] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleAction = (id, status) => {
        setActionLoading(id);
        router.patch(route('contact-requests.update', id), {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage(status === 'accepted' ? 'Invitation acceptée !' : 'Invitation déclinée');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                setActionLoading(null);
            },
            onError: () => setActionLoading(null),
            onFinish: () => setActionLoading(null)
        });
    };

    const handleAdd = (receiverId) => {
        setActionLoading('add' + receiverId);
        router.post(route('contact-requests.store'), {
            receiver_id: receiverId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('Demande envoyée !');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                setActionLoading(null);
            },
            onFinish: () => setActionLoading(null)
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('Mes Connexions')}</h2>}>
            <Head title={t('Connexions & Demandes')} />

            {/* Toast Notification - Clean Social Style */}
            {showToast && (
                <div className="fixed top-20 right-6 z-50 animate-fade-in-up">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-6 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm font-black">{toastMessage}</span>
                    </div>
                </div>
            )}

            <div className="py-8 min-h-[calc(100vh-73px)] bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

                    {/* Pending Requests Section - Instagram Style List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                {t("Demandes d'invitation")}
                            </h3>
                            {pendingRequests.length > 0 && (
                                <span className="bg-violet-600 text-white py-0.5 px-2 rounded-full text-[10px] font-black">{pendingRequests.length}</span>
                            )}
                        </div>

                        {pendingRequests.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {pendingRequests.map((req) => (
                                    <div key={req.id} className="py-4 flex items-center justify-between group">
                                        <Link href={route('users.show', req.sender.id)} className="flex items-center gap-4">
                                            {/* Circular Avatar */}
                                            <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm flex-shrink-0">
                                                {req.sender.avatar ? (
                                                    <img src={req.sender.avatar} alt={req.sender.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-black text-slate-400 dark:text-slate-500">
                                                        {req.sender.name.substring(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="text-[15px] font-black text-slate-900 dark:text-white leading-tight truncate">{req.sender.name}</h4>
                                                <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 truncate">{req.sender.programme || req.sender.role}</p>
                                            </div>
                                        </Link>

                                        <div className="flex gap-2 flex-shrink-0 ml-4">
                                            <button
                                                onClick={() => handleAction(req.id, 'accepted')}
                                                disabled={actionLoading === req.id}
                                                className="px-5 py-2 bg-violet-600 text-white font-black text-xs rounded-lg hover:bg-violet-700 transition active:scale-95 shadow-sm disabled:opacity-50"
                                            >
                                                {actionLoading === req.id ? '...' : t('Accepter')}
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'rejected')}
                                                disabled={actionLoading === req.id}
                                                className="px-4 py-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 font-black text-xs rounded-lg transition active:scale-95 disabled:opacity-50"
                                            >
                                                {t('Plus tard')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-3">
                                    <svg className="h-6 w-6 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 font-bold text-xs italic">{t('Aucune nouvelle demande.')}</p>
                            </div>
                        )}
                    </div>

                    {/* Suggestions Section - Matching Algorithm UI */}
                    {suggestions.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                                    {t('Suggestions de Jumelage (Match MVP)')}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suggestions.map((user) => (
                                    <div key={user.id} className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/10 transition-colors"></div>

                                        <div className="flex items-start gap-4 h-full">
                                            <Link href={route('users.show', user.id)} className="h-16 w-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
                                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="h-full w-full object-cover" />
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <Link href={route('users.show', user.id)}>
                                                        <h4 className="text-[16px] font-black text-slate-900 dark:text-white truncate hover:text-indigo-600 transition-colors">{user.name}</h4>
                                                    </Link>
                                                    <div className="flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 px-2 py-1 rounded-lg">
                                                        <span className="text-[10px] font-black text-violet-600">SCORE {user.match_details.score}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] font-bold text-slate-400 mb-3">{user.programme || 'Étudiant'}</p>

                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {user.match_details.common_interests_count > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black">
                                                            ✨ {user.match_details.common_interests_count} {t('Intérêts communs')}
                                                        </span>
                                                    )}
                                                    {user.match_details.dominant_category_match && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[10px] font-black">
                                                            🚀 {t('Bonus Catégorie !')}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleAdd(user.id)}
                                                    disabled={actionLoading === 'add' + user.id}
                                                    className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs transition-all active:scale-95 hover:shadow-lg disabled:opacity-50"
                                                >
                                                    {actionLoading === 'add' + user.id ? '...' : t('Se Jumeler')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Connections - Clean Social Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                {t('Mes Jumelages Actifs')}
                            </h3>
                        </div>

                        {connections.length > 0 ? (
                            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                                {connections.map((conn) => (
                                    <div key={conn.id} className="relative bg-white dark:bg-slate-910 rounded-3xl p-5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group text-center">
                                        <Link href={route('users.show', conn.id)} className="block relative mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-4">
                                            {/* Circular Avatar */}
                                            <div className="h-full w-full rounded-full overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105 duration-500">
                                                {conn.avatar ? (
                                                    <img src={conn.avatar} alt={conn.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-300 dark:text-slate-600">
                                                        {conn.name.substring(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-md"></span>
                                        </Link>

                                        <Link href={route('users.show', conn.id)}>
                                            <h4 className="text-[14px] sm:text-[15px] font-black text-slate-900 dark:text-white leading-tight truncate px-1 hover:text-indigo-600 transition-colors">{conn.name}</h4>
                                        </Link>
                                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1 truncate mb-6">{conn.program || conn.role}</p>

                                        <Link
                                            href={`/messages/${conn.id}`}
                                            className="block w-full py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 text-slate-900 dark:text-slate-300 font-black text-xs rounded-xl transition-all active:scale-95 border border-slate-200 dark:border-white/10"
                                        >
                                            {t('Message')}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
                                <p className="text-slate-400 dark:text-slate-500 font-bold italic text-xs">{t('Pas de jumelages actifs.')}</p>
                                <Link href={route('dashboard')} className="inline-block mt-4 text-violet-600 font-black text-[10px] uppercase tracking-widest hover:underline">{t('Explorer profiles')} →</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate3d(0, 15px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}} />
        </AuthenticatedLayout >
    );
}
