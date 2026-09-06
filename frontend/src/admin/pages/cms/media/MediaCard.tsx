import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "../../../services/media.service";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function isLocal(asset: MediaAsset): boolean {
  return (asset.publicId || "").startsWith("local:");
}

interface MediaCardProps {
  asset: MediaAsset;
  onClick: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ asset, onClick, onDelete }) => {
  const isVideo = asset.resourceType === "video";
  const local = isLocal(asset);

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onClick(asset)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden flex-shrink-0">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icons.Play className="h-5 w-5 text-white fill-white ml-1" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{asset.format.toUpperCase()}</span>
            </div>
          </div>
        ) : (
          <img
            src={asset.secureUrl}
            alt={asset.altText || asset.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-size="11" text-anchor="middle" fill="%239ca3af"%3ENo preview%3C/text%3E%3C/svg%3E';
            }}
          />
        )}

        {/* Type badge */}
        <div className={cn(
          "absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          isVideo ? "bg-purple-500/90 text-white" : local ? "bg-amber-500/90 text-white" : "bg-teal-500/90 text-white"
        )}>
          {isVideo ? "VIDEO" : "IMAGE"}
        </div>

        {/* Local badge */}
        {local && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
            LOCAL
          </div>
        )}

        {/* Delete button */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-sm"
          onClick={(e) => { e.stopPropagation(); onDelete(asset); }}
          title="Move to recycle bin"
        >
          <Icons.Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight" title={asset.displayName}>
          {asset.slot || asset.displayName || asset.originalFilename}
        </p>
        {asset.section && (
          <p className="text-[11px] text-gray-500 truncate">{asset.section}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="text-[11px] text-gray-400">{formatBytes(asset.bytes)}</span>
          {asset.width && asset.height && (
            <span className="text-[11px] text-gray-400">{asset.width}×{asset.height}</span>
          )}
          {asset.duration && (
            <span className="text-[11px] text-gray-400">{asset.duration.toFixed(1)}s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
