import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

const TYPE_META = {
    received: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
        color: 'bg-sky-500/10 text-sky-500 dark:text-sky-400',
    },
    accepted: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
        color: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
    },
    post_liked: {
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
        color: 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
    },
    default: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
        color: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    },
};

function timeAgo(dateStr, t) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return t("À l'instant");
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('min')}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('h')}`;
    return `${Math.floor(diff / 86400)}${t('j')}`;
}

import { useTranslation } from '@/Contexts/LanguageContext';

export default function Index({ notifications }) {
    const { t } = useTranslation();

    const unreadCount = notifications?.unread_count ?? 0;
    const items = notifications?.recent ?? [];

    const markAllRead = () => {
        router.post(route('notifications.read'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title={t('Notifications')} />

            <div className="py-10 sm:py-20 min-h-[calc(100vh-80px)] font-outfit">
                <div className="mx-auto max-w-2xl px-5 sm:px-6">
                    
                    {/* Header Section */}
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                {t('Alertes')}
                            </h1>
                            <div className="flex items-center gap-3 mt-4">
                                {unreadCount > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        {unreadCount} {t('nouvelles')}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {t('Tout est à jour')}
                                    </span>
                                )}
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllRead}
                                className="group relative flex items-center gap-2 px-5 py-3 overflow-hidden rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                            >
                                <span className="relative z-10 text-[10px] font-black uppercase tracking-widest">{t('Tout lire')}</span>
                                <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="glass-modern rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-white/5 overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-white/5 bg-white/30 dark:bg-slate-950/30 backdrop-blur-3xl">
                            {items.length === 0 ? (
                                <div className="py-32 text-center">
                                    <div className="relative inline-block mb-8">
                                        <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 animate-pulse" />
                                        <svg className="relative w-20 h-20 text-slate-200 dark:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-600">{t('Aucune notification')}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400/40 mt-3">{t('On te préviendra dès qu’il y a du nouveau !')}</p>
                                </div>
                            ) : (
                                items.map(n => {
                                    const data = n.data ?? {};
                                    const meta = TYPE_META[data.type] ?? TYPE_META.default;
                                    const isUnread = !n.read_at;
                                    return (
                                        <div
                                            key={n.id}
                                            className={`group flex items-start gap-5 px-7 py-8 transition-all relative cursor-pointer ${isUnread ? 'bg-white/60 dark:bg-violet-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-white/5'}`}
                                            onClick={() => { if (data.link) router.visit(data.link); }}
                                        >
                                            {/* Status Dot */}
                                            {isUnread && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-violet-600 shadow-[2px_0_10px_rgba(124,58,237,0.4)]" />
                                            )}

                                            <div className="relative flex-shrink-0">
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-inner border border-white/20">
                                                    {data.sender_avatar ? (
                                                        <img 
                                                            src={data.sender_avatar.startsWith('http') || data.sender_avatar.startsWith('/storage/') ? data.sender_avatar : `/storage/${data.sender_avatar}`} 
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-700" 
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-black text-xl text-slate-300">
                                                            {(data.sender_name ?? '?').charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg ${meta.color} backdrop-blur-md`}>
                                                    {meta.icon}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <p className={`text-[14px] leading-relaxed tracking-tight ${isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-500 dark:text-slate-400'}`}>
                                                    {data.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-violet-500 transition-colors">
                                                        {timeAgo(n.created_at, t)}
                                                    </span>
                                                    {isUnread && <span className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="px-8 py-5 bg-slate-50/50 dark:bg-black/20 text-center border-t border-slate-100 dark:border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400/50">
                                    {t('Fin des notifications')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
