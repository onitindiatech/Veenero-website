import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_OPTIONS = [
  { value: "all",      label: "All Pages" },
  { value: "about",    label: "About" },
  { value: "home",     label: "Home" },
  { value: "solutions",label: "Solutions" },
  { value: "approach", label: "Our Approach" },
  { value: "impact",   label: "Impact" },
  { value: "careers",  label: "Careers" },
  { value: "blog",     label: "Blog / Insights" },
  { value: "contact",  label: "Contact" },
];

interface Props {
  search: string;
  page: string;
  type: "all" | "image" | "video";
  onSearch: (v: string) => void;
  onPage: (v: string) => void;
  onType: (v: "all" | "image" | "video") => void;
  onClear: () => void;
  hasActive: boolean;
}

export const MediaFilters: React.FC<Props> = ({ search, page, type, onSearch, onPage, onType, onClear, hasActive }) => (
  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
    <div className="relative flex-1 min-w-48">
      <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search assets..."
        className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400" />
      {search && (
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => onSearch("")}>
          <Icons.X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>

    <select value={page} onChange={(e) => onPage(e.target.value)}
      className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 min-w-[140px]">
      {PAGE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
    </select>

    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
      {(["all", "image", "video"] as const).map((t) => (
        <button key={t} onClick={() => onType(t)}
          className={cn("px-3 h-10 text-sm font-medium capitalize transition-colors",
            type === t ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-50")}>
          {t}
        </button>
      ))}
    </div>

    {hasActive && (
      <button onClick={onClear}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 px-3 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <Icons.X className="h-3.5 w-3.5" />Clear
      </button>
    )}
  </div>
);

export default MediaFilters;
