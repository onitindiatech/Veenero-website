import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import mediaService, { type MediaAsset } from "../../../services/media.service";
import { formatBytes, formatDate, isLocal } from "./MediaCard";
import MediaUsagePanel from "./MediaUsagePanel";
import DeleteConfirmModal from "./DeleteConfirmModal";

const PAGE_OPTIONS = [
  { value: "",         label: "None (Unassigned)" },
  { value: "about",    label: "About" },
  { value: "home",     label: "Home" },
  { value: "solutions",label: "Solutions" },
  { value: "approach", label: "Our Approach" },
  { value: "impact",   label: "Impact & ESG" },
  { value: "careers",  label: "Careers" },
  { value: "blog",     label: "Blog / Insights" },
  { value: "contact",  label: "Contact" },
];

const PAGE_LABELS: Record<string, string> = {
  about: "About",
  home: "Home",
  solutions: "Solutions",
  approach: "Our Approach",
  impact: "Impact & ESG",
  careers: "Careers",
  blog: "Blog / Insights",
  contact: "Contact",
};

interface Props {
  asset: MediaAsset;
  onClose: () => void;
  onDeleted: (publicId: string) => void;
  onUpdated: (asset: MediaAsset) => void;
  onReplace: (asset: MediaAsset) => void;
}

export const MediaDetailsDrawer: React.FC<Props> = ({
  asset,
  onClose,
  onDeleted,
  onUpdated,
  onReplace,
}) => {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(asset.displayName || "");
  const [altText, setAltText] = useState(asset.altText || "");
  const [tags, setTags] = useState(asset.tags ? asset.tags.join(", ") : "");
  const [description, setDescription] = useState(asset.description || "");
  const [page, setPage] = useState(asset.page || "");
  const [section, setSection] = useState(asset.section || "");
  const [slot, setSlot] = useState(asset.slot || "");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isVideo = asset.resourceType === "video";
  const local = isLocal(asset);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.secureUrl);
    toast.success("CDN URL copied to clipboard");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await mediaService.updateMetadata(asset.publicId, {
        displayName: displayName.trim(),
        altText: altText.trim(),
        tags: parsedTags,
        description: description.trim(),
        page: page.trim(),
        section: section.trim(),
        slot: slot.trim(),
      });

      toast.success("Metadata updated successfully");
      const updatedAsset: MediaAsset = {
        ...asset,
        displayName: displayName.trim(),
        altText: altText.trim(),
        tags: parsedTags,
        description: description.trim(),
        page: page.trim(),
        section: section.trim(),
        slot: slot.trim(),
      };
      onUpdated(updatedAsset);
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update metadata.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await mediaService.softDelete(asset.publicId);
      toast.success("Asset moved to recycle bin");
      onDeleted(asset.publicId);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete asset.");
      throw err;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex" onClick={onClose}>
        <div className="flex-1 bg-black/40 backdrop-blur-xs" />
        <div
          className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-base font-bold text-gray-900">Asset Overview</h2>
              <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                {asset.slot || asset.displayName || asset.originalFilename}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>

          {/* Local asset notice */}
          {local && (
            <div className="mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
              <Icons.HardDrive className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Local Static Asset</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  This asset is bundled locally with the site. Click <strong>Replace</strong> to upload an updated version directly to Cloudinary CDN.
                </p>
              </div>
            </div>
          )}

          {/* Preview Canvas */}
          <div className="w-full aspect-video bg-gray-950 flex items-center justify-center overflow-hidden relative">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                    <Icons.Play className="h-6 w-6 text-white fill-white ml-0.5" />
                  </div>
                  <p className="text-gray-300 text-xs font-semibold">{asset.originalFilename}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {asset.duration ? `${asset.duration.toFixed(1)}s • ` : ""}
                    {asset.format.toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={asset.secureUrl}
                alt={asset.altText || asset.displayName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231f2937"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" fill="%239ca3af"%3EPreview unavailable%3C/text%3E%3C/svg%3E';
                }}
              />
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
            <Button
              size="sm"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs h-9"
              onClick={() => onReplace(asset)}
            >
              <Icons.RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Replace Asset
            </Button>
            {!local && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-9"
                onClick={handleCopyUrl}
                title="Copy Cloudinary CDN URL"
              >
                <Icons.Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy URL
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-9 text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={() => setShowDeleteModal(true)}
            >
              <Icons.Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>

          {/* Content Sections */}
          <div className="flex-1 px-6 py-5 space-y-6">
            {/* 1. Live CMS Usage Scanner */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Where It Is Used
              </h3>
              <MediaUsagePanel publicId={asset.publicId} />
            </div>

            {/* 2. Metadata & CMS Placement Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  CMS Configuration & Metadata
                </h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  onClick={() => setEditing(!editing)}
                >
                  <Icons.Pencil className="h-3 w-3" />
                  {editing ? "Cancel Edit" : "Edit Details"}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3.5 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Assigned Page
                    </label>
                    <select
                      value={page}
                      onChange={(e) => setPage(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    >
                      {PAGE_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Section
                      </label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="e.g. Hero Section"
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Slot Name
                      </label>
                      <input
                        type="text"
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        placeholder="e.g. Hero Visual"
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Aqua Saver Product Overview"
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe what is seen in the image"
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="water, telemetry, industrial"
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Internal Admin Notes
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Optional notes for other administrators..."
                      className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                    />
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs h-9 mt-2"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-1.5">
                        <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ) : (
                <dl className="space-y-2.5 text-xs bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 font-semibold text-gray-500">Assigned Page</dt>
                    <dd className="font-semibold text-gray-900">
                      {asset.page ? PAGE_LABELS[asset.page.toLowerCase()] || asset.page : "—"}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 font-semibold text-gray-500">Section</dt>
                    <dd className="text-gray-800">{asset.section || "—"}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 font-semibold text-gray-500">Slot</dt>
                    <dd className="text-gray-800">{asset.slot || "—"}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 font-semibold text-gray-500">Alt Text</dt>
                    <dd className="text-gray-800">{asset.altText || "None"}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 font-semibold text-gray-500">Tags</dt>
                    <dd className="text-gray-800">
                      {asset.tags && asset.tags.length ? asset.tags.join(", ") : "None"}
                    </dd>
                  </div>
                  {asset.description && (
                    <div className="flex gap-3">
                      <dt className="w-24 shrink-0 font-semibold text-gray-500">Notes</dt>
                      <dd className="text-gray-700 italic">{asset.description}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            {/* 3. Technical File Details */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Technical Specifications
              </h3>
              <dl className="space-y-2 text-xs bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 font-semibold text-gray-500">Dimensions</dt>
                  <dd className="text-gray-800">
                    {asset.width && asset.height
                      ? `${asset.width} × ${asset.height} px`
                      : asset.duration
                      ? `${asset.duration.toFixed(1)}s`
                      : "—"}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 font-semibold text-gray-500">File Size</dt>
                  <dd className="text-gray-800">{formatBytes(asset.bytes)}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 font-semibold text-gray-500">Format</dt>
                  <dd className="text-gray-800 uppercase">{asset.format}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 font-semibold text-gray-500">Uploaded</dt>
                  <dd className="text-gray-800">{formatDate(asset.createdAt)}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 font-semibold text-gray-500">Public ID</dt>
                  <dd className="text-gray-600 font-mono text-[10px] break-all">{asset.publicId}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        asset={asset}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default MediaDetailsDrawer;
