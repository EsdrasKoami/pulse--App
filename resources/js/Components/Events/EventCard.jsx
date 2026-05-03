import React from 'react';
import { usePage, router } from '@inertiajs/react';

export default function EventCard({ event, onInviteClick }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const handleJoin = () => {
        router.post(route('events.join', event.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm(t('Supprimer cet événement ?'))) {
            router.delete(route('events.destroy', event.id));
        }
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-900">
                        <img src={event.creator.avatar || `https://ui-avatars.com/api/?name=${event.creator.name}`} className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{event.creator.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Organisateur')}</p>
                    </div>
                </div>

                {event.is_creator && (
                    <button onClick={handleDelete} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-3">
                    {event.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-3 leading-relaxed">
                    {event.description}
                </p>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">{event.event_date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">{event.location}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/50">
                <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 overflow-hidden">
                        <span className="text-[10px] font-black text-slate-400">{event.participants_count}</span>
                    </div>
                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                        {event.max_participants ? `${event.participants_count}/${event.max_participants}` : t('Illimité')}
                    </span>
                </div>

                <div className="flex gap-2">
                    {(event.is_joined || event.is_creator) && (
                        <button
                            onClick={() => onInviteClick && onInviteClick(event)}
                            className="px-4 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-500/20"
                        >
                            {t('Inviter')}
                        </button>
                    )}
                    <button
                        onClick={handleJoin}
                        disabled={event.is_full && !event.is_joined}
                        className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all
                            ${event.is_joined
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-rose-500 hover:text-white'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                            } disabled:opacity-50 disabled:grayscale`}
                    >
                        {event.is_joined ? t('Quitter') : (event.is_full ? t('Complet') : t('Rejoindre'))}
                    </button>
                </div>
            </div>
        </div>
    );
}
