import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const workExperienceType = defineType({
  name: "workExperience",
  title: "Work Experience",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "company", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "location", type: "string" }),
  ],
});
