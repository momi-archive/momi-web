import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, ClipboardPaste } from "lucide-react";
import { useState, useEffect } from "react";
import { useAddArchive, useCategories } from "@/hooks/useArchives";

interface QuickMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultContent?: string | null;
  onSuccess?: () => void;
}

export function QuickMemoDialog({
  open,
  onOpenChange,
  defaultContent,
  onSuccess,
}: QuickMemoDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("none");

  const addArchive = useAddArchive();
  const { data: categories } = useCategories();

  // 다이얼로그 열릴 때 클립보드 내용 설정
  useEffect(() => {
    if (open && defaultContent) {
      setContent(defaultContent);
      setTitle("");
      setCategoryId("none");
    }
  }, [open, defaultContent]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await addArchive.mutateAsync({
        type: "memo",
        title: title.trim() || "빠른 메모",
        content: content.trim(),
        category_id: categoryId === "none" ? undefined : categoryId,
      });

      onOpenChange(false);
      onSuccess?.();

      // 상태 초기화
      setTitle("");
      setContent("");
      setCategoryId("none");
    } catch (error) {
      console.error("Failed to save memo:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTitle("");
    setContent("");
    setCategoryId("none");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] glass border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-heading">
            <ClipboardPaste className="h-5 w-5 text-primary" />
            빠른 메모
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 제목 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              제목
              <span className="text-muted-foreground font-normal text-xs ml-2">
                (선택)
              </span>
            </Label>
            <Input
              placeholder="메모 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-background/80 border-border/50"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">내용</Label>
            <Textarea
              placeholder="메모 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-background/80 border-border/50 resize-none"
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              카테고리
              <span className="text-muted-foreground font-normal text-xs ml-2">
                (선택)
              </span>
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-10 bg-background/80 border-border/50">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">선택 안함</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || addArchive.isPending}
            className="flex-1 bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90"
          >
            {addArchive.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장하기"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
