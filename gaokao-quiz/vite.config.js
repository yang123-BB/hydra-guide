import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 将 KaTeX 字体 font-display: block(FOIT，加载期间不可见) 改为 swap，避免公式首屏闪白
function katexFontSwap() {
  return {
    name: 'katex-font-swap',
    transform(code, id) {
      if (id.endsWith('.css') && code.includes('font-display:block')) {
        return code.replace(/font-display:\s*block/g, 'font-display:swap')
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [react(), katexFontSwap()],
  base: './',
  server: {
    port: 3000,
    host: true
  },
  build: {
    minify: 'terser',
    // 生产构建去除 console.log / console.warn（保留 error 便于排查）
    terserOptions: {
      compress: { drop_console: ['log', 'warn'] }
    },
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 第三方库拆分为独立 chunk，利用 hash 文件名做长期缓存
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('katex')) return 'vendor-katex'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react'
            return 'vendor'
          }
        }
      }
    }
  }
})
