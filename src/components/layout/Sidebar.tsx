import { Button } from "@/components/ui/button";
import { Folder, LogOut, HelpCircle, Mail } from "lucide-react";
import { useCategories } from "@/hooks/useArchives";
import { CategoryManager } from "../categories/CategoryManager";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface SidebarProps {
  selectedCategoryId?: string;
  onSelectCategory: (id?: string) => void;
}

export function Sidebar({ selectedCategoryId, onSelectCategory }: SidebarProps) {
  const { data: categories } = useCategories();
  const { signOut, user } = useAuth();

  return (
    <div className="w-64 space-y-6 py-4 hidden md:flex md:flex-col pl-2 sticky top-0 h-screen overflow-y-auto">
      <div className="flex-1 space-y-6">
        <Link to="/" className="px-6 py-4 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-card shadow-sm border border-border/40 flex-shrink-0">
            <img src="/logo.png" alt="Momi Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Momi
            </h1>
          </div>
        </Link>

        <div className="px-3 py-2">
          <h2 className="mb-3 px-4 text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
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
          <h2 className="mb-3 px-4 text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
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
            
            <CategoryManager />
          </div>
        </div>
      </div>

      {/* User & Logout */}
      <div className="px-3 py-2 border-t border-border/50 space-y-1">
        <div className="mb-2 px-2 text-xs text-muted-foreground truncate">
          {user?.email}
        </div>
        <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground" asChild>
          <Link to="/help">
            <HelpCircle className="mr-2 h-4 w-4" />
            도움말
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground" asChild>
          <Link to="/contact">
            <Mail className="mr-2 h-4 w-4" />
            문의하기
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" /> 로그아웃
        </Button>
      </div>
    </div>
  );
}
