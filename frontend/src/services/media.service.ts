// frontend/src/services/media.service.ts
// Public (no-auth) media service — allows the public website to resolve
// the current Cloudinary URL for a given page/section/slot from the Media Library.
// This makes the Media Library the canonical source of truth for website assets.

export interface PublicMediaAsset {
  id: string;
  publicId: string;
  secureUrl: string;
  altText: string;
  width?: number;
  height?: number;
  resourceType: "image" | "video";
  format: string;
  page?: string;
  section?: string;
  slot?: string;
}

import { API_BASE_URL } from '@/config/api';

const API_BASE = `${API_BASE_URL}/api`;

/**
 * Fetches the active (non-deleted) Media Library asset for a given slot.
 * Returns null if no asset is found for the slot (404 is treated as null, not an error).
 *
 * @param page    - Page identifier, e.g. "about"
 * @param section - Section name, e.g. "Hero Section"
 * @param slot    - Slot name, e.g. "Hero Visual"
 */
export async function getAssetBySlot(
  page: string,
  section: string,
  slot: string
): Promise<PublicMediaAsset | null> {
  try {
    const params = new URLSearchParams({ page, section, slot });
    const res = await fetch(`${API_BASE}/media/asset?${params.toString()}`);

    // 404 means no asset is seeded/uploaded for this slot yet — not an error
    if (res.status === 404) return null;

    if (!res.ok) {
      console.warn(`[MediaService] Failed to fetch asset for slot ${page}/${section}/${slot}: ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (!json.success || !json.data) return null;

    return json.data as PublicMediaAsset;
  } catch (err) {
    // Network error — silently return null so the public page falls back gracefully
    console.warn(`[MediaService] Network error fetching slot asset:`, err);
    return null;
  }
}
