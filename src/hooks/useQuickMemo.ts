import { useState, useEffect, useCallback } from "react";

export function useQuickMemo() {
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePaste = useCallback(async (e: KeyboardEvent) => {
    // 입력 필드에 포커스 시 무시
    const activeEl = document.activeElement;
    const tagName = activeEl?.tagName?.toUpperCase();

    if (
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      activeEl?.getAttribute("contenteditable") === "true" ||
      activeEl?.closest("[contenteditable='true']")
    ) {
      return;
    }

    // Cmd/Ctrl + V 감지
    if ((e.metaKey || e.ctrlKey) && e.key === "v") {
      e.preventDefault();

      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setClipboardContent(text.trim());
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to read clipboard:", error);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handlePaste);
    return () => document.removeEventListener("keydown", handlePaste);
  }, [handlePaste]);

  const reset = useCallback(() => {
    setClipboardContent(null);
    setIsOpen(false);
  }, []);

  return {
    clipboardContent,
    isOpen,
    setIsOpen,
    setClipboardContent,
    reset,
  };
}
