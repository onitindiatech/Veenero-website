import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import mediaService, { type MediaUsageData, type MediaUsageEntry } from "../../../services/media.service";

interface Props {
  publicId: string;
}

const PAGE_NAMES: Record<string, string> = {
  about: "About Us",
  home: "Homepage",
  solutions: "Solutions",
  approach: "Our Approach",
  impact: "Impact & ESG",
  careers: "Careers",
  blog: "Blog & Insights",
  contact: "Contact",
};

export const MediaUsagePanel: React.FC<Props> = ({ publicId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MediaUsageData | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    mediaService
      .getUsage(publicId)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load usage data");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [publicId]);

  if (loading) {
    return (
      <div className="space-y-2 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Icons.Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
          <span>Scanning CMS usage...</span>
        </div>
        <div className="h-16 bg-gray-50 animate-pulse rounded-lg border border-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
        <Icons.AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Unable to scan usage</p>
          <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  const usages = data?.usages || [];
  const count = data?.usageCount || 0;

  if (count === 0) {
    return (
      <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
          <Icons.CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-900">Unreferenced Asset</p>
          <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
            No CMS sections or database records currently reference this image. It can be safely modified or deleted without breaking live pages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[11px] font-bold">
            {count}
          </span>
          <span className="text-xs font-semibold text-gray-800">
            Active Placement{count > 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
          Referenced in CMS
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {usages.map((u: MediaUsageEntry, idx: number) => {
          const pageName = PAGE_NAMES[u.page.toLowerCase()] || u.page;
          return (
            <div
              key={idx}
              className="p-3 bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100 rounded-xl flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/50">
                  {pageName}
                </span>
                {u.route && (
                  <Link
                    to={u.route}
                    className="text-[11px] font-medium text-teal-600 hover:text-teal-800 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Edit in CMS</span>
                    <Icons.ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900 leading-snug">{u.entity}</p>
                <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 flex-wrap">
                  <span className="text-gray-700 font-medium">{u.section}</span>
                  {u.field && (
                    <>
                      <span className="text-gray-300">›</span>
                      <span className="text-gray-500">{u.field}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaUsagePanel;
