import { useArchives, useDeleteArchive } from "@/hooks/useArchives";
import { ArchiveCard } from "./ArchiveCard";
import { Loader2 } from "lucide-react";

interface ArchiveGridProps {
  selectedCategoryId?: string;
  searchQuery?: string;
}

export function ArchiveGrid({ selectedCategoryId, searchQuery }: ArchiveGridProps) {
  const { data: archives, isLoading, error } = useArchives(selectedCategoryId, searchQuery);
  const deleteArchive = useDeleteArchive();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        데이터를 불러오는 중 오류가 발생했습니다.
        <p className="text-sm mt-2 text-muted-foreground">
           데이터베이스 연결 상태를 확인해주세요.
        </p>
      </div>
    );
  }

  if (!archives || archives.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
        <p className="text-xl font-medium mb-2">아직 기록된 내용이 없습니다</p>
        <p className="text-sm">위의 '기록 추가하기' 버튼을 눌러보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {archives.map((item) => (
        <ArchiveCard 
          key={item.id} 
          item={item} 
          onDelete={(id) => deleteArchive.mutate(id)}
        />
      ))}
    </div>
  );
}
