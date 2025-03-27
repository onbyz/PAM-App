/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
  "./src/**/*.{js,jsx,ts,tsx}", // Include your React component files
],
theme: {
  extend: {
    fontFamily: {
      sans: [
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ]
    },
    fontSize: {
      'h1': '1.75rem', // Adjust as needed for h1
      'h2': '1.61rem', // Adjust as needed for h2
      'h3': '1.0rem', // Adjust as needed for h3  
  },
    screens: {
      sm: '320px',
      md: '768px',
      lg: '1025px',
    LapL: '1440px',
      xl: '1700px'
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      }
    }
  }
},
plugins: [require("tailwindcss-animate")],
}