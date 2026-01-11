import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Link as LinkIcon, Loader2, X, Sparkles } from "lucide-react";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAddArchive, useUpdateArchive, useCategories, ArchiveItem } from "@/hooks/useArchives";

const formSchema = z.object({
  url: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
}).refine((data) => {
  // URL 또는 내용 중 하나는 반드시 있어야 함
  if (!data.url && !data.content) {
    return false;
  }
  return true;
}, {
  message: "링크 또는 내용을 입력해주세요",
  path: ["content"],
});

interface ArchiveInputProps {
  initialData?: ArchiveItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  /** 북마클릿에서 전달받은 기본 URL */
  defaultUrl?: string;
  /** 북마클릿에서 전달받은 기본 제목 */
  defaultTitle?: string;
  /** 컴팩트 모드 (헤더용 작은 버튼) */
  compact?: boolean;
}

export function ArchiveInput({ initialData, open, onOpenChange, trigger, onSuccess, defaultUrl, defaultTitle, compact }: ArchiveInputProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const addArchive = useAddArchive();
  const updateArchive = useUpdateArchive();
  const { data: categories } = useCategories();
  const [isScraping, setIsScraping] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      content: "",
      categoryId: undefined,
      imageUrl: "",
    },
  });

  // Reset form when initialData changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          url: initialData.url || "",
          title: initialData.title || "",
          content: initialData.content || "",
          categoryId: initialData.category_id || "none",
          imageUrl: initialData.image_url || "",
        });
      } else {
        // 북마클릿에서 전달받은 기본값 사용
        form.reset({
          url: defaultUrl || "",
          title: defaultTitle || "",
          content: "",
          categoryId: undefined,
          imageUrl: "",
        });
        // 기본 URL이 있으면 메타데이터 자동 수집
        if (defaultUrl) {
          fetchMetadata(defaultUrl);
        }
      }
    }
  }, [initialData, isOpen, form, defaultUrl, defaultTitle]);

  const fetchMetadata = async (url: string) => {
    if (!url || !url.startsWith("http")) return;

    setIsScraping(true);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title && !form.getValues("title")) {
          form.setValue("title", data.title);
        }
        if (data.description && !form.getValues("content")) {
          form.setValue("content", data.description);
        }
        if (data.image) {
          form.setValue("imageUrl", data.image);
        }
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      setIsScraping(false);
    }
  };

  const watchUrl = form.watch("url");
  const watchImageUrl = form.watch("imageUrl");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // URL이 있으면 링크, 없으면 메모로 자동 판단
      const type: "link" | "memo" = values.url ? "link" : "memo";

      const payload = {
        type,
        url: values.url || undefined,
        content: values.content,
        title: values.title || (type === "link" ? "새로운 링크" : "새로운 메모"),
        category_id: values.categoryId === "none" ? undefined : values.categoryId,
        image_url: values.imageUrl || undefined,
      };

      if (isEditMode && initialData) {
        await updateArchive.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await addArchive.mutateAsync(payload);
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  }

  const isPending = addArchive.isPending || updateArchive.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          compact ? (
            <Button
              size="sm"
              className="h-9 px-3 bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 shadow-md text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">기록 추가</span>
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 shadow-lg animate-fade-in-up text-white"
            >
              <Plus className="mr-2 h-5 w-5" /> 기록 추가하기
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[560px] md:max-w-[640px] glass border-border/20 p-0 overflow-hidden gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-border/10">
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isEditMode ? "기록 수정하기" : "기록 남기기"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">

            {/* 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground font-semibold text-sm">
                    제목
                    <span className="text-muted-foreground font-normal text-xs ml-2">(선택)</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="기록의 제목을 입력하세요"
                      className="h-11 bg-background/80 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 링크 URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground font-semibold text-sm flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    링크
                    <span className="text-muted-foreground font-normal text-xs">(선택)</span>
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="https://example.com"
                        className="h-11 bg-background/80 border-border/50 pr-28 focus:border-primary focus:ring-1 focus:ring-primary/20"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          if (!isEditMode && e.target.value) {
                            fetchMetadata(e.target.value);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isScraping || !field.value}
                        onClick={() => fetchMetadata(field.value || "")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        {isScraping ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            추출 중
                          </>
                        ) : (
                          "정보 불러오기"
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이미지 미리보기 */}
            {watchImageUrl && (
              <div className="relative group">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                  <img
                    src={watchImageUrl}
                    alt="미리보기"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => form.setValue("imageUrl", "")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* 내용 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground font-semibold text-sm">
                    내용
                    {!watchUrl && <span className="text-red-500 ml-1">*</span>}
                    {watchUrl && <span className="text-muted-foreground font-normal text-xs ml-2">(선택)</span>}
                  </Label>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder={watchUrl
                        ? "이 링크에 대한 메모를 남겨보세요"
                        : "자유롭게 생각을 적어보세요"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 카테고리 */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground font-semibold text-sm">
                    카테고리
                    <span className="text-muted-foreground font-normal text-xs ml-2">(선택)</span>
                  </Label>
                  <Select onValueChange={field.onChange} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger className="h-11 bg-background/80 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">선택 안함</SelectItem>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-border/10">
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setIsOpen(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-11 bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 font-semibold shadow-lg"
                >
                  {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isPending ? "저장 중..." : (isEditMode ? "수정 완료" : "등록 완료")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
