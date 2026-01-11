import { ReactNode } from "react";

/**
 * 정규식 특수문자를 이스케이프
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 검색어와 일치하는 텍스트를 하이라이트 처리
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 하이라이트된 ReactNode 배열
 */
export function highlightText(text: string, query: string): ReactNode {
  if (!query || !text) return text;

  const escapedQuery = escapeRegex(query);
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 dark:bg-yellow-500/40 text-inherit rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}
