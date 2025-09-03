/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 90%, 50%)',
          50: 'hsl(210, 90%, 95%)',
          100: 'hsl(210, 90%, 90%)',
          200: 'hsl(210, 90%, 80%)',
          300: 'hsl(210, 90%, 70%)',
          400: 'hsl(210, 90%, 60%)',
          500: 'hsl(210, 90%, 50%)',
          600: 'hsl(210, 90%, 40%)',
          700: 'hsl(210, 90%, 30%)',
          800: 'hsl(210, 90%, 20%)',
          900: 'hsl(210, 90%, 10%)',
        },
        accent: {
          DEFAULT: 'hsl(170, 80%, 45%)',
          50: 'hsl(170, 80%, 95%)',
          100: 'hsl(170, 80%, 90%)',
          200: 'hsl(170, 80%, 80%)',
          300: 'hsl(170, 80%, 70%)',
          400: 'hsl(170, 80%, 60%)',
          500: 'hsl(170, 80%, 45%)',
          600: 'hsl(170, 80%, 35%)',
          700: 'hsl(170, 80%, 25%)',
          800: 'hsl(170, 80%, 15%)',
          900: 'hsl(170, 80%, 5%)',
        },
        background: {
          DEFAULT: 'hsl(210, 20%, 98%)',
          surface: 'hsl(210, 20%, 100%)',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 8px 24px hsla(210, 30%, 10%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

