import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface LinkItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
}

export function useLinks() {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LinkItem[];
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Link deleted");
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete link");
    },
  });
}
