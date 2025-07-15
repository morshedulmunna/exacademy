import { PlayIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const youtubeSectionType = defineType({
  name: "youtubeSection",
  title: "YouTube Section",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "videos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "videoUrl", type: "url" }), defineField({ name: "thumbnail", type: "image", options: { hotspot: true } })],
        }),
      ],
    }),
  ],
});
