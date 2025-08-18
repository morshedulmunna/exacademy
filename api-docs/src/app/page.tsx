import { apiDocConfig } from "@/data/api-docs";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ApiOverview } from "@/components/api-overview";

/**
 * Main page component for API documentation
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-80">
          <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
              <ApiOverview config={apiDocConfig} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
