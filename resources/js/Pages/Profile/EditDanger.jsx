import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';

export default function EditDanger() {
    const [confirmed, setConfirmed] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => { },
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Compte — Pulse" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-32">

                {/* Back */}
                <Link href={route('profile.edit')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Retour
                </Link>

                <h1 className="font-display text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Compte</h1>
                <p className="text-sm font-bold text-slate-400 mb-10">Gestion définitive de votre compte Pulse.</p>

                {!confirmed ? (
                    /* Warning card */
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-rose-700 dark:text-rose-400 text-lg mb-1">Zone critique</h3>
                                <p className="text-sm font-bold text-rose-600/70 dark:text-rose-400/70 leading-relaxed">
                                    La suppression de votre compte est <strong>définitive et irréversible</strong>. Toutes vos données, messages et connexions seront supprimés.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setConfirmed(true)}
                            className="w-full py-4 rounded-2xl bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-black text-sm hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-[0.98]"
                        >
                            Je comprends les risques — Continuer
                        </button>
                    </div>
                ) : (
                    /* Confirmation form */
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8">
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Confirmez votre mot de passe pour supprimer définitivement votre compte.
                            </p>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Mot de passe</label>
                            <input
                                ref={passwordInput}
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoFocus
                                className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/10 transition-all"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => { setConfirmed(false); clearErrors(); reset(); }}
                                className="flex-1 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-sm hover:text-slate-900 dark:hover:text-white transition-all"
                            >
                                Annuler
                            </button>
                            <form onSubmit={submit} className="flex-1">
                                <button
                                    type="submit"
                                    disabled={processing || !data.password}
                                    className="w-full py-4 rounded-2xl bg-rose-600 text-white font-black text-sm shadow-xl shadow-rose-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    Supprimer définitivement
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `.font-display { font-family: 'Outfit', sans-serif; }` }} />
        </AuthenticatedLayout>
    );
}
