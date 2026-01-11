import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useContact, useContactCount } from "@/hooks/useContact";

export function ContactPage() {
  const { user } = useAuth();
  const contact = useContact();
  const contactCount = useContactCount(user?.id);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !user?.email || !subject.trim() || !content.trim()) {
      return;
    }

    if (!contactCount.data?.canSend) {
      return;
    }

    contact.mutate(
      {
        email: user.email,
        subject: subject.trim(),
        content: content.trim(),
        userId: user.id,
      },
      {
        onSuccess: () => {
          setSubject("");
          setContent("");
        },
      }
    );
  };

  const canSend = contactCount.data?.canSend ?? true;
  const remaining = contactCount.data?.remaining ?? 3;
  const isValid = subject.trim() && content.trim() && canSend;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* 헤더 */}
        <div className="space-y-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              돌아가기
            </Button>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              문의하기
            </h1>
            <p className="text-muted-foreground">
              궁금한 점이나 피드백을 보내주세요
            </p>
          </div>
        </div>

        {/* 문의 폼 */}
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  제목 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="문의 제목을 입력하세요"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={contact.isPending}
                />
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  내용 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="문의 내용을 자세히 작성해주세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  disabled={contact.isPending}
                  className="resize-none"
                />
              </div>

              {/* 남은 횟수 안내 */}
              {!canSend ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                  <p className="text-sm text-destructive font-medium">
                    오늘 문의 한도(3회)를 모두 사용했습니다.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    내일 다시 시도해주세요.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  오늘 남은 문의 횟수: {remaining}회 / 3회
                </p>
              )}

              {/* 제출 버튼 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 text-white"
                disabled={!isValid || contact.isPending}
              >
                {contact.isPending ? (
                  "전송 중..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    문의 보내기
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 안내 */}
        <p className="text-sm text-muted-foreground text-center">
          문의 내용은 빠른 시일 내에 답변드리겠습니다.
          <br />
          긴급한 문의는 직접 이메일로 연락해주세요.
        </p>
      </div>
    </div>
  );
}
