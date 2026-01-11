import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-primary-600 to-aurora-500 bg-clip-text text-5xl font-bold text-transparent font-heading">
            Design System
          </h1>
          <p className="text-xl text-muted-foreground">
            Midnight & Aurora Theme • Typography • Components
          </p>
        </div>

        {/* Colors */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-heading">Colors</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-primary shadow-soft"></div>
              <p className="font-semibold">Primary (Aurora Violet)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-secondary shadow-soft"></div>
              <p className="font-semibold">Secondary (Soft Cyan)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-foreground shadow-soft"></div>
              <p className="font-semibold">Foreground (Midnight)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg border border-border bg-background shadow-soft"></div>
              <p className="font-semibold">Background (Cool Gray)</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-heading">Typography</h2>
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-medium">
            <h1 className="text-4xl font-bold font-heading">Heading 1 (Outfit)</h1>
            <h2 className="text-3xl font-bold font-heading">Heading 2 (Outfit)</h2>
            <h3 className="text-2xl font-bold font-heading">Heading 3 (Outfit)</h3>
            <p className="text-base text-muted-foreground">
              Body text is rendered in Pretendard. This is a sample paragraph to demonstrate the readability of the font.
              Pretendard is chosen for its excellent legibility in both Korean and English.
            </p>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-heading">Components</h2>
          
          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="buttons" className="space-y-8 py-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                 <Button className="bg-gradient-to-r from-primary-600 to-aurora-500 hover:opacity-90 transition-opacity">
                    Gradient Button
                 </Button>
                 <Button className="shadow-glow hover:shadow-lg transition-all">
                    Glow Button
                 </Button>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="grid gap-6 py-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Standard Card</CardTitle>
                  <CardDescription>A simple card component.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Content goes here.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Action</Button>
                </CardFooter>
              </Card>

              {/* Glass Card */}
              <div className="glass rounded-xl p-6 text-foreground">
                <h3 className="mb-2 text-2xl font-bold font-heading">Glass Card (Custom)</h3>
                <p className="mb-4 text-muted-foreground">
                  This card uses the custom `.glass` utility class with backdrop blur and border.
                </p>
                <Button className="w-full bg-white/20 text-foreground hover:bg-white/30">
                  Glass Action
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="space-y-4 py-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="Password" />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
