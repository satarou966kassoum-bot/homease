import type { Config } from "tailwindcss";

// Système de design HomeEase :
// - Vert lagune profond (identité, confiance) + ocre chaud (soleil, énergie, CTA)
// - Fond papier chaud (pas de crème générique), encre vert-nuit plutôt que noir pur
// - Fraunces (serif chaleureuse) pour les titres, Inter (sans lisible) pour le reste
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lagoon: {
          50: "#EEF3F5",
          100: "#D8E4E8",
          300: "#A8C0C9",
          500: "#6E93A0",
          600: "#587A87",
          700: "#46626D",
          900: "#2E4249",
        },
        ochre: {
          100: "#DCE6EA",
          300: "#A9C2CB",
          400: "#7FA0AC",
          500: "#3F6774",
          600: "#2F4F59",
        },
        clay: {
          500: "#B23A2E",
          600: "#8F2E24",
        },
        sand: {
          50: "#FAF7F2",
          100: "#F2EBDD",
          200: "#E6DBC7",
          400: "#C7B99C",
        },
        ink: {
          500: "#26313A",
          400: "#46525C",
          300: "#6B7780",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,36,32,0.06), 0 1px 0 rgba(27,36,32,0.04)",
        elevated: "0 8px 24px rgba(27,36,32,0.10)",
        sheet: "0 -8px 24px rgba(27,36,32,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
