# MarkdownRenderer Component

A reusable React component for rendering markdown content with syntax highlighting and custom styling.

## Features

- ✅ **GitHub Flavored Markdown (GFM)** support
- ✅ **Syntax highlighting** for code blocks
- ✅ **Dark mode** support
- ✅ **Custom styling** for all markdown elements
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Accessibility** features

## Supported Languages

The component includes syntax highlighting for:

- JavaScript
- TypeScript
- JSX/TSX
- CSS
- JSON
- Bash

## Usage

```tsx
import MarkdownRenderer from "@/components/ui/markdown-renderer";

function MyComponent() {
  const markdownContent = `
# My Blog Post

This is a **bold** paragraph with some *italic* text.

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

- Item 1
- Item 2
- Item 3

### Tables

| Feature | Support |
|---------|---------|
| Markdown | ✅ |
| Tables | ✅ |
| Code | ✅ |
  `;

  return (
    <div>
      <MarkdownRenderer content={markdownContent} />
    </div>
  );
}
```

## Props

| Prop        | Type     | Default | Description                     |
| ----------- | -------- | ------- | ------------------------------- |
| `content`   | `string` | -       | The markdown content to render  |
| `className` | `string` | `""`    | Additional CSS classes to apply |

## Styling

The component uses Tailwind CSS classes and includes:

- **Prose styling** for typography
- **Dark mode** support with `dark:prose-invert`
- **Custom code blocks** with syntax highlighting
- **Responsive tables** with horizontal scroll
- **Styled links** with hover effects
- **Blockquotes** with left border
- **Images** with rounded corners

## Customization

You can customize the styling by passing additional classes:

```tsx
<MarkdownRenderer content={markdownContent} className="prose-sm max-w-2xl" />
```

## Dependencies

- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `prismjs` - Syntax highlighting
- `tailwindcss` - Styling

## Installation

The required dependencies are already installed:

```bash
npm install react-markdown remark-gfm prismjs @types/prismjs
```
