"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { listModules } from "@/actions/modules/list-modules-action";
import CollapsibleModule from "./CollapsibleModule";

interface ModuleItem {
  id: string;
  title: string;
  description?: string;
  position: number;
  created_at: string;
  updated_at?: string;
}

interface CollapsibleModulesListProps {
  courseId: string;
}

/**
 * Collapsible modules list - loads modules initially, each module loads lessons on expand
 */
export default function CollapsibleModulesList({ courseId }: CollapsibleModulesListProps) {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await listModules(courseId);
        if (res.success) {
          const items: ModuleItem[] = res.data;
          setModules(items.sort((a, b) => a.position - b.position));
        } else {
          setError(res.message || "Failed to load modules");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load modules");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>
      </div>
    );
  }

  if (!modules.length) {
    return <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No modules found</div>;
  }

  return (
    <div>
      {modules.map((m) => (
        <CollapsibleModule key={m.id} module={m} courseId={courseId} />
      ))}
    </div>
  );
}
