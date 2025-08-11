"use client";

import React, { useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Suggestion from "@tiptap/suggestion";
import { Extension } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export interface BlockEditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
}

// Slash command items
type SlashItem = {
  title: string;
  description: string;
  command: (opts: { editor: any; range: { from: number; to: number } }) => void;
};

const createSlashCommand = (items: SlashItem[]) =>
  Extension.create({
    name: "slash-command",
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: "/",
          startOfLine: true,
          items: ({ query }: { query: string }) => {
            return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = document.createElement("div");
                component.className = "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg w-80 overflow-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

                const renderItems = () => {
                  component.innerHTML = "";
                  props.items.forEach((item: SlashItem, index: number) => {
                    const div = document.createElement("div");
                    div.className = "px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-col gap-0.5" + (index === props.selected ? " bg-gray-100 dark:bg-gray-800" : "");
                    const title = document.createElement("div");
                    title.className = "text-sm font-medium text-gray-900 dark:text-gray-100";
                    title.innerText = item.title;
                    const desc = document.createElement("div");
                    desc.className = "text-xs text-gray-500 dark:text-gray-400";
                    desc.innerText = item.description;
                    div.appendChild(title);
                    div.appendChild(desc);
                    div.addEventListener("click", () => {
                      props.command(item);
                    });
                    component.appendChild(div);
                  });
                };

                renderItems();

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect as any,
                  appendTo: () => document.body,
                  content: component,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate(props: any) {
                (popup[0] as any)?.setProps({ getReferenceClientRect: props.clientRect });
                // Update selected styles for both light and dark themes
                const children = Array.from(component.children) as HTMLElement[];
                children.forEach((child, i) => {
                  child.classList.remove("bg-gray-100", "bg-gray-800", "dark:bg-gray-800");
                  if (i === props.selected) {
                    child.classList.add("bg-gray-100", "dark:bg-gray-800");
                  }
                });
              },

              onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                  (popup[0] as any)?.hide();
                  return true;
                }
                return false;
              },

              onExit() {
                (popup[0] as any)?.destroy();
              },
            };
          },
          command: ({ editor, range, props }: any) => {
            props.command({ editor, range });
          },
        }) as any,
      ];
    },
  });

export default function BlockEditor({ initialContent = "", placeholder = "Type '/' for commands", onChange, className }: BlockEditorProps) {
  // Create and register languages for syntax highlighting
  const lowlight = createLowlight();
  lowlight.register("go", go);
  lowlight.register("javascript", javascript);
  lowlight.register("typescript", typescript);
  const items: SlashItem[] = useMemo(
    () => [
      {
        title: "Text",
        description: "Start writing with plain text",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setParagraph().run();
        },
      },
      {
        title: "Heading 1",
        description: "Big heading",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        description: "Medium heading",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small heading",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Create a simple bullet list",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a simple numbered list",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Code Block",
        description: "Insert a code block",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
      },
      {
        title: "Quote",
        description: "Insert a quote",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: "Horizontal Rule",
        description: "Insert a divider",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
    ],
    []
  );

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          codeBlock: false,
        }),
        // Enable syntax-highlighted code blocks
        CodeBlockLowlight.configure({ lowlight }),
        Placeholder.configure({ placeholder }),
        // Add convenient list indent/outdent shortcuts
        Extension.create({
          name: "list-shortcuts",
          addKeyboardShortcuts() {
            return {
              Tab: () => this.editor?.commands.sinkListItem("listItem") ?? false,
              "Shift-Tab": () => this.editor?.commands.liftListItem("listItem") ?? false,
            };
          },
        }),
        createSlashCommand(items),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            // Base prose + layout
            "prose w-full h-full max-w-none min-h-0 focus:outline-none px-4 py-6 leading-relaxed text-gray-900 dark:text-gray-100 dark:prose-invert " +
            // Ensure list markers render correctly
            "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:list-outside [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:list-outside " +
            // Avoid extra margins on list paragraphs so marker aligns with first line
            "[&_li_p]:m-0 " +
            // Inline code pill (not inside pre)
            "[&_:not(pre)>code]:text-orange-500 dark:[&_:not(pre)>code]:text-orange-400 [&_:not(pre)>code]:bg-zinc-100 dark:[&_:not(pre)>code]:bg-white/10 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded " +
            // Code block panel
            "[&_pre]:bg-[#1f2430] [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:border [&_pre]:border-white/10 [&_pre]:shadow-sm " +
            // Reset inner code inside pre
            "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:shadow-none [&_pre_code]:rounded-none [&_pre_code]:text-gray-100 [&_pre_code]:text-[0.95rem] " +
            // Token colors (highlight.js / lowlight classes)
            "[&_pre_.hljs-keyword]:text-pink-400 [&_pre_.hljs-title]:text-emerald-400 [&_pre_.hljs-function]:text-emerald-400 [&_pre_.hljs-params]:text-sky-300 " +
            "[&_pre_.hljs-built_in]:text-purple-400 [&_pre_.hljs-number]:text-orange-300 [&_pre_.hljs-string]:text-green-400 [&_pre_.hljs-operator]:text-orange-300 " +
            "[&_pre_.hljs-punctuation]:text-gray-300 [&_pre_.hljs-comment]:text-zinc-400",
        },
      },
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
      // Render immediately so placeholder appears on initial mount
      immediatelyRender: true,
    },
    []
  );

  return (
    <div className={`w-full h-full ${className ?? ""}`}>
      <div className="rounded-lg border-r h-full w-full border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <EditorContent className="w-full h-full" editor={editor} aria-placeholder={placeholder} />
      </div>
    </div>
  );
}
