import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/Contexts/LanguageContext';

// ─── Input Field ──────────────────────────────────────────────────────────────
function Input({ id, label, type = 'text', value, onChange, placeholder, autoComplete, error, autoFocus }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="mb-5">
            <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                {label}
            </label>
            <div className="relative group">
                <input
                    id={id}
                    autoFocus={autoFocus}
                    type={isPassword && show ? 'text' : type}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full bg-white dark:bg-slate-900/80 border-2 rounded-2xl px-5 py-3.5 text-[15px] font-medium placeholder-slate-300 dark:placeholder-slate-700 transition-all outline-none focus:ring-0 dark:text-white
                        ${error
                            ? 'border-rose-300 dark:border-rose-800 focus:border-rose-400'
                            : 'border-slate-100 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-600 group-hover:border-slate-200'
                        }`}
                    style={{ paddingRight: isPassword ? '3.5rem' : undefined }}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        {show
                            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><path d="M1 1l22 22" /></svg>
                            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                    </button>
                )}
            </div>
            {error && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{error}</p>}
        </div>
    );
}

function Select({ id, label, value, onChange, options, error }) {
    return (
        <div className="mb-5">
            <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full bg-white dark:bg-slate-900/80 border-2 rounded-2xl px-5 py-3.5 text-[15px] font-medium transition-all outline-none dark:text-white
                    ${error
                        ? 'border-rose-300 dark:border-rose-800'
                        : 'border-slate-100 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-600'
                    }`}
            >
                <option value="">Sélectionnez une question</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {error && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{error}</p>}
        </div>
    );
}

function SubmitBtn({ label, processing }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="relative w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm tracking-wider active:scale-[0.98] transition-all disabled:opacity-40 mt-6 overflow-hidden group shadow-xl shadow-slate-900/10 dark:shadow-white/5"
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {processing && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                )}
                {label}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
}

