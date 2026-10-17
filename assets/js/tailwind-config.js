tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                slate: {
                    850: '#13243a',
                    950: '#071322',
                },
                brand: {
                    300: '#c4ecff',
                    400: '#8bd6ff',
                    500: '#45b8f2',
                    600: '#2088d0',
                    700: '#17629b',
                    800: '#164364',
                    900: '#102a41',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'shine': 'shine 1.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                shine: {
                    '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
                    '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' }
                }
            }
        }
    }
}
