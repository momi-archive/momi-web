import { LinkInput } from "@/components/links/LinkInput";
import { LinkGrid } from "@/components/links/LinkGrid";
import { useQueryClient } from "@tanstack/react-query";

export function HomePage() {
  const queryClient = useQueryClient();

  const handleLinkAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["links"] });
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header Section */}
        <div className="space-y-4 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold font-heading tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
              Momi
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Capture. Organize. INSPIRE.
          </p>
        </div>

        {/* Input Section */}
        <div className="relative z-10">
           <LinkInput onLinkAdded={handleLinkAdded} />
        </div>

        {/* Grid Section */}
        <div className="relative min-h-[400px]">
           {/* Background decoration for the grid area */}
           <div className="pointer-events-none absolute -top-[100px] left-1/2 -ml-[400px] h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
           
           <LinkGrid />
        </div>
      </div>
    </div>
  );
}
