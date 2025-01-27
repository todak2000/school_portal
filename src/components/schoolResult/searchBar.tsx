import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { sampleClasses } from "@/constants/schools";

interface SearchBarProps {
  selectedClass: string;
  setSelectedClass: (lga: string) => void;
}

const SearchBar = React.memo(
  ({
    selectedClass,
    setSelectedClass,
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

    const handleClassSelect = (lga: string) => {
      setSelectedClass(lga);
      setIsDropdownOpen(false);
    };

    return (
      <div className="flex flex-col w-full gap-4 ">
        {/* Filter Bar by Class */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-4 py-2 border-0 flex items-center gap-2 bg-secondary text-white rounded-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              
              {selectedClass !==''?selectedClass:`Select Class`}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-100 mt-1 w-36 bg-white border border-gray-200 shadow-lg rounded-md max-h-40 overflow-y-auto">
                <div className="py-1">
                  {sampleClasses.map((cls) => (
                    <button
                      key={cls.name}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50
                      ${
                        selectedClass === cls.classId
                          ? "bg-orange-100 text-primary"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleClassSelect(cls.classId)}
                    >
                      {cls.classId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>

        
      </div>
    );
  }
);

// Add display name for the component
SearchBar.displayName = "SearchBar";

export { SearchBar };
