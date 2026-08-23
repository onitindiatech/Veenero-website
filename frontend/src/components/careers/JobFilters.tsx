import React from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedLoc: string;
  setSelectedLoc: (loc: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  departments: string[];
  locations: string[];
  types: string[];
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  selectedLoc,
  setSelectedLoc,
  selectedType,
  setSelectedType,
  departments,
  locations,
  types
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
      
      {/* Search Input Bar (Spans wide on left) */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by job title, department, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all font-medium shadow-sm"
        />
      </div>

      {/* Select Dropdowns (Horizontal on desktop, stack on mobile) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        
        {/* Department Filter */}
        <div className="relative w-full sm:w-44 md:w-40 lg:w-44">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-2xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-600 appearance-none font-medium shadow-sm cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Location Filter */}
        <div className="relative w-full sm:w-44 md:w-40 lg:w-44">
          <select
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-2xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-600 appearance-none font-medium shadow-sm cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Employment Type Filter */}
        <div className="relative w-full sm:w-44 md:w-40 lg:w-44">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-2xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-600 appearance-none font-medium shadow-sm cursor-pointer"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Reset Filters Button */}
        {(searchQuery || selectedDept || selectedLoc || selectedType) ? (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDept("");
              setSelectedLoc("");
              setSelectedType("");
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 bg-card hover:bg-muted border border-border/80 hover:border-teal-600/30 text-teal-700 dark:text-teal-400 font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition-all duration-150 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 bg-card/50 border border-border/40 text-muted-foreground font-bold rounded-2xl text-xs sm:text-sm shadow-sm opacity-50 whitespace-nowrap cursor-not-allowed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}

      </div>
    </div>
  );
};

export default JobFilters;
