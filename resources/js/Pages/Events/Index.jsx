import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import EventCard from '@/Components/Events/EventCard';
import CreateEventModal from '@/Components/Events/CreateEventModal';
import InviteFriendsModal from '@/Components/Events/InviteFriendsModal';

export default function Index({ events, connections }) {
    const { translations = {} } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [invitingEvent, setInvitingEvent] = useState(null);
    const t = (key) => translations[key] || key;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                            {t('Événements')}
                        </h2>
                        <span className="hidden sm:block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                            {events.length} {t('Activités')}
                        </span>
                    </div>
                    
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all duration-500 hover:rotate-90 hover:scale-110 active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-white/5 overflow-hidden"
                        title={t('Créer un événement')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="relative z-10 h-6 w-6 sm:h-8 sm:w-8 transition-colors group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            }
        >
            <Head title={t('Événements')} />

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                    {events.length > 0 ? (
                        events.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                onInviteClick={(e) => setInvitingEvent(e)} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-24 sm:py-32 text-center border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-[2.5rem] sm:rounded-[4rem] group hover:border-violet-200 dark:hover:border-violet-900/30 transition-colors duration-500">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mb-3">
                                {t('Aucun événement prévu')}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-400 font-bold max-w-xs mx-auto">
                                {t('Soyez le premier à organiser une activité sur Pulse !')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <InviteFriendsModal
                event={invitingEvent}
                connections={connections}
                onClose={() => setInvitingEvent(null)}
            />

            <style dangerouslySetInnerHTML={{ __html: `.font-display { font-family: 'Outfit', sans-serif; }` }} />
        </AuthenticatedLayout>
    );
}
