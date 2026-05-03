import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function MessagesIndex({ messages = [], chatUser = null, connections = [], groups = [] }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const { auth } = usePage().props;
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || isSending || !chatUser) return;

        setIsSending(true);
        router.post(route('messages.store', chatUser.id), {
            content: newMessage
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewMessage('');
                setIsSending(false);
                scrollToBottom();
            },
            onError: () => setIsSending(false),
            onFinish: () => setIsSending(false)
        });
    };

    // Calculate real stats for the Hub
    const totalConnections = connections.length;
    const unreadTotal = connections.reduce((acc, conn) => acc + (conn.unread_count || 0), 0);

    return (
        <AuthenticatedLayout header={null} hideNavigation={!!chatUser}>
            <Head title={t('Messagerie')} />

            <div className="h-[calc(100dvh-0px)] md:h-[calc(100dvh-73px)] transition-colors duration-300">
                <div className="mx-auto max-w-7xl h-full sm:px-6 lg:px-8">
                    <div className="glass-premium sm:rounded-[2.5rem] shadow-2xl sm:border border-white/20 dark:border-white/10 overflow-hidden flex h-full transition-all duration-500 animate-fade-in-up">

                        {/* Sidebar */}
                        <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-white/5 flex flex-col z-10 transition-all ${chatUser ? 'hidden md:flex' : 'flex'} bg-white/40 dark:bg-slate-900/40 backdrop-blur-md`}>
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{t('Messages')}</h3>
                                    <Link href="/groups/create" className="p-2 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors" title={t('Nouveau Cercle')}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder={t('Rechercher...')}
                                        className="w-full rounded-2xl border-none bg-slate-900/5 dark:bg-white/5 dark:text-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
                                    />
                                    <svg className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                                
                                {/* Groupes */}
                                {groups.length > 0 && (
                                    <div className="space-y-1">
                                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Groupes')}</h4>
                                        {groups.map(group => (
                                            <Link
                                                key={group.id}
                                                href={`/groups/${group.id}`}
                                                className={`flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-500 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300`}
                                            >
                                                <div className="h-12 w-12 rounded-2xl border-2 border-white/20 shadow-md flex items-center justify-center font-black text-lg flex-shrink-0 relative overflow-hidden bg-rev text-white">
                                                    {group.avatar ? (
                                                        <img src={group.avatar} className="h-full w-full object-cover" alt={group.name} />
                                                    ) : (
                                                        group.name.substring(0, 1).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="font-black text-[14px] truncate tracking-tight">{group.name}</h4>
                                                    </div>
                                                    <p className={`text-[11px] truncate mt-0.5 font-bold text-slate-500 dark:text-slate-400`}>
                                                        {group.member_count} {t('membres')}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Amis (Connexions) */}
                                <div className="space-y-1">
                                    <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Discussions')}</h4>
                                    {connections.length > 0 ? (
                                        connections.map(conn => (
                                            <Link
                                                key={conn.id}
                                                href={`/messages/${conn.id}`}
                                                className={`flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-500 cursor-pointer ${chatUser?.id === conn.id ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/30' : 'hover:bg-white/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'}`}
                                            >
                                                <div className="h-12 w-12 rounded-full border-2 border-white/20 shadow-md flex items-center justify-center font-black text-lg flex-shrink-0 relative">
                                                    {conn.avatar ? (
                                                        <img src={conn.avatar} className="h-full w-full object-cover rounded-full" alt={conn.name} />
                                                    ) : (
                                                        <div className={`h-full w-full rounded-full flex items-center justify-center ${chatUser?.id === conn.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                            {conn.name.substring(0, 1).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {conn.unread_count > 0 && chatUser?.id !== conn.id && (
                                                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-600 text-[10px] items-center justify-center text-white font-black">
                                                                {conn.unread_count}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="font-black text-[14px] truncate tracking-tight">{conn.name}</h4>
                                                        <span className={`text-[9px] font-black uppercase ${chatUser?.id === conn.id ? 'text-violet-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                                            {conn.last_message_time || ''}
                                                        </span>
                                                    </div>
                                                    <p className={`text-[11px] truncate mt-0.5 font-bold ${chatUser?.id === conn.id ? 'text-violet-100/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {chatUser?.id === conn.id ? t('Discussion active') : (conn.last_message || `${t('Dites bonjour à')} ${conn.name.split(' ')[0]}!`)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                                            {t('Aucun jumelage actif pour le moment.')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        {chatUser ? (
                            <div className="w-full md:flex-1 flex flex-col relative overflow-hidden bg-slate-50/20 dark:bg-slate-950/20 backdrop-blur-[2px]">
                                {/* Chat Header */}
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-20">
                                    <Link href="/messages" className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-white/30 transition border border-white/10">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                    <div className="h-10 w-10 rounded-full border-2 border-white/40 shadow-lg flex items-center justify-center bg-rev text-white font-black text-xs overflow-hidden">
                                        {chatUser.avatar ? (
                                            <img src={chatUser.avatar} className="h-full w-full object-cover" />
                                        ) : (
                                            chatUser.name.substring(0, 1).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-none">{chatUser.name}</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('En ligne')}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-2.5 text-slate-500 hover:text-violet-600 dark:hover:text-fuchsia-400 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition border border-white/5 active:scale-95">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Messages View */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                    {messages.length > 0 ? (
                                        messages.map(msg => (
                                            <div key={msg.id} className={`flex w-full items-end gap-3 ${msg.sender_id === auth.user.id ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {msg.sender_id !== auth.user.id && (
                                                    <div className="h-8 w-8 rounded-full border-2 border-white/20 shadow-md bg-white flex items-center justify-center font-black text-[10px] text-slate-500 flex-shrink-0 animate-fade-in-up overflow-hidden">
                                                        {chatUser.avatar ? (
                                                            <img src={chatUser.avatar} className="h-full w-full object-cover" />
                                                        ) : (
                                                            chatUser.name.substring(0, 1).toUpperCase()
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`group relative max-w-[80%] sm:max-w-[70%] transition-all duration-300 animate-fade-in-up ${msg.sender_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-5 py-4 shadow-2xl transition-all ${msg.sender_id === auth.user.id
                                                        ? 'bg-rev rounded-[2rem] rounded-br-lg text-white'
                                                        : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-white/10 text-slate-900 dark:text-slate-100 rounded-[2rem] rounded-bl-lg'}`}>
                                                        {/* We parse Markdown-like syntax for the event link if needed, but a simple paragraph works for MVP */}
                                                        <p className="text-[14px] leading-relaxed font-bold tracking-tight whitespace-pre-wrap">{msg.content}</p>
                                                    </div>
                                                    <div className={`flex items-center gap-2 mt-2 px-1 ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-80 leading-none">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {msg.sender_id === auth.user.id && (
                                                            <svg className={`h-3 w-3 ${msg.is_read ? 'text-violet-500' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                                            <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('Pas encore de messages')}</h3>
                                            <p className="text-sm font-bold">{t('Lancez la conversation avec')} {chatUser.name.split(' ')[0]} !</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Floating Input Area */}
                                <div className="px-4 sm:px-6 pb-6 md:pb-8 pt-4 bg-transparent relative z-20">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        className="flex items-center gap-3 p-2 rounded-[2.5rem] glass-premium border border-white/20 shadow-2xl max-w-4xl mx-auto backdrop-blur-3xl focus-within:ring-2 ring-violet-500/50 focus-within:shadow-violet-500/20 transition-all duration-500 group"
                                    >
                                        <button type="button" className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-violet-500 transition-colors">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            disabled={isSending}
                                            placeholder={t('Exprimez-vous...')}
                                            className="flex-1 bg-transparent border-none text-[15px] font-bold text-slate-900 dark:text-white placeholder-slate-400/60 focus:ring-0 outline-none px-2 shadow-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSending || !newMessage.trim()}
                                            className="h-12 w-12 rounded-full bg-rev text-white flex items-center justify-center shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            <svg className="h-5 w-5 transform rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-1 flex-col relative overflow-hidden bg-white/20 dark:bg-slate-950/20 backdrop-blur-md">
                                <div className="p-12 pb-6">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 animate-fade-in-up">{t('Bonjour')}, {auth.user.name.split(' ')[0]} ! 👋</h2>
                                            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-fade-in-up delay-75">{t('Prêt à élargir ton réseau aujourd\'hui ?')}</p>
                                        </div>
                                        <div className="flex gap-4 animate-fade-in-up delay-100">
                                            <div className="glass-premium p-4 rounded-3xl border border-white/20 shadow-xl text-center min-w-[100px] bg-white/10 dark:bg-slate-800/50">
                                                <span className="block text-2xl font-black text-violet-600 dark:text-fuchsia-400">{totalConnections}</span>
                                                <span className="text-[10px] uppercase font-black tracking-widest opacity-50 dark:opacity-70 dark:text-slate-300">{t('Matchs')}</span>
                                            </div>
                                            <div className="glass-premium p-4 rounded-3xl border border-white/20 shadow-xl text-center min-w-[100px] bg-white/10 dark:bg-slate-800/50">
                                                <span className="block text-2xl font-black text-emerald-500">{unreadTotal}</span>
                                                <span className="text-[10px] uppercase font-black tracking-widest opacity-50 dark:opacity-70 dark:text-slate-300">{t('Messages')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suggested Pairs - Actual Connections */}
                                    {connections.length > 0 && (
                                        <div className="mb-12 animate-fade-in-up delay-150">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{t('Récemment actifs')}</h3>
                                                <Link href="/connections" className="text-xs font-bold text-violet-600 dark:text-fuchsia-400 hover:underline">{t('Tous les contacts')}</Link>
                                            </div>
                                            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                                                {connections.slice(0, 5).map(peer => (
                                                    <Link href={`/messages/${peer.id}`} key={peer.id} className="flex-shrink-0 group cursor-pointer block">
                                                        <div className="relative mb-3">
                                                            <div className="h-20 w-20 rounded-[2rem] bg-rev p-1 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                                <div className="h-full w-full rounded-[1.8rem] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/10">
                                                                    {peer.avatar ? (
                                                                        <img src={peer.avatar} className="h-full w-full object-cover" alt={peer.name} />
                                                                    ) : (
                                                                        <span className="text-xl font-black opacity-30">{peer.name.charAt(0)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-md"></span>
                                                        </div>
                                                        <p className="text-center text-[13px] font-black tracking-tight text-slate-800 dark:text-slate-200">{peer.name.split(' ')[0]}</p>
                                                    </Link>
                                                ))}
                                                <Link href="/groups/create" className="flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 border-2 border-dashed border-white/20 text-slate-400 hover:text-violet-500 hover:border-violet-500/50 cursor-pointer transition-all" title={t('Créer un groupe')}>
                                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative group overflow-hidden rounded-[3rem] p-12 bg-rev text-white shadow-2xl animate-fade-in-up delay-200">
                                        <div className="relative z-10 max-w-md">
                                            <h3 className="text-3xl font-black tracking-tighter mb-4">{t('Ta prochaine collaboration commence ici.')}</h3>
                                            <p className="text-violet-100 font-bold mb-8 text-lg">{t('Trouve des partenaires d\'étude passionnés et booste tes résultats.')}</p>
                                            <Link href="/connections" className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                                                {t('Lancer une recherche')}
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>

                                        <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden opacity-20 pointer-events-none">
                                            <div className="absolute top-[-20%] right-[-10%] h-[140%] w-[120%] bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] animate-pulse"></div>
                                        </div>
                                        <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center opacity-30 pointer-events-none">
                                    <div className="text-[100px] font-black tracking-tighter select-none">{t('MESSAGES')}</div>
                                    <div className="h-40 w-40 rounded-full border-[20px] border-white/5 animate-spin-slow"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate3d(0, 20px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .delay-75 { animation-delay: 75ms; }
                .delay-100 { animation-delay: 100ms; }
                .delay-150 { animation-delay: 150ms; }
                .delay-200 { animation-delay: 200ms; }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                }
            `}} />
        </AuthenticatedLayout>
    );
}
