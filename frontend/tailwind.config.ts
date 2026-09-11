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
          50: "#EAF3F1",
          100: "#CEE4DF",
          300: "#6FA79A",
          500: "#0F5C4F",
          600: "#0C4A40",
          700: "#093931",
          900: "#062420",
        },
        ochre: {
          100: "#FBE8CD",
          300: "#F5C989",
          400: "#EDA24F",
          500: "#E0862E",
          600: "#B96A1E",
        },
        clay: {
          500: "#B23A2E",
          600: "#8F2E24",
        },
        sand: {
          50: "#FBF8F2",
          100: "#F3EDE0",
          200: "#E7E1D3",
          400: "#C9C0AB",
        },
        ink: {
          500: "#1B2420",
          400: "#3A443F",
          300: "#5B655F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
        xl: "22px",
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
