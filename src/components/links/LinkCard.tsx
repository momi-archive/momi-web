import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkCardProps {
  link: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    image_url?: string;
    created_at: string;
  };
  onDelete?: (id: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  return (
    <Card className="glass group overflow-hidden transition-all hover:shadow-glow hover:-translate-y-1">
      {link.image_url && (
         <div className="aspect-video w-full overflow-hidden bg-muted">
            <img 
              src={link.image_url} 
              alt={link.title || "Link preview"} 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
         </div>
      )}
      <CardHeader className="p-4 pb-2">
        <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {link.title || link.url}
        </h3>
        <p className="text-xs text-muted-foreground truncate font-mono">
           {new URL(link.url).hostname}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-20">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {link.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive p-0 h-8 w-8"
            onClick={() => onDelete?.(link.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" asChild className="w-full">
          <a href={link.url} target="_blank" rel="noopener noreferrer">
             Vislt <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
