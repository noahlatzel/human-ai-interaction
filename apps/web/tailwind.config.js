// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = { // <--- KRITISCHE ÄNDERUNG: 'export default' ersetzt durch 'module.exports'
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // Hier wird die Standard-Tailwind-Farbpalette erweitert und die Schriftart bleibt
    theme: {
        extend: {
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
            },
        },
    },
    // Safelist beibehalten, um die dynamisch generierten Klassen zu sichern
    safelist: [
        { pattern: /bg-(sky|teal|amber)-(50|100|200|300|400|500|600|700|800|900)/, variants: ['hover'] },
        { pattern: /text-(sky|teal|amber)-(500|600|700)/, variants: ['hover'] },
        { pattern: /border-(sky|teal|amber)-(100|400|500|600)/ },
        { pattern: /shadow-(sky|teal|amber)-(200|500)/, variants: ['hover'] },
        { pattern: /ring-(sky|teal|amber)-(100|500)/ },
        { pattern: /(from|to)-(sky|teal|amber)-(50|600|700)/ },
        { pattern: /fill-current/ },
    ],
    plugins: [],
}