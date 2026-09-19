import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import mediaService, { type MediaAsset, type MediaUsageData } from "../../../services/media.service";
import { formatBytes } from "./MediaCard";

interface Props {
  asset: MediaAsset | null;
  isOpen: boolean;
  isPermanent?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  asset,
  isOpen,
  isPermanent = false,
  onClose,
  onConfirm,
}) => {
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [usageData, setUsageData] = useState<MediaUsageData | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || !asset) {
      setUsageData(null);
      return;
    }

    let mounted = true;
    setLoadingUsage(true);

    mediaService
      .getUsage(asset.publicId)
      .then((data) => {
        if (mounted) {
          setUsageData(data);
          setLoadingUsage(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoadingUsage(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  const usageCount = usageData?.usageCount || 0;
  const isUsed = usageCount > 0;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isUsed ? "bg-amber-100 text-amber-600" : "bg-red-50 text-red-600"
              }`}
            >
              <Icons.AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isPermanent ? "Permanently Delete Asset" : "Move to Recycle Bin"}
              </h3>
              <p className="text-xs text-gray-500">
                {isPermanent
                  ? "This action cannot be undone."
                  : "Assets can be restored from Recycle Bin."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Asset Summary Card */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden shrink-0">
              {asset.resourceType === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <Icons.Film className="h-6 w-6" />
                </div>
              ) : (
                <img
                  src={asset.secureUrl}
                  alt={asset.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3C/svg%3E';
                  }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {asset.slot || asset.displayName || asset.originalFilename}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatBytes(asset.bytes)} • {asset.format.toUpperCase()}
                {asset.page ? ` • ${asset.page}` : ""}
              </p>
            </div>
          </div>

          {/* Usage Status */}
          {loadingUsage ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
              <Icons.Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <p className="text-xs text-gray-600">Checking if this image is used on the website...</p>
            </div>
          ) : isUsed ? (
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Icons.AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    This asset is in use ({usageCount} location{usageCount > 1 ? "s" : ""})
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Deleting or removing this asset may cause missing images on live pages:
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pl-7 max-h-36 overflow-y-auto">
                {usageData?.usages.map((u, i) => (
                  <div
                    key={i}
                    className="text-[11px] bg-white/80 p-2 rounded-lg border border-amber-200/60 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">{u.entity}</span>
                      <span className="text-gray-400 mx-1">›</span>
                      <span className="text-gray-600">{u.section}</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded uppercase">
                      {u.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <Icons.CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Safe to Delete</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  This asset is not linked to any active CMS sections or pages. Deleting it will not affect the website.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={deleting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={deleting || loadingUsage}
            className={`text-xs text-white ${
              isUsed
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? (
              <span className="flex items-center gap-1.5">
                <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </span>
            ) : isUsed ? (
              "Delete Anyway"
            ) : isPermanent ? (
              "Delete Permanently"
            ) : (
              "Move to Recycle Bin"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
