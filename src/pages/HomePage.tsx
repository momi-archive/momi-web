import { ArchiveInput } from "@/components/archives/ArchiveInput";
import { ArchiveGrid } from "@/components/archives/ArchiveGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function HomePage() {
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const handleArchiveAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["archives"] });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex gap-8">
        
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block sticky top-0 h-screen overflow-y-auto py-8">
           <Sidebar 
              selectedCategoryId={selectedCategoryId} 
              onSelectCategory={setSelectedCategoryId} 
            />
        </div>

        {/* Main Content */}
        <div className="flex-1 py-8 space-y-10">
            {/* Header Section */}
            <div className="space-y-2 animate-fade-in-up">
                <h1 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">
                    <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
                    나만의 공간
                    </span>
                </h1>
                <p className="text-muted-foreground">
                    영감을 기록하고 정리하세요.
                </p>
            </div>

            {/* Input Section */}
            <div className="relative z-10 max-w-sm">
                <ArchiveInput onAdded={handleArchiveAdded} />
            </div>

            {/* Grid Section */}
            <div className="relative min-h-[400px]">
                {/* Background decoration */}
                <div className="pointer-events-none absolute -top-[100px] left-1/2 -ml-[400px] h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
                
                <h2 className="text-xl font-bold font-heading mb-6 px-1 flex items-center gap-2">
                    {selectedCategoryId ? "카테고리 모아보기" : "최근 기록"}
                </h2>
                <ArchiveGrid selectedCategoryId={selectedCategoryId} />
            </div>
        </div>
      </div>
    </div>
  );
}
