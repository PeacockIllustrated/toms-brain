import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#2563eb", // blue-600
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#f3f4f6", // gray-100
                    foreground: "#6b7280", // gray-500
                },
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#000000",
                },
            },
        },
    },
    plugins: [],
};
export default config;
