import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import mediaService, { type MediaAsset } from "../../../services/media.service";
import { formatBytes, formatDate } from "./MediaCard";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Props {
  assets: MediaAsset[];
  onRestore: (asset: MediaAsset) => void;
  onHardDelete: (publicId: string) => void;
}

export const RecycleBin: React.FC<Props> = ({
  assets,
  onRestore,
  onHardDelete,
}) => {
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  const handleRestore = async (asset: MediaAsset) => {
    try {
      await mediaService.restore(asset.publicId);
      toast.success("Asset restored successfully");
      onRestore(asset);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Restore failed.");
    }
  };

  const handleHardDeleteConfirm = async () => {
    if (!assetToDelete) return;
    try {
      await mediaService.hardDelete(assetToDelete.publicId);
      toast.success("Asset permanently deleted from Cloudinary & database");
      onHardDelete(assetToDelete.publicId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Permanent delete failed.");
      throw err;
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
          <Icons.Trash2 className="h-7 w-7" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Recycle Bin is Empty</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          When you delete assets from the media library, they are kept here safely so they can be restored at any time.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <Icons.AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Assets in the recycle bin are retained safely and can be restored at any time. Permanent deletion completely purges the file from Cloudinary and the database.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  CMS Page
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Size
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Deleted On
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {asset.resourceType === "video" ? (
                          <Icons.Film className="h-5 w-5 text-gray-400" />
                        ) : (
                          <img
                            src={asset.secureUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-[200px]">
                          {asset.slot || asset.displayName || asset.originalFilename}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {asset.format.toUpperCase()}
                          {asset.section ? ` • ${asset.section}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-200/50">
                      {asset.page || asset.folder}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {formatBytes(asset.bytes)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {asset.deletedAt ? formatDate(asset.deletedAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 text-teal-700 border-teal-200 hover:bg-teal-50"
                        onClick={() => handleRestore(asset)}
                      >
                        <Icons.RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={() => setAssetToDelete(asset)}
                      >
                        <Icons.Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete Forever
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal for Permanent Purging */}
      <DeleteConfirmModal
        asset={assetToDelete}
        isOpen={Boolean(assetToDelete)}
        isPermanent={true}
        onClose={() => setAssetToDelete(null)}
        onConfirm={handleHardDeleteConfirm}
      />
    </>
  );
};

export default RecycleBin;
