import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function CreateEventModal({ isOpen, onClose }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        location: '',
        event_date: '',
        max_participants: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-8 sm:p-12 bg-white dark:bg-slate-950 rounded-[3rem]">
                <h2 className="text-3xl font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-8">
                    {t('Nouvel événement')}
                </h2>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Titre')}</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold placeholder-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder={t('Ex: Soirée jeux de société')}
                            required
                        />
                        {errors.title && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Date et heure')}</label>
                        <input
                            type="datetime-local"
                            value={data.event_date}
                            onChange={e => setData('event_date', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                            required
                        />
                        {errors.event_date && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.event_date}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Lieu')}</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder={t('Ex: Local 1234 or Discord')}
                                required
                            />
                            {errors.location && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.location}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Participants max (optionnel)')}</label>
                            <input
                                type="number"
                                value={data.max_participants}
                                onChange={e => setData('max_participants', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder={t('Illimité si vide')}
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('Description')}</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold h-32 focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder={t('Détails sur l\'activité...')}
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            {t('Annuler')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {processing ? t('Création...') : t('Publier l\'événement')}
                        </button>
                    </div>
                </form>
            </div>
            
        </Modal>
    );
}
