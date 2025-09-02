"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";
import { ResponseType } from "@/lib/types";

/**
 * Video upload action functions
 * Handles all video upload-related API calls
 */

export interface InitVideoUploadRequest {
  filename: string;
  content_type: string;
  file_size: number;
  lesson_id?: string;
}

export interface InitVideoUploadResponse {
  upload_id: string;
  file_key: string;
  chunk_urls: string[];
  chunk_size: number;
  total_chunks: number;
}

export interface CompleteVideoUploadRequest {
  upload_id: string;
  file_key: string;
  chunk_etags: string[];
}

export interface CompleteVideoUploadResponse {
  video_url: string;
  file_key: string;
  status: string;
}

export interface UploadChunkRequest {
  upload_id: string;
  file_key: string;
  chunk_number: number;
  chunk_data: Uint8Array;
}

export interface UploadChunkResponse {
  chunk_number: number;
  etag: string;
  status: string;
}

/**
 * Initialize a multipart video upload
 * @param request - Upload initialization request
 * @returns Structured response with success/error information
 */
export async function initVideoUploadAction(request: InitVideoUploadRequest): Promise<ResponseType> {
  try {
    const response = await API.post(API_ENDPOINTS.VIDEO.UPLOAD_INIT, request);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}

/**
 * Complete a multipart video upload
 * @param request - Upload completion request
 * @returns Structured response with success/error information
 */
export async function completeVideoUploadAction(request: CompleteVideoUploadRequest): Promise<ResponseType> {
  try {
    const response = await API.post(API_ENDPOINTS.VIDEO.UPLOAD_COMPLETE, request);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}

/**
 * Upload a video chunk (alternative to direct upload to presigned URL)
 * @param request - Chunk upload request
 * @returns Structured response with success/error information
 */
export async function uploadVideoChunkAction(request: UploadChunkRequest): Promise<ResponseType> {
  try {
    const response = await API.post(API_ENDPOINTS.VIDEO.UPLOAD_CHUNK, request);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}

/**
 * Get video information by ID
 * @param videoId - Video UUID
 * @returns Structured response with success/error information
 */
export async function getVideoAction(videoId: string): Promise<ResponseType> {
  try {
    const response = await API.get(`${API_ENDPOINTS.VIDEO.GET}/${videoId}`);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}

/**
 * Get videos by lesson ID
 * @param lessonId - Lesson UUID
 * @returns Structured response with success/error information
 */
export async function getVideosByLessonAction(lessonId: string): Promise<ResponseType> {
  try {
    const response = await API.get(`${API_ENDPOINTS.VIDEO.GET_BY_LESSON}/${lessonId}/videos`);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}

/**
 * Delete a video
 * @param videoId - Video UUID
 * @returns Structured response with success/error information
 */
export async function deleteVideoAction(videoId: string): Promise<ResponseType> {
  try {
    const response = await API.delete(`${API_ENDPOINTS.VIDEO.DELETE}/${videoId}`);
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
