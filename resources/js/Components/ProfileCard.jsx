import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/Contexts/LanguageContext';

export default function ProfileCard({ user, index = 0 }) {
    const { t } = useTranslation();

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleConnect = () => {
        if (user.connection_status === 'received_pending') {
            router.get(route('connections.index'));
            return;
        }

        setSending(true);
        router.post(route('contact-requests.store'), { receiver_id: user.id }, {
            preserveScroll: true,
            onSuccess: () => setSent(true),
            onFinish: () => setSending(false)
        });
    };

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full"></div>
                <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                    className="relative h-20 w-20 rounded-[2rem] object-cover border-2 border-white dark:border-slate-800 shadow-xl mx-auto transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" 
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                
                {user.matchPercentage && (
                    <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">
                        {user.matchPercentage}% Match
                    </div>
                )}
            </div>

            <div className="text-center mb-6">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{user.programme || t('Étudiant.e Pulse')}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                {(user.interests || []).slice(0, 3).map((interest, i) => {
                    const name = typeof interest === 'string' ? interest : interest.name;
                    return (
                        <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-xl uppercase tracking-wider border border-slate-200/50 dark:border-slate-700/50">
                            {t(name)}
                        </span>
                    );
                })}
            </div>

            {Number(user.id) !== Number(usePage().props.auth.user.id) ? (
                <button
                    onClick={handleConnect}
                    disabled={sending || sent || user.connection_status === 'sent_pending' || user.connection_status === 'accepted' || user.is_connection}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        sent || user.connection_status === 'sent_pending' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                        : (user.connection_status === 'accepted' || user.is_connection)
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 cursor-default'
                        : user.connection_status === 'received_pending'
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white'
                    }`}
                >
                    {sending ? t('Envoi...') : (
                        sent || user.connection_status === 'sent_pending' ? t('Invitation envoyée') : 
                        (user.connection_status === 'accepted' || user.is_connection) ? t('Jumelé(e)') : 
                        user.connection_status === 'received_pending' ? t('Répondre') : t('Se Jumeler')
                    )}
                </button>
            ) : (
                <div className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center border border-dashed border-slate-200 dark:border-slate-800">
                    {t('C\'est vous !')}
                </div>
            )}
        </div>
    );
}
