import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useArchives";
import { Plus, Trash2, Edit2, Check, X, Settings } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function CategoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // New Category State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366F1");

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  // Delete State
  const [deletingCategory, setDeletingCategory] = useState<{ id: string, name: string } | null>(null);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory.mutateAsync({ name: newCategoryName, color: newCategoryColor });
    setNewCategoryName("");
    setNewCategoryColor("#6366F1");
  };

  const startEditing = (category: { id: string; name: string; color: string }) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    await updateCategory.mutateAsync({ id: editingId, name: editName, color: editColor });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
            <Settings className="mr-2 h-4 w-4" /> 카테고리 관리
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass">
        <DialogHeader>
          <DialogTitle>카테고리 관리</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
            {/* Add New */}
            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">새 카테고리 추가</Label>
                <div className="flex gap-2 items-center">
                    <input 
                        type="color" 
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="h-9 w-9 p-0.5 rounded-md cursor-pointer bg-transparent border border-input"
                    />
                    <Input 
                        placeholder="카테고리 이름" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="h-9 bg-white/50"
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <Button size="sm" onClick={handleAdd} disabled={!newCategoryName.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">목록</Label>
                {categories?.map(category => (
                    <div key={category.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 group transition-colors">
                        {editingId === category.id ? (
                            <>
                                <input 
                                    type="color" 
                                    value={editColor}
                                    onChange={(e) => setEditColor(e.target.value)}
                                    className="h-8 w-8 p-0.5 rounded-md cursor-pointer bg-transparent border border-input shrink-0"
                                />
                                <Input 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="h-8 bg-white/50"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") saveEdit();
                                        if(e.key === "Escape") cancelEdit();
                                    }}
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100">
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <span 
                                    className="w-4 h-4 rounded-full shrink-0" 
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="flex-1 text-sm font-medium truncate">{category.name}</span>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" onClick={() => startEditing(category)} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setDeletingCategory({ id: category.id, name: category.name })} 
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
      
      <ConfirmDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="카테고리 삭제"
        description={`'${deletingCategory?.name}' 카테고리를 삭제하시겠습니까?\n포함된 항목은 '카테고리 없음'으로 변경됩니다.`}
        confirmText="삭제하기"
        onConfirm={() => deletingCategory && deleteCategory.mutate(deletingCategory.id)}
      />
    </Dialog>
  );
}
