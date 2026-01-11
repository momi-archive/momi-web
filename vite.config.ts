import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { parse } from 'node-html-parser'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [
    react(),
    tailwindcss() as any,
    // 로컬 개발 환경에서 API를 처리하기 위한 플러그인
    {
      name: 'api-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // /api/contact - Resend API로 실제 이메일 전송
          if (req.url === '/api/contact' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const { email, subject, content } = JSON.parse(body);
                if (!email || !subject || !content) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Email, subject, and content are required' }));
                  return;
                }

                const resendApiKey = env.RESEND_API_KEY;
                const contactEmail = env.CONTACT_EMAIL;

                if (!resendApiKey || !contactEmail) {
                  console.log('[Dev] Missing RESEND_API_KEY or CONTACT_EMAIL in .env');
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Server configuration error: Missing API key or contact email' }));
                  return;
                }

                // Resend API 호출
                const resendResponse = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: 'Momi <onboarding@resend.dev>',
                    to: contactEmail,
                    subject: `[Momi 문의] ${subject}`,
                    html: `
                      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3B82F6;">새로운 문의가 도착했습니다</h2>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <p style="margin: 0 0 10px;"><strong>발신자:</strong> ${email}</p>
                          <p style="margin: 0;"><strong>제목:</strong> ${subject}</p>
                        </div>
                        <div style="padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
                          <h3 style="margin-top: 0;">문의 내용</h3>
                          <p style="white-space: pre-wrap;">${content}</p>
                        </div>
                        <p style="color: #888; font-size: 12px; margin-top: 20px;">
                          이 이메일은 Momi 서비스에서 자동으로 발송되었습니다.
                        </p>
                      </div>
                    `,
                    reply_to: email,
                  }),
                });

                if (!resendResponse.ok) {
                  const error = await resendResponse.json();
                  console.error('[Dev] Resend API error:', error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Failed to send email' }));
                  return;
                }

                console.log('[Dev] Email sent successfully to:', contactEmail);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error('[Dev] Contact error:', e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to process contact' }));
              }
            });
            return;
          }

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
}});

