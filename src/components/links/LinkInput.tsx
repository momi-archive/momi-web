import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

interface LinkInputProps {
  onLinkAdded?: () => void;
}

export function LinkInput({ onLinkAdded }: LinkInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("links").insert([
        {
          url: values.url,
          title: "New Link", // Placeholder until we fetch OG tags
          description: "Added to your archive",
        },
      ]);

      if (error) throw error;

      toast.success("Link added to archive!");
      form.reset();
      setIsExpanded(false);
      onLinkAdded?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add link.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-full h-14 text-lg bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/60 text-muted-foreground shadow-lg animate-fade-in-up"
          variant="outline"
        >
          <Plus className="mr-2 h-5 w-5" /> Add a new link...
        </Button>
      ) : (
        <Card className="glass animate-fade-in-up">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Paste your URL here..."
                          className="h-12 bg-white/50"
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary-600 to-aurora-500"
                >
                  {isLoading ? "Adding..." : "Add"}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
