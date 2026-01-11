import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, Trash2, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchiveItem, Category } from "@/hooks/useArchives";
import ReactMarkdown from "react-markdown";

interface ArchiveCardProps {
  item: ArchiveItem & { categories: Category | null };
  onDelete?: (id: string) => void;
}

export function ArchiveCard({ item, onDelete }: ArchiveCardProps) {
  const isLink = item.type === "link";

  return (
    <Card className="glass group overflow-hidden transition-all hover:shadow-glow hover:-translate-y-1 flex flex-col h-full">
      {/* Header Image (Links only) */}
      {isLink && item.image_url && (
         <div className="aspect-video w-full overflow-hidden bg-muted">
            <img 
              src={item.image_url} 
              alt={item.title || "Link preview"} 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
         </div>
      )}

      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex justify-between items-start">
            <div className={`p-1.5 rounded-md ${isLink ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                {isLink ? <LinkIcon size={14} /> : <FileText size={14} />}
            </div>
            {item.categories && (
                <span 
                    className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
                    style={{ backgroundColor: item.categories.color + '20', color: item.categories.color }}
                >
                    {item.categories.name}
                </span>
            )}
        </div>
        
        {isLink ? (
             <>
                <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {item.title || item.url}
                </h3>
                <p className="text-xs text-muted-foreground truncate font-mono">
                {new URL(item.url!).hostname}
                </p>
             </>
        ) : (
            <div className="h-6" /> // Spacer for alignment if needed
        )}
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
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive p-0 h-8 w-8"
            onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item.id);
            }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        {isLink && (
            <Button variant="secondary" size="sm" asChild className="w-full">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
                방문하기 <ExternalLink className="ml-2 h-3 w-3" />
            </a>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
