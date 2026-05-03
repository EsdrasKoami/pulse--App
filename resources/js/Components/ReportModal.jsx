import Modal from './Modal';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportModal({
    show,
    onClose,
    onConfirm,
    title,
    processing = false
}) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-8 sm:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 shadow-sm mx-auto">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-3 text-center">
                    {title || t('Signaler un utilisateur')}
                </h3>

                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 text-center">
                    {t('Veuillez préciser la raison de ce signalement. Nous traiterons cette demande avec attention.')}
                </p>

                <div className="mb-8">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t('Expliquez brièvement...')}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all min-h-[120px] resize-none"
                        autoFocus
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-sm hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                    >
                        {t('Annuler')}
                    </button>
                    <button
                        type="submit"
                        disabled={processing || !reason.trim()}
                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {t('Envoyer')}
                    </button>
                </div>
            </form>

            
        </Modal>
    );
}
