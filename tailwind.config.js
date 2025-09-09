/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Inclut tous les fichiers React dans src
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#1E40AF",
        brandGreen: "#10B981",
        brandGradientStart: "#DBEAFE",
        brandGradientEnd: "#D1FAE5",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
