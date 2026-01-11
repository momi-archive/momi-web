import { useLinks, useDeleteLink } from "@/hooks/useLinks";
import { LinkCard } from "./LinkCard";
import { Loader2 } from "lucide-react";

export function LinkGrid() {
  const { data: links, isLoading, error } = useLinks();
  const deleteLink = useDeleteLink();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        Error loading links. Please check your connection or database setup.
        {/* Helper message for the user if they haven't set up the DB */}
        <p className="text-sm mt-2 text-muted-foreground">
           Make sure you have created the 'links' table in Supabase.
        </p>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-xl font-light">Your archive is empty.</p>
        <p className="text-sm">Start by adding a link above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {links.map((link) => (
        <LinkCard 
          key={link.id} 
          link={link} 
          onDelete={(id) => deleteLink.mutate(id)}
        />
      ))}
    </div>
  );
}
