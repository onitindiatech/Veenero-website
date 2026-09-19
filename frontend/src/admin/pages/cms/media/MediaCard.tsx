import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "../../../services/media.service";

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isLocal(asset: MediaAsset): boolean {
  return (asset.publicId || "").startsWith("local:");
}

export function getThumbnailUrl(url: string): string {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/c_fill,w_400,h_300,f_auto,q_auto/");
  }
  return url;
}

const PAGE_NAMES: Record<string, string> = {
  about: "About",
  home: "Home",
  solutions: "Solutions",
  approach: "Approach",
  impact: "Impact",
  careers: "Careers",
  blog: "Blog",
  contact: "Contact",
};

interface MediaCardProps {
  asset: MediaAsset;
  onClick: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
  onReplace?: (asset: MediaAsset) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  asset,
  onClick,
  onDelete,
  onReplace,
}) => {
  const isVideo = asset.resourceType === "video";
  const local = isLocal(asset);
  const isUsed = Boolean(asset.page && asset.page.trim());
  const pageLabel = asset.page ? PAGE_NAMES[asset.page.toLowerCase()] || asset.page : "";

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onClick(asset)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden flex-shrink-0">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icons.Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">
                {asset.format.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <img
            src={getThumbnailUrl(asset.secureUrl)}
            alt={asset.altText || asset.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-size="11" text-anchor="middle" fill="%239ca3af"%3ENo preview%3C/text%3E%3C/svg%3E';
            }}
          />
        )}

        {/* Top-left: Type badge */}
        <div
          className={cn(
            "absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs",
            isVideo
              ? "bg-purple-600/90 text-white"
              : local
              ? "bg-amber-600/90 text-white"
              : "bg-teal-600/90 text-white"
          )}
        >
          {isVideo ? "VIDEO" : "IMAGE"}
        </div>

        {/* Top-right Action Buttons on Hover */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {onReplace && (
            <button
              type="button"
              className="p-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onReplace(asset);
              }}
              title="Replace image"
            >
              <Icons.RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-gray-600 hover:text-red-600 hover:bg-red-50 shadow-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset);
            }}
            title="Move to recycle bin"
          >
            <Icons.Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bottom-left: Local badge */}
        {local && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100/95 text-amber-800 border border-amber-200 backdrop-blur-sm shadow-xs">
            LOCAL
          </div>
        )}

        {/* Bottom-right: Usage badge overlay */}
        <div className="absolute bottom-2 right-2">
          {isUsed ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-900/85 text-emerald-100 backdrop-blur-sm shadow-xs border border-emerald-500/30">
              <Icons.CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
              <span>Used</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-gray-900/75 text-gray-300 backdrop-blur-sm shadow-xs border border-white/10">
              <span>Unused</span>
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        {/* Title */}
        <p
          className="text-xs font-bold text-gray-900 truncate leading-snug"
          title={asset.displayName || asset.slot || asset.originalFilename}
        >
          {asset.displayName || asset.slot || asset.originalFilename}
        </p>

        {/* CMS Placement Breadcrumb */}
        {isUsed ? (
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium truncate">
            <span className="font-semibold uppercase tracking-wider text-[10px] bg-teal-50 px-1 py-0.2 rounded text-teal-700 shrink-0">
              {pageLabel}
            </span>
            {asset.section && (
              <>
                <span className="text-gray-300">›</span>
                <span className="truncate text-gray-600">{asset.section}</span>
              </>
            )}
            {asset.slot && asset.slot !== asset.displayName && (
              <>
                <span className="text-gray-300">›</span>
                <span className="truncate text-gray-400 text-[10px]">{asset.slot}</span>
              </>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 italic">No CMS section assigned</p>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 text-[11px] text-gray-400">
          <span>{formatBytes(asset.bytes)}</span>
          {asset.width && asset.height && (
            <span>
              {asset.width}×{asset.height}
            </span>
          )}
          {asset.duration && <span>{asset.duration.toFixed(1)}s</span>}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
