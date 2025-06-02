/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: ["class", "class"],
	theme: {
	  fontFamily: {
		inter: [
		  'Inter',
		  'sans-serif'
		]
	  },
	  extend: {
		colors: {
		  current: 'currentColor',
		  transparent: 'transparent',
		  stroke: '#EEEEEE',
		  strokedark: '#2D2F40',
		  hoverdark: '#252A42',
		  titlebg: '#ADFFF8',
		  titlebg2: '#FFEAC2',
		  titlebgdark: '#46495A',
		  btndark: '#4C0B0D',
		  white: '#FFFFFF',
		  black: '#181C31',
		  blackho: '#2C3149',
		  blacksection: '#1C2136',
		  primary: {
			DEFAULT: '#ea580c',          // Laranja forte
			foreground: '#ffffff'        // Texto branco no botão
		  },
		  primaryho: '#AE581F',
		  meta: '#20C5A8',
		  waterloo: '#757693',
		  manatee: '#999AA1',
		  alabaster: '#FBFBFB',
		  zumthor: '#EDF5FF',
		  socialicon: '#D1D8E0',
		  background: '#ffffff',
		  foreground: '#181C31',
		  card: {
			DEFAULT: '#ffffff',
			foreground: '#181C31'
		  },
		  popover: {
			DEFAULT: '#ffffff',
			foreground: '#181C31'
		  },
		  secondary: {
			DEFAULT: '#f3f4f6',
			foreground: '#181C31'
		  },
		  muted: {
			DEFAULT: '#f3f4f6',
			foreground: '#757693'
		  },
		  accent: {
			DEFAULT: '#f97316',           // Um laranja para hovers
			foreground: '#ffffff'
		  },
		  destructive: {
			DEFAULT: '#dc2626',
			foreground: '#ffffff'
		  },
		  border: '#e5e7eb',
		  input: '#e5e7eb',
		  ring: '#ea580c',                // Laranja no focus-ring
		  chart: {
			'1': '#ea580c',
			'2': '#f97316',
			'3': '#fb923c',
			'4': '#fdba74',
			'5': '#fed7aa'
		  }
		},
		fontSize: {
		  metatitle: ['12px', '20px'],
		  sectiontitle: ['14px', '22px'],
		  regular: ['16px', '26px'],
		  metatitle3: ['18px', '26px'],
		  metatitle2: ['20px', '32px'],
		  para2: ['22px', '35px'],
		  itemtitle: ['26px', '32px'],
		  itemtitle2: ['24px', '32px'],
		  hero: ['44px', '58px'],
		  sectiontitle3: ['44px', '55px'],
		  sectiontitle2: ['40px', '52px'],
		  sectiontitle4: ['34px', '48px'],
		},
		spacing: {
		  '13': '3.25rem',
		  '15': '3.75rem',
		  '16': '4rem',
		  '17': '4.25rem',
		  '18': '4.5rem',
		  '19': '4.75rem',
		  '21': '5.25rem',
		  '22': '5.5rem',
		  '25': '6.25rem',
		  '27': '6.75rem',
		  '29': '7.25rem',
		  '30': '7.5rem',
		  '35': '8.75rem',
		  '40': '10rem',
		  '45': '11.25rem',
		  '46': '11.5rem',
		  '50': '12.5rem',
		  '55': '13.75rem',
		  '60': '15rem',
		  '65': '16.25rem',
		  '67': '16.75rem',
		  '90': '22.5rem',
		  '4.5': '1.125rem',
		  '5.5': '1.375rem',
		  '6.5': '1.625rem',
		  '7.5': '1.875rem',
		  '8.5': '2.125rem',
		  '10.5': '2.625rem',
		  '11.5': '2.875rem',
		  '12.5': '3.125rem',
		  '13.5': '3.375rem',
		  '14.5': '3.625rem',
		  '15.5': '3.875rem',
		  '17.5': '4.375rem',
		  '18.5': '4.625rem',
		  '21.5': '5.375rem',
		  '22.5': '5.625rem',
		  '27.5': '6.875rem',
		  '29.5': '7.375rem',
		  '32.5': '8.125rem',
		  '37.5': '9.375rem',
		  '42.5': '10.625rem',
		  '47.5': '11.875rem',
		  '67.5': '16.875rem',
		},
		maxWidth: {
		  'c-1390': '86.875rem',
		  'c-1315': '82.188rem',
		  'c-1280': '80rem',
		  'c-1235': '77.188rem',
		  'c-1154': '72.125rem',
		  'c-1016': '63.5rem',
		},
		zIndex: {
		  '1': '1',
		  '999': '999',
		  '99999': '99999',
		  '999999': '999999',
		},
		opacity: {
		  '65': '.65',
		},
		transitionProperty: {
		  width: 'width',
		},
		boxShadow: {
		  'solid-l': '0px 10px 120px 0px rgba(45, 74, 170, 0.1)',
		  'solid-2': '0px 2px 10px rgba(122, 135, 167, 0.05)',
		  'solid-3': '0px 6px 90px rgba(8, 14, 40, 0.04)',
		  'solid-4': '0px 6px 90px rgba(8, 14, 40, 0.1)',
		  'solid-5': '0px 8px 24px rgba(45, 74, 170, 0.08)',
		  'solid-6': '0px 8px 24px rgba(10, 16, 35, 0.08)',
		  'solid-7': '0px 30px 50px rgba(45, 74, 170, 0.1)',
		  'solid-8': '0px 12px 120px rgba(45, 74, 170, 0.06)',
		  'solid-9': '0px 12px 30px rgba(45, 74, 170, 0.06)',
		  'solid-10': '0px 8px 30px rgba(45, 74, 170, 0.06)',
		  'solid-11': '0px 6px 20px rgba(45, 74, 170, 0.05)',
		  'solid-12': '0px 2px 10px rgba(0, 0, 0, 0.05)',
		  'solid-13': '0px 2px 19px rgba(0, 0, 0, 0.05)',
		},
		keyframes: {
		  line: {
			'0%, 100%': { transform: 'translateY(100%)' },
			'50%': { transform: 'translateY(0)' }
		  }
		},
		animation: {
		  line1: 'line 3s linear infinite',
		  line2: 'line 6s linear infinite',
		  line3: 'line 9s linear infinite',
		},
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)',
		}
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  