import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_OPTIONS = [
  { value: "all",       label: "All Pages" },
  { value: "about",     label: "About" },
  { value: "home",      label: "Home" },
  { value: "solutions", label: "Solutions" },
  { value: "approach",  label: "Our Approach" },
  { value: "impact",    label: "Impact & ESG" },
  { value: "careers",   label: "Careers" },
  { value: "blog",      label: "Blog / Insights" },
  { value: "contact",   label: "Contact" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name",   label: "File Name (A–Z)" },
];

interface Props {
  search: string;
  page: string;
  type: "all" | "image" | "video";
  usage: "all" | "used" | "unused";
  sort: "newest" | "oldest" | "name";
  onSearch: (v: string) => void;
  onPage: (v: string) => void;
  onType: (v: "all" | "image" | "video") => void;
  onUsage: (v: "all" | "used" | "unused") => void;
  onSort: (v: "newest" | "oldest" | "name") => void;
  onClear: () => void;
  hasActive: boolean;
}

export const MediaFilters: React.FC<Props> = ({
  search,
  page,
  type,
  usage,
  sort,
  onSearch,
  onPage,
  onType,
  onUsage,
  onSort,
  onClear,
  hasActive,
}) => (
  <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center flex-wrap mb-4">
    {/* Search Input */}
    <div className="relative flex-1 min-w-[220px]">
      <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name, section, slot or tags..."
        className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 text-xs bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
      />
      {search && (
        <button
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
          onClick={() => onSearch("")}
        >
          <Icons.X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>

    {/* Page Filter */}
    <select
      value={page}
      onChange={(e) => onPage(e.target.value)}
      className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 min-w-[130px]"
    >
      {PAGE_OPTIONS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>

    {/* Usage Status Filter Toggle */}
    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
      {(
        [
          { key: "all", label: "All Assets" },
          { key: "used", label: "Used" },
          { key: "unused", label: "Unused" },
        ] as const
      ).map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onUsage(item.key)}
          className={cn(
            "px-3 h-9 text-xs font-semibold transition-colors",
            usage === item.key
              ? "bg-teal-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>

    {/* Resource Type Toggle */}
    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
      {(["all", "image", "video"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onType(t)}
          className={cn(
            "px-3 h-9 text-xs font-semibold capitalize transition-colors",
            type === t
              ? "bg-teal-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          {t}
        </button>
      ))}
    </div>

    {/* Sort Dropdown */}
    <select
      value={sort}
      onChange={(e) => onSort(e.target.value as "newest" | "oldest" | "name")}
      className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 min-w-[130px]"
    >
      {SORT_OPTIONS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>

    {/* Clear Filter Button */}
    {hasActive && (
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 px-3 h-9 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
      >
        <Icons.RotateCcw className="h-3 w-3" />
        Reset
      </button>
    )}
  </div>
);

export default MediaFilters;
