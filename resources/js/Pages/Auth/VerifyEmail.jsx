import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function VerifyEmail({ status }) {
    const { translations = {}, locale = 'fr' } = usePage().props;
    const t = (key) => translations[key] || key;

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submitCode = (e) => {
        e.preventDefault();
        post(route('verification.code'));
    };

    const resendEmail = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white flex flex-col justify-center p-6">
            <Head title={t('Vérification — Pulse')} />

            <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
                {/* Minimalist deco blob */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl">P</div>
                        <span className="font-display text-2xl font-black tracking-tighter">Pulse</span>
                    </div>

                    <h3 className="font-display text-3xl font-black tracking-tighter mb-4">
                        {t('Vérifiez votre compte.')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                        {t('Nous avons envoyé un code de validation à votre adresse @edu.cegeptr.qc.ca. Veuillez le saisir ci-dessous.')}
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/30 animate-fade-in">
                            {t('Un nouveau code a été envoyé.')}
                        </div>
                    )}

                    <form onSubmit={submitCode}>
                        <div className="mb-6">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                {t('Code de validation')}
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] placeholder-slate-200 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:border-slate-300 dark:focus:border-slate-600 transition-all ${errors.code ? 'border-rose-500/50' : ''}`}
                            />
                            {errors.code && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1 text-center">{errors.code}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                        >
                            {t('Vérifier')}
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-between px-1">
                        <button
                            onClick={resendEmail}
                            disabled={processing}
                            className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                        >
                            {t('Renvoyer le code')}
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
                        >
                            {t('Déconnexion')}
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 Pulse — CEGEP 3R</p>
        </div>
    );
}
