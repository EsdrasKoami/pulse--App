import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

// Composant Toast élégant
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-6 right-6 z-[100] animate-fade-in-up">
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
                type === 'success' 
                ? 'bg-white/90 dark:bg-slate-900/90 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : 'bg-white/90 dark:bg-slate-900/90 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
                <div className={`h-2 w-2 rounded-full ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                <p className="text-sm font-black tracking-tight">{message}</p>
            </div>
        </div>
    );
};

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });

    const [toast, setToast] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => setToast({ message: 'Utilisateur créé avec succès !', type: 'success' }),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.users.index')} className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="font-display text-2xl font-black tracking-tighter">Créer un Membre</h2>
                </div>
            }
        >
            <Head title="Admin - Créer Utilisateur" />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="py-12 px-6 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={submit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Nom Complet</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                placeholder="ex: Jean Dupont"
                            />
                            {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Adresse Email (@edu.cegeptr.qc.ca)</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                placeholder="prenom.nom@edu.cegeptr.qc.ca"
                            />
                            {errors.email && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.email}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Mot de passe</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                />
                                {errors.password && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Confirmation</label>
                                <input 
                                    type="password" 
                                    value={data.password_confirmation} 
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] flex items-center justify-between group cursor-pointer" onClick={() => setData('is_admin', !data.is_admin)}>
                            <div>
                                <p className="text-sm font-black tracking-tight mb-1">Privilèges Administrateur</p>
                                <p className="text-[11px] font-bold text-slate-400">Permet d'accéder à ce panneau et de gérer les membres.</p>
                            </div>
                            <div className={`h-6 w-11 rounded-full transition-colors relative ${data.is_admin ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${data.is_admin ? 'translate-x-5' : ''}`} />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-sm shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {processing ? 'Création en cours...' : 'Enregistrer le nouveau membre'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
