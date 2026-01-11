import { ArchiveInput } from "@/components/archives/ArchiveInput";
import { ArchiveGrid } from "@/components/archives/ArchiveGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";

export function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleArchiveAdded = () => {
    // Refresh logic handled by React Query invalidation
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        selectedCategoryId={selectedCategoryId} 
        onSelectCategory={setSelectedCategoryId} 
      />

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-10 overflow-y-auto h-screen">
          {/* Header Section */}
          <div className="flex justify-between items-start animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">
                    <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
                    나만의 공간
                    </span>
                </h1>
                <p className="text-muted-foreground">
                    영감을 기록하고 정리하세요.
                </p>
            </div>
            <ModeToggle />
          </div>

            {/* Add Button */}
            <div className="max-w-sm">
                <ArchiveInput onSuccess={handleArchiveAdded} />
            </div>

            {/* Grid Section */}
            <div className="relative min-h-[400px]">
                {/* Background decoration */}
                <div className="pointer-events-none absolute -top-[100px] left-1/2 -ml-[400px] h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
                
                {/* Header with Search */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-bold font-heading px-1 flex items-center gap-2 shrink-0">
                        {searchQuery ? `"${searchQuery}" 검색 결과` : (selectedCategoryId ? "카테고리 모아보기" : "최근 기록")}
                    </h2>
                    <div className="w-full max-w-xs">
                        <SearchInput value={searchQuery} onChange={setSearchQuery} />
                    </div>
                </div>
                <ArchiveGrid selectedCategoryId={selectedCategoryId} searchQuery={searchQuery} />
            </div>
        </div>
    </div>
  );
}
