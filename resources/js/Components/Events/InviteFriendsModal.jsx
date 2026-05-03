import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function InviteFriendsModal({ event, connections = [], onClose }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const [search, setSearch] = useState('');
    const [invitingId, setInvitingId] = useState(null);
    const [sentIds, setSentIds] = useState([]);

    if (!event) return null;

    const filteredConnections = connections.filter(conn =>
        conn.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleInvite = (userId) => {
        if (sentIds.includes(userId)) return;
        
        setInvitingId(userId);
        router.post(route('events.invite', { event: event.id, user: userId }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSentIds(prev => [...prev, userId]);
            },
            onFinish: () => setInvitingId(null)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t('Inviter des amis')}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('Recherche...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border-none bg-slate-100 dark:bg-slate-800 pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 transition-all font-bold dark:text-white"
                        />
                        <svg className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Connections List */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {filteredConnections.length > 0 ? (
                        filteredConnections.map(conn => {
                            const isSent = sentIds.includes(conn.id);
                            const isInviting = invitingId === conn.id;

                            return (
                                <div key={conn.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500 dark:text-slate-400">
                                            {conn.avatar ? (
                                                <img src={conn.avatar} className="h-full w-full object-cover" />
                                            ) : (
                                                conn.name.charAt(0)
                                            )}
                                        </div>
                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{conn.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleInvite(conn.id)}
                                        disabled={isInviting || isSent}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isSent 
                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                            : 'bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20'
                                        } disabled:opacity-80`}
                                    >
                                        {isInviting ? (
                                            t('Envoi...')
                                        ) : isSent ? (
                                            <>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t('Envoyé')}
                                            </>
                                        ) : (
                                            t('Envoyer')
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-slate-400 font-bold text-sm">
                            {t('Aucun ami trouvé.')}
                        </div>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
            `}} />
        </div>
    );
}
