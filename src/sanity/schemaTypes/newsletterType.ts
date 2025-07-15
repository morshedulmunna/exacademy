import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const newsletterType = defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  icon: EnvelopeIcon,
  fields: [defineField({ name: "title", type: "string" }), defineField({ name: "description", type: "text" }), defineField({ name: "publishedAt", type: "datetime" }), defineField({ name: "content", type: "blockContent" })],
});
