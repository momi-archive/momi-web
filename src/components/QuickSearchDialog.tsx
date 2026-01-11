import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Link as LinkIcon, FileText } from "lucide-react";
import { useArchives, ArchiveItem } from "@/hooks/useArchives";
import { cn } from "@/lib/utils";

interface QuickSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 상대 시간 포맷
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString();
}

export function QuickSearchDialog({ open, onOpenChange }: QuickSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 검색 쿼리로 데이터 가져오기
  const { data: archives } = useArchives(undefined, query);

  // 필터링된 결과 (최대 8개)
  const results = archives?.slice(0, 8) || [];

  // 다이얼로그 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // 약간의 지연 후 포커스 (Dialog 애니메이션 후)
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // 선택된 항목이 변경될 때 스크롤
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      selectedEl?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, results.length]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          handleSelect(results[selectedIndex]);
          break;
      }
    },
    [results, selectedIndex]
  );

  // 항목 선택 처리
  const handleSelect = (item: ArchiveItem) => {
    if (item.type === "link" && item.url) {
      window.open(item.url, "_blank");
    }
    // 메모의 경우 나중에 상세보기 모달 열기 등 추가 가능
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden" showCloseButton={false}>
        {/* 검색 입력 */}
        <div className="flex items-center border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="검색..."
            className="border-0 focus-visible:ring-0 h-12 text-base"
          />
        </div>

        {/* 검색 결과 */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              {query ? "검색 결과가 없습니다" : "검색어를 입력하세요"}
            </div>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
                  selectedIndex === index
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {item.type === "link" ? (
                    <LinkIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {item.title || "제목 없음"}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{item.type === "link" ? "링크" : "메모"}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.created_at)}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* 하단 힌트 */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t text-xs text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
              <span>이동</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
              <span>열기</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">esc</kbd>
              <span>닫기</span>
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
