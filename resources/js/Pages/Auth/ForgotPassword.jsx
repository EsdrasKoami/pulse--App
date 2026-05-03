import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white flex flex-col justify-center p-6">
            <Head title={t('Réinitialisation — Pulse')} />

            <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black text-xl">P</div>
                        <span className="font-display text-2xl font-black tracking-tighter">Pulse</span>
                    </div>

                    <h3 className="font-display text-3xl font-black tracking-tighter mb-4">
                        {t('Oublié ?')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                        {t("Pas de soucis. Indiquez votre adresse courriel pour recevoir un lien, ou utilisez votre question de secours.")}
                    </p>

                    {status && (
                        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/30 animate-fade-in">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">
                                {t('Courriel institutionnel')}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="prenom.nom@edu.cegeptr.qc.ca"
                                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[15px] font-medium placeholder-slate-300 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:border-slate-300 dark:focus:border-slate-600 transition-all ${errors.email ? 'border-rose-500/50' : ''}`}
                                autoFocus
                            />
                            {errors.email && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                        >
                            {t('Envoyer le lien')}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center space-y-4">
                        <Link
                            href={route('password.security.index')}
                            className="block text-xs font-black text-slate-900 dark:text-white hover:underline uppercase tracking-widest"
                        >
                            {t('Utiliser ma question de secours')}
                        </Link>
                        
                        <Link
                            href={route('login')}
                            className="block text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
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
