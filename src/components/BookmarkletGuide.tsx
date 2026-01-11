import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark, GripVertical, Copy, Check } from "lucide-react";
import { useRef, useState } from "react";

// 북마클릿 JavaScript 코드
const getBookmarkletCode = () => {
  const baseUrl = window.location.origin;
  return `javascript:(function(){window.open('${baseUrl}?add=true&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank');})();`;
};

export function BookmarkletGuide() {
  const bookmarkletRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Dialog가 열릴 때 href 설정 (타이밍 문제 해결)
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Dialog가 열린 직후 href 설정 (DOM이 마운트된 후)
      setTimeout(() => {
        if (bookmarkletRef.current) {
          bookmarkletRef.current.href = getBookmarkletCode();
        }
      }, 0);
    }
  };

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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
          <Bookmark className="mr-2 h-4 w-4" />
          빠른 저장 설정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            빠른 저장 설정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 설명 + 북마클릿 버튼 */}
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
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              드래그가 안 되면 아래 코드를 복사해서 북마크 URL에 붙여넣으세요.
            </p>
            <div className="flex gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {getBookmarkletCode().substring(0, 40)}...
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
            북마크바 표시: <code className="bg-muted px-1 rounded">Cmd+Shift+B</code> (Mac) / <code className="bg-muted px-1 rounded">Ctrl+Shift+B</code> (Win)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
