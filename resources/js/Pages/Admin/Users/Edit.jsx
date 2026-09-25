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

export default function Edit({ auth, user }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        is_admin: !!user.is_admin,
        is_banned: !!user.is_banned,
        ban_reason: user.ban_reason || '',
    });

    const [toast, setToast] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id), {
            onSuccess: () => setToast({ message: 'Profil mis à jour avec succès !', type: 'success' }),
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
                    <h2 className="font-display text-2xl font-black tracking-tighter">Modifier le Profil</h2>
                </div>
            }
        >
            <Head title={`Admin - Éditer ${user.name}`} />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="py-12 px-6 max-w-4xl mx-auto grid lg:grid-cols-12 gap-12">
                
                {/* Aperçu Profil */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-6">
                        <div className="relative inline-block group">
                            <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                <img 
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=128`} 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {user.is_banned && (
                                <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-display text-2xl font-black tracking-tighter leading-none mb-1">{user.prenom} {user.nom}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{user.programme || 'Étudiant'}</p>
                        </div>
                        <div className="pt-6 grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Inscrit le</p>
                                <p className="text-xs font-black tracking-tight">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Rôle</p>
                                <p className="text-xs font-black tracking-tight">{user.is_admin ? 'Admin' : 'Étudiant'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulaire Édition */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <form onSubmit={submit} className="space-y-8">
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Nom d'affichage</label>
                                    <input 
                                        type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                    />
                                    {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Email institutionnel</label>
                                    <input 
                                        type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                    />
                                    {errors.email && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Sécurité du compte</h4>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Nouveau mot de passe</label>
                                        <input 
                                            type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                            placeholder="Laisser vide si inchangé"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Confirmation</label>
                                        <input 
                                            type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-5 text-sm font-bold transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                {errors.password && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.password}</p>}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-[2rem] flex items-center justify-between cursor-pointer border-2 transition-all ${data.is_admin ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-950 border-transparent'}`} onClick={() => setData('is_admin', !data.is_admin)}>
                                    <div>
                                        <p className={`text-sm font-black tracking-tight ${data.is_admin ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>Administrateur</p>
                                        <p className="text-[10px] font-bold text-slate-400">Accès total au panel</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full transition-colors relative ${data.is_admin ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                        <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${data.is_admin ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>

                                <div className={`p-6 rounded-[2rem] flex items-center justify-between cursor-pointer border-2 transition-all ${data.is_banned ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' : 'bg-slate-50 dark:bg-slate-950 border-transparent'}`} onClick={() => setData('is_banned', !data.is_banned)}>
                                    <div>
                                        <p className={`text-sm font-black tracking-tight ${data.is_banned ? 'text-rose-600 dark:text-rose-400' : ''}`}>Bloquer l'accès</p>
                                        <p className="text-[10px] font-bold text-slate-400">Interdit la connexion</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full transition-colors relative ${data.is_banned ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                        <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${data.is_banned ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            {data.is_banned && (
                                <div className="animate-fade-in-down">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1 text-rose-500">Raison du blocage (Visible par l'utilisateur)</label>
                                    <textarea 
                                        value={data.ban_reason} onChange={e => setData('ban_reason', e.target.value)}
                                        className="w-full bg-rose-50/30 dark:bg-rose-500/5 border-2 border-rose-100 dark:border-rose-500/20 focus:border-rose-300 dark:focus:border-rose-500/40 rounded-2xl p-5 text-sm font-bold transition-all outline-none min-h-[100px]"
                                        placeholder="Indiquez pourquoi ce compte est suspendu..."
                                    />
                                </div>
                            )}

                            <button 
                                type="submit" disabled={processing}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-sm shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Mise à jour...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
