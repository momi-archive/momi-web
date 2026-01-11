import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import { useCategories } from "@/hooks/useArchives";

interface SidebarProps {
  selectedCategoryId?: string;
  onSelectCategory: (id?: string) => void;
}

export function Sidebar({ selectedCategoryId, onSelectCategory }: SidebarProps) {
  const { data: categories } = useCategories();

  return (
    <div className="w-64 space-y-6 py-4 hidden md:block pl-2">
      <div className="px-3 py-2">
        <h2 className="mb-3 px-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          라이브러리
        </h2>
        <div className="space-y-1">
          <Button
            variant={!selectedCategoryId ? "secondary" : "ghost"}
            className="w-full justify-start font-medium"
            onClick={() => onSelectCategory(undefined)}
          >
            <Folder className="mr-2 h-4 w-4" />
            전체 보기
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-3 px-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          카테고리
        </h2>
        <div className="space-y-1">
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
              className="w-full justify-start font-medium"
              onClick={() => onSelectCategory(category.id)}
            >
              <span 
                className="mr-2 h-3 w-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Button>
          ))}
          
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
            <Plus className="mr-2 h-4 w-4" /> 카테고리 추가
          </Button>
        </div>
      </div>
    </div>
  );
}
