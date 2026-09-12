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
          50: "#F2F1EF",
          100: "#E3E1DC",
          300: "#B5B0A8",
          500: "#1F1D1B",
          600: "#141312",
          700: "#0E0D0C",
          900: "#050505",
        },
        ochre: {
          100: "#EFE6D8",
          300: "#D8C6A4",
          400: "#B99B6B",
          500: "#8C6D3E",
          600: "#6E5530",
        },
        clay: {
          500: "#B23A2E",
          600: "#8F2E24",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F2ECE2",
          200: "#E4DACA",
          400: "#C4B79E",
        },
        ink: {
          500: "#1A1A18",
          400: "#3D3B37",
          300: "#615E58",
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
