module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // Adjust this to match your project structure
  ],
  theme: {
    extend: {
      animation: {
        'move-right-left': 'moveRightLeft 3s linear infinite',
        'slide-up': 'slideUp 1s ease-out forwards', 
        'slide-from-bottom': 'slideFromBottom 3s ease-out forwards', 
        'move-left-right':'moveLeftRight 3s linear infinite'
      },
      keyframes: {
        moveRightLeft: {
          '0%': { transform: 'translateX(50%)' }, // Start from the right
          '100%': { transform: 'translateX(0%)' }, // End at its final position
        },
        slideUp: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 }, // Start above and hidden
          '100%': { transform: 'translateY(0)', opacity: 1 }, // End in place and visible
        },
        slideFromBottom: {
          '0%': { transform: 'translateY(20px)', opacity: 0 }, // Start below and hidden
          '100%': { transform: 'translateY(0)', opacity: 1 }, // End at the final position and visible
        },
        moveLeftRight:{
          '0%': { transform: 'translateX(0%)' }, 
          '50%': { transform: 'translateX(50%)' }, 
          '100%': { transform: 'translateX(0%)' }, 
        }
      },
    },
  },
  plugins: [],
};