import { useEffect, useRef, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

const TYPE_META = {
    received: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
        color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-500',
    },
    accepted: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
        color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
    },
    post_liked: {
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
        color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500',
    },
    default: {
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
        color: 'bg-slate-50 dark:bg-slate-900 text-slate-400',
    },
};

function timeAgo(dateStr, t) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return t("À l'instant");
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('min')}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('h')}`;
    return `${Math.floor(diff / 86400)}${t('j')}`;
}

export default function NotificationPanel() {
    const { notifications, translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    const unreadCount = notifications?.unread_count ?? 0;
    const items = Array.isArray(notifications?.recent) ? notifications.recent : [];

    // Auto-poll every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['notifications'], preserveScroll: true, preserveState: true });
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    // Close on outside click (desktop only)
    useEffect(() => {
        function handleClick(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleBellClick = () => {
        if (window.innerWidth < 640) {
            router.visit(route('notifications.index'));
        } else {
            setOpen(!open);
        }
    };

    const markAllRead = () => {
        router.post(route('notifications.read'), {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications'],
        });
    };

    const NotificationList = () => (
        <>
            {/* Panel Header */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-900">
                <div>
                    <h3 className="font-display text-xl font-black tracking-tighter">{t('Notifications')}</h3>
                    {unreadCount > 0 && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                            {unreadCount} {unreadCount > 1 ? t('non lues') : t('non lue')}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {t('Tout lire')}
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto divide-y divide-slate-50 dark:divide-slate-900 no-scrollbar" style={{ maxHeight: 'min(420px, 60vh)' }}>
                {items.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="text-4xl mb-4">🔔</div>
                        <p className="text-sm font-black text-slate-300 dark:text-slate-700">{t('Aucune notification')}</p>
                    </div>
                ) : (
                    items.slice(0, 10).map(n => {
                        const data = n.data ?? {};
                        const meta = TYPE_META[data.type] ?? TYPE_META.default;
                        const isUnread = !n.read_at;
                        return (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 px-6 py-5 transition-colors cursor-pointer ${isUnread ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''} hover:bg-slate-50 dark:hover:bg-slate-900/60`}
                                onClick={() => { setOpen(false); if (data.link) router.visit(data.link); }}
                            >
                                <div className="relative flex-shrink-0">
                                    {data.sender_avatar
                                        ? <img src={typeof data.sender_avatar === 'string' && (data.sender_avatar.startsWith('http') || data.sender_avatar.startsWith('/storage/')) ? data.sender_avatar : `/storage/${data.sender_avatar}`} className="h-12 w-12 rounded-2xl object-cover" />
                                        : <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-black text-slate-400">{(data.sender_name ?? '?').charAt(0)}</div>
                                    }
                                    <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 ${meta.color}`}>
                                        {meta.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[13px] leading-snug ${isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-500 dark:text-slate-400'}`}>
                                        {data.message}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 mt-1.5">
                                        {timeAgo(n.created_at, t)}
                                    </p>
                                </div>
                                {isUnread && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500 mt-2 animate-pulse" />}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="px-8 py-4 border-t border-slate-50 dark:border-slate-900 text-center">
                <button 
                    onClick={() => { setOpen(false); router.visit(route('notifications.index')); }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 dark:text-fuchsia-400 hover:opacity-70 transition-opacity"
                >
                    {t('Voir tout')}
                </button>
            </div>
        </>
    );

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={handleBellClick}
                className={`relative p-2.5 rounded-2xl text-slate-400 transition-all ${open ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'}`}
                aria-label="Notifications"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white dark:border-black shadow-lg animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* ── DESKTOP Panel (dropdown) ── */}
            {open && (
                <div
                    className="hidden sm:block absolute right-0 top-full mt-4 w-[380px] z-[200] bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-100 dark:border-slate-900 overflow-hidden"
                    style={{ animation: 'panelIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
                >
                    <NotificationList />
                </div>
            )}

            
        </div>
    );
}