// ─── Hero Visual Panel ────────────────────────────────────────────────────────
function HeroPanel({ t, locale, switchLanguage }) {
    return (
        <div className="hidden lg:block relative overflow-hidden">
            {/* Background Image */}
            <img
                src="/images/auth-hero.jpg"
                alt="Campus Pulse"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-violet-950/70" />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                backgroundSize: '150px 150px'
            }} />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-14">

                {/* Top: Logo + Lang */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-black text-xl border border-white/20">P</div>
                        <span className="text-white font-black text-2xl tracking-tighter">Pulse</span>
                    </div>
                    <button
                        onClick={() => switchLanguage(locale === 'fr' ? 'en' : 'fr')}
                        className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                        {locale === 'fr' ? 'EN' : 'FR'}
                    </button>
                </div>

                {/* Middle: Headline */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">{t('Hub Social Étudiant')}</span>
                    </div>
                    <h2 className="text-white font-black text-6xl leading-[1.05] tracking-tighter">
                        {t("L'énergie")}<br />
                        <span className="text-white/40">{t('du campus.')}</span>
                    </h2>
                    <p className="text-white/60 text-lg font-medium max-w-sm leading-relaxed">
                        {t('Connectez-vous avec les étudiants qui partagent vos passions.')}
                    </p>
                </div>

                {/* Bottom: Social Proof card */}
                <div className="bg-white/8 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 max-w-sm">
                    <div className="flex -space-x-3 mb-4">
                        {[
                            'https://ui-avatars.com/api/?name=L+B&background=8b5cf6&color=fff&size=40',
                            'https://ui-avatars.com/api/?name=A+T&background=6366f1&color=fff&size=40',
                            'https://ui-avatars.com/api/?name=M+G&background=ec4899&color=fff&size=40',
                            'https://ui-avatars.com/api/?name=K+R&background=14b8a6&color=fff&size=40',
                        ].map((src, i) => (
                            <img key={i} src={src} className="h-9 w-9 rounded-full border-2 border-white/20 object-cover" alt="" />
                        ))}
                        <div className="h-9 w-9 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white text-[10px] font-black">+</div>
                    </div>
                    <p className="text-white font-black text-sm leading-snug">{t('Le jumelage réinventé')}</p>
                    <p className="text-white/50 text-xs font-bold mt-1">{t('Rejoignez 500+ étudiants')}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuthPage({ defaultTab = 'register', status, canResetPassword }) {
    const { locale: initialLocale = 'fr' } = usePage().props;
    const { t, locale, switchLanguage } = useTranslation();

    const securityQuestions = [
        "Quel est le nom de votre premier animal de compagnie ?",
        "Quelle est votre ville de naissance ?",
        "Quel était le nom de votre école primaire ?",
        "Quelle est votre couleur préférée ?",
        "Quel est le nom de jeune fille de votre mère ?"
    ];

    const [tab, setTab] = useState(defaultTab);
    const [mounted, setMounted] = useState(false);

    const loginForm = useForm({ email: '', password: '', remember: false });
    const registerForm = useForm({
        name: '',
        email: '',
        phone: '',
        security_question: '',
        security_answer: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { setTab(defaultTab); }, [defaultTab]);

    const switchTab = (next) => {
        if (next === tab) return;
        setTab(next);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-white">
            <Head title={tab === 'register' ? t("S'inscrire — Pulse") : t('Connexion — Pulse')} />

            <div className="grid lg:grid-cols-2 min-h-screen">

                {/* ── Left Panel: Hero Visual ── */}
                <HeroPanel t={t} locale={locale} switchLanguage={switchLanguage} />

                {/* ── Right Panel: Form ── */}
                <div className="flex flex-col justify-center bg-white dark:bg-black relative overflow-y-auto">
                    <div className={`w-full max-w-md mx-auto px-8 py-12 sm:px-12 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 mb-10">
                            <div className="h-8 w-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-black text-sm">P</div>
                            <span className="font-black text-xl tracking-tighter">Pulse</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-black tracking-tighter leading-tight mb-2">
                                {tab === 'login' ? t('Bon retour.') : t('Rejoindre Pulse.')}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                {tab === 'login'
                                    ? t('Entrez vos identifiants institutionnels.')
                                    : t('Créez votre profil en quelques secondes.')}
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
                            {['login', 'register'].map(tabId => (
                                <button
                                    key={tabId}
                                    onClick={() => switchTab(tabId)}
                                    className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300
                                        ${tab === tabId
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {tabId === 'login' ? t('Connexion') : t('Inscription')}
                                </button>
                            ))}
                        </div>

                        {/* Status message */}
                        {status && (
                            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                {status}
                            </div>
                        )}

                        {/* ── Login Form ── */}
                        {tab === 'login' ? (
                            <form onSubmit={e => { e.preventDefault(); loginForm.post(route('login'), { onFinish: () => loginForm.reset('password') }); }}>
                                <Input
                                    id="le" label={t('Courriel')} type="email"
                                    value={loginForm.data.email}
                                    onChange={e => loginForm.setData('email', e.target.value)}
                                    placeholder="prenom.nom@edu.cegeptr.qc.ca"
                                    error={loginForm.errors.email} autoFocus
                                />
                                <Input
                                    id="lp" label={t('Mot de passe')} type="password"
                                    value={loginForm.data.password}
                                    onChange={e => loginForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    error={loginForm.errors.password}
                                />

                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={loginForm.data.remember}
                                                onChange={e => loginForm.setData('remember', e.target.checked)}
                                            />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${loginForm.data.remember ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${loginForm.data.remember ? 'translate-x-4' : ''}`} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{t('Rester connecté')}</span>
                                    </label>
                                    {canResetPassword && (
                                        <a href={route('password.request')} className="text-xs font-black text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                            {t('Oublié ?')}
                                        </a>
                                    )}
                                </div>

                                <SubmitBtn label={t('Continuer')} processing={loginForm.processing} />

                                <p className="text-center text-xs font-bold text-slate-400 mt-6">
                                    {t("Pas de compte ?")}
                                    <button type="button" onClick={() => switchTab('register')} className="ml-1 text-slate-900 dark:text-white font-black hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                        {t("S'inscrire")}
                                    </button>
                                </p>
                            </form>
                        ) : (
                        /* ── Register Form ── */
                            <form onSubmit={e => { e.preventDefault(); registerForm.post(route('register')); }}>
                                <Input
                                    id="rn" label={t('Nom Complet')} type="text"
                                    value={registerForm.data.name}
                                    onChange={e => registerForm.setData('name', e.target.value)}
                                    placeholder="Jean Tremblay"
                                    error={registerForm.errors.name} autoFocus
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        id="re" label={t('Courriel')} type="email"
                                        value={registerForm.data.email}
                                        onChange={e => registerForm.setData('email', e.target.value)}
                                        placeholder="étudiant@cegeptr.qc.ca"
                                        error={registerForm.errors.email}
                                    />
                                    <Input
                                        id="rt" label={t('Téléphone (Optionnel)')} type="tel"
                                        value={registerForm.data.phone}
                                        onChange={e => registerForm.setData('phone', e.target.value)}
                                        placeholder="819-123-4567"
                                        error={registerForm.errors.phone}
                                    />
                                </div>

                                {/* Security box */}
                                <div className="my-2 p-5 bg-slate-50 dark:bg-slate-950/80 rounded-[1.8rem] border border-slate-100 dark:border-slate-800/80">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        {t('Sécurité du compte')}
                                    </p>
                                    <Select
                                        id="sq" label={t('Question de secours')}
                                        value={registerForm.data.security_question}
                                        onChange={e => registerForm.setData('security_question', e.target.value)}
                                        options={securityQuestions}
                                        error={registerForm.errors.security_question}
                                    />
                                    <Input
                                        id="sa" label={t('Réponse')}
                                        value={registerForm.data.security_answer}
                                        onChange={e => registerForm.setData('security_answer', e.target.value)}
                                        placeholder="Votre réponse secrète"
                                        error={registerForm.errors.security_answer}
                                    />
                                </div>

                                <Input
                                    id="rp" label={t('Mot de passe')} type="password"
                                    value={registerForm.data.password}
                                    onChange={e => registerForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    error={registerForm.errors.password}
                                />
                                <Input
                                    id="rp2" label={t('Confirmation')} type="password"
                                    value={registerForm.data.password_confirmation}
                                    onChange={e => registerForm.setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    error={registerForm.errors.password_confirmation}
                                />

                                <SubmitBtn label={t('Créer un compte')} processing={registerForm.processing} />

                                <p className="text-center text-xs font-bold text-slate-400 mt-6">
                                    {t('Déjà inscrit ?')}
                                    <button type="button" onClick={() => switchTab('login')} className="ml-1 text-slate-900 dark:text-white font-black hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                        {t('Connexion')}
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700">© 2026 Pulse — CÉGEP de Trois-Rivières</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
