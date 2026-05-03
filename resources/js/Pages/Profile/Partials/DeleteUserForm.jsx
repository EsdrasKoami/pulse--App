import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const { translations = {} } = usePage().props;
    const t = (key) => translations[key] || key;
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">{t('Zone Critique')}</h4>
                <p className="text-sm font-bold text-slate-500">{t('La suppression de votre compte est définitive. Toutes vos données seront effacées de Pulse.')}</p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-8 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 dark:border-rose-500/20"
            >
                {t('Supprimer mon compte')}
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10 bg-white dark:bg-slate-950 font-sans">
                    <h2 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
                        {t('Êtes-vous absolument sûr ?')}
                    </h2>

                    <p className="text-sm font-bold text-slate-400 mb-8">
                        {t('Cette action ne peut pas être annulée. Veuillez saisir votre mot de passe pour confirmer la suppression définitive.')}
                    </p>

                    <div className="mb-10">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('Mot de passe')}</label>
                        <TextInput
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all"
                        >
                            {t('Annuler')}
                        </button>

                        <button
                            disabled={processing}
                            className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                        >
                            {t('Confirmer la suppression')}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
