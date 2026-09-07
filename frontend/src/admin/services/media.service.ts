// media.service.ts — Admin-only media API service
// API secret is NEVER exposed to the frontend.

export interface MediaAsset {
  id: string;
  assetId: string;
  publicId: string;
  resourceType: "image" | "video";
  format: string;
  secureUrl: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
  folder: string;
  displayName: string;
  altText: string;
  tags: string[];
  page?: string;
  section?: string;
  slot?: string;
  description?: string;
  seedKey?: string;
  originalFilename: string;
  deletedAt?: string | null;
  createdAt: string;
}

export interface MediaStats {
  total: number;
  images: number;
  videos: number;
  recentlyAdded: number;
}

export interface MediaListResponse {
  success: boolean;
  data: MediaAsset[];
  stats: MediaStats;
}

export interface MediaListParams {
  folder?: string;
  type?: "image" | "video" | "all";
  search?: string;
  deleted?: boolean;
}

export interface UploadMediaParams {
  file: File;
  folder: string;
  displayName?: string;
  altText?: string;
  tags?: string;
  page?: string;
  section?: string;
  slot?: string;
  description?: string;
  onProgress?: (pct: number) => void;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

const ADMIN_MEDIA_URL = `${API_BASE}/admin/media`;

async function parseError(response: Response, defaultMessage: string): Promise<Error> {
  let errData: Record<string, unknown> = {};
  try { errData = await response.json(); } catch { }
  if (response.status === 401) return new Error((errData?.error as Record<string,string>)?.message || "Session expired. Please sign in again.");
  if (response.status === 403) return new Error((errData?.error as Record<string,string>)?.message || "Insufficient permissions.");
  if (response.status === 404) return new Error((errData?.error as Record<string,string>)?.message || "Asset not found.");
  if (response.status >= 500) return new Error((errData?.error as Record<string,string>)?.message || "Server error. Please try again.");
  return new Error((errData?.error as Record<string,string>)?.message || defaultMessage);
}

export const mediaService = {
  async list(params: MediaListParams = {}): Promise<MediaListResponse> {
    const qp = new URLSearchParams();
    if (params.folder && params.folder !== "all") qp.set("folder", params.folder);
    if (params.type && params.type !== "all") qp.set("type", params.type);
    if (params.search) qp.set("search", params.search);
    if (params.deleted) qp.set("deleted", "true");
    const url = `${ADMIN_MEDIA_URL}${qp.toString() ? "?" + qp.toString() : ""}`;
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw await parseError(res, "Failed to fetch media assets.");
      return res.json();
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("fetch")) throw err;
      throw new Error("Unable to connect to the media API.");
    }
  },

  async upload(params: UploadMediaParams): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("folder", params.folder);
    if (params.displayName) formData.append("displayName", params.displayName);
    if (params.altText)     formData.append("altText", params.altText);
    if (params.tags)        formData.append("tags", params.tags);
    if (params.page)        formData.append("page", params.page);
    if (params.section)     formData.append("section", params.section);
    if (params.slot)        formData.append("slot", params.slot);
    if (params.description) formData.append("description", params.description);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${ADMIN_MEDIA_URL}/upload`);
      xhr.withCredentials = true;
      if (params.onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) params.onProgress!(Math.round((e.loaded / e.total) * 100));
        });
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status === 201 && data.success) {
            resolve(data.data as MediaAsset);
          } else {
            reject(new Error(data?.error?.message || "Upload failed."));
          }
        } catch {
          reject(new Error("Upload failed — invalid server response."));
        }
      };
      xhr.onerror = () => reject(new Error("Upload failed — network error."));
      xhr.send(formData);
    });
  },

  async updateMetadata(publicId: string, data: { displayName?: string; altText?: string; tags?: string[]; description?: string }): Promise<void> {
    const encoded = encodeURIComponent(publicId);
    try {
      const res = await fetch(`${ADMIN_MEDIA_URL}/${encoded}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res, "Failed to update asset metadata.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("fetch")) throw err;
      throw new Error("Unable to connect to the media API.");
    }
  },

  async softDelete(publicId: string): Promise<void> {
    const encoded = encodeURIComponent(publicId);
    try {
      const res = await fetch(`${ADMIN_MEDIA_URL}/${encoded}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res, "Failed to delete asset.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("fetch")) throw err;
      throw new Error("Unable to connect to the media API.");
    }
  },

  async hardDelete(publicId: string): Promise<void> {
    const encoded = encodeURIComponent(publicId);
    try {
      const res = await fetch(`${ADMIN_MEDIA_URL}/${encoded}/permanent`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res, "Failed to permanently delete asset.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("fetch")) throw err;
      throw new Error("Unable to connect to the media API.");
    }
  },

  async restore(publicId: string): Promise<void> {
    const encoded = encodeURIComponent(publicId);
    try {
      const res = await fetch(`${ADMIN_MEDIA_URL}/${encoded}/restore`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res, "Failed to restore asset.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("fetch")) throw err;
      throw new Error("Unable to connect to the media API.");
    }
  },

  /**
   * Replace an existing Media asset in-place.
   * Uploads a new file to Cloudinary and updates the existing MongoDB document,
   * preserving page, section, slot, seedKey and all CMS placement metadata.
   * The old Cloudinary asset is cleaned up server-side after the DB update.
   */
  async replace(
    oldPublicId: string,
    params: Omit<UploadMediaParams, "folder">
  ): Promise<MediaAsset> {
    const encoded = encodeURIComponent(oldPublicId);
    const formData = new FormData();
    formData.append("file", params.file);
    if (params.displayName) formData.append("displayName", params.displayName);
    if (params.altText)     formData.append("altText", params.altText);
    if (params.tags)        formData.append("tags", params.tags);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${ADMIN_MEDIA_URL}/${encoded}/replace`);
      xhr.withCredentials = true;
      if (params.onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) params.onProgress!(Math.round((e.loaded / e.total) * 100));
        });
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && data.success) {
            resolve(data.data as MediaAsset);
          } else {
            reject(new Error(data?.error?.message || "Replace failed."));
          }
        } catch {
          reject(new Error("Replace failed — invalid server response."));
        }
      };
      xhr.onerror = () => reject(new Error("Replace failed — network error."));
      xhr.send(formData);
    });
  },
};

export default mediaService;




