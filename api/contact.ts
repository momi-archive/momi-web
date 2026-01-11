import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const DAILY_LIMIT = 3;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, subject, content, userId } = await req.json();

    if (!email || !subject || !content || !userId) {
      return new Response(JSON.stringify({ error: 'Email, subject, content, and userId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!resendApiKey || !contactEmail || !supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 오늘 시작 시간 (UTC 기준)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 오늘 문의 횟수 조회
    const { count, error: countError } = await supabase
      .from('contact_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (countError) {
      console.error('Count error:', countError);
      return new Response(JSON.stringify({ error: 'Failed to check daily limit' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if ((count ?? 0) >= DAILY_LIMIT) {
      return new Response(JSON.stringify({
        error: `일일 문의 한도(${DAILY_LIMIT}회)를 초과했습니다. 내일 다시 시도해주세요.`,
        code: 'DAILY_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
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
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 문의 로그 저장
    const { error: logError } = await supabase
      .from('contact_logs')
      .insert({
        user_id: userId,
        user_email: email,
      });

    if (logError) {
      console.error('Log error:', logError);
      // 로그 저장 실패해도 이메일은 발송됐으므로 성공 처리
    }

    // 남은 횟수 계산
    const remaining = DAILY_LIMIT - (count ?? 0) - 1;

    return new Response(
      JSON.stringify({ success: true, remaining }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Contact API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
