import { ApiDocConfig } from "@/types/api";
import { baseConfig } from "@/data/base";
import { authCategory } from "@/data/categories/auth";
import { coursesCategory } from "@/data/categories/courses";
import { usersCategory } from "@/data/categories/users";

/**
 * API documentation configuration assembled from modular pieces
 */
export const apiDocConfig: ApiDocConfig = {
  ...baseConfig,
  categories: [authCategory, coursesCategory, usersCategory],
};
