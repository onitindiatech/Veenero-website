/**
 * mergeHomeSection
 *
 * Safely merges a CMS API response for a Home section with the static fallback.
 * Rules:
 *   - Scalar fields (string, number, boolean) from CMS override the fallback.
 *   - `visible` is only applied when the CMS value is explicitly `false`
 *     (the fallback is always `true`; we never hide a section just because
 *     the CMS returned `visible: undefined` or forgot to include the field).
 *   - Array fields are only replaced when the CMS returns a non-empty array.
 *     An empty array `[]` or missing field falls back to the static default.
 */
export function mergeHomeSection<T extends { visible?: boolean }>(
  fallback: T,
  cms: Partial<T> | null | undefined
): T {
  if (!cms) return fallback;

  const merged: Record<string, unknown> = { ...fallback };

  for (const key of Object.keys(cms) as (keyof T)[]) {
    const cmsVal = cms[key];

    // visible: only override if CMS explicitly says false
    if (key === 'visible') {
      merged['visible'] = cmsVal === false ? false : fallback.visible ?? true;
      continue;
    }

    // Arrays: only replace when CMS returns a non-empty array
    if (Array.isArray(cmsVal)) {
      if (cmsVal.length > 0) {
        merged[key as string] = cmsVal;
      }
      // else: keep fallback array
      continue;
    }

    // Scalars / objects: replace only when not null/undefined
    if (cmsVal !== null && cmsVal !== undefined) {
      merged[key as string] = cmsVal;
    }
  }

  return merged as T;
}
