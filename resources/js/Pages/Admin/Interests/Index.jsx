import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

// Composant Toast élégant
const NotificationToast = ({ message, type = 'success', onClose }) => {
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

// Modale de Confirmation Premium
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, processing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/20 dark:bg-black/40 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-scale-in">
                <div className="h-16 w-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="font-display text-3xl font-black tracking-tighter mb-4">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8">{message}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onConfirm} 
                        disabled={processing}
                        className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        {processing ? 'Suppression...' : 'Confirmer la suppression'}
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full py-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, interests }) {
    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        name: '',
        category: '',
        icon: '✨',
        active: true
    });

    const [editing, setEditing] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [notif, setNotif] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const commonEmojis = ['🎵', '🎨', '📷', '🍳', '💃', '🎬', '🏃', '⚽', '🚴', '🏊', '🧘', '🎲', '♟️', '🃏', '🖥️', '🎮', '📱', '📚', '✈️', '🤝', '🍕', '🏀', '🎭', '💻', '🧪', '🌱', '🥊', '🎸'];

    const notify = (message, type = 'success') => {
        setNotif({ message, type });
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            patch(route('admin.interests.update', editing.id), {
                onSuccess: () => { 
                    setEditing(null); 
                    reset(); 
                    clearErrors();
                    notify('Hobby mis à jour !');
                }
            });
        } else {
            post(route('admin.interests.store'), {
                onSuccess: () => {
                    reset();
                    clearErrors();
                    notify('Nouveau hobby ajouté !');
                }
            });
        }
    };

    const startEdit = (interest) => {
        setEditing(interest);
        setData({
            name: interest.name,
            category: interest.category,
            icon: interest.icon || '✨',
            active: !!interest.active
        });
        clearErrors();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = () => {
        if (!deleteModal.id) return;
        
        router.post(route('admin.interests.destroy', deleteModal.id), {
            _method: 'DELETE',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, id: null });
                notify('Hobby supprimé avec succès');
            },
            onError: () => {
                setDeleteModal({ isOpen: false, id: null });
                notify('Erreur lors de la suppression', 'error');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('dashboard')} className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="font-display text-2xl font-black tracking-tighter">Catalogue des Hobbies</h2>
                </div>
            }
        >
            <Head title="Admin - Intérêts" />

            {notif && <NotificationToast message={notif.message} type={notif.type} onClose={() => setNotif(null)} />}

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Supprimer l'intérêt ?"
                message="Cette action est irréversible. Toutes les associations avec les étudiants seront également supprimées."
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
                processing={processing}
            />

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Formulaire */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${editing ? 'border-violet-500/30 shadow-2xl shadow-violet-500/10' : 'border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none'}`}>
                            <h3 className="font-display text-2xl font-black tracking-tighter mb-8">
                                {editing ? 'Modifier l’intérêt' : 'Ajouter un hobby'}
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nom du hobby</label>
                                    <input 
                                        type="text" value={data.name} onChange={e => setData('name', e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-4 text-sm font-bold"
                                        placeholder="ex: Photographie"
                                    />
                                    {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Catégorie</label>
                                    <select 
                                        value={data.category} onChange={e => setData('category', e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 rounded-2xl p-4 text-sm font-bold"
                                    >
                                        <option value="">Choisir une catégorie</option>
                                        <option value="arts">Arts & Culture</option>
                                        <option value="sports">Sports & Plein air</option>
                                        <option value="gaming">Gaming & Tech</option>
                                        <option value="jeux">Jeux de société</option>
                                        <option value="autres">Autres</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Icône (Emoji)</label>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                                        >
                                            {data.icon}
                                        </button>
                                        <input 
                                            type="text" value={data.icon} onChange={e => setData('icon', e.target.value)} 
                                            className="flex-1 bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl px-4 text-sm font-bold"
                                        />
                                    </div>
                                    
                                    {showEmojiPicker && (
                                        <div className="absolute top-full left-0 mt-4 p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 grid grid-cols-7 gap-2 w-full">
                                            {commonEmojis.map(emoji => (
                                                <button 
                                                    key={emoji} type="button" 
                                                    onClick={() => { setData('icon', emoji); setShowEmojiPicker(false); }}
                                                    className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-lg transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className={`w-full py-4 rounded-2xl font-black text-sm active:scale-[0.98] transition-all shadow-xl ${editing ? 'bg-violet-600 text-white shadow-violet-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/10 dark:shadow-white/5'}`}
                                >
                                    {editing ? 'Appliquer les modifications' : 'Ajouter au catalogue'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Liste */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-950">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hobby</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-slate-800">
                                    {interests.map(interest => (
                                        <tr key={interest.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">{interest.icon}</span>
                                                    <span className="font-display text-lg font-black tracking-tighter">{interest.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    {interest.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-6">
                                                    <button 
                                                        onClick={() => startEdit(interest)} 
                                                        className="text-xs font-black text-slate-400 hover:text-violet-500 uppercase tracking-widest transition-colors"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); setDeleteModal({ isOpen: true, id: interest.id }); }} 
                                                        className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors cursor-pointer"
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
                    </div>

                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
