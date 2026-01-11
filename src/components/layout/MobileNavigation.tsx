import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, Folder, LogOut, X } from "lucide-react";
import { useCategories } from "@/hooks/useArchives";
import { useAuth } from "@/hooks/useAuth";
import { CategoryManager } from "../categories/CategoryManager";

interface MobileNavigationProps {
  selectedCategoryId?: string;
  onSelectCategory: (id?: string) => void;
}

export function MobileNavigation({
  selectedCategoryId,
  onSelectCategory,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { signOut, user } = useAuth();

  const handleSelectCategory = (id?: string) => {
    onSelectCategory(id);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="md:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="glass border-white/20 max-h-[85vh]">
        <DrawerHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg overflow-hidden bg-white shadow-sm">
                <img
                  src="/logo.png"
                  alt="Momi"
                  className="h-full w-full object-cover"
                />
              </div>
              <DrawerTitle className="text-lg font-bold font-heading">
                Momi
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* 라이브러리 섹션 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-2">
              라이브러리
            </h3>
            <Button
              variant={!selectedCategoryId ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSelectCategory(undefined)}
            >
              <Folder className="mr-2 h-4 w-4" />
              전체 보기
            </Button>
          </div>

          {/* 카테고리 섹션 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-2">
              카테고리
            </h3>
            <div className="space-y-1">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <span
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </Button>
              ))}
              <CategoryManager />
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-border/50">
          <div className="text-xs text-muted-foreground truncate mb-2 text-center">
            {user?.email}
          </div>
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" /> 로그아웃
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
