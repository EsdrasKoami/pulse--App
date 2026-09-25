import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

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

export default function Index({ auth, users }) {
    const [toast, setToast] = useState(null);
    const [blockModal, setBlockModal] = useState({ isOpen: false, user: null, reason: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

    const notify = (message, type = 'success') => {
        setToast({ message, type });
    };

    const toggleBan = (user, reason) => {
        router.post(route('admin.users.toggle-ban', user.id), { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                setBlockModal({ isOpen: false, user: null, reason: '' });
                notify(`Utilisateur ${user.is_banned ? 'débloqué' : 'bloqué'} avec succès`);
            }
        });
    };

    const confirmDelete = (user) => {
        router.delete(route('admin.users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, user: null });
                notify('Utilisateur supprimé avec succès');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.dashboard')} className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h2 className="font-display text-2xl font-black tracking-tighter">Gestion des Membres</h2>
                    </div>
                    <Link href={route('admin.users.create')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 transition-all">
                        Nouvel Utilisateur
                    </Link>
                </div>
            }
        >
            <Head title="Admin - Utilisateurs" />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Modal de Blocage */}
            <Modal show={blockModal.isOpen} onClose={() => setBlockModal({ ...blockModal, isOpen: false })}>
                <div className="p-10">
                    <h3 className="font-display text-3xl font-black tracking-tighter mb-4">
                        {blockModal.user?.is_banned ? 'Débloquer l’accès' : 'Bloquer l’utilisateur'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">
                        {blockModal.user?.is_banned 
                            ? `Êtes-vous sûr de vouloir redonner accès à ${blockModal.user?.name} ?` 
                            : `Voulez-vous suspendre l'accès de ${blockModal.user?.name} ? Précisez la raison ci-dessous.`}
                    </p>

                    {!blockModal.user?.is_banned && (
                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Raison du blocage</label>
                            <textarea 
                                value={blockModal.reason} 
                                onChange={e => setBlockModal({ ...blockModal, reason: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-4 text-sm font-bold min-h-[100px] outline-none transition-all"
                                placeholder="Ex: Comportement inapproprié, Spam..."
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => toggleBan(blockModal.user, blockModal.reason)}
                            className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${blockModal.user?.is_banned ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                        >
                            {blockModal.user?.is_banned ? 'Confirmer le déblocage' : 'Confirmer le blocage'}
                        </button>
                        <button 
                            onClick={() => setBlockModal({ ...blockModal, isOpen: false })}
                            className="w-full py-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Suppression */}
            <Modal show={deleteModal.isOpen} onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}>
                <div className="p-10">
                    <div className="h-16 w-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="font-display text-3xl font-black tracking-tighter mb-4">Suppression définitive</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed">
                        Vous êtes sur le point de supprimer le compte de <span className="text-slate-900 dark:text-white">{deleteModal.user?.name}</span>. <br />
                        Toutes ses données (messages, posts, connexions) seront effacées de manière permanente. Cette action est irréversible.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => confirmDelete(deleteModal.user)}
                            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                        >
                            Supprimer définitivement
                        </button>
                        <button 
                            onClick={() => setDeleteModal({ isOpen: false, user: null })}
                            className="w-full py-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                        >
                            Garder l'utilisateur
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Membre</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Programme</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {users.data.map(user => (
                                    <tr key={user.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-950/30 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-white dark:border-slate-700">
                                                    <img 
                                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-display text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                                                        {user.prenom} {user.nom}
                                                        {user.is_admin && <span className="ml-2 text-[8px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Admin</span>}
                                                    </p>
                                                    <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                                                {user.programme || 'Non spécifié'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.is_banned ? (
                                                <div className="flex flex-col">
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                        Compte Bloqué
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 line-clamp-1 italic max-w-[150px]">
                                                        "{user.ban_reason}"
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Actif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-5">
                                                <Link 
                                                    href={route('admin.users.edit', user.id)}
                                                    className="text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-all"
                                                >
                                                    Éditer
                                                </Link>
                                                <button 
                                                    onClick={() => setBlockModal({ isOpen: true, user, reason: user.ban_reason || '' })}
                                                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${user.is_banned ? 'text-emerald-500 hover:text-emerald-600' : 'text-amber-500 hover:text-amber-600'}`}
                                                >
                                                    {user.is_banned ? 'Débloquer' : 'Bloquer'}
                                                </button>
                                                <button 
                                                    disabled={user.id === auth.user.id}
                                                    onClick={() => setDeleteModal({ isOpen: true, user })}
                                                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${user.id === auth.user.id ? 'opacity-0 pointer-events-none' : 'text-slate-300 hover:text-rose-500'}`}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Simple */}
                    {users.links.length > 3 && (
                        <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 flex justify-center gap-2">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${link.active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
