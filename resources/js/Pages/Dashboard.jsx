import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import StoriesBar from '@/Components/Social/StoriesBar';
import PostCard from '@/Components/Social/PostCard';
import CreatePost from '@/Components/Social/CreatePost';
import ProfileCard from '@/Components/ProfileCard';
import StatCard from '@/Components/StatCard';
import DonutChart from '@/Components/DonutChart';
import Dropdown from '@/Components/Dropdown';

import { useTranslation } from '@/Contexts/LanguageContext';

export default function Dashboard() {
    const { auth, stories, posts, profiles, personalStats } = usePage().props;
    const [view, setView] = useState('feed'); // 'feed', 'discovering', or 'personal'
    const { t } = useTranslation();

    const views = [
        { id: 'feed', icon: <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /> },
        { id: 'discovering', icon: <path d="M12 21a9 9 0 100-18 9 9 0 000 18z M16 8l-2 6-6 2 2-6 6-2z" /> },
        { id: 'personal', icon: <path d="M16 8v8m-4-5v5m-4-2v2M4 18h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" /> }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [interestFilter, setInterestFilter] = useState('all');
    
    // Extract unique interests for filtering
    const allInterests = ['all', ...new Set(profiles?.flatMap(p => p.interests).filter(Boolean))];

    const filteredProfiles = profiles?.filter(p => {
        const name = p.name?.toLowerCase() || '';
        const query = searchQuery?.toLowerCase() || '';
        const matchesSearch = name.includes(query);
        const matchesInterest = interestFilter === 'all' || p.interests?.includes(interestFilter);
        return matchesSearch && matchesInterest;
    }) || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tighter text-slate-900 dark:text-white">
                        {view === 'feed' ? t('Flux') : (view === 'discovering' ? t('Découverte') : t('Tableau de bord'))}
                    </h2>
                    <div className="flex gap-1.5 sm:gap-2">
                        {views.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setView(v.id)}
                                className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 ${view === v.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    {v.icon}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title={t('Flux')} />

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans">
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10">
                    {/* Main Content */}
                    <div className="flex-1 max-w-5xl mx-auto w-full">
                        {view === 'feed' && (
                            <>
                                <div className="mb-6 sm:mb-8 bg-white dark:bg-slate-950 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-900 py-1 sm:py-2 shadow-sm overflow-hidden">
                                    <StoriesBar stories={stories || []} />
                                </div>
                                <CreatePost />
                                <div className="space-y-6 sm:space-y-8 pb-32 max-w-2xl mx-auto">
                                    {posts && posts.length > 0 ? (
                                        posts.map(post => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <div className="py-20 sm:py-24 text-center rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-900">
                                            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white mb-2">{t('Silence radio.')}</h3>
                                            <p className="text-sm sm:text-base text-slate-400 font-bold">{t('Soyez le premier à poster sur Pulse.')}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {view === 'discovering' && (
                            <div className="space-y-8 pb-32">
                                {/* Real Search Bar */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto animate-fade-in-up">
                                    {/* Search Bar */}
                                    <div className="relative group flex-1 w-full">
                                        <div className="absolute inset-0 bg-violet-500/10 blur-2xl rounded-[3rem] group-focus-within:bg-violet-500/20 transition-all duration-500"></div>
                                        <div className="relative flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/20 dark:border-slate-800 rounded-[2.5rem] px-6 py-4 shadow-2xl transition-all group-focus-within:border-violet-500/50">
                                            <svg className="w-6 h-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input 
                                                type="text" 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={t('Chercher une personne...')} 
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-900 dark:text-white placeholder-slate-400 ml-4 outline-none"
                                            />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Filter Dropdown */}
                                    <div className="w-full sm:w-auto">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="w-full sm:w-auto flex items-center justify-between gap-3 px-8 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/20 dark:border-slate-800 rounded-[2.5rem] shadow-2xl hover:border-violet-500/50 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                        </svg>
                                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                                                            {interestFilter === 'all' ? t('Tous les intérêts') : interestFilter}
                                                        </span>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content align="right" width="64">
                                                <div className="p-2 max-h-80 overflow-y-auto no-scrollbar">
                                                    {allInterests.map(interest => (
                                                        <button
                                                            key={interest}
                                                            onClick={() => setInterestFilter(interest)}
                                                            className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all mb-1
                                                                ${interestFilter === interest 
                                                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            {interest === 'all' ? t('Tous les intérêts') : interest}
                                                        </button>
                                                    ))}
                                                </div>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Results Grid */}
                                <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                                    {filteredProfiles.length > 0 ? (
                                        filteredProfiles.map((profile, idx) => (
                                            <ProfileCard key={profile.id} user={profile} index={idx} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center opacity-50">
                                            <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-black">{t('Aucun résultat')}</h3>
                                            <p className="font-bold text-sm">{t('Essayez avec d\'autres mots clés.')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {view === 'personal' && (
                            <div className="space-y-8 sm:space-y-10 pb-32 animate-fade-in-up">
                                {/* Highlights Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                    <StatCard label={t('Connexions')} value={personalStats.matches} color="indigo" />
                                    <StatCard label={t('Mentions J\'aime')} value={personalStats.likesReceived} color="rose" trend="+12%" />
                                    <StatCard label={t('Publications')} value={personalStats.posts} color="emerald" />
                                </div>

                                {/* Donut Chart */}
                                <DonutChart stats={personalStats} totalLabel={t('TOTAL')} />

                                {/* Secondary Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <StatCard label={t('Commentaires')} value={personalStats.comments} color="violet" />
                                    <StatCard label={t('Intérêts')} value={personalStats.interests} color="amber" />
                                    <StatCard label={t('Demandes')} value={personalStats.pendingRequests} color="sky" />
                                </div>

                                {/* Recent Interactions */}
                                <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] sm:rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full"></div>

                                    <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mb-6 sm:mb-10 relative z-10 uppercase tracking-tighter">
                                        {t('Activités récentes')}
                                    </h3>
                                    <div className="space-y-3 sm:space-y-4 relative z-10">
                                        {personalStats.interactions && personalStats.interactions.length > 0 ? (
                                            personalStats.interactions.map(interaction => (
                                                <div key={interaction.id} className="flex items-center justify-between p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group/item">
                                                    <div className="flex items-center gap-3 sm:gap-5">
                                                        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-[0.8rem] sm:rounded-[1.2rem] overflow-hidden shadow-md grayscale group-hover/item:grayscale-0 transition-all duration-500">
                                                            <img src={interaction.user_avatar || `https://ui-avatars.com/api/?name=${interaction.user_name}`} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm sm:text-lg font-black text-slate-900 dark:text-white leading-tight mb-0.5">
                                                                {interaction.user_name}
                                                            </p>
                                                            <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">
                                                                {interaction.type === 'like' ? t('a aimé votre post') : t('a commenté votre post')}
                                                                {interaction.preview && <span className="ml-1 sm:ml-2 lowercase font-bold text-slate-300 line-clamp-1 italic">"{interaction.preview}"</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-300 dark:text-slate-700">
                                                            {interaction.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-16 sm:py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[9px] sm:text-[10px] border-2 border-dashed border-slate-50 dark:border-slate-900 rounded-[2rem] sm:rounded-[3rem]">
                                                {t('Aucune activité.')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - only show for feed/discovery */}
                    {view !== 'personal' && (
                        <div className="hidden lg:block w-80 space-y-10">
                            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-900 shadow-sm">
                                <h4 className="text-xl font-display font-black text-slate-900 dark:text-white mb-8">{t('Suggestions')}</h4>
                                <div className="space-y-6">
                                    {profiles.slice(0, 5).map(profile => (
                                        <div key={profile.id} className="flex items-center justify-between gap-3 group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                                                    <img 
                                                        src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`} 
                                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        alt={profile.name}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{profile.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{profile.program || profile.programme || t('Étudiant.e')}</p>
                                                </div>
                                            </div>
                                            <button
                                                disabled={profile.is_connection}
                                                onClick={() => router.post(route('contact-requests.store'), { receiver_id: profile.id }, { preserveScroll: true })}
                                                className={`text-[11px] font-black transition-all ${profile.is_connection ? 'text-emerald-500 dark:text-emerald-400 cursor-default' : 'text-slate-900 dark:text-white hover:underline'}`}
                                            >
                                                {profile.is_connection ? t('Suivi(e)') : t('Suivre')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setView('discovering')}
                                    className="w-full mt-10 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                                >
                                    {t('Explorer')}
                                </button>
                            </div>

                            <div className="px-8 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] leading-loose">
                                © 2026 Pulse <br /> {t('Hub Social Étudiant')}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
