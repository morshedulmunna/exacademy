"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { ApiEndpoint as ApiEndpointType } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getMethodColor, copyToClipboard, getStatusColor } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";

interface ApiEndpointProps {
  endpoint: ApiEndpointType;
}

/**
 * API Endpoint component displaying detailed endpoint documentation
 */
export function ApiEndpoint({ endpoint }: ApiEndpointProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["description"]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
  };

  const copyEndpoint = async () => {
    const success = await copyToClipboard(`${endpoint.method} ${endpoint.path}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fullUrl = `https://api.executeacademy.com/v1${endpoint.path}`;

  return (
    <Card id={endpoint.id} className="dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Badge className={cn("font-mono", getMethodColor(endpoint.method))}>{endpoint.method}</Badge>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded whitespace-pre-wrap break-all">{endpoint.path}</code>
              {endpoint.deprecated && <Badge variant="destructive">Deprecated</Badge>}
            </div>
            <CardTitle className="text-xl">{endpoint.title}</CardTitle>
            <CardDescription>{endpoint.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={copyEndpoint} className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        {endpoint.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {endpoint.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Collapsible Sections */}
        <div className="space-y-2">
          {/* Description */}
          <div>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto" onClick={() => toggleSection("description")}>
              <span className="font-medium">Description</span>
              {expandedSections.includes("description") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {expandedSections.includes("description") && (
              <div className="mt-2 pl-4">
                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
              </div>
            )}
          </div>

          {/* Parameters */}
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto" onClick={() => toggleSection("parameters")}>
                <span className="font-medium">Parameters</span>
                {expandedSections.includes("parameters") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              {expandedSections.includes("parameters") && (
                <div className="mt-2 pl-4">
                  <div className="space-y-2">
                    {endpoint.parameters.map((param) => (
                      <div key={param.name} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{param.name}</code>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            <Badge variant={param.required ? "default" : "secondary"} className="text-xs">
                              {param.required ? "Required" : "Optional"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{param.description}</p>
                        {param.example && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Example: </span>
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{JSON.stringify(param.example)}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Request Body */}
          {endpoint.requestBody && (
            <div>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto" onClick={() => toggleSection("requestBody")}>
                <span className="font-medium">Request Body</span>
                {expandedSections.includes("requestBody") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              {expandedSections.includes("requestBody") && (
                <div className="mt-2 pl-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{endpoint.requestBody.description}</p>
                    {endpoint.requestBody.example && <CodeBlock code={JSON.stringify(endpoint.requestBody.example, null, 2)} language="json" title="Request Body Example" />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Responses */}
          <div>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto" onClick={() => toggleSection("responses")}>
              <span className="font-medium">Responses</span>
              {expandedSections.includes("responses") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {expandedSections.includes("responses") && (
              <div className="mt-2 pl-4">
                <div className="space-y-3">
                  {endpoint.responses.map((response) => (
                    <div key={response.statusCode} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={cn("font-mono text-sm", getStatusColor(response.statusCode))}>{response.statusCode}</span>
                          <span className="text-sm font-medium">{response.description}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {response.contentType}
                        </Badge>
                      </div>
                      {response.example && <CodeBlock code={JSON.stringify(response.example, null, 2)} language="json" title={`${response.statusCode} Response Example`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Examples */}
          {endpoint.examples && endpoint.examples.length > 0 && (
            <div>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto" onClick={() => toggleSection("examples")}>
                <span className="font-medium">Examples</span>
                {expandedSections.includes("examples") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              {expandedSections.includes("examples") && (
                <div className="mt-2 pl-4">
                  <div className="space-y-4">
                    {endpoint.examples.map((example, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{example.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{example.description}</p>

                        {example.request && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Request</h5>
                            {example.request.headers && <CodeBlock code={JSON.stringify(example.request.headers, null, 2)} language="json" title="Headers" />}
                            {example.request.body && <CodeBlock code={JSON.stringify(example.request.body, null, 2)} language="json" title="Body" />}
                          </div>
                        )}

                        {example.response && (
                          <div className="space-y-2 mt-3">
                            <h5 className="text-sm font-medium">Response</h5>
                            <CodeBlock code={JSON.stringify(example.response.body, null, 2)} language="json" title={`${example.response.statusCode} Response`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
