import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const DAILY_LIMIT = 3;

interface ContactRequest {
  email: string;
  subject: string;
  content: string;
  userId: string;
}

async function sendContact(data: ContactRequest) {
  // 1. 일일 한도 체크
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("contact_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.userId)
    .gte("created_at", today.toISOString());

  if ((count ?? 0) >= DAILY_LIMIT) {
    throw new Error(`일일 문의 한도(${DAILY_LIMIT}회)를 초과했습니다. 내일 다시 시도해주세요.`);
  }

  // 2. 이메일 전송
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "문의 전송에 실패했습니다");
  }

  // 3. 로그 저장 (프론트엔드에서 직접 - RLS 정책 통과)
  const { error: logError } = await supabase
    .from("contact_logs")
    .insert({
      user_id: data.userId,
      user_email: data.email,
    });

  if (logError) {
    console.error("Failed to save contact log:", logError);
  }

  const remaining = DAILY_LIMIT - (count ?? 0) - 1;
  return { success: true, remaining };
}

async function getTodayContactCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("contact_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Failed to get contact count:", error);
    return 0;
  }

  return count ?? 0;
}

export function useContactCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["contactCount", userId],
    queryFn: () => getTodayContactCount(userId!),
    enabled: !!userId,
    select: (count) => ({
      count,
      remaining: DAILY_LIMIT - count,
      canSend: count < DAILY_LIMIT,
    }),
  });
}

export function useContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendContact,
    onSuccess: (data, variables) => {
      // 캐시 무효화하여 남은 횟수 갱신
      queryClient.invalidateQueries({ queryKey: ["contactCount", variables.userId] });

      const remaining = data.remaining ?? 0;
      toast.success("문의가 전송되었습니다", {
        description: remaining > 0
          ? `빠른 시일 내에 답변드리겠습니다. (오늘 남은 횟수: ${remaining}회)`
          : "빠른 시일 내에 답변드리겠습니다. (오늘 문의 한도를 모두 사용했습니다)",
      });
    },
    onError: (error: Error) => {
      toast.error("문의 전송 실패", {
        description: error.message,
      });
    },
  });
}
