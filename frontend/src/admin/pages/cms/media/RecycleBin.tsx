import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import mediaService, { type MediaAsset } from '../../../services/media.service';
import { formatBytes, formatDate } from './MediaCard';

interface Props {
  assets: MediaAsset[];
  onRestored: (publicId: string) => void;
  onPermanentlyDeleted: (publicId: string) => void;
}

export const RecycleBin: React.FC<Props> = ({ assets, onRestored, onPermanentlyDeleted }) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleRestore = async (asset: MediaAsset) => {
    try {
      await mediaService.restore(asset.publicId);
      toast.success('Asset restored successfully');
      onRestored(asset.publicId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Restore failed.');
    }
  };

  const handleHardDelete = async (asset: MediaAsset) => {
    try {
      await mediaService.hardDelete(asset.publicId);
      toast.success('Asset permanently deleted');
      onPermanentlyDeleted(asset.publicId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Permanent delete failed.');
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Icons.Trash2 className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-600">Recycle bin is empty</p>
        <p className="text-xs text-gray-400 mt-1">Deleted assets will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Icons.AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Assets in the recycle bin are soft-deleted and can be restored at any time. Permanent deletion will remove them permanently.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Page</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Deleted</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {asset.resourceType === 'video'
                        ? <Icons.Film className="h-5 w-5 text-gray-400" />
                        : <Icons.Image className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate max-w-[160px]">{asset.displayName || asset.originalFilename}</p>
                      <p className="text-xs text-gray-400">{asset.format.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                    {asset.page || asset.folder}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatBytes(asset.bytes)}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                  {asset.deletedAt ? formatDate(asset.deletedAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 text-teal-600 border-teal-200 hover:bg-teal-50"
                      onClick={() => handleRestore(asset)}
                    >
                      <Icons.RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Restore
                    </Button>
                    {confirmId !== asset.id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setConfirmId(asset.id)}
                      >
                        <Icons.Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" className="text-xs h-8 bg-red-500 hover:bg-red-600 text-white px-2" onClick={() => { handleHardDelete(asset); setConfirmId(null); }}>
                          Delete forever
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8 px-2" onClick={() => setConfirmId(null)}>
                          <Icons.X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecycleBin;
