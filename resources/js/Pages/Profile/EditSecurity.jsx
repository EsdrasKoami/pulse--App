import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';

export default function EditSecurity() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) { reset('password', 'password_confirmation'); passwordInput.current.focus(); }
                if (errors.current_password) { reset('current_password'); currentPasswordInput.current.focus(); }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sécurité — Pulse" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-32">

                {/* Back */}
                <Link href={route('profile.edit')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Retour
                </Link>

                <h1 className="font-display text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Sécurité</h1>
                <p className="text-sm font-bold text-slate-400 mb-10">Mettez à jour votre mot de passe régulièrement.</p>

                <form onSubmit={submit} className="space-y-6">
                    {[
                        { field: 'current_password', label: 'Mot de passe actuel', ref: currentPasswordInput, auto: 'current-password' },
                        { field: 'password', label: 'Nouveau mot de passe', ref: passwordInput, auto: 'new-password' },
                        { field: 'password_confirmation', label: 'Confirmer', ref: null, auto: 'new-password' },
                    ].map(({ field, label, ref: fRef, auto }) => (
                        <div key={field}>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{label}</label>
                            <input
                                ref={fRef}
                                type="password"
                                value={data[field]}
                                onChange={e => setData(field, e.target.value)}
                                autoComplete={auto}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
                            />
                            <InputError message={errors[field]} className="mt-1" />
                        </div>
                    ))}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-900">
                        <Transition show={recentlySuccessful} enter="transition duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mot de passe mis à jour ✓</p>
                        </Transition>
                        <button
                            disabled={processing}
                            className="ml-auto px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                        >
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>

            
        </AuthenticatedLayout>
    );
}
