import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import mediaService, { MediaAsset } from '../../services/media.service';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
  resourceType?: 'image' | 'video' | 'all';
  initialFolder?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media from Library',
  resourceType = 'all',
  initialFolder = 'about',
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [folderFilter, setFolderFilter] = useState<string>(initialFolder);
  const [typeFilter, setTypeFilter] = useState<'image' | 'video' | 'all'>(resourceType);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, folderFilter, typeFilter]);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mediaService.list({
        folder: folderFilter === 'all' ? undefined : folderFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
      });
      setAssets(res.data.filter((a) => !a.deletedAt));
    } catch (err: any) {
      setError(err.message || 'Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      asset.displayName?.toLowerCase().includes(q) ||
      asset.originalFilename?.toLowerCase().includes(q) ||
      asset.slot?.toLowerCase().includes(q) ||
      asset.section?.toLowerCase().includes(q) ||
      asset.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-5xl h-[85vh] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center shadow-xs">
              <Icons.Image className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
              <p className="text-xs text-muted-foreground">Select an existing verified Cloudinary asset or browse folders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-border bg-muted/10 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, slot, section or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Folder / Page Selector */}
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-background border border-border/70 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-foreground"
            >
              <option value="all">All Pages / Folders</option>
              <option value="about">About Page</option>
              <option value="home">Home Page</option>
              <option value="blog">Blog</option>
              <option value="careers">Careers</option>
              <option value="general">General</option>
            </select>

            {/* Resource Type */}
            <div className="flex bg-muted rounded-xl p-0.5 border border-border/50">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('image')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'image'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Images
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('video')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'video'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Videos
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid / Content Area */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-muted/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-3">
              <Icons.Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-xs font-medium">Loading media assets...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto my-12">
              <Icons.AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
              <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={loadMedia}>
                Retry
              </Button>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Icons.ImageOff className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">No media assets found</p>
              <p className="text-xs mt-1">Try adjusting your search query or folder filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.publicId === asset.publicId;
                const isVideo = asset.resourceType === 'video';

                return (
                  <div
                    key={asset.publicId}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-card transition-all duration-200 flex flex-col ${
                      isSelected
                        ? 'border-teal-500 ring-2 ring-teal-500/40 shadow-glow'
                        : 'border-border/60 hover:border-border hover:shadow-card'
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                      {isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 relative">
                          <video
                            src={asset.secureUrl}
                            className="w-full h-full object-cover opacity-80"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Icons.PlayCircle className="w-8 h-8 text-white/90 drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={asset.secureUrl}
                          alt={asset.displayName || asset.originalFilename}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      {/* Selection Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                          <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Format Badge */}
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white uppercase tracking-wider">
                        {asset.format || (isVideo ? 'MP4' : 'IMG')}
                      </span>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <p className="text-xs font-bold text-foreground truncate" title={asset.displayName || asset.originalFilename}>
                          {asset.displayName || asset.originalFilename}
                        </p>
                        {asset.slot && (
                          <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold truncate mt-0.5">
                            {asset.slot}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 pt-1 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground font-medium">
                        <span>{asset.width && asset.height ? `${asset.width}×${asset.height}` : isVideo ? 'Video' : 'Asset'}</span>
                        <span className="capitalize">{asset.page || asset.folder}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-xs text-muted-foreground truncate max-w-md">
            {selectedAsset ? (
              <span>
                Selected: <strong className="text-foreground">{selectedAsset.displayName || selectedAsset.originalFilename}</strong>
              </span>
            ) : (
              <span>Click on any media card above to select it</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelect(selectedAsset);
                  onClose();
                }
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-5 shadow-xs font-semibold"
            >
              Use Selected Media
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MediaPickerModal;
