/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}", // Busca clases de Tailwind en todos los templates Angular
    ],
    theme: {
        extend: {
        colors: {
            primary: {
            DEFAULT: "#2563eb", // Azul principal
            dark: "#1e40af",
            light: "#60a5fa",
            },
            secondary: {
            DEFAULT: "#64748b", // Gris moderno
            dark: "#475569",
            light: "#94a3b8",
            },
            success: "#16a34a",
            danger: "#dc2626",
            warning: "#f59e0b",
        },
        },
    },
    plugins: [],
};
