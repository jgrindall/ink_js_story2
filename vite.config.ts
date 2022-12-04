import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), monacoEditorPlugin({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicDir: 'public'
})



