module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'times': ['Times New Roman', 'serif'],
      },
      gradientColorStops: {
        'custom-gradient': 'rgba(221, 126, 71, 0.60) 54.81%, rgba(221, 112, 49, 0.11) 75.08%',
        'active-gradient': 'rgba(169, 73, 69, 0.60) 54.81%, rgba(169, 73, 69, 0.50) 75.08%',
    },
    
    
      colors:{
        'active-color': 'rgba(174, 69, 66, 0.60)',
        'inactive-color': 'rgba(223, 203, 163, 0.60)',
        'half-color':'rgba(188, 104, 87, 0.40);'
      }
      
    },
  },
  plugins: [],
}