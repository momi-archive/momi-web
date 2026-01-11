import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Link as LinkIcon, FileText, Check } from "lucide-react";
import { useState } from "react";
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
import { useAddArchive, useCategories } from "@/hooks/useArchives";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  type: z.enum(["link", "memo"]),
  url: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
}).refine((data) => {
    if (data.type === "link" && !data.url) return false;
    if (data.type === "memo" && !data.content) return false;
    return true;
}, {
    message: "필수 항목을 입력해주세요",
    path: ["url"], 
});

interface ArchiveInputProps {
  onAdded?: () => void;
}

export function ArchiveInput({ onAdded }: ArchiveInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const addArchive = useAddArchive();
  const { data: categories } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "link",
      url: "",
      title: "",
      content: "",
      categoryId: undefined,
    },
  });

  const activeType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addArchive.mutateAsync({
        type: values.type,
        url: values.url,
        content: values.content,
        title: values.title || (values.type === "link" ? "새로운 링크" : "새로운 메모"),
        category_id: values.categoryId === "none" ? undefined : values.categoryId,
      });

      form.reset({
        type: activeType,
        url: "",
        title: "",
        content: "",
        categoryId: undefined
      });
      setIsOpen(false);
      onAdded?.();
    } catch (error) {
      console.error(error);
    }
  }

  // Handle Type Selection
  const setType = (type: "link" | "memo") => {
    form.setValue("type", type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full h-14 text-lg bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 shadow-lg animate-fade-in-up text-white"
        >
          <Plus className="mr-2 h-5 w-5" /> 기록 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass border-white/20 p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-heading">기록 남기기</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 pt-2">
             
             {/* Type Selection */}
             <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">유형 선택</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div 
                        onClick={() => setType("link")}
                        className={cn(
                            "cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all hover:bg-accent/50",
                            activeType === "link" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-secondary/50 text-muted-foreground hover:border-border"
                        )}
                    >
                        <LinkIcon className="h-5 w-5" />
                        <span className="font-semibold text-sm">링크</span>
                    </div>
                    <div 
                        onClick={() => setType("memo")}
                        className={cn(
                            "cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all hover:bg-accent/50",
                            activeType === "memo" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-secondary/50 text-muted-foreground hover:border-border"
                        )}
                    >
                        <FileText className="h-5 w-5" />
                        <span className="font-semibold text-sm">메모</span>
                    </div>
                </div>
             </div>

             <div className="space-y-4">
                {/* Category */}
                <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                    <Label className="text-foreground font-medium flex items-center gap-1">
                         카테고리 
                         <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="bg-white/50 border-input">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="none">선택 안함</SelectItem>
                            {categories?.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: cat.color}}/>
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

                {/* URL (Link Only) */}
                {activeType === "link" && (
                     <FormField
                     control={form.control}
                     name="url"
                     render={({ field }) => (
                       <FormItem>
                         <Label className="text-foreground font-medium flex items-center gap-1">
                             링크 주소
                             <span className="text-red-500">*</span>
                         </Label>
                         <FormControl>
                           <Input
                             placeholder="https://example.com"
                             className="bg-white/50"
                             {...field}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                )}

                {/* Title (Optional) */}
                 <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-foreground font-medium">
                          제목 <span className="text-muted-foreground font-normal text-xs">(선택)</span>
                      </Label>
                      <FormControl>
                        <Input
                          placeholder={activeType === "link" ? "링크 제목 (입력하지 않으면 자동 생성)" : "메모 제목"}
                          className="bg-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-foreground font-medium flex items-center gap-1">
                          {activeType === "link" ? "설명 / 메모" : "내용"}
                          {activeType === "memo" && <span className="text-red-500">*</span>}
                      </Label>
                      <FormControl>
                        <Textarea
                          placeholder={activeType === "link" ? "이 링크에 대한 간단한 메모를 남겨보세요." : "자유롭게 생각을 적어보세요 (마크다운 지원)"}
                          className="min-h-[120px] bg-white/50 resize-yyyy font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

            <DialogFooter>
                <div className="flex w-full gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsOpen(false)}
                    >
                        취소
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={addArchive.isPending}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90"
                    >
                        {addArchive.isPending ? "저장 중..." : "등록 완료"}
                    </Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
