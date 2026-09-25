import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
                display: ['Bricolage Grotesque', 'Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cegeptr: {
                    navy: '#042C53',
                    blue: '#1a6abf',
                    accent: '#3b82f6',
                },
            },
        },
    },

    plugins: [forms({ strategy: 'class' })],
};
