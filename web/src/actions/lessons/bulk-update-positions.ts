"use server";

import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";

export interface LessonPositionUpdate {
  id: string;
  position: number;
}

export interface BulkUpdateLessonPositionsRequest {
  module_id: string;
  lessons: LessonPositionUpdate[];
}

/**
 * Bulk update lesson positions via backend API
 * @param moduleId - The ID of the module
 * @param lessons - Array of lesson position updates
 */
export async function bulkUpdateLessonPositions(moduleId: string, lessons: LessonPositionUpdate[]): Promise<any> {
  try {
    const payload: BulkUpdateLessonPositionsRequest = {
      module_id: moduleId,
      lessons,
    };

    const res = await API.patch(`/api/modules/${moduleId}/lessons/positions`, payload);
    return DataObj(res);
  } catch (error: any) {
    return ErrorObj(error);
  }
}
