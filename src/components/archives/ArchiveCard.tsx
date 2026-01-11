import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchiveItem } from "@/hooks/useArchives";
import { ExternalLink, FileText, Link as LinkIcon, Trash2, Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCategories } from "@/hooks/useArchives";
import { Badge } from "@/components/ui/badge";
import { ArchiveInput } from "./ArchiveInput"; // Import ArchiveInput
import { useState } from "react";

interface ArchiveCardProps {
  item: ArchiveItem;
  onDelete?: (id: string) => void;
}

export function ArchiveCard({ item, onDelete }: ArchiveCardProps) {
  const isLink = item.type === "link";
  const { data: categories } = useCategories();
  const category = categories?.find(c => c.id === item.category_id);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
        <Card className="glass group hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border-border/50 bg-card/60 hover:-translate-y-1">
        {isLink && item.image_url && (
            <div className="aspect-video w-full overflow-hidden border-b border-border/50 bg-muted/30">
                <img 
                    src={item.image_url} 
                    alt={item.title || "Preview"} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        )}
        <CardHeader className="p-4 pb-2 space-y-2">
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isLink ? <LinkIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                {category && (
                    <Badge 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0 h-5 font-normal bg-opacity-10 dark:bg-opacity-20"
                        style={{ 
                            backgroundColor: `${category.color}20`, 
                            color: category.color,
                            borderColor: `${category.color}40`
                        }}
                    >
                        {category.name}
                    </Badge>
                )}
            </div>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {item.title || "Untitled"}
            </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-1 min-h-[80px]">
            {isLink ? (
                <p className="text-sm text-muted-foreground line-clamp-3">
                {item.content || "설명이 없습니다."}
                </p>
            ) : (
                <div className="prose prose-sm dark:prose-invert line-clamp-6 text-sm">
                    <ReactMarkdown>{item.content || ""}</ReactMarkdown>
                </div>
            )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between gap-2 mt-auto">
            <div className="flex gap-1">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-primary p-0 h-8 w-8"
                    onClick={() => setIsEditOpen(true)}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive p-0 h-8 w-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('정말 삭제하시겠습니까?')) {
                            onDelete?.(item.id);
                        }
                    }}
                >
                <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            
            {isLink && (
                <Button variant="secondary" size="sm" asChild className="w-full max-w-[100px]">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                    방문하기 <ExternalLink className="ml-2 h-3 w-3" />
                </a>
                </Button>
            )}
        </CardFooter>
        </Card>

        {/* Edit Modal */}
        <ArchiveInput 
            initialData={item} 
            open={isEditOpen} 
            onOpenChange={setIsEditOpen} 
            trigger={<></>} // No trigger needed as distinct controlled Dialog
        />
    </>
  );
}
