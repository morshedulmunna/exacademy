"use client";

import { ApiDocConfig } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiEndpoint } from "@/components/api-endpoint";
import { useDocs } from "@/components/docs-context";

interface ApiOverviewProps {
  config: ApiDocConfig;
}

/**
 * API Overview component displaying the main documentation content
 */
export function ApiOverview({ config }: ApiOverviewProps) {
  const { searchQuery } = useDocs();

  const visibleCategories = config.categories
    .map((c) => ({
      ...c,
      endpoints: c.endpoints.filter((e) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return [e.title, e.description, e.path, e.method, ...(e.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(q);
      }),
    }))
    .filter((c) => c.endpoints.length > 0 || !searchQuery);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{config.description}</p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">Version {config.version}</Badge>
          <Badge variant="secondary">Base URL: {config.baseUrl}</Badge>
        </div>
      </div>

      {/* Authentication Section */}
      {config.authentication && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔐 Authentication</span>
            </CardTitle>
            <CardDescription>{config.authentication.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">Authorization: Bearer YOUR_TOKEN_HERE</code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rate Limiting Section */}
      {config.rateLimiting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚡ Rate Limiting</span>
            </CardTitle>
            <CardDescription>{config.rateLimiting.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {config.rateLimiting.limits.map((limit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-sm">{limit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* API Endpoints by Category */}
      <div className="space-y-8">
        {visibleCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="space-y-4">
              {category.endpoints.map((endpoint) => (
                <ApiEndpoint key={endpoint.id} endpoint={endpoint} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
