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
          50: "#F3F1EC",
          100: "#E6E1D6",
          300: "#B0A996",
          500: "#141311",
          600: "#0D0C0B",
          700: "#0A0908",
          900: "#000000",
        },
        ochre: {
          100: "#EFE4CB",
          300: "#D9BE85",
          400: "#C6A050",
          500: "#A9822E",
          600: "#8A6A24",
        },
        clay: {
          500: "#B23A2E",
          600: "#8F2E24",
        },
        sand: {
          50: "#FAF7F1",
          100: "#F1EADC",
          200: "#E3D8C3",
          400: "#C7B896",
        },
        ink: {
          500: "#161514",
          400: "#3A3835",
          300: "#605D57",
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
