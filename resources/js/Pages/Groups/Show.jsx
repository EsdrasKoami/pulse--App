import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import ProfileCard from '@/Components/ProfileCard';

export default function Show({ category, group, profiles, messages, is_private }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const { auth } = usePage().props;
    const title = is_private ? group.name : category.name;
    const subtitle = is_private
        ? `${t('Cercle privé créé par')} ${group.creator}`
        : `${t('Espace Thématique:')} ${category.name}`;

    const chatEndRef = useRef(null);

    const { data, setData, post, reset, processing } = useForm({
        content: ''
    });

    const submitMessage = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        post(route('groups.messages.store', group.id), {
            preserveScroll: true,
            onSuccess: () => reset('content')
        });
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <AuthenticatedLayout
            header={
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
                                                    <img src={msg.user_avatar || `https://ui-avatars.com/api/?name=${msg.user_name}`} className="h-8 w-8 rounded-full object-cover shrink-0" />
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
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder={t('Écrivez un message...')}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white placeholder-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || !data.content.trim()}
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
                                        <div key={profile.id} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm">
                                            <img src={profile.avatar} className="h-10 w-10 rounded-full object-cover" />
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
        </AuthenticatedLayout>
    );
}
