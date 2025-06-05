import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss({
      config: {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './public/index.html',
        ],
        theme: {
          extend: {
            colors: {
              primary: '#1D4ED8', // Example primary color
              secondary: '#FBBF24', // Example secondary color
            },
          },
        },
      },
    })
  ],
})
