import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────
const STEPS = ['Identité', 'Programme', 'Intérêts', 'Avatar'];

const CATEGORY_LABELS = {
    arts: { label: 'Arts & Créativité', icon: '🎨' },
    sports: { label: 'Sports', icon: '⚽' },
    jeux: { label: 'Jeux', icon: '🎲' },
    gaming: { label: 'Gaming', icon: '🎮' },
    autres: { label: 'Autres', icon: '✨' },
};

// ─── Sub-Components ────────────────────────────────────────────────────────
function Field({ label, id, error, children, hint }) {
    return (
        <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1" htmlFor={id}>
                {label}
            </label>
            {children}
            {hint && !error && <p className="text-[11px] font-bold text-slate-400 mt-2 ml-1">{hint}</p>}
            {error && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{error}</p>}
        </div>
    );
}

function TextInput({ id, value, onChange, placeholder, maxLength, autoFocus }) {
    return (
        <input
            id={id} value={value} onChange={onChange}
            placeholder={placeholder} maxLength={maxLength}
            autoFocus={autoFocus}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[15px] font-medium placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:border-slate-300 dark:focus:border-slate-600 transition-all dark:text-white"
        />
    );
}

function Textarea({ id, value, onChange, placeholder, maxLength }) {
    return (
        <div className="relative">
            <textarea
                id={id} value={value} onChange={onChange}
                placeholder={placeholder} maxLength={maxLength} rows={4}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[15px] font-medium placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:border-slate-300 dark:focus:border-slate-600 transition-all dark:text-white resize-none"
            />
            <span className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300">{value.length}/{maxLength}</span>
        </div>
    );
}

// ─── Step Components ────────────────────────────────────────────────────────
function StepIdentite({ data, setData, errors }) {
    return (
        <div className="animate-fade-in-up">
            <div className="text-4xl mb-6">👤</div>
            <h3 className="font-display text-3xl font-black tracking-tighter mb-2">Comment vous appelez-vous ?</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10">C'est le nom qui s'affichera sur votre profil Pulse.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Prénom" id="prenom" error={errors.prenom}>
                    <TextInput id="prenom" value={data.prenom} onChange={e => setData('prenom', e.target.value)} placeholder="Jean" autoFocus />
                </Field>
                <Field label="Nom" id="nom" error={errors.nom}>
                    <TextInput id="nom" value={data.nom} onChange={e => setData('nom', e.target.value)} placeholder="Tremblay" />
                </Field>
            </div>
            <Field label="Téléphone (Optionnel)" id="phone" error={errors.phone}>
                <TextInput id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="819-123-4567" />
            </Field>
        </div>
    );
}

function StepProgramme({ data, setData, errors }) {
    return (
        <div className="animate-fade-in-up">
            <div className="text-4xl mb-6">🎓</div>
            <h3 className="font-display text-3xl font-black tracking-tighter mb-2">Votre parcours.</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10">Dites-nous ce que vous étudiez au CEGEP.</p>

            <Field label="Programme / Département" id="programme" error={errors.programme} hint="ex: Informatique, Sciences humaines, Soins infirmiers…">
                <TextInput id="programme" value={data.programme} onChange={e => setData('programme', e.target.value)} placeholder="Techniques de l'informatique" />
            </Field>
            <Field label="Bio / À propos" id="bio" error={errors.bio}>
                <Textarea id="bio" value={data.bio} onChange={e => setData('bio', e.target.value)} placeholder="Une courte description pour briser la glace..." maxLength={200} />
            </Field>
        </div>
    );
}

