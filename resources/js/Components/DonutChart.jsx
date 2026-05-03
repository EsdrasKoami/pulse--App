import React from 'react';

export default function DonutChart({ stats, totalLabel = 'OVERALL' }) {
    if (!stats) return null;

    const data = [
        { label: 'Connexions', value: stats.matches, color: '#0ea5e9' }, // Cyan
        { label: 'Publications', value: stats.posts, color: '#6366f1' }, // Indigo
        { label: 'J\'aime reçus', value: stats.likesReceived, color: '#f43f5e' }, // Rose
        { label: 'Commentaires', value: stats.comments, color: '#a855f7' }, // Violet
        { label: 'Intérêts', value: stats.interests, color: '#10b981' }, // Emerald
    ].filter(d => d.value > 0);

    const totalValue = data.reduce((acc, d) => acc + d.value, 0);
    const size = 300;
    const strokeWidth = 50;
    const center = size / 2;
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 group">
            <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px]">
                <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-50 dark:text-slate-900"
                    />

                    {data.map((d, i) => {
                        const percentage = (d.value / totalValue) * 100;
                        const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
                        const currentOffset = offset;
                        offset += percentage;

                        return (
                            <circle
                                key={i}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={d.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={-(currentOffset * circumference) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                                style={{ strokeDashoffset: `-${(currentOffset * circumference) / 100}` }}
                            />
                        );
                    })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center transform rotate-0">
                    <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tighter">
                        {totalValue}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-0.5 sm:mt-1">
                        {totalLabel}
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full space-y-4 sm:space-y-6">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-md shadow-sm transition-transform group-hover/item:scale-125" style={{ backgroundColor: d.color }}></div>
                            <span className="text-[11px] sm:text-[13px] font-black text-slate-500 uppercase tracking-widest">{d.label}</span>
                        </div>
                        <span className="text-md sm:text-lg font-black text-slate-900 dark:text-white font-display text-right">
                            {((d.value / totalValue) * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>


        </div>
    );
}
