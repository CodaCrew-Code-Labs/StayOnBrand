import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    {
      name: 'csp-injector',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          const csp =
            mode === 'development'
              ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://d94qwxh6czci4.cloudfront.net https://static-demo.airwallex.com https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self';"
              : "script-src 'self' https://d94qwxh6czci4.cloudfront.net https://static-demo.airwallex.com https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self';"
          return html.replace(
            '<meta name="viewport"',
            `<meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta http-equiv="Permissions-Policy" content="bluetooth=(), camera=(), microphone=(), geolocation=(), usb=()" />\n    <meta name="viewport"`
          )
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __name: 'undefined'
  },
  server: {
    port: Number(process.env.VITE_APP_PORT) || 3000,
    open: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
}))
