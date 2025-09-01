import { listModulesDeep } from "@/actions/modules/list-modules-deep-action";
import { createDeepModules } from "@/actions/modules/deep-modules-action";

export async function apiListModulesDeep(courseId: string) {
  return listModulesDeep(courseId);
}

export async function apiCreateDeepModules(courseId: string, payload: any) {
  console.log("Mariya__________________", payload);
  return createDeepModules(courseId, payload);
}
