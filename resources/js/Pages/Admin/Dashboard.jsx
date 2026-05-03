import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/LanguageContext';

const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">{value}</span>
                {trend && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">+{trend}</span>}
            </div>
        </div>
    </div>
);

export default function Dashboard({ auth, stats, recent_users, pending_reports }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{t("Panel d'administration")}</h2>}
        >
            <Head title={t('Admin Dashboard')} />

            <div className="py-12 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title={t('Étudiants')} value={stats.total_users} icon="👥" trend={stats.new_users_week} color="bg-blue-500" />
                    <StatCard title={t('Publications')} value={stats.total_posts} icon="📝" color="bg-violet-500" />
                    <StatCard title={t('Groupes')} value={stats.total_groups} icon="🏢" color="bg-emerald-500" />
                    <StatCard title={t('Signalements')} value={stats.total_reports} icon="⚠️" color="bg-rose-500" />
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    
                    {/* Recent Users Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-display text-xl font-black tracking-tighter">{t('Nouveaux membres')}</h3>
                            <Link href={route('admin.users.index')} className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">{t('Voir tout')}</Link>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 divide-y dark:divide-slate-800">
                            {recent_users.map(user => (
                                <div key={user.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors first:rounded-t-[2.5rem] last:rounded-b-[2.5rem]">
                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="h-10 w-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800" alt="" />
                                        <div>
                                            <p className="text-sm font-black tracking-tight">{user.name}</p>
                                            <p className="text-xs text-slate-500 font-bold">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-display text-xl font-black tracking-tighter">{t('Actions rapides')}</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link 
                                href={route('admin.users.create')}
                                className="p-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] flex flex-col justify-between h-48 group active:scale-95 transition-all"
                            >
                                <span className="text-2xl group-hover:scale-125 transition-transform origin-left duration-500">➕</span>
                                <span className="text-lg font-black tracking-tighter leading-none">{t('Créer un')}<br />{t('Utilisateur')}</span>
                            </Link>
                            <Link 
                                href={route('admin.interests.index')}
                                className="p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-48 group active:scale-95 transition-all"
                            >
                                <span className="text-2xl group-hover:scale-125 transition-transform origin-left duration-500">🎨</span>
                                <span className="text-lg font-black tracking-tighter leading-none">{t('Gérer les')}<br />{t('Hobbies')}</span>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
