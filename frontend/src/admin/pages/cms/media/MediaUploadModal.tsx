import React, { useState, useRef } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import mediaService, { type MediaAsset } from "../../../services/media.service";

interface Props {
  onClose: () => void;
  onUploadComplete: (asset: MediaAsset) => void;
  replaceTarget: MediaAsset | null;
}

export const MediaUploadModal: React.FC<Props> = ({ onClose, onUploadComplete, replaceTarget }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [altText, setAltText] = useState("");
  const [tags, setTags] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from replace target if applicable
  React.useEffect(() => {
    if (replaceTarget) {
      setDisplayName(replaceTarget.displayName || "");
      setAltText(replaceTarget.altText || "");
      setTags(replaceTarget.tags?.join(", ") || "");
    }
  }, [replaceTarget]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      let result: MediaAsset;

      if (replaceTarget) {
        // In-place replacement: atomically updates the existing Media document,
        // preserving page, section, slot, seedKey and all CMS placement metadata.
        // The old Cloudinary asset is deleted server-side after the DB update.
        result = await mediaService.replace(replaceTarget.publicId, {
          file,
          displayName: displayName.trim() || replaceTarget.displayName,
          altText: altText.trim() || replaceTarget.altText,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean).join(",") || replaceTarget.tags?.join(","),
          onProgress: (prog) => setProgress(prog),
        });
      } else {
        // New upload — page/section/slot come from the upload form fields
        result = await mediaService.upload({
          file,
          folder: "general",
          displayName: displayName.trim(),
          altText: altText.trim(),
          tags: tags.split(",").map(t => t.trim()).filter(Boolean).join(","),
          onProgress: (prog) => setProgress(prog),
        });
      }

      toast.success(replaceTarget ? "Asset replaced successfully!" : "Upload complete!");
      onUploadComplete(result);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : replaceTarget ? "Replace failed" : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{replaceTarget ? "Replace Asset" : "Upload Media"}</h2>
            {replaceTarget && (
              <p className="text-xs text-gray-500 mt-0.5">Replacing: {replaceTarget.slot || replaceTarget.displayName}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!file ? (
            <div 
              onDragOver={e => e.preventDefault()} 
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-xl bg-gray-50 hover:bg-teal-50/30 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <Icons.UploadCloud className="h-6 w-6 text-teal-600" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Click or drag file to upload</p>
              <p className="text-xs text-gray-500 mt-1">Images (PNG, JPG, WEBP) or Videos (MP4, WEBM)</p>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {file.type.startsWith("video/") ? <Icons.Film className="h-5 w-5 text-purple-600" /> : <Icons.Image className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-teal-900 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-teal-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-teal-600 hover:text-teal-800 p-2">
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" />

          {file && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Display Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Hero Background Image"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Alt Text (Accessibility)</label>
                <input type="text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Describe the image..."
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Tags (comma-separated)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="about, hero, water"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              
              {replaceTarget && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1">
                  <p className="text-xs font-semibold text-gray-700">CMS Placement Preserved</p>
                  <p className="text-[11px] text-gray-500">This replacement will retain the mapping to <strong>{replaceTarget.page} › {replaceTarget.section} › {replaceTarget.slot}</strong>.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative overflow-hidden"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <Icons.Loader2 className="h-4 w-4 animate-spin" /> {progress}%
              </div>
            ) : "Upload Asset"}
            {uploading && (
              <div className="absolute bottom-0 left-0 h-1 bg-teal-400" style={{ width: `${progress}%`, transition: 'width 0.2s' }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;
