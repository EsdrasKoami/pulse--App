import React, { useState, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/LanguageContext';

export default function StoriesBar({ stories = [] }) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const [selectedStoryId, setSelectedStoryId] = useState(null);
    const fileInputRef = useRef();

    const handleCreateClick = () => fileInputRef.current.click();

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            router.post(route('stories.store'), { image: file }, {
                forceFormData: true,
                onSuccess: () => {
                    // Flash success handled by AuthenticatedLayout
                }
            });
        }
    };

    const toggleLike = (story) => {
        router.post(route('stories.like', story.id), {}, {
            preserveScroll: true,
        });
    };

    const deleteStory = (story) => {
        if (confirm(t('Supprimer cette story ?'))) {
            router.delete(route('stories.destroy', story.id), {
                onSuccess: () => setSelectedStoryId(null)
            });
        }
    };

    // Find the fresh story data from props to ensure UI updates after like/delete
    const currentStory = stories.find(s => s.id === selectedStoryId);

    return (
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-6 px-6 relative">
            <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

            {/* Add New Story */}
            <div onClick={handleCreateClick} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
                <div className="h-[76px] w-[76px] rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-1 group-hover:border-violet-500 transition-all group-hover:rotate-6">
                    <div className="h-full w-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-violet-500 transition-colors">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-500">{t('Nouveau')}</span>
            </div>

            {/* Other Stories grouped by user */}
            {stories.map((story) => (
                <div key={story.id} onClick={() => setSelectedStoryId(story.id)} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
                    <div className={`h-[76px] w-[76px] rounded-full p-1 border-2 transition-all group-hover:scale-105 active:scale-90 ${story.is_liked ? 'border-rose-500' : 'border-slate-900 dark:border-white'}`}>
                        <div className="h-full w-full rounded-full overflow-hidden border-2 border-white dark:border-slate-950">
                            <img
                                src={story.user.avatar || `https://ui-avatars.com/api/?name=${story.user.name}`}
                                alt={story.user.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest w-20 truncate text-center leading-none">
                        {story.user.name.split(' ')[0]}
                    </span>
                </div>
            ))}

            {/* Story Viewer Modal */}
            {currentStory && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
                    <button onClick={() => setSelectedStoryId(null)} className="absolute top-10 right-10 text-white hover:text-slate-400 transition-colors z-[210]">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="relative w-full max-w-lg aspect-[9/16] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 mx-4">
                        {/* Progress Bar */}
                        <div className="absolute top-6 left-6 right-6 flex gap-1 z-20">
                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white animate-story-progress" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="absolute top-12 left-8 right-8 flex items-center justify-between z-20">
                            <div className="flex items-center gap-4">
                                <img src={currentStory.user.avatar || `https://ui-avatars.com/api/?name=${currentStory.user.name}`} className="h-10 w-10 rounded-full border-2 border-white" />
                                <div>
                                    <p className="text-white font-black text-sm">{currentStory.user.name}</p>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{new Date(currentStory.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                            </div>
                            
                            {currentStory.user.id === auth.user.id && (
                                <button onClick={(e) => { e.stopPropagation(); deleteStory(currentStory); }} className="p-2 text-white/40 hover:text-rose-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Story Image */}
                        <img src={currentStory.image_url} className="h-full w-full object-cover" />

                        {/* Bottom Actions */}
                        <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-center z-20">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleLike(currentStory); }}
                                className={`group flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-md border transition-all active:scale-90 ${currentStory.is_liked ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/10 border-white/20 text-white'}`}
                            >
                                <svg className={`w-7 h-7 transition-transform group-hover:scale-125 ${currentStory.is_liked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="font-black text-xs uppercase tracking-widest">{currentStory.likes_count || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}
