import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import mediaService, { type MediaAsset } from "../../../services/media.service";

const PAGE_OPTIONS = [
  { value: "shared",    label: "Shared / General Asset" },
  { value: "about",     label: "About Us" },
  { value: "home",      label: "Homepage" },
  { value: "solutions", label: "Solutions" },
  { value: "approach",  label: "Our Approach" },
  { value: "impact",    label: "Impact & ESG" },
  { value: "careers",   label: "Careers" },
  { value: "blog",      label: "Blog & Insights" },
  { value: "contact",   label: "Contact" },
];

interface Props {
  onClose: () => void;
  onUploadComplete: (asset: MediaAsset) => void;
  replaceTarget: MediaAsset | null;
}

export const MediaUploadModal: React.FC<Props> = ({
  onClose,
  onUploadComplete,
  replaceTarget,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [altText, setAltText] = useState("");
  const [tags, setTags] = useState("");
  const [page, setPage] = useState("shared");
  const [section, setSection] = useState("");
  const [slot, setSlot] = useState("");
  const [description, setDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from replace target if applicable
  useEffect(() => {
    if (replaceTarget) {
      setDisplayName(replaceTarget.displayName || "");
      setAltText(replaceTarget.altText || "");
      setTags(replaceTarget.tags?.join(", ") || "");
      setPage(replaceTarget.page || "shared");
      setSection(replaceTarget.section || "");
      setSlot(replaceTarget.slot || "");
      setDescription(replaceTarget.description || "");
    }
  }, [replaceTarget]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!displayName && !replaceTarget) {
        // Auto-populate displayName from file name (without extension)
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setDisplayName(nameWithoutExt);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      if (!displayName && !replaceTarget) {
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setDisplayName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      let result: MediaAsset;

      if (replaceTarget) {
        // In-place replacement: updates existing doc and cleans up old Cloudinary asset
        result = await mediaService.replace(replaceTarget.publicId, {
          file,
          displayName: displayName.trim() || replaceTarget.displayName,
          altText: altText.trim() || replaceTarget.altText,
          tags:
            tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .join(",") || replaceTarget.tags?.join(","),
          onProgress: (prog) => setProgress(prog),
        });
      } else {
        // New upload with full CMS context
        const folder = page === "shared" ? "shared" : `veenero/${page}`;
        result = await mediaService.upload({
          file,
          folder,
          displayName: displayName.trim() || file.name,
          altText: altText.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .join(","),
          page: page === "shared" ? "" : page,
          section: section.trim(),
          slot: slot.trim(),
          description: description.trim(),
          onProgress: (prog) => setProgress(prog),
        });
      }

      toast.success(replaceTarget ? "Asset replaced successfully!" : "Asset uploaded successfully!");
      onUploadComplete(result);
      onClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : replaceTarget
          ? "Replace failed"
          : "Upload failed"
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {replaceTarget ? "Replace Website Image" : "Upload New Media"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {replaceTarget
                ? `In-place swap for: ${replaceTarget.slot || replaceTarget.displayName}`
                : "Upload an image or video with optional CMS placement"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Replace Context Banner */}
          {replaceTarget && (
            <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-3 flex items-start gap-2.5">
              <Icons.Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-900">
                <p className="font-semibold">Automatic Website Sync</p>
                <p className="text-teal-700 text-[11px] mt-0.5">
                  Replacing this asset updates the live website immediately while preserving the
                  existing placement:{" "}
                  <strong>
                    {replaceTarget.page} › {replaceTarget.section || "General"} ›{" "}
                    {replaceTarget.slot || "Visual"}
                  </strong>
                  .
                </p>
              </div>
            </div>
          )}

          {/* File Picker / Dropzone */}
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-xl bg-gray-50/50 hover:bg-teal-50/30 flex flex-col items-center justify-center cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-2 text-teal-600">
                <Icons.UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-gray-700">Click or drag file to choose</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Images up to 10 MB (PNG, JPG, WEBP) • Videos up to 50 MB (MP4, WEBM)
              </p>
            </div>
          ) : (
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-xs">
                  {file.type.startsWith("video/") ? (
                    <Icons.Film className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Icons.Image className="h-5 w-5 text-teal-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-teal-900 truncate max-w-[240px]">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-teal-700">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "file"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-teal-700 hover:text-teal-900 p-1.5 rounded-lg hover:bg-teal-100/50 transition-colors"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
          />

          {/* Form Fields */}
          <div className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Display Title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Hero Background Diagram"
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            {/* CMS Placement section (only when not replacing, or editable) */}
            {!replaceTarget && (
              <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-150 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                  <Icons.Layout className="h-3.5 w-3.5 text-teal-600" />
                  <span>CMS Placement (Where will this be used?)</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
                    Website Page
                  </label>
                  <select
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  >
                    {PAGE_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
                      Section Name
                    </label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="e.g. Hero Section"
                      className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
                      Slot Identifier
                    </label>
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      placeholder="e.g. Hero Visual"
                      className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Alt Text (SEO & Accessibility)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe image content for accessibility"
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="solutions, iot, dashboard"
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            {!replaceTarget && (
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Admin Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Context for team members..."
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden shadow-xs"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading {progress > 0 ? `${progress}%` : "..."}
              </span>
            ) : replaceTarget ? (
              "Replace & Update Asset"
            ) : (
              "Upload Asset"
            )}
            {uploading && progress > 0 && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-teal-300 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;
