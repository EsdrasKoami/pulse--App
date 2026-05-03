import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// ── Global Error Boundary ───────────────────────────────────────────────────
class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[Pulse Error Boundary]', error, info.componentStack);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', background: '#0f0f0f', color: '#fff', padding: '2rem'
                }}>
                    <div style={{ maxWidth: '680px', width: '100%' }}>
                        <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 900, letterSpacing: '0.3em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                            Pulse — Erreur de rendu
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#f43f5e' }}>
                            {this.state.error?.name || 'Erreur'}
                        </h1>
                        <pre style={{
                            background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px',
                            padding: '1.5rem', fontSize: '13px', overflowX: 'auto',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#fbbf24',
                            lineHeight: 1.6, marginBottom: '1.5rem'
                        }}>
                            {this.state.error?.message}
                            {'\n\n'}
                            {this.state.error?.stack}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 2rem', background: '#6366f1', color: '#fff',
                                border: 'none', borderRadius: '10px', cursor: 'pointer',
                                fontWeight: 900, fontSize: '14px', letterSpacing: '0.1em'
                            }}
                        >
                            Recharger
                        </button>
                        <p style={{ marginTop: '1rem', fontSize: '11px', color: '#555' }}>
                            Copiez ce message et envoyez-le pour obtenir de l'aide.
                        </p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AppErrorBoundary>
                <App {...props} />
            </AppErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
