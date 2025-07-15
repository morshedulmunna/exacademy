import { client } from "./client";

export async function getAllPosts() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      body,
      "author": author->name,
      "categories": categories[]->title
    }`
  );
}

export async function getAllCourses() {
  return client.fetch(
    `*[_type == "course"] | order(publishedAt desc){
      _id,
      title,
      slug,
      description,
      image,
      publishedAt,
      "categories": categories[]->title,
      lessons
    }`
  );
}

export async function getAllWorkExperiences() {
  return client.fetch(
    `*[_type == "workExperience"] | order(startDate desc){
      _id,
      company,
      role,
      startDate,
      endDate,
      description,
      logo,
      location
    }`
  );
}

export async function getAllNewsletters() {
  return client.fetch(
    `*[_type == "newsletter"] | order(publishedAt desc){
      _id,
      title,
      description,
      publishedAt,
      content
    }`
  );
}

export async function getYoutubeSections() {
  return client.fetch(
    `*[_type == "youtubeSection"]{
      _id,
      title,
      description,
      videos
    }`
  );
}
