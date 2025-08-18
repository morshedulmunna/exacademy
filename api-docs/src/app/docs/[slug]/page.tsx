import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Params {
  params: { slug: string };
}

/**
 * Docs page: renders a Markdown file from src/docs/{slug}.md
 */
export default function DocPage({ params }: Params) {
  const docPath = path.join(process.cwd(), "src", "docs", `${params.slug}.md`);
  if (!fs.existsSync(docPath)) return notFound();
  const content = fs.readFileSync(docPath, "utf8");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-24 max-w-3xl">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const docsDir = path.join(process.cwd(), "src", "docs");
  if (!fs.existsSync(docsDir)) return [];
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}
