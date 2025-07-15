import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { courseType } from "./courseType";
import { workExperienceType } from "./workExperienceType";
import { newsletterType } from "./newsletterType";
import { youtubeSectionType } from "./youtubeSectionType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, courseType, workExperienceType, newsletterType, youtubeSectionType],
};
