import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

const CATEGORY_LABELS = {
    arts: { label: 'Arts & Créativité', icon: '🎨' },
    sports: { label: 'Sports', icon: '⚽' },
    jeux: { label: 'Jeux', icon: '🎲' },
    gaming: { label: 'Gaming', icon: '🎮' },
    autres: { label: 'Autres', icon: '✨' },
};

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const { auth, allInterests: pageInterests = {}, translations = {} } = usePage().props;
    const user = auth.user;
    const allInterests = pageInterests;
    const t = (key) => translations[key] || key;

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
        post(route('profile.update'), { preserveScroll: true });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar_file', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const toggleInterest = (id) => {
        const current = data.interests;
        setData('interests', current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-10">

                {/* Visual Avatar Management */}
                <div className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div
                        className="relative h-24 w-24 rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img src={avatarPreview || `https://ui-avatars.com/api/?name=${data.prenom}`} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('Photo de profil')}</h4>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-black px-6 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            {t('Changer')}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <InputError className="mt-2" message={errors.avatar_file} />
                    </div>
                </div>

                {/* Identity Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('Prénom')}</label>
                        <input value={data.prenom} onChange={e => setData('prenom', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all" />
                        <InputError className="mt-2" message={errors.prenom} />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('Nom')}</label>
                        <input value={data.nom} onChange={e => setData('nom', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all" />
                        <InputError className="mt-2" message={errors.nom} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t("Programme d'études")}</label>
                        <input value={data.programme} onChange={e => setData('programme', e.target.value)} placeholder={t("Ex: Techniques de l'informatique")} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all" />
                        <InputError className="mt-2" message={errors.programme} />
                    </div>
                </div>

                {/* Bio Section */}
                <div>
                    <div className="flex justify-between items-end mb-2 px-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Bio courte')}</label>
                        <span className={`text-[10px] font-black ${data.bio.length > 200 ? 'text-rose-500' : 'text-slate-300'}`}>{data.bio.length}/200</span>
                    </div>
                    <textarea
                        rows="4"
                        value={data.bio}
                        onChange={e => setData('bio', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all resize-none"
                        placeholder={t('Présentez-vous en quelques mots...')}
                    ></textarea>
                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {/* Interests Taxonomy */}
                <div className="pt-10 border-t border-slate-50 dark:border-slate-900">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t("Centres d'intérêt")}</h4>
                    <div className="space-y-8">
                        {Object.keys(allInterests).map(cat => (
                            <div key={cat}>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-4">{CATEGORY_LABELS[cat]?.icon || '•'} {t(CATEGORY_LABELS[cat]?.label || cat)}</p>
                                <div className="flex flex-wrap gap-2.5">
                                    {allInterests[cat].map(interest => {
                                        const active = data.interests.includes(interest.id);
                                        return (
                                            <button
                                                key={interest.id}
                                                type="button"
                                                onClick={() => toggleInterest(interest.id)}
                                                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all border ${active ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-xl' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                            >
                                                <span className="mr-2 opacity-80">{interest.icon}</span>
                                                {interest.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visibility & Submit */}
                <div className="pt-10 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" checked={data.visibility} onChange={e => setData('visibility', e.target.checked)} className="h-5 w-5 rounded-lg border-slate-200 dark:border-slate-800 text-slate-900 focus:ring-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{t('Profil Public')}</p>
                                <p className="text-[10px] font-bold text-slate-400">{t('Visible dans la découverte')}</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center gap-6">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-out duration-300"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                            leave="transition ease-in duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('Modifications Sauvegardées')}</p>
                        </Transition>

                        <button
                            disabled={processing}
                            className="px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
                        >
                            {t('Enregistrer')}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
