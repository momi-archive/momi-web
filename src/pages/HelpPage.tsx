import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Keyboard, ClipboardPaste, Bookmark, GripVertical, Copy, Check, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

// 북마클릿 JavaScript 코드
const getBookmarkletCode = () => {
  const baseUrl = window.location.origin;
  return `javascript:(function(){window.open('${baseUrl}?add=true&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank');})();`;
};

// 단축키 데이터
const shortcuts = [
  {
    icon: Search,
    title: "빠른 검색",
    shortcut: "Cmd/Ctrl + K",
    description: "빠른 검색창을 열어 기록을 검색하고 바로 이동합니다.",
  },
  {
    icon: ClipboardPaste,
    title: "빠른 메모",
    shortcut: "Cmd/Ctrl + V",
    description: "클립보드 내용을 바로 메모로 저장합니다. 입력 필드 외부에서 동작합니다.",
  },
];

export function HelpPage() {
  const bookmarkletRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  // 페이지 로드 시 북마클릿 href 설정
  useEffect(() => {
    if (bookmarkletRef.current) {
      bookmarkletRef.current.href = getBookmarkletCode();
    }
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getBookmarkletCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* 헤더 */}
        <div className="space-y-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              돌아가기
            </Button>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
              <Keyboard className="h-8 w-8 text-primary" />
              도움말
            </h1>
            <p className="text-muted-foreground">
              Momi를 더 빠르게 사용하세요
            </p>
          </div>
        </div>

        {/* 단축키 섹션 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">단축키</h2>
          <div className="space-y-3">
            {shortcuts.map((item) => (
              <Card key={item.title} className="glass border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.title}
                    </CardTitle>
                    <kbd className="px-3 py-1.5 text-sm font-mono bg-muted rounded-md border border-border">
                      {item.shortcut}
                    </kbd>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 북마클릿 섹션 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold font-heading flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            북마클릿으로 빠른 저장
          </h2>

          <Card className="glass border-border/50">
            <CardContent className="pt-6 space-y-4">
              {/* 북마클릿 버튼 */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  아래 버튼을 <strong>북마크바로 드래그</strong>하세요
                </p>
                <a
                  ref={bookmarkletRef}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-aurora-500 text-white rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 opacity-70" />
                  <span>Momi에 저장</span>
                </a>
              </div>

              {/* 사용 방법 */}
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>위 버튼을 북마크바로 드래그</li>
                <li>저장할 웹사이트 방문</li>
                <li>북마크바에서 클릭하면 Momi에 저장!</li>
              </ol>

              {/* 수동 설정 */}
              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  드래그가 안 되면 아래 코드를 복사해서 북마크 URL에 붙여넣으세요.
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                    {getBookmarkletCode().substring(0, 50)}...
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 북마크바 팁 */}
              <p className="text-xs text-muted-foreground">
                북마크바 표시:{" "}
                <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">Cmd+Shift+B</kbd> (Mac) /{" "}
                <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">Ctrl+Shift+B</kbd> (Win)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 추가 팁 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">추가 팁</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              <strong className="text-foreground">검색:</strong> 상단 검색창에서 제목과 내용을 동시에 검색할 수 있습니다.
            </li>
            <li>
              <strong className="text-foreground">카테고리:</strong> 사이드바에서 카테고리를 만들고 기록을 분류하세요.
            </li>
            <li>
              <strong className="text-foreground">마크다운:</strong> 메모 작성 시 마크다운 문법을 사용할 수 있습니다.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
