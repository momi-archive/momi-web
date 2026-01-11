import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, ExternalLink, Copy, Check } from "lucide-react";

// 인앱 브라우저 감지
function getInAppBrowserType(): 'kakao' | 'other' | null {
  const ua = navigator.userAgent || navigator.vendor;
  if (/KAKAOTALK/i.test(ua)) return 'kakao';
  if (/Instagram|FBAN|FBAV|NAVER|Line/i.test(ua)) return 'other';
  return null;
}

// 외부 브라우저로 열기 (카카오톡 전용)
function openInExternalBrowser() {
  const currentUrl = window.location.href;
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
}

// URL 복사
async function copyUrlToClipboard(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}

export function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inAppType, setInAppType] = useState<'kakao' | 'other' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInAppType(getInAppBrowserType());
  }, []);

  const handleCopyUrl = async () => {
    const success = await copyUrlToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (user) {
      // ProtectedRoute에서 전달받은 원본 URL로 리다이렉트 (북마클릿 파라미터 보존)
      const from = location.state?.from;
      const redirectTo = from ? from.pathname + (from.search || "") : "/";
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="glass p-8 rounded-2xl border-border/20 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-2xl overflow-hidden bg-card shadow-glow border border-border/20 p-1">
              <img src="/logo.png" alt="Momi Logo" className="h-full w-full object-cover rounded-xl" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
                Momi
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                영감을 기록하고, 나만의 공간을 채우다
              </p>
            </div>
          </div>

          {/* 인앱 브라우저 안내 */}
          {inAppType === 'kakao' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                  카카오톡에서는 Google 로그인이 제한됩니다.<br />
                  외부 브라우저에서 열어주세요.
                </p>
              </div>
              <Button
                onClick={openInExternalBrowser}
                size="lg"
                className="w-full h-12"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Safari로 열기
              </Button>
            </div>
          ) : inAppType === 'other' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                  인앱 브라우저에서는 Google 로그인이 제한됩니다.<br />
                  URL을 복사해서 Safari에서 열어주세요.
                </p>
              </div>
              <Button
                onClick={handleCopyUrl}
                size="lg"
                className="w-full h-12"
                variant={copied ? "secondary" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    복사됨! Safari에서 붙여넣기
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" />
                    URL 복사하기
                  </>
                )}
              </Button>
            </div>
          ) : (
            /* Google Login Button */
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 로그인
            </Button>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            로그인하면 자동으로 계정이 생성됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
