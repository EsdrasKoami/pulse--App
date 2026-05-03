import React from 'react';

export default function EngagementChart({ data, title }) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.total), 5);
    const height = 200;
    const width = 800;
    const padding = 40;

    const points = data.map((d, i) => ({
        x: (i * (width - padding * 2)) / (data.length - 1) + padding,
        y: height - (d.total / maxVal) * (height - padding * 2) - padding,
        ...d
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8v8m-4-5v5m-4-2v2M4 18h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        7 derniers jours d'activité
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Engagement</span>
                    </div>
                </div>
            </div>

            <div className="relative h-[240px] w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                        const y = height - v * (height - padding * 2) - padding;
                        return (
                            <line
                                key={i}
                                x1={padding} y1={y} x2={width - padding} y2={y}
                                className="stroke-slate-100 dark:stroke-slate-900"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* Area */}
                    <path d={areaPath} fill="url(#chartGradient)" className="animate-pulse-slow" />

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
                    />

                    {/* Points */}
                    {points.map((p, i) => (
                        <g key={i} className="group/point cursor-pointer">
                            <circle
                                cx={p.x} cy={p.y} r="6"
                                fill="#6366f1"
                                className="stroke-white dark:stroke-slate-950 stroke-2 transition-all group-hover/point:r-8"
                            />
                            <text
                                x={p.x} y={height - 10}
                                className="text-[10px] font-black fill-slate-400 text-center"
                                textAnchor="middle"
                            >
                                {p.day}
                            </text>

                            {/* Tooltip on hover (simplified) */}
                            <g className="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                                <rect x={p.x - 20} y={p.y - 35} width="40" height="25" rx="8" className="fill-slate-900 shadow-xl" />
                                <text x={p.x} y={p.y - 18} className="text-[10px] font-black fill-white" textAnchor="middle">
                                    {p.total}
                                </text>
                            </g>
                        </g>
                    ))}
                </svg>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulseSlow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse-slow {
                    animation: pulseSlow 4s infinite ease-in-out;
                }
                .font-display { font-family: 'Outfit', sans-serif; }
            `}} />
        </div>
    );
}
