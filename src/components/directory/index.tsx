"use client";
import React, { useState } from "react";
import { DirectoryCard } from "./card";

import { lgas } from "@/constants/schools";
import { Search } from "lucide-react";
import Pagination from "../pagination";
import { SearchBar } from "./searchBar";
import useSchools from "@/hooks/useSchools";
import LoaderSpin from "../loader/LoaderSpin";

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { data } = useSchools();
  const filteredSchools =
    data && data?.length > 0
      ? data.filter((school) => {
          return (
            (school?.name as string)
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            (selectedLGA ? school.lga === selectedLGA : true)
          );
        })
      : [];

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!data) {
    return (
      <main className="flex-1 p-6">
        <LoaderSpin />
      </main>
    );
  }
  return (
    <div className="w-full min-h-[80vh] md:min-h-[50vh] bg-white px-4 lg:px-20 2xl:px-[20%] py-10">
      <SearchBar
        searchTerm={searchTerm}
        selectedLGA={selectedLGA}
        lgas={lgas}
        setSearchTerm={setSearchTerm}
        setSelectedLGA={setSelectedLGA}
        setCurrentPage={setCurrentPage}
      />

      {paginatedSchools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-4 my-2 overflow-y-auto">
          {paginatedSchools.map((i) => (
            <DirectoryCard
              key={i.name}
              data={
                i as {
                  name: string;
                  lga: string;
                  description: string;
                  avatar?: string | null | undefined;
                  headerImage?: string | undefined;
                  studentCount: string;
                }
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-52">
          <Search size={48} className="text-gray-400" />
          <p className="text-gray-500 font-geistMono">
            No results found{" "}
            {searchTerm !== "" ? ` for <b>${searchTerm}</b>` : null}
          </p>
        </div>
      )}

      {filteredSchools.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default React.memo(DirectoryPage);
