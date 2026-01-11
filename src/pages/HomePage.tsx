import { ArchiveInput } from "@/components/archives/ArchiveInput";
import { ArchiveGrid } from "@/components/archives/ArchiveGrid";
import { QuickMemoDialog } from "@/components/archives/QuickMemoDialog";
import { QuickSearchDialog } from "@/components/QuickSearchDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { useState, useEffect, useRef } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";
import { useSearchParams } from "react-router-dom";
import { useQuickMemo } from "@/hooks/useQuickMemo";
import { useQuickSearch } from "@/hooks/useQuickSearch";

export function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // 빠른 메모 (Cmd/Ctrl + V)
  const {
    clipboardContent,
    isOpen: isQuickMemoOpen,
    setIsOpen: setQuickMemoOpen,
    reset: resetQuickMemo,
  } = useQuickMemo();

  // 빠른 검색 (Cmd/Ctrl + K)
  const {
    isOpen: isQuickSearchOpen,
    setIsOpen: setQuickSearchOpen,
  } = useQuickSearch();

  // 북마클릿에서 전달받은 데이터
  const [bookmarkletData, setBookmarkletData] = useState<{
    url?: string;
    title?: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const bookmarkletProcessedRef = useRef(false);

  // URL 파라미터 처리 (북마클릿)
  useEffect(() => {
    const addParam = searchParams.get("add");

    // 이미 처리했거나 add 파라미터가 없으면 스킵
    if (bookmarkletProcessedRef.current || addParam !== "true") {
      return;
    }

    // 중복 실행 방지
    bookmarkletProcessedRef.current = true;

    const urlParam = searchParams.get("url");
    const titleParam = searchParams.get("title");

    setBookmarkletData({
      url: urlParam || undefined,
      title: titleParam || undefined,
    });
    setIsAddDialogOpen(true);

    // URL 파라미터 제거 (지연 실행으로 상태 업데이트 충돌 방지)
    setTimeout(() => {
      setSearchParams({}, { replace: true });
    }, 0);
  }, [searchParams, setSearchParams]);

  const handleArchiveAdded = () => {
    // Refresh logic handled by React Query invalidation
    // 북마클릿 데이터 초기화
    setBookmarkletData(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setBookmarkletData(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Mobile Navigation */}
      <MobileNavigation
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10 overflow-y-auto min-h-screen">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading tracking-tight">
                    <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
                    나만의 공간
                    </span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    영감을 기록하고 정리하세요.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <ArchiveInput
                  open={isAddDialogOpen}
                  onOpenChange={handleDialogOpenChange}
                  onSuccess={handleArchiveAdded}
                  defaultUrl={bookmarkletData?.url}
                  defaultTitle={bookmarkletData?.title}
                  compact
                />
                <ModeToggle />
            </div>
          </div>

            {/* Grid Section */}
            <div className="relative min-h-[400px]">
                {/* Background decoration */}
                <div className="pointer-events-none absolute -top-[50px] md:-top-[100px] left-1/2 -ml-[200px] md:-ml-[400px] h-[400px] md:h-[800px] w-[400px] md:w-[800px] rounded-full bg-primary/5 blur-[80px] md:blur-[120px]" />

                {/* Header with Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
                    <h2 className="text-lg md:text-xl font-bold font-heading px-1 flex items-center gap-2 shrink-0">
                        {searchQuery ? `"${searchQuery}" 검색 결과` : (selectedCategoryId ? "카테고리 모아보기" : "최근 기록")}
                    </h2>
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <SearchInput value={searchQuery} onChange={setSearchQuery} />
                    </div>
                </div>
                <ArchiveGrid selectedCategoryId={selectedCategoryId} searchQuery={searchQuery} />
            </div>
        </div>

      {/* 빠른 메모 다이얼로그 (Cmd/Ctrl + V) */}
      <QuickMemoDialog
        open={isQuickMemoOpen}
        onOpenChange={setQuickMemoOpen}
        defaultContent={clipboardContent}
        onSuccess={resetQuickMemo}
      />

      {/* 빠른 검색 다이얼로그 (Cmd/Ctrl + K) */}
      <QuickSearchDialog
        open={isQuickSearchOpen}
        onOpenChange={setQuickSearchOpen}
      />
    </div>
  );
}
