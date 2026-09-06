import React, { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import mediaService, { type MediaAsset } from "../../services/media.service";

import MediaCard from "./media/MediaCard";
import MediaFilters from "./media/MediaFilters";
import MediaDetailsDrawer from "./media/MediaDetailsDrawer";
import MediaUploadModal from "./media/MediaUploadModal";
import RecycleBin from "./media/RecycleBin";

// Helper to group assets by Section
function groupAssetsBySection(assets: MediaAsset[]): Record<string, MediaAsset[]> {
  const groups: Record<string, MediaAsset[]> = {};
  assets.forEach(asset => {
    const section = asset.section || "Uncategorized";
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
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all");
  
  // UI State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaAsset | null>(null);

  // Fetch data
  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.list();
      setAssets(data.data.filter(a => !a.deletedAt));
      setDeletedAssets(data.data.filter(a => a.deletedAt));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Filtering Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (selectedPage !== "all") {
        const matchesPage =
          asset.page?.toLowerCase() === selectedPage.toLowerCase() ||
          asset.folder?.toLowerCase().includes(selectedPage.toLowerCase());
        if (!matchesPage) return false;
      }
      if (selectedType !== "all" && asset.resourceType !== selectedType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          asset.displayName?.toLowerCase().includes(q) ||
          asset.originalFilename?.toLowerCase().includes(q) ||
          asset.altText?.toLowerCase().includes(q) ||
          asset.section?.toLowerCase().includes(q) ||
          asset.slot?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assets, selectedPage, selectedType, searchQuery]);

  // Derived Stats
  const stats = useMemo(() => {
    const images = assets.filter(a => a.resourceType === "image").length;
    const videos = assets.filter(a => a.resourceType === "video").length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recent = assets.filter(a => new Date(a.createdAt) > oneWeekAgo).length;
    return { total: assets.length, images, videos, recent };
  }, [assets]);

  // Handlers
  const handleUploadComplete = (newAsset: MediaAsset) => {
    if (replaceTarget) {
      // If we are replacing, the old asset was soft-deleted on the backend.
      // We need to reload everything to get the updated states.
      loadMedia();
      setReplaceTarget(null);
      setSelectedAsset(newAsset);
    } else {
      setAssets(prev => [newAsset, ...prev]);
    }
  };

  const handleUpdated = (updatedAsset: MediaAsset) => {
    setAssets(prev => prev.map(a => a.publicId === updatedAsset.publicId ? updatedAsset : a));
    setSelectedAsset(updatedAsset);
  };

  const handleDeleted = (publicId: string) => {
    const asset = assets.find(a => a.publicId === publicId);
    if (asset) {
      setAssets(prev => prev.filter(a => a.publicId !== publicId));
      setDeletedAssets(prev => [{ ...asset, deletedAt: new Date().toISOString() }, ...prev]);
    }
    setSelectedAsset(null);
  };

  const handleRestored = (asset: MediaAsset) => {
    setDeletedAssets(prev => prev.filter(a => a.publicId !== asset.publicId));
    setAssets(prev => [{ ...asset, deletedAt: null }, ...prev]);
  };

  const handleHardDeleted = (publicId: string) => {
    setDeletedAssets(prev => prev.filter(a => a.publicId !== publicId));
  };

  // Grouping for Display
  const showGrouped = selectedPage !== "all" && filteredAssets.length > 0;
  const groupedAssets = showGrouped ? groupAssetsBySection(filteredAssets) : {};

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
      <div className="px-6 py-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Media Library</h1>
            <p className="text-gray-500 mt-1 text-sm max-w-2xl">Manage every image, video and visual asset used across the Veenero website.</p>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-2 px-5"
            onClick={() => { setReplaceTarget(null); setIsUploadOpen(true); }}
          >
            <Icons.Upload className="h-4 w-4" /> Upload Media
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Assets", val: stats.total, icon: Icons.FolderOpen, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Images",       val: stats.images, icon: Icons.Image,      color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Videos",       val: stats.videos, icon: Icons.Film,       color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Added This Week", val: stats.recent, icon: Icons.Clock,   color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.val}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6 px-2">
          <button
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "library" ? "text-teal-600" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("library")}
          >
            <span className="flex items-center gap-2"><Icons.Library className="h-4 w-4" /> Library <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px]">{assets.length}</span></span>
            {activeTab === "library" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />}
          </button>
          <button
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "recycle-bin" ? "text-teal-600" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("recycle-bin")}
          >
            <span className="flex items-center gap-2"><Icons.Trash2 className="h-4 w-4" /> Recycle Bin <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px]">{deletedAssets.length}</span></span>
            {activeTab === "recycle-bin" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />}
          </button>
        </div>

        {/* Filters */}
        {activeTab === "library" && (
          <MediaFilters 
            search={searchQuery} onSearch={setSearchQuery}
            page={selectedPage} onPage={setSelectedPage}
            type={selectedType} onType={setSelectedType}
            hasActive={!!searchQuery || selectedPage !== "all" || selectedType !== "all"}
            onClear={() => { setSearchQuery(""); setSelectedPage("all"); setSelectedType("all"); }}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-12 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Icons.Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading library...</p>
            </div>
          </div>
        ) : activeTab === "recycle-bin" ? (
          <RecycleBin 
            assets={deletedAssets} 
            onRestore={handleRestored} 
            onHardDelete={handleHardDeleted} 
          />
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Icons.ImageOff className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No assets found</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">
              {assets.length === 0 ? "Your media library is empty. Upload your first asset to get started." : "No assets match your current filters. Try clearing them."}
            </p>
            {assets.length > 0 ? (
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedPage("all"); setSelectedType("all"); }}>
                Clear Filters
              </Button>
            ) : (
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsUploadOpen(true)}>
                <Icons.Upload className="h-4 w-4 mr-2" /> Upload Media
              </Button>
            )}
          </div>
        ) : showGrouped ? (
          // Grouped Display (Page selected)
          <div className="space-y-10">
            {Object.entries(groupedAssets).sort(([a], [b]) => a.localeCompare(b)).map(([section, sectionAssets], idx) => (
              <div key={section} className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                  <div className="h-6 w-1 bg-teal-500 rounded-full" />
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">{section}</h3>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{sectionAssets.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sectionAssets.map(asset => (
                    <MediaCard key={asset.publicId} asset={asset} onClick={setSelectedAsset} onDelete={() => handleDeleted(asset.publicId)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat Display (All pages)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map(asset => (
              <MediaCard key={asset.publicId} asset={asset} onClick={setSelectedAsset} onDelete={() => handleDeleted(asset.publicId)} />
            ))}
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      {isUploadOpen && (
        <MediaUploadModal 
          onClose={() => { setIsUploadOpen(false); setReplaceTarget(null); }} 
          onUploadComplete={handleUploadComplete} 
          replaceTarget={replaceTarget}
        />
      )}

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
    </div>
  );
};

export default MediaLibrary;
