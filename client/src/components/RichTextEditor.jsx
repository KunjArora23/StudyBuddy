import { useEditor, EditorContent } from "@tiptap/react";

// Import only the extensions we need
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { useEffect } from "react";

export default function RichTextEditor({ input, setInput }) {
  // Initialize TipTap editor with only basic formatting: bold, italic, underline
  const editor = useEditor({
    extensions: [
      Document,   // Root document node
      Paragraph,  // Allows writing paragraphs
      Text,       // Enables text content
      Bold,       // Bold formatting
      Italic,     // Italic formatting
      Underline,  // Underline formatting
    ],
    content: input?.description || "<p></p>",  // Set initial content
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-3 text-gray-800 focus:outline-none", // Styling for editor area
      },
    },
    onUpdate: ({ editor }) => {
      // When editor content changes, update `description` field in parent state
      const html = editor.getHTML();
      setInput((prev) => ({ ...prev, description: html }));
    },
  });

  // Sync external state changes with editor content
  useEffect(() => {
    if (editor && input?.description && input.description !== editor.getHTML()) {
      try {
        editor.commands.setContent(input.description); // Safely set content
      } catch (err) {
        console.warn("Invalid content passed to TipTap editor:", err);
        editor.commands.setContent("<p></p>"); // Fallback to empty paragraph
      }
    }
  }, [editor, input?.description]);

  // Show nothing until the editor is fully initialized
  if (!editor) return null;

  // Define toolbar buttons
  const buttons = [
    {
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
  ];

  return (
    <div className="w-full border border-gray-300 rounded-lg shadow bg-white">
      {/* Toolbar: Shows formatting buttons */}
      <div className="flex gap-2 p-2 border-b border-gray-200">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            type="button"
            className={`px-3 py-1 text-sm rounded ${
              btn.isActive()
                ? "bg-blue-600 text-white" // Active formatting
                : "bg-gray-100 hover:bg-gray-200" // Inactive formatting
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} className="px-3 py-2" />
    </div>
  );
}
