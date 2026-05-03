export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 group relative overflow-hidden ${disabled && 'pointer-events-none opacity-50'
                } ` + className
            }
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
    );
}
