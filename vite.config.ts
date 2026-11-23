import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Social apps (WhatsApp, Facebook, X) need absolute URLs for the share image.
 * Set SITE_URL (e.g. https://akubutouwa26.com) in .env.local or your host's dashboard.
 */
function siteUrl(url: string): Plugin {
  const base = url.replace(/\/+$/, '')
  return {
    name: 'site-url',
    transformIndexHtml: html => html.replaceAll('__SITE_URL__', base),
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), siteUrl(env.SITE_URL ?? '')],
  }
})
