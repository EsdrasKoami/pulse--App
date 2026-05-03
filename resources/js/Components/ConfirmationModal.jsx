import Modal from './Modal';
import { usePage } from '@inertiajs/react';

export default function ConfirmationModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant = 'danger', // 'danger' or 'warning'
    processing = false
}) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;

    const accentColor = variant === 'danger' ? 'rose' : 'amber';

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-8 sm:p-10 text-center">
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-${accentColor}-50 dark:bg-${accentColor}-500/10 text-${accentColor}-500 shadow-sm`}>
                    {variant === 'danger' ? (
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                </div>

                <h3 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-3">
                    {title}
                </h3>

                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-10 px-4 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-sm hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                    >
                        {cancelLabel || t('Annuler')}
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-4 rounded-2xl bg-${accentColor}-600 text-white font-black text-sm shadow-xl shadow-${accentColor}-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `.font-display { font-family: 'Outfit', sans-serif; }` }} />
        </Modal>
    );
}
