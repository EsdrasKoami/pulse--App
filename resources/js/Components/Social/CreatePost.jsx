import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useTranslation } from '@/Contexts/LanguageContext';

export default function CreatePost() {
    const { props } = usePage();
    const auth = props.auth || {};
    const user = auth.user || {};
    
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef();

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        image: null,
    });

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.content.trim() && !data.image) return;
        
        post(route('posts.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
                setIsFocused(false);
            },
        });
    };

    return (
        <div className={`bg-white dark:bg-slate-950 rounded-[2.5rem] p-5 sm:p-7 shadow-2xl shadow-slate-900/5 dark:shadow-white/5 border transition-all duration-500 mb-12 animate-fade-in-up ${isFocused ? 'border-violet-500/30 ring-4 ring-violet-500/5' : 'border-slate-100 dark:border-slate-900'}`}>
            <div className="flex gap-5">
                <div className="h-14 w-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-900 border border-white/20 dark:border-white/5 shadow-inner">
                    <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}`} 
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" 
                        alt={user.name}
                    />
                </div>
                <form onSubmit={submit} className="flex-1">
                    <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                    
                    <div className={`relative transition-all duration-300 rounded-[1.8rem] ${isFocused ? 'bg-slate-50 dark:bg-slate-900/50 p-4' : 'p-0'}`}>
                        <textarea
                            value={data.content}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                if (!data.content && !previewUrl) {
                                    setIsFocused(false);
                                }
                            }}
                            onChange={e => setData('content', e.target.value)}
                            placeholder={t('De quoi voulez-vous discuter ?')}
                            className="w-full resize-none bg-transparent border-none p-2 text-[17px] font-medium placeholder-slate-300 dark:placeholder-slate-700 focus:ring-0 min-h-[60px] max-h-[300px] outline-none dark:text-white transition-all overflow-hidden"
                            style={{ height: isFocused ? '120px' : '60px' }}
                        />
                        {isFocused && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${data.content.length > 900 ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {data.content.length}/1000
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {errors.content && <p className="text-[11px] font-black text-rose-500 uppercase tracking-wider mt-3 ml-2">{errors.content}</p>}
                    {errors.image && <p className="text-[11px] font-black text-rose-500 uppercase tracking-wider mt-3 ml-2">{errors.image}</p>}

                    <div className={`flex items-center justify-between pt-6 mt-2 transition-all duration-500 ${isFocused || previewUrl ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative h-12 w-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${previewUrl ? 'bg-violet-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-violet-500 hover:bg-violet-500/10'}`}
                            >
                                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">{t('Image')}</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || (!data.content.trim() && !data.image)}
                            className="group relative px-10 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
                        >
                            <span className="relative z-10">{processing ? t('Envoi...') : t('Partager')}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="absolute inset-0 bg-violet-600 opacity-0 group-active:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {previewUrl && (
                        <div className="relative mt-8 group select-none animate-fade-in-up">
                            <div className="max-h-[400px] w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-900 shadow-2xl bg-slate-100 dark:bg-slate-900">
                                <img src={previewUrl} className="h-full w-full object-contain transition-transform duration-1000 group-hover:scale-105" alt="Preview" />
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white h-10 w-10 flex items-center justify-center rounded-2xl shadow-xl hover:bg-rose-500 transition-all hover:scale-110 active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
