"use server";

import FetchAPI from "@/actions/http";

/**
 * Uploads a file to the media endpoint and returns the upload response
 * @param formData - FormData containing the file to upload
 * @returns Promise<UploadResponse>
 */
export async function uploadMedia(formData: FormData) {
  const res = await FetchAPI.post({
    endpoint: "/api/media/upload",
    body: formData,
  });
  return res;
}

/**
 * Uploads a file and returns just the URL
 * @param formData - FormData containing the file to upload
 * @returns Promise<string> - The uploaded file URL
 */
export async function uploadMediaAndGetUrl(formData: FormData): Promise<string> {
  const response = await uploadMedia(formData);

  console.log(response);
  return response.data.url;
}
