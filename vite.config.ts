import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { parse } from 'node-html-parser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() as any,
    // 로컬 개발 환경에서 /api/extract 를 처리하기 위한 간단한 플러그인
    {
      name: 'api-extract-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/extract' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const { url } = JSON.parse(body);
                const response = await fetch(url, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                });
                const html = await response.text();
                const root = parse(html);

                const getMeta = (name: string) => 
                  root.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ||
                  root.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';

                const result = {
                  title: getMeta('og:title') || root.querySelector('title')?.text || '',
                  description: getMeta('og:description') || getMeta('description') || '',
                  image: getMeta('og:image') || ''
                };

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to scrape' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
