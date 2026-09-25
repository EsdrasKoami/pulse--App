import { Head, Link } from '@inertiajs/react';

export default function Suspended({ auth, reason }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 selection:bg-rose-500 selection:text-white">
            <Head title="Compte Suspendu" />

            <div className="w-full max-w-xl">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-8 relative overflow-hidden">
                    
                    {/* Effet de fond */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>

                    {/* Icône */}
                    <div className="inline-flex h-24 w-24 bg-rose-50 dark:bg-rose-500/10 rounded-[2.5rem] items-center justify-center mb-4 border-2 border-rose-100 dark:border-rose-500/20">
                        <svg className="w-12 h-12 text-rose-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Texte */}
                    <div className="space-y-4">
                        <h1 className="font-display text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                            Accès Suspendu
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-md mx-auto">
                            L'administration a temporairement restreint l'accès à votre compte Pulse pour non-respect des règles de la plateforme.
                        </p>
                    </div>

                    {/* Raison */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Motif de la suspension</p>
                        <p className="text-sm font-black text-rose-600 dark:text-rose-400 italic">
                            "{reason || 'Violation des conditions d\'utilisation'}"
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[11px] font-bold text-slate-400">
                            Si vous pensez qu'il s'agit d'une erreur, contactez le support informatique du CEGPTR.
                        </p>
                        <div className="pt-4">
                            <Link 
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Pulse — Sécurité & Modération
                    </p>
                </div>
            </div>
        </div>
    );
}
