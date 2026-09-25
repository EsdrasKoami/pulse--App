import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function ResetPasswordSecurity() {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    
    const [step, setStep] = useState(1); // 1: Email, 2: Question & Password
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        email: '',
        security_answer: '',
        password: '',
        password_confirmation: '',
    });

    const findQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();

        try {
            const response = await axios.post(route('password.security.question'), { email: data.email });
            setQuestion(response.data.question);
            setStep(2);
        } catch (err) {
            if (err.response && err.response.data.errors) {
                Object.keys(err.response.data.errors).forEach(key => {
                    setError(key, err.response.data.errors[key][0]);
                });
            } else {
                setError('email', 'Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    const submitReset = (e) => {
        e.preventDefault();
        post(route('password.security.update'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white flex flex-col justify-center p-6">
            <Head title={t('Réinitialisation Sécurisée — Pulse')} />

            <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl">P</div>
                        <span className="font-display text-2xl font-black tracking-tighter">Pulse</span>
                    </div>

                    <h3 className="font-display text-3xl font-black tracking-tighter mb-4">
                        {t('Question de secours')}
                    </h3>
                    
                    {step === 1 ? (
                        <>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                                {t("Entrez votre courriel pour retrouver votre question de secours.")}
                            </p>

                            <form onSubmit={findQuestion}>
                                <div className="mb-8">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                        {t('Courriel institutionnel')}
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full bg-slate-50/70 dark:bg-slate-950 border rounded-2xl p-4 text-[15px] font-semibold transition-all outline-none dark:text-white ${errors.email ? 'border-rose-400 dark:border-rose-800' : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5'}`}
                                        autoFocus
                                    />
                                    {errors.email && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.email}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                                >
                                    {loading ? t('Recherche...') : t('Trouver ma question')}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-fade-in">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('Votre question')}</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{question}</p>
                            </div>

                            <form onSubmit={submitReset}>
                                <div className="mb-6">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                        {t('Votre réponse')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.security_answer}
                                        onChange={e => setData('security_answer', e.target.value)}
                                        className={`w-full bg-slate-50/70 dark:bg-slate-950 border rounded-2xl p-4 text-[15px] font-semibold transition-all outline-none dark:text-white ${errors.security_answer ? 'border-rose-400 dark:border-rose-800' : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5'}`}
                                        autoFocus
                                    />
                                    {errors.security_answer && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.security_answer}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                        {t('Nouveau mot de passe')}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className={`w-full bg-slate-50/70 dark:bg-slate-950 border rounded-2xl p-4 text-[15px] font-semibold transition-all outline-none dark:text-white ${errors.password ? 'border-rose-400 dark:border-rose-800' : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5'}`}
                                    />
                                    {errors.password && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.password}</p>}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                        {t('Confirmer le mot de passe')}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full bg-slate-50/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 rounded-2xl p-4 text-[15px] font-semibold transition-all outline-none dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                                >
                                    {t('Réinitialiser le mot de passe')}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {t('Retour')}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-10 text-center border-t border-slate-50 dark:border-slate-800 pt-8">
                        <Link
                            href={route('login')}
                            className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                        >
                            {t('Retour à la connexion')}
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 Pulse — CEGEP 3R</p>
        </div>
    );
}
