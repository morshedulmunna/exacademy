import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Header } from "@/components/header";

/**
 * Docs index page: lists available Markdown docs from src/docs
 */
export default function DocsIndexPage() {
  const docsDir = path.join(process.cwd(), "src", "docs");
  const entries = fs.existsSync(docsDir) ? fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-24 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Documentation</h1>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No docs found. Add .md files under src/docs.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((file) => {
              const slug = file.replace(/\.md$/, "");
              return (
                <li key={file}>
                  <Link href={`/docs/${slug}`} className="text-primary hover:underline">
                    {slug}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
