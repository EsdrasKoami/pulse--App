import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';

const CATEGORY_LABELS = {
    arts: 'Arts & Créativité',
    sports: 'Sports',
    jeux: 'Jeux',
    gaming: 'Gaming',
    autres: 'Autres',
};

export default function EditBio({ mustVerifyEmail, status, allInterests = {} }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const fileInputRef = useRef(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        programme: user.programme || '',
        bio: user.bio || '',
        visibility: user.visibility ?? true,
        interests: user.interests ? user.interests.map(i => i.id) : [],
        avatar_file: null,
        _method: 'patch',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => { },
        });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) { setData('avatar_file', file); setAvatarPreview(URL.createObjectURL(file)); }
    };

    const toggleInterest = (id) => {
        const c = data.interests;
        setData('interests', c.includes(id) ? c.filter(i => i !== id) : [...c, id]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Identité & Bio — Pulse" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-32">

                {/* Back */}
                <Link href={route('profile.edit')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Retour
                </Link>

                <h1 className="font-display text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Identité & Bio</h1>
                <p className="text-sm font-bold text-slate-400 mb-10">Ce que les autres voient de vous sur Pulse.</p>

                <form onSubmit={submit} className="space-y-10">

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div
                            className="relative h-24 w-24 rounded-[1.75rem] overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer group flex-shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img src={avatarPreview || `https://ui-avatars.com/api/?name=${data.prenom}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Photo de profil</p>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-black px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all active:scale-95">
                                Modifier
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
                        </div>
                    </div>

                    {/* Name grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[['prenom', 'Prénom'], ['nom', 'Nom']].map(([field, label]) => (
                            <div key={field}>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{label}</label>
                                <input
                                    value={data[field]}
                                    onChange={e => setData(field, e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
                                />
                                <InputError message={errors[field]} className="mt-1" />
                            </div>
                        ))}
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Programme</label>
                            <input
                                value={data.programme}
                                onChange={e => setData('programme', e.target.value)}
                                placeholder="Ex: Techniques de l'informatique"
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <div className="flex justify-between mb-2 px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio</label>
                            <span className={`text-[10px] font-black ${data.bio.length > 200 ? 'text-rose-500' : 'text-slate-300'}`}>{data.bio.length}/200</span>
                        </div>
                        <textarea
                            rows="4"
                            value={data.bio}
                            onChange={e => setData('bio', e.target.value)}
                            placeholder="Présentez-vous en quelques mots..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold resize-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
                        />
                    </div>

                    {/* Visibility */}
                    <label className="flex items-center gap-5 cursor-pointer">
                        <input type="checkbox" checked={data.visibility} onChange={e => setData('visibility', e.target.checked)} className="h-5 w-5 rounded-lg border-slate-200 dark:border-slate-800 text-slate-900 focus:ring-0" />
                        <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Profil Public</p>
                            <p className="text-xs font-bold text-slate-400">Visible dans la découverte</p>
                        </div>
                    </label>

                    {/* Interests */}
                    {Object.keys(allInterests).length > 0 && (
                        <div className="pt-8 border-t border-slate-50 dark:border-slate-900">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">Centres d'intérêt</p>
                            <div className="space-y-6">
                                {Object.keys(allInterests).map(cat => (
                                    <div key={cat}>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 mb-3">
                                            {CATEGORY_LABELS[cat] || cat}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {allInterests[cat].map(interest => {
                                                const active = data.interests.includes(interest.id);
                                                return (
                                                    <button
                                                        key={interest.id} type="button"
                                                        onClick={() => toggleInterest(interest.id)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${active ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300'}`}
                                                    >
                                                        {interest.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-900">
                        <Transition show={recentlySuccessful} enter="transition duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sauvegardé ✓</p>
                        </Transition>
                        <button
                            disabled={processing}
                            className="ml-auto px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>

            
        </AuthenticatedLayout>
    );
}