function StepInterets({ data, setData, interests, errors }) {
    const grouped = interests.reduce((acc, interest) => {
        if (!acc[interest.category]) acc[interest.category] = [];
        acc[interest.category].push(interest);
        return acc;
    }, {});

    const toggle = (id) => {
        const current = data.interests;
        setData('interests', current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id]
        );
    };

    return (
        <div className="animate-fade-in-up">
            <div className="text-4xl mb-6">✨</div>
            <h3 className="font-display text-3xl font-black tracking-tighter mb-2">Vos passions.</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10">Choisissez au moins 3 centres d'intérêt pour de meilleures suggestions.</p>

            {errors.interests && <p className="text-rose-500 text-xs font-black uppercase mb-4 tracking-widest">{errors.interests}</p>}

            <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {Object.entries(grouped).map(([cat, items]) => {
                    const meta = CATEGORY_LABELS[cat] || { label: cat, icon: '•' };
                    return (
                        <div key={cat}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{meta.icon} {meta.label}</p>
                            <div className="flex flex-wrap gap-2">
                                {items.map(interest => {
                                    const selected = data.interests.includes(interest.id);
                                    return (
                                        <button
                                            key={interest.id}
                                            type="button"
                                            onClick={() => toggle(interest.id)}
                                            className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all border ${selected ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                        >
                                            <span className="mr-2">{interest.icon}</span>
                                            {interest.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-center mt-10 text-[11px] font-black uppercase tracking-widest text-slate-300">
                {data.interests.length} sélectionné{data.interests.length > 1 ? 's' : ''} / 3 minimum
            </p>
        </div>
    );
}

function StepAvatar({ data, setData, errors }) {
    const fileRef = useRef();
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('avatar', file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="animate-fade-in-up text-center">
            <div className="text-4xl mb-6">📸</div>
            <h3 className="font-display text-3xl font-black tracking-tighter mb-2">Finaliser le tout.</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-12">Ajoutez une photo et choisissez votre visibilité.</p>

            <div
                onClick={() => fileRef.current.click()}
                className="h-40 w-40 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-auto mb-10 overflow-hidden cursor-pointer group transition-all hover:border-slate-400"
            >
                {preview ? (
                    <img src={preview} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-slate-300 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {errors.avatar && <p className="text-rose-500 text-xs font-black uppercase mb-6">{errors.avatar}</p>}

            <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                {[
                    { value: 'public', label: 'Public', sub: 'Visible partout' },
                    { value: 'anonyme', label: 'Anonyme', sub: 'Profil caché' },
                ].map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setData('visibility', opt.value)}
                        className={`p-5 rounded-2xl border transition-all ${data.visibility === opt.value ? 'bg-slate-50 dark:bg-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-black border-slate-100 dark:border-slate-900 opacity-40'}`}
                    >
                        <p className="font-black text-xs uppercase tracking-widest">{opt.label}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">{opt.sub}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Setup Component ───────────────────────────────────────────────────
export default function Setup({ interests, initialData = {} }) {
    const [step, setStep] = useState(0);
    const [mounted, setMounted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        prenom: initialData.prenom || '',
        nom: initialData.nom || '',
        programme: '',
        bio: '',
        interests: [],
        avatar: null,
        visibility: 'public',
        phone: initialData.phone || '',
    });

    useEffect(() => setMounted(true), []);

    const canAdvance = () => {
        if (step === 0) return data.prenom.trim() && data.nom.trim();
        if (step === 2) return data.interests.length >= 3;
        return true;
    };

    const next = () => { if (canAdvance()) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
    const back = () => { setStep(s => Math.max(s - 1, 0)); };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.setup.store'), { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-white selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <Head title="Configuration — Pulse" />

            <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 min-h-screen">

                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl">P</div>
                            <span className="font-display text-2xl font-black tracking-tighter">Pulse</span>
                        </div>

                        {/* Dynamic Progress indicator */}
                        <div className="space-y-12">
                            {STEPS.map((label, i) => (
                                <div key={i} className={`flex items-center gap-6 transition-all duration-700 ${i === step ? 'opacity-100 translate-x-4' : 'opacity-20'}`}>
                                    <span className="font-display text-6xl font-black text-slate-200 dark:text-slate-800 tracking-tighter tabular-nums">0{i + 1}</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Étape</p>
                                        <p className="font-display text-3xl font-black tracking-tighter">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
                        © 2026 Pulse — CEGEP 3R
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-[120px]"></div>
                </div>

                {/* Form Side */}
                <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
                    <div className={`w-full max-w-sm mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                        {/* Step Form */}
                        <form onSubmit={e => e.preventDefault()} className="min-h-[500px] flex flex-col">
                            <div className="flex-1">
                                {step === 0 && <StepIdentite data={data} setData={setData} errors={errors} />}
                                {step === 1 && <StepProgramme data={data} setData={setData} errors={errors} />}
                                {step === 2 && <StepInterets data={data} setData={setData} errors={errors} interests={interests} />}
                                {step === 3 && <StepAvatar data={data} setData={setData} errors={errors} />}
                            </div>

                            {/* Navigation */}
                            <div className="mt-12 flex items-center gap-4">
                                {step > 0 && (
                                    <button
                                        type="button"
                                        onClick={back}
                                        className="p-4 rounded-2xl border border-slate-100 dark:border-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                )}

                                {step < STEPS.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={next}
                                        disabled={!canAdvance()}
                                        className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-20 shadow-xl shadow-slate-900/10 dark:shadow-white/5 flex items-center justify-center gap-3"
                                    >
                                        Continuer
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={submit}
                                        disabled={processing}
                                        className="flex-1 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                                    >
                                        {processing ? 'Enregistrement...' : 'Lancer mon profil'}
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-20 lg:hidden text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 Pulse — CEGEP 3R</p>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}
