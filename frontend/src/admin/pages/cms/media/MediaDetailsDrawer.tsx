import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import mediaService, { type MediaAsset } from "../../../services/media.service";
import { formatBytes, formatDate, isLocal } from "./MediaCard";

const PAGE_LABELS: Record<string, string> = {
  about: "About", home: "Home", solutions: "Solutions",
  approach: "Our Approach", impact: "Impact", careers: "Careers",
  blog: "Blog / Insights", contact: "Contact",
};

interface Props {
  asset: MediaAsset;
  onClose: () => void;
  onDeleted: (publicId: string) => void;
  onUpdated: (asset: MediaAsset) => void;
  onReplace: (asset: MediaAsset) => void;
}

export const MediaDetailsDrawer: React.FC<Props> = ({ asset, onClose, onDeleted, onUpdated, onReplace }) => {
  const [editing, setEditing]           = useState(false);
  const [displayName, setDisplayName]   = useState(asset.displayName);
  const [altText, setAltText]           = useState(asset.altText);
  const [tags, setTags]                 = useState(asset.tags.join(", "));
  const [description, setDescription]  = useState(asset.description || "");
  const [saving, setSaving]             = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isVideo = asset.resourceType === "video";
  const local = isLocal(asset);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.secureUrl);
    toast.success("URL copied to clipboard");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await mediaService.updateMetadata(asset.publicId, {
        displayName: displayName.trim(),
        altText: altText.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        description: description.trim(),
      } as Parameters<typeof mediaService.updateMetadata>[1]);
      toast.success("Metadata updated successfully");
      onUpdated({ ...asset, displayName: displayName.trim(), altText: altText.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean), description: description.trim() });
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update metadata.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await mediaService.softDelete(asset.publicId);
      toast.success("Asset moved to recycle bin");
      onDeleted(asset.publicId);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete asset.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30 backdrop-blur-sm" />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">Asset Details</h2>
            {asset.section && asset.slot && (
              <p className="text-[11px] text-teal-600 font-medium mt-0.5">
                {PAGE_LABELS[asset.page || ""] || asset.page} › {asset.section} › {asset.slot}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Local asset notice */}
        {local && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <Icons.HardDrive className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Local Asset</p>
              <p className="text-xs text-amber-700 mt-0.5">
                This asset is bundled by Vite and served locally. Use <strong>Replace</strong> to upload it to Cloudinary and make it CDN-backed.
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <Icons.Film className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">{asset.originalFilename}</p>
                <p className="text-gray-500 text-xs mt-1">{asset.duration ? `${asset.duration.toFixed(1)}s` : ""} {asset.format.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            <img
              src={asset.secureUrl}
              alt={asset.altText || asset.displayName}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-size="11" text-anchor="middle" fill="%239ca3af"%3ENo preview%3C/text%3E%3C/svg%3E';
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 py-4 border-b border-gray-50">
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => onReplace(asset)}>
            <Icons.RefreshCw className="h-3.5 w-3.5 mr-1.5" />Replace
          </Button>
          {!local && (
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={handleCopyUrl}>
              <Icons.Copy className="h-3.5 w-3.5 mr-1.5" />Copy URL
            </Button>
          )}
          {!confirmDelete ? (
            <Button size="sm" variant="outline" className="flex-1 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => setConfirmDelete(true)}>
              <Icons.Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete
            </Button>
          ) : (
            <Button size="sm" className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>
              <Icons.AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Confirm
            </Button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex-1 px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Metadata</h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1" onClick={() => setEditing(!editing)}>
              <Icons.Pencil className="h-3 w-3" />{editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              {[
                { label: "Display Name", val: displayName, set: setDisplayName },
                { label: "Alt Text", val: altText, set: setAltText },
                { label: "Tags (comma-separated)", val: tags, set: setTags },
                { label: "Description", val: description, set: setDescription },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input type="text" value={val} onChange={(e) => set(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              ))}
              <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <dl className="space-y-3 text-sm">
              {[
                { label: "Slot",        value: asset.slot       || "—" },
                { label: "Section",     value: asset.section    || "—" },
                { label: "Page",        value: asset.page ? (PAGE_LABELS[asset.page] || asset.page) : "—" },
                { label: "Type",        value: asset.resourceType.toUpperCase() + " / " + asset.format.toUpperCase() },
                { label: "Size",        value: formatBytes(asset.bytes) },
                { label: "Dimensions",  value: asset.width && asset.height ? `${asset.width} × ${asset.height}px` : (asset.duration ? `${asset.duration.toFixed(1)}s` : "—") },
                { label: "Alt Text",    value: asset.altText    || "None" },
                { label: "Tags",        value: asset.tags.length ? asset.tags.join(", ") : "None" },
                { label: "Description", value: asset.description || "—" },
                { label: "Uploaded",    value: formatDate(asset.createdAt) },
                { label: "Status",      value: local ? "Local (not on Cloudinary)" : "Cloudinary CDN" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-24 flex-shrink-0 text-xs font-semibold text-gray-500 pt-0.5">{label}</dt>
                  <dd className="flex-1 text-gray-800 break-all text-sm">{value}</dd>
                </div>
              ))}
              {!local && (
                <div className="flex gap-3">
                  <dt className="w-24 flex-shrink-0 text-xs font-semibold text-gray-500 pt-0.5">CDN URL</dt>
                  <dd className="flex-1 min-w-0">
                    <a href={asset.secureUrl} target="_blank" rel="noreferrer"
                      className="text-teal-600 hover:text-teal-700 text-xs break-all underline decoration-dotted">
                      {asset.secureUrl.substring(0, 55)}...
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsDrawer;
