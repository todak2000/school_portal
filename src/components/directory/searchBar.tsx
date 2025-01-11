import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  selectedLGA: string;
  lgas: string[];
  setSearchTerm: (term: string) => void;
  setSelectedLGA: (lga: string) => void;
  setCurrentPage: (page: number) => void;
}

const SearchBar = React.memo(
  ({
    searchTerm,
    selectedLGA,
    lgas,
    setSearchTerm,
    setSelectedLGA,
    setCurrentPage,
  }: SearchBarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleLGASelect = (lga: string) => {
      setSelectedLGA(lga);
      setCurrentPage(1);
      setIsDropdownOpen(false);
    };

    return (
      <div className="flex flex-col w-full gap-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-4 py-2 border-0 flex items-center gap-2 bg-secondary text-white rounded-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Plus size={16} />
              Filter by LGA
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto">
                <div className="py-1">
                  {lgas.map((lga) => (
                    <button
                      key={lga}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50
                      ${
                        selectedLGA === lga
                          ? "bg-orange-100 text-primary"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleLGASelect(lga)}
                    >
                      {lga}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 min-w-[50%]">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Search through all Schools ${
                selectedLGA ? `in ${selectedLGA}` : ""
              }`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-1/2 pl-10 pr-4 py-2 border font-geistMono text-sm border-primary bg-orange-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLGA && (
            <div className="bg-orange-100 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-primary">
              {selectedLGA}
              <button
                onClick={() => {
                  setSelectedLGA("");
                  setCurrentPage(1);
                }}
                className="hover:text-orange-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Add display name for the component
SearchBar.displayName = "SearchBar";

export { SearchBar };
