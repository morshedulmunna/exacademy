import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "categories", type: "array", of: [defineArrayMember({ type: "reference", to: { type: "category" } })] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "lessons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "content", type: "text" }), defineField({ name: "videoUrl", type: "url" })],
        }),
      ],
    }),
  ],
});
