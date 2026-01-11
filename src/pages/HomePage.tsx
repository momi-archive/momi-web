import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-aurora-500/20 blur-[100px]" />

      <div className="z-10 text-center space-y-8 animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-aurora-500 bg-clip-text text-transparent">
              Momi
            </span>
          </h1>
          <p className="mx-auto max-w-[600px] text-xl text-muted-foreground md:text-2xl font-light">
            Capture your moments, <br className="hidden sm:inline" />
            Archive your inspiration.
          </p>
        </div>

        {/* Glass Card Effect Container */}
        <div className="glass p-8 rounded-2xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
          <p className="mb-6 text-foreground/80">
            나만의 아카이빙 공간을 만들어보세요.
            <br />
            이미지, 링크, 생각 모든 것을 담을 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 shadow-glow">
              Go to Archive
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/design">View Design System</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
