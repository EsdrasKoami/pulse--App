import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ProfileCard from '@/Components/ProfileCard';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Show({ category, group, profiles, messages, is_private }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const { auth } = usePage().props;
    const title = is_private ? group.name : category.name;
    const subtitle = is_private
        ? `${t('Cercle privé créé par')} ${group.creator}`
        : `${t('Espace Thématique:')} ${category.name}`;

    const chatEndRef = useRef(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Message Form
    const { data: msgData, setData: setMsgData, post: postMsg, reset: resetMsg, processing: msgProcessing } = useForm({
        content: ''
    });

    // Edit Group Form
    const { data: editData, setData: setEditData, patch: patchGroup, processing: editProcessing, errors: editErrors } = useForm({
        name: group?.name || '',
        description: group?.description || '',
        members: profiles?.map(p => p.id).filter(id => id !== auth.user.id) || []
    });

    const submitMessage = (e) => {
        e.preventDefault();
        if (!msgData.content.trim()) return;

        postMsg(route('groups.messages.store', group.id), {
            preserveScroll: true,
            onSuccess: () => resetMsg('content')
        });
    };

    const handleUpdateGroup = (e) => {
        e.preventDefault();
        patchGroup(route('groups.update', group.id), {
            preserveScroll: true,
            onSuccess: () => setIsSettingsOpen(false)
        });
    };

    const handleDeleteGroup = () => {
        setIsSettingsOpen(false);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('groups.destroy', group.id), {
            onFinish: () => setIsConfirmDeleteOpen(false)
        });
    };

    const toggleMember = (id) => {
        const newMembers = editData.members.includes(id)
            ? editData.members.filter(m => m !== id)
            : [...editData.members, id];
        setEditData('members', newMembers);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Link href={route('groups.index')} className="p-2 rounded-full glass-panel text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    {is_private && group.is_admin && (
                        <button 
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            }
        >
            <Head title={`${is_private ? t('Groupe') : t('Espace')} ${title}`} />

            <div className="relative min-h-screen py-8">
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl">
                        <div className={`absolute inset-0 bg-gradient-to-r ${is_private ? 'from-violet-600/40 to-fuchsia-600/40' : 'from-indigo-600/30 to-purple-600/30'}`}></div>
                        <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-center items-center text-center">
                            <span className="mb-4 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-black tracking-widest uppercase text-white backdrop-blur-md shadow-inner">
                                {profiles.length} {profiles.length > 1 ? t('Membres') : t('Membre')} {is_private && `• ${t('Privé')}`}
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-md">
                                {is_private ? group.name : `${t('Bienvenue dans l\'espace')} ${category.name}`}
                            </h3>
                            <p className="mt-4 max-w-2xl text-[15px] sm:text-[16px] text-slate-300 font-medium">
                                {is_private
                                    ? group.description || t(`Un espace d'échange privé pour collaborer sur des projets ou des études.`)
                                    : `${t('Ces membres de la communauté cégépienne partagent un intérêt pour')} ${category.name}. ${t('Parcourez leurs profils et initiez une conversation.')}`}
                            </p>
                            <div className="mt-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{subtitle}</div>
                        </div>
                    </div>

                    {is_private ? (
                        <div className="flex flex-col lg:flex-row gap-8 pb-20">
                            {/* Chat Section */}
                            <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col min-h-[500px]">
                                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-6 pl-2">
                                    {t('Discussion de groupe')}
                                </h4>

                                <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6">
                                    {messages && messages.length > 0 ? (
                                        messages.map((msg, idx) => {
                                            const isMe = msg.user_id === auth.user.id;
                                            return (
                                                <div key={idx} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                                    <img 
                                                        src={msg.user_avatar || `https://ui-avatars.com/api/?name=${msg.user_name}&background=random&color=fff`} 
                                                        className="h-8 w-8 rounded-full object-cover shrink-0 bg-slate-200 dark:bg-slate-800" 
                                                    />
                                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                                                            {isMe ? t('Moi') : msg.user_name} • {msg.time}
                                                        </span>
                                                        <div className={`px-4 py-3 text-[14px] ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white rounded-2xl rounded-tl-sm'}`}>
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                                            {t('Soyez le premier à envoyer un message !')}
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <form onSubmit={submitMessage} className="relative mt-auto">
                                    <input
                                        type="text"
                                        value={msgData.content}
                                        onChange={e => setMsgData('content', e.target.value)}
                                        placeholder={t('Écrivez un message...')}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white placeholder-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={msgProcessing || !msgData.content.trim()}
                                        className="absolute right-2 top-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            {/* Members Sidebar */}
                            <div className="w-full lg:w-80 space-y-6">
                                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white pl-2">
                                    {t('Membres')} ({profiles.length})
                                </h4>
                                <div className="space-y-4">
                                    {profiles.map(profile => (
                                        <div key={profile.id} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                                            <img 
                                                src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} 
                                                className="h-10 w-10 rounded-full object-cover bg-slate-100 dark:bg-slate-800" 
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{profile.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{profile.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Public Space Grid */
                        <>
                            <div className="mb-8">
                                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                    {t('Membres de la communauté')}
                                </h4>
                            </div>

                            {profiles.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
                                    {profiles.map((profile, idx) => (
                                        <ProfileCard key={profile.id} user={profile} index={idx} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center glass-panel rounded-[2rem]">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t('Espace vide')}</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">{t("Il n'y a personne d'autre ici pour le moment.")}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Settings Modal ── */}
            <Modal show={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} maxWidth="2xl">
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {/* Modal Header */}
                    <div className="relative p-8 sm:p-10 border-b border-slate-50 dark:border-slate-900 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-display">
                                    {t('Paramètres du groupe')}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    {t('Personnalisez votre espace de discussion.')}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsSettingsOpen(false)}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateGroup} className="p-8 sm:p-10 space-y-8">
                        <div className="space-y-6">
                            {/* Group Info Section */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">
                                        {t('Nom du groupe')}
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={e => setEditData('name', e.target.value)}
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-[15px] font-semibold focus:border-slate-900 dark:focus:border-white transition-all outline-none dark:text-white"
                                        required
                                    />
                                    <InputError message={editErrors.name} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">
                                        {t('Description')}
                                    </label>
                                    <textarea
                                        value={editData.description}
                                        onChange={e => setEditData('description', e.target.value)}
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-[15px] font-semibold focus:border-slate-900 dark:focus:border-white transition-all outline-none dark:text-white min-h-[100px]"
                                        rows={3}
                                    />
                                    <InputError message={editErrors.description} className="mt-2" />
                                </div>
                            </div>

                            {/* Members Section */}
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 ml-1">
                                    {t('Gérer les membres')}
                                </label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {usePage().props.connections?.length > 0 ? (
                                        usePage().props.connections.map(friend => {
                                            const isSelected = editData.members.includes(friend.id);
                                            return (
                                                <button
                                                    key={friend.id}
                                                    type="button"
                                                    onClick={() => toggleMember(friend.id)}
                                                    className={`group relative flex items-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all text-left overflow-hidden
                                                        ${isSelected 
                                                            ? 'border-indigo-600/50 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-sm' 
                                                            : 'border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
                                                        }`}
                                                >
                                                    <div className="relative">
                                                        <img 
                                                            src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}&background=random&color=fff`} 
                                                            className="h-10 w-10 rounded-2xl object-cover border border-white/20 bg-slate-100 dark:bg-slate-800" 
                                                        />
                                                        {isSelected && (
                                                            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white dark:border-slate-900">
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`text-[13px] font-black truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                                            {friend.name}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{friend.role}</p>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                                            <p className="text-xs font-bold text-slate-400">{t('Aucune connexion disponible')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100 dark:border-slate-900">
                            <button 
                                type="button" 
                                onClick={handleDeleteGroup}
                                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100 dark:border-rose-900/30"
                            >
                                {t('Supprimer le groupe')}
                            </button>
                            
                            <div className="flex w-full sm:w-auto gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                                >
                                    {t('Annuler')}
                                </button>
                                <button 
                                    type="submit"
                                    disabled={editProcessing}
                                    className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
                                >
                                    {editProcessing ? t('Enregistrement...') : t('Enregistrer')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ── Delete Confirmation Modal ── */}
            <ConfirmationModal
                show={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={confirmDelete}
                title={t('Supprimer le groupe')}
                message={t('Êtes-vous sûr de vouloir dissoudre ce cercle ? Tous les messages et l\'historique seront définitivement effacés.')}
                confirmLabel={t('Supprimer')}
                cancelLabel={t('Annuler')}
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
