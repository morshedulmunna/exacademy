"use server";

import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";

export interface ModulePositionUpdate {
  id: string;
  position: number;
}

export interface BulkUpdateModulePositionsRequest {
  course_id: string;
  modules: ModulePositionUpdate[];
}

/**
 * Bulk update module positions via backend API
 * @param courseId - The ID of the course
 * @param modules - Array of module position updates
 */
export async function bulkUpdateModulePositions(courseId: string, modules: ModulePositionUpdate[]): Promise<any> {
  try {
    const payload: BulkUpdateModulePositionsRequest = {
      course_id: courseId,
      modules,
    };

    const res = await API.patch(`/api/courses/${courseId}/modules/positions`, payload);
    return DataObj(res);
  } catch (error: any) {
    return ErrorObj(error);
  }
}
