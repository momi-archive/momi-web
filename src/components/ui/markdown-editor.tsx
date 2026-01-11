import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

// highlight.js 테마 CSS
import "highlight.js/styles/github-dark.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Code,
  Code2,
  Link as LinkIcon,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import TurndownService from "turndown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// lowlight 인스턴스 생성 (주요 언어 지원)
const lowlight = createLowlight(common);

// HTML → Markdown 변환기
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// 코드 블록 변환 규칙 추가
turndownService.addRule("codeBlock", {
  filter: (node) => {
    return (
      node.nodeName === "PRE" &&
      node.firstChild !== null &&
      node.firstChild.nodeName === "CODE"
    );
  },
  replacement: (_content, node) => {
    const codeElement = node.firstChild as HTMLElement;
    const language = codeElement.className?.match(/language-(\w+)/)?.[1] || "";
    const code = codeElement.textContent || "";
    return `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
  },
});

// Markdown → HTML 변환
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return "";
  try {
    return marked.parse(markdown, { async: false }) as string;
  } catch {
    return markdown;
  }
};

// HTML → Markdown 변환
const htmlToMarkdown = (html: string): string => {
  if (!html || html === "<p></p>") return "";
  try {
    return turndownService.turndown(html);
  } catch {
    return html;
  }
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // 기본 코드블록 비활성화
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
        HTMLAttributes: {
          class: "hljs",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "내용을 입력하세요...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
        },
      }),
    ],
    content: markdownToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 focus:outline-none prose-sm max-w-none",
      },
    },
  });

  // value가 외부에서 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== htmlToMarkdown(editor.getHTML())) {
      const html = markdownToHtml(value);
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [value, editor]);

  // 링크 Popover가 열릴 때 기존 URL 가져오기
  useEffect(() => {
    if (linkPopoverOpen && editor) {
      const previousUrl = editor.getAttributes("link").href || "";
      setLinkUrl(previousUrl);
    }
  }, [linkPopoverOpen, editor]);

  const applyLink = () => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkPopoverOpen(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPopoverOpen(false);
    setLinkUrl("");
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* 도구모음 */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg border border-border/50">
        {/* 굵게 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("bold") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="굵게 (⌘B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        {/* 기울임 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("italic") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="기울임 (⌘I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        {/* 인라인 코드 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("code") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="인라인 코드"
        >
          <Code className="h-4 w-4" />
        </Button>

        {/* 코드 블록 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("codeBlock") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="코드 블록"
        >
          <Code2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border/50 mx-1" />

        {/* 링크 - Popover */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
                editor.isActive("link") && "bg-primary/10 text-primary"
              )}
              title="링크 (⌘K)"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">URL</label>
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    }
                  }}
                  className="h-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={applyLink}
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  적용
                </Button>
                {editor.isActive("link") && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={removeLink}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 인용 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("blockquote") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="인용"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* 글머리 기호 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("bulletList") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="글머리 기호"
        >
          <List className="h-4 w-4" />
        </Button>

        {/* 번호 매기기 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("orderedList") && "bg-primary/10 text-primary"
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="번호 매기기"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border/50 mx-1" />

        {/* 제목 1 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("heading", { level: 1 }) &&
              "bg-primary/10 text-primary"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        {/* 제목 2 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("heading", { level: 2 }) &&
              "bg-primary/10 text-primary"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        {/* 제목 3 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            editor.isActive("heading", { level: 3 }) &&
              "bg-primary/10 text-primary"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="제목 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      {/* 에디터 */}
      <div className="bg-background/80 rounded-lg border border-border/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <EditorContent editor={editor} />
      </div>

      {/* 도움말 */}
      <p className="text-xs text-muted-foreground px-1">
        마크다운 문법을 지원합니다.{" "}
        <span className="hidden sm:inline">
          **굵게**, *기울임*, ```코드블록 입력 시 자동 변환
        </span>
      </p>

      {/* Tiptap 에디터 스타일 */}
      <style>{`
        .tiptap {
          min-height: 200px;
          padding: 1rem;
        }

        .tiptap:focus {
          outline: none;
        }

        .tiptap p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }

        .tiptap p:last-child {
          margin-bottom: 0;
        }

        .tiptap h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
          font-family: var(--font-heading);
        }

        .tiptap h1:first-child {
          margin-top: 0;
        }

        .tiptap h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
          font-family: var(--font-heading);
        }

        .tiptap h2:first-child {
          margin-top: 0;
        }

        .tiptap h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          font-family: var(--font-heading);
        }

        .tiptap h3:first-child {
          margin-top: 0;
        }

        .tiptap strong {
          font-weight: 700;
        }

        .tiptap em {
          font-style: italic;
        }

        .tiptap code {
          background: hsl(var(--muted));
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          color: hsl(var(--primary));
        }

        .tiptap pre {
          background: #1e1e2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #e4e4e7;
        }

        .tiptap pre code {
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }

        /* 문법 하이라이팅 스타일 */
        .tiptap pre .hljs-keyword,
        .tiptap pre .hljs-selector-tag,
        .tiptap pre .hljs-built_in,
        .tiptap pre .hljs-name,
        .tiptap pre .hljs-tag {
          color: #c792ea;
        }

        .tiptap pre .hljs-string,
        .tiptap pre .hljs-title,
        .tiptap pre .hljs-section,
        .tiptap pre .hljs-attribute,
        .tiptap pre .hljs-literal,
        .tiptap pre .hljs-template-tag,
        .tiptap pre .hljs-template-variable,
        .tiptap pre .hljs-type,
        .tiptap pre .hljs-addition {
          color: #c3e88d;
        }

        .tiptap pre .hljs-deletion,
        .tiptap pre .hljs-selector-attr,
        .tiptap pre .hljs-selector-pseudo,
        .tiptap pre .hljs-meta {
          color: #f07178;
        }

        .tiptap pre .hljs-doctag,
        .tiptap pre .hljs-attr {
          color: #ffcb6b;
        }

        .tiptap pre .hljs-symbol,
        .tiptap pre .hljs-bullet,
        .tiptap pre .hljs-link,
        .tiptap pre .hljs-subst,
        .tiptap pre .hljs-quote,
        .tiptap pre .hljs-number,
        .tiptap pre .hljs-regexp {
          color: #f78c6c;
        }

        .tiptap pre .hljs-comment,
        .tiptap pre .hljs-code,
        .tiptap pre .hljs-formula {
          color: #676e95;
          font-style: italic;
        }

        .tiptap pre .hljs-variable,
        .tiptap pre .hljs-template-variable {
          color: #f07178;
        }

        .tiptap pre .hljs-selector-class {
          color: #ffcb6b;
        }

        .tiptap pre .hljs-class .hljs-title {
          color: #ffcb6b;
        }

        .tiptap blockquote {
          border-left: 4px solid hsl(var(--primary) / 0.5);
          padding-left: 1rem;
          font-style: italic;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.75rem;
        }

        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tiptap li {
          margin-bottom: 0.25rem;
        }

        .tiptap a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }

        .tiptap a:hover {
          opacity: 0.8;
        }

        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
