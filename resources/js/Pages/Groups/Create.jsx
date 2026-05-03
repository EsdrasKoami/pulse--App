import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ friends = [] }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        members: []
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMember = (id) => {
        const newMembers = data.members.includes(id)
            ? data.members.filter(m => m !== id)
            : [...data.members, id];
        setData('members', newMembers);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('groups.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                    {t('Nouveau Cercle')}
                </h2>
            }
        >
            <Head title={t('Créer un Groupe')} />

            <div className="py-12 min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="space-y-10">
                        {/* Section 1: Basic Info */}
                        <div className="glass-premium rounded-[2.5rem] p-8 sm:p-12 border border-white/20 shadow-2xl animate-fade-in-up">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <span className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">1</span>
                                {t('Identité du Groupe')}
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('Nom du Cercle')}</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder={t('Ex: Étude Bio - Jeudi Soir')}
                                        className="w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 dark:text-white px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                                    />
                                    {errors.name && <p className="mt-2 text-rose-500 text-xs font-black uppercase ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('Description (Optionnel)')}</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder={t("Quel est l'objectif de ce groupe ?")}
                                        rows="3"
                                        className="w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 dark:text-white px-6 py-4 font-bold focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                                    />
                                    {errors.description && <p className="mt-2 text-rose-500 text-xs font-black uppercase ml-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Friend Selection */}
                        <div className="glass-premium rounded-[2.5rem] p-8 sm:p-12 border border-white/20 shadow-2xl animate-fade-in-up delay-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">2</span>
                                    {t('Inviter vos Amis')}
                                </h3>

                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder={t('Rechercher...')}
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full rounded-xl border-none bg-slate-100 dark:bg-white/5 dark:text-white pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-violet-500/30 transition-all font-bold"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map(friend => (
                                        <div
                                            key={friend.id}
                                            onClick={() => toggleMember(friend.id)}
                                            className={`flex items-center justify-between p-4 rounded-3xl border-2 transition-all cursor-pointer group animate-fade-in-up ${data.members.includes(friend.id)
                                                ? 'border-violet-600 bg-violet-600/5 dark:bg-violet-600/10'
                                                : 'border-transparent bg-white/30 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full border-2 border-white/20 shadow-md flex items-center justify-center font-black text-lg flex-shrink-0 relative">
                                                    {friend.avatar ? (
                                                        <img src={friend.avatar} className="h-full w-full object-cover rounded-full" />
                                                    ) : (
                                                        <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            {friend.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[15px] dark:text-white leading-tight">{friend.name}</h4>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{friend.role}</p>
                                                </div>
                                            </div>

                                            <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${data.members.includes(friend.id)
                                                ? 'bg-violet-600 border-violet-600'
                                                : 'border-slate-200 dark:border-white/10'}`}>
                                                {data.members.includes(friend.id) && (
                                                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-slate-400 font-bold italic text-sm">
                                        {friends.length === 0 ? t("Vous n'avez pas encore de connexions acceptées.") : t("Aucun ami trouvé.")}
                                    </div>
                                )}
                            </div>
                            {errors.members && <p className="mt-4 text-rose-500 text-xs font-black uppercase text-center">{errors.members}</p>}
                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-200">
                            <Link
                                href={route('groups.index')}
                                className="order-2 sm:order-1 px-10 py-4 text-slate-500 dark:text-slate-400 font-black text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {t('Annuler')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || data.members.length === 0 || !data.name.trim()}
                                className="order-1 sm:order-2 relative w-full sm:w-auto px-12 py-5 bg-rev text-white font-black text-base rounded-[2rem] shadow-2xl shadow-violet-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 overflow-hidden"
                            >
                                {processing ? t('Création...') : (
                                    <>
                                        {t('Créer le Cercle')}
                                        <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[11px]">{data.members.length} {data.members.length > 1 ? t('membres') : t('membre')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
