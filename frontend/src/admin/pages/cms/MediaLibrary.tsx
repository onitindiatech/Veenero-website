import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import mediaService, {
  type MediaAsset,
  type MediaStats,
} from "../../services/media.service";

import MediaCard from "./media/MediaCard";
import MediaFilters from "./media/MediaFilters";
import MediaDetailsDrawer from "./media/MediaDetailsDrawer";
import MediaUploadModal from "./media/MediaUploadModal";
import RecycleBin from "./media/RecycleBin";
import DeleteConfirmModal from "./media/DeleteConfirmModal";

// Helper to group assets by Section
function groupAssetsBySection(assets: MediaAsset[]): Record<string, MediaAsset[]> {
  const groups: Record<string, MediaAsset[]> = {};
  assets.forEach((asset) => {
    const section = asset.section || "General / Uncategorized";
    if (!groups[section]) groups[section] = [];
    groups[section].push(asset);
  });
  return groups;
}

export const MediaLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"library" | "recycle-bin">("library");

  // Data State
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [deletedAssets, setDeletedAssets] = useState<MediaAsset[]>([]);
  const [backendStats, setBackendStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all");
  const [selectedUsage, setSelectedUsage] = useState<"all" | "used" | "unused">("all");
  const [selectedSort, setSelectedSort] = useState<"newest" | "oldest" | "name">("newest");

  // UI State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  // Fetch data
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await mediaService.list({
        folder: selectedPage !== "all" ? selectedPage : undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        search: searchQuery.trim() || undefined,
        usage: selectedUsage !== "all" ? selectedUsage : undefined,
        sort: selectedSort,
      });

      // Also fetch deleted assets count
      const deletedRes = await mediaService.list({ deleted: true });

      setAssets(res.data.filter((a) => !a.deletedAt));
      setDeletedAssets(deletedRes.data || []);
      setBackendStats(res.stats);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load media assets");
    } finally {
      setLoading(false);
    }
  }, [selectedPage, selectedType, searchQuery, selectedUsage, selectedSort]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // Derived Stats
  const displayStats = useMemo(() => {
    if (backendStats) return backendStats;
    const images = assets.filter((a) => a.resourceType === "image").length;
    const videos = assets.filter((a) => a.resourceType === "video").length;
    const used = assets.filter((a) => Boolean(a.page && a.page.trim())).length;
    return {
      total: assets.length,
      images,
      videos,
      used,
      unused: assets.length - used,
      recentlyAdded: 0,
    };
  }, [backendStats, assets]);

  // Handlers
  const handleUploadComplete = (newAsset: MediaAsset) => {
    if (replaceTarget) {
      loadMedia();
      setReplaceTarget(null);
      setSelectedAsset(newAsset);
    } else {
      setAssets((prev) => [newAsset, ...prev]);
      loadMedia();
    }
  };

  const handleUpdated = (updatedAsset: MediaAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a.publicId === updatedAsset.publicId ? updatedAsset : a))
    );
    setSelectedAsset(updatedAsset);
  };

  const handleDeleted = (publicId: string) => {
    const asset = assets.find((a) => a.publicId === publicId);
    if (asset) {
      setAssets((prev) => prev.filter((a) => a.publicId !== publicId));
      setDeletedAssets((prev) => [
        { ...asset, deletedAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    if (selectedAsset?.publicId === publicId) {
      setSelectedAsset(null);
    }
  };

  const handleRestored = (restoredAsset: MediaAsset) => {
    setDeletedAssets((prev) => prev.filter((a) => a.publicId !== restoredAsset.publicId));
    setAssets((prev) => [{ ...restoredAsset, deletedAt: null }, ...prev]);
    loadMedia();
  };

  const handleHardDeleted = (publicId: string) => {
    setDeletedAssets((prev) => prev.filter((a) => a.publicId !== publicId));
  };

  const confirmDeleteAsset = async () => {
    if (!assetToDelete) return;
    try {
      await mediaService.softDelete(assetToDelete.publicId);
      toast.success("Asset moved to recycle bin");
      handleDeleted(assetToDelete.publicId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete asset");
      throw err;
    }
  };

  // Grouping for Section-based Display when a specific page is selected
  const showGrouped = selectedPage !== "all" && assets.length > 0;
  const groupedAssets = showGrouped ? groupAssetsBySection(assets) : {};

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedPage !== "all" ||
    selectedType !== "all" ||
    selectedUsage !== "all" ||
    selectedSort !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPage("all");
    setSelectedType("all");
    setSelectedUsage("all");
    setSelectedSort("newest");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/40">
      <div className="px-6 py-6 pb-4">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Media Library</h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60">
                Production CMS
              </span>
            </div>
            <p className="text-gray-500 mt-1 text-sm max-w-2xl">
              Centralized Cloudinary media management. Track live CMS usage, replace website visual assets in-place, and organize visual content across all pages.
            </p>
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-2 px-4 h-9 text-xs font-semibold shrink-0"
            onClick={() => {
              setReplaceTarget(null);
              setIsUploadOpen(true);
            }}
          >
            <Icons.Upload className="h-4 w-4" />
            Upload Media
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            {
              label: "Total Assets",
              val: displayStats.total,
              icon: Icons.FolderOpen,
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "Images",
              val: displayStats.images,
              icon: Icons.Image,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Videos",
              val: displayStats.videos,
              icon: Icons.Film,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Used in CMS",
              val: displayStats.used,
              icon: Icons.CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Unused Assets",
              val: displayStats.unused,
              icon: Icons.HelpCircle,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3.5 border border-gray-200/70 shadow-xs flex items-center gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-tight">{stat.val}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-4 px-1">
          <button
            type="button"
            className={`pb-3 text-xs font-bold transition-colors relative flex items-center gap-2 ${
              activeTab === "library"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("library")}
          >
            <Icons.Library className="h-4 w-4" />
            <span>Active Media</span>
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-semibold">
              {assets.length}
            </span>
            {activeTab === "library" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />
            )}
          </button>
          <button
            type="button"
            className={`pb-3 text-xs font-bold transition-colors relative flex items-center gap-2 ${
              activeTab === "recycle-bin"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("recycle-bin")}
          >
            <Icons.Trash2 className="h-4 w-4" />
            <span>Recycle Bin</span>
            {deletedAssets.length > 0 && (
              <span className="bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-[10px] font-semibold">
                {deletedAssets.length}
              </span>
            )}
            {activeTab === "recycle-bin" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Filters Toolbar */}
        {activeTab === "library" && (
          <MediaFilters
            search={searchQuery}
            onSearch={setSearchQuery}
            page={selectedPage}
            onPage={setSelectedPage}
            type={selectedType}
            onType={setSelectedType}
            usage={selectedUsage}
            onUsage={setSelectedUsage}
            sort={selectedSort}
            onSort={setSelectedSort}
            hasActive={hasActiveFilters}
            onClear={clearFilters}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-12 min-h-0">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-3 space-y-3 animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-lg" />
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : activeTab === "recycle-bin" ? (
          <RecycleBin
            assets={deletedAssets}
            onRestore={handleRestored}
            onHardDelete={handleHardDeleted}
          />
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 text-gray-400">
              <Icons.ImageOff className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No assets found</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-5">
              {hasActiveFilters
                ? "No media assets match your active filters. Try clearing or broadening your search criteria."
                : "Your media library is empty. Upload your first asset to get started."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={clearFilters}
              >
                Reset All Filters
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs"
                onClick={() => setIsUploadOpen(true)}
              >
                <Icons.Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload First Asset
              </Button>
            )}
          </div>
        ) : showGrouped ? (
          // Grouped Display (Specific Page Selected)
          <div className="space-y-8">
            {Object.entries(groupedAssets)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([section, sectionAssets]) => (
                <div key={section}>
                  <div className="flex items-center gap-2.5 mb-3 border-b border-gray-100 pb-2">
                    <div className="h-4 w-1 bg-teal-500 rounded-full" />
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {section}
                    </h3>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/50">
                      {sectionAssets.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {sectionAssets.map((asset) => (
                      <MediaCard
                        key={asset.publicId}
                        asset={asset}
                        onClick={setSelectedAsset}
                        onDelete={(a) => setAssetToDelete(a)}
                        onReplace={(a) => {
                          setReplaceTarget(a);
                          setIsUploadOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // Flat Display (All Pages / General View)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map((asset) => (
              <MediaCard
                key={asset.publicId}
                asset={asset}
                onClick={setSelectedAsset}
                onDelete={(a) => setAssetToDelete(a)}
                onReplace={(a) => {
                  setReplaceTarget(a);
                  setIsUploadOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload / Replace Modal */}
      {isUploadOpen && (
        <MediaUploadModal
          onClose={() => {
            setIsUploadOpen(false);
            setReplaceTarget(null);
          }}
          onUploadComplete={handleUploadComplete}
          replaceTarget={replaceTarget}
        />
      )}

      {/* Asset Details Drawer */}
      {selectedAsset && (
        <MediaDetailsDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          onReplace={(asset) => {
            setReplaceTarget(asset);
            setSelectedAsset(null);
            setIsUploadOpen(true);
          }}
        />
      )}

      {/* Usage-Aware Delete Confirmation Modal */}
      <DeleteConfirmModal
        asset={assetToDelete}
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        onConfirm={confirmDeleteAsset}
      />
    </div>
  );
};

export default MediaLibrary;
