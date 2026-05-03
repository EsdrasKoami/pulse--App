import React, { useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ReportModal from '@/Components/ReportModal';

import { useTranslation } from '@/Contexts/LanguageContext';

export default function PostCard({ post }) {
    const { post: toggleLike } = useForm();
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const { t } = useTranslation();
    const { auth } = usePage().props;

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [blockProcessing, setBlockProcessing] = useState(false);
    const [reportProcessing, setReportProcessing] = useState(false);

    const handleBlock = () => {
        setBlockProcessing(true);
        router.post(route('users.block', post.user.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setBlockProcessing(false);
                setShowBlockModal(false);
                setShowOptions(false);
            }
        });
    };

    const handleReport = (reason) => {
        setReportProcessing(true);
        router.post(route('report.store'), {
            reported_id: post.user.id,
            reportable_id: post.id,
            reportable_type: 'App\\Models\\Post',
            reason: reason
        }, {
            preserveScroll: true,
            onFinish: () => {
                setReportProcessing(false);
                setShowReportModal(false);
                setShowOptions(false);
            }
        });
    };

    // For commenting
    const { data, setData, post: postComment, processing, reset } = useForm({
        content: ''
    });

    const handleLike = () => {
        router.post(route('posts.like', post.id), {}, {
            preserveScroll: true,
        });
    };

    const submitComment = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;
        postComment(route('posts.comments.store', post.id), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-900 group animate-fade-in-up">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('users.show', post.user.id)}>
                        <img src={post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.name}`} className="h-11 w-11 rounded-full object-cover transition-opacity hover:opacity-80" />
                    </Link>
                    <div>
                        <Link href={route('users.show', post.user.id)} className="block">
                            <h4 className="text-[15px] font-black text-slate-900 dark:text-white leading-tight hover:text-indigo-600 transition-colors">
                                {post.user.name}
                            </h4>
                        </Link>
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                            {post.created_at}
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm10 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-5 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
                        </svg>
                    </button>

                    {showOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 py-2 animate-fade-in">
                            {auth.user.id !== post.user.id && (
                                <>
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="w-full text-left px-4 py-2.5 text-[13px] font-black text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                        </svg>
                                        {t('Signaler')}
                                    </button>
                                    <button
                                        onClick={() => setShowBlockModal(true)}
                                        className="w-full text-left px-4 py-2.5 text-[13px] font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636" />
                                        </svg>
                                        {t("Bloquer l'utilisateur")}
                                    </button>
                                </>
                            )}
                            {auth.user.id === post.user.id && (
                                <p className="px-4 py-2 text-[11px] font-bold text-slate-400 italic">{t("Tes options de post")}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
                <p className="text-[17px] text-slate-800 dark:text-slate-200 font-medium leading-[1.6]">
                    {post.content}
                </p>
            </div>

            {/* Image */}
            {post.image_url && (
                <div className="px-6 pb-6">
                    <div className="h-[500px] w-full rounded-[2rem] overflow-hidden relative group/img cursor-pointer">
                        <img
                            src={post.image_url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors"></div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center justify-between mt-2">
                <div className="flex items-center gap-8">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 transition-all active:scale-75 ${post.is_liked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <svg className={`w-7 h-7 ${post.is_liked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-black">{post.likes_count}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 transition-all active:scale-75 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.348-.124.629-.462 1.583-.848 2.228-.05.084-.047.19.01.272a.25.25 0 0 0 .227.102c1.47-.07 2.923-.464 3.974-1.12.383.084.78.128 1.186.128l.178-.002z" />
                        </svg>
                        <span className="text-sm font-black">{post.comments?.length || 0}</span>
                    </button>

                    {/* Share Button (Visual only) */}
                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-75">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-slate-50 dark:border-slate-900 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto no-scrollbar">
                        {(post.comments || []).map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <Link href={route('users.show', comment.user.id)}>
                                    <img src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}`} className="h-8 w-8 rounded-full object-cover mt-1 transition-opacity hover:opacity-80" />
                                </Link>
                                <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-2xl px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-900">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <Link href={route('users.show', comment.user.id)}>
                                            <p className="text-[13px] font-black text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">{comment.user.name}</p>
                                        </Link>
                                        <p className="text-[10px] font-bold text-slate-400">{comment.created_at}</p>
                                    </div>
                                    <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {post.comments?.length === 0 && (
                            <p className="text-center text-[12px] font-bold text-slate-400 py-4">{t('Soyez le premier à commenter !')}</p>
                        )}
                    </div>

                    <form onSubmit={submitComment} className="relative flex items-center">
                        <input
                            type="text"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder={t('Écrire un commentaire...')}
                            className="w-full bg-white dark:bg-slate-900 rounded-2xl border-none pl-4 pr-12 py-3 text-[13px] font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 shadow-sm border border-slate-100 dark:border-slate-800"
                        />
                        <button
                            type="submit"
                            disabled={processing || !data.content.trim()}
                            className="absolute right-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black text-slate-900 dark:text-white font-black text-[11px] uppercase tracking-wider disabled:opacity-30 transition-all hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </form>
                </div>
            )}
            <ConfirmationModal
                show={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onConfirm={handleBlock}
                processing={blockProcessing}
                variant="danger"
                title={t('Bloquer cet utilisateur')}
                message={t('Êtes-vous sûr de vouloir bloquer cet utilisateur ? Vous ne verrez plus ses publications et il ne pourra plus interagir avec vous.')}
                confirmLabel={t('Bloquer')}
            />

            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                onConfirm={handleReport}
                processing={reportProcessing}
                title={t('Signaler ce contenu')}
            />
        </div>
    );
}
