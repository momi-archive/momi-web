import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ArchiveItem {
  id: string;
  type: "link" | "memo";
  title?: string; // Optional for link, optional/required for memo
  content?: string; // Memo content or Link description
  url?: string; // Only for links
  image_url?: string;
  tags?: string[];
  category_id?: string;
  created_at: string;
}

// --- Categories Hooks ---

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: { name: string; color: string }) => {
      const { error } = await supabase.from("categories").insert([category]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Category>) => {
      const { error } = await supabase.from("categories").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["archives"] }); // Update archives to reflect new colors/names
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, unassign archived items from this category
      const { error: unassignError } = await supabase
        .from("archives")
        .update({ category_id: null })
        .eq("category_id", id);
        
      if (unassignError) throw unassignError;

      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete category");
    },
  });
}


// --- Archives Hooks ---

export function useArchives(categoryId?: string, searchQuery?: string) {
  return useQuery({
    queryKey: ["archives", categoryId, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("archives")
        .select(`
          *,
          categories (
             id, name, color
          )
        `)
        .order("created_at", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (ArchiveItem & { categories: Category | null })[];
    },
  });
}

export function useAddArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Partial<ArchiveItem>) => {
      const { error } = await supabase.from("archives").insert([newItem]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Item archived");
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to archive item");
    },
  });
}

export function useUpdateArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ArchiveItem>) => {
      const { error } = await supabase.from("archives").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("기록이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("수정에 실패했습니다.");
    },
  });
}

export function useDeleteArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("archives").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("기록이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제에 실패했습니다.");
    },
  });
}
