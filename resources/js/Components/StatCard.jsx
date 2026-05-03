import React from 'react';

export default function StatCard({ label, value, color = 'indigo', trend = null }) {
    const colorThemes = {
        indigo: 'text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-white/10',
        rose: 'text-rose-600 dark:text-rose-400 border-rose-100 dark:border-white/10',
        emerald: 'text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-white/10',
        amber: 'text-amber-600 dark:text-amber-400 border-amber-100 dark:border-white/10',
        violet: 'text-violet-600 dark:text-violet-400 border-violet-100 dark:border-white/10',
        sky: 'text-sky-600 dark:text-sky-400 border-sky-100 dark:border-white/10',
    }[color];

    const barColor = {
        indigo: 'bg-indigo-500',
        rose: 'bg-rose-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        violet: 'bg-violet-500',
        sky: 'bg-sky-500',
    }[color];

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-slate-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 active:scale-95 group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 sm:w-1.5 h-full ${barColor} opacity-20 group-hover:opacity-100 transition-opacity`}></div>

            <div className="flex flex-col">
                <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2 leading-tight">
                    {label}
                </h4>
                <div className={`text-3xl sm:text-5xl font-black tracking-tighter font-display ${colorThemes.split(' ')[0]}`}>
                    {value}
                </div>

                {trend && (
                    <div className="mt-2 sm:mt-4 flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                            {trend}
                        </div>
                    </div>
                )}
            </div>

            
        </div>
    );
}
