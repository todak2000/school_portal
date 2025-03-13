/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// types.ts
export type DataTableColumn = {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
};

export interface DataTableProps<T> {
  data: T[];
  setTotalCount: React.Dispatch<React.SetStateAction<number>>| null;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  columns: DataTableColumn[];
  defaultForm: Record<string, any> | null;
  selectable?: boolean;
  role: string;
  fieldValue: string;
  filterData: string;
  field: string;
  filterableColumns?: string[];
  searchableColumns?: string[];
  onCreate: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  collectionName: string;
  defaultSort: any;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

// Helper functions
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// DataTable.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  Filter,
  Search,
  Download,
  Plus,
  SortAsc,
  SortDesc,
  UserPen,
  FileSliders,
  SearchSlash,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import CRUDOperation from "@/firebase/functions/CRUDOperation";
import LoaderSpin from "../loader/LoaderSpin";
import Collection from "@/firebase/db";
import { ROLE } from "@/constants";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const FirebaseSchoolDataTable = React.memo(function DataTable<
  T extends Record<string, any>
>({
  data,
  setTotalCount,
  setData,
  columns,
  defaultForm,
  selectable = true,
  filterableColumns = [],
  searchableColumns = [],
  role,
  fieldValue,
  field,
  filterData,
  onCreate,
  onEdit,
  onDelete,
  collectionName,
  defaultSort = { field: "createdAt", direction: "desc" },
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounceTimeout, setSearchDebounceTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [alert, setAlert] = useState({ message: "", type: "error" });
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    isLoading: false,
  });
  const firebaseService = new CRUDOperation(collectionName);
  const dispatch = useDispatch();

  const handleStudentResult = (id: string) => {
    let r: string;
    switch (role) {
      case ROLE.admin:
        r = role;
        break;
      case ROLE.student:
        r = "students";
        break;
      default:
        r = "school_admin";
    }
    window.open(`/${r}/student/${id}`, "_blank");
  };

  const fetchData = useCallback(async () => {
    setPaginationState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await firebaseService.getSingleFieldPaginatedData<T>(
        paginationState.itemsPerPage,
        paginationState.currentPage,
        sortConfig?.key || defaultSort.field,
        sortConfig?.direction || defaultSort.direction,
        filters,
        field,
        fieldValue,
        filterData !== "" ? filterData : searchTerm,
        searchableColumns
      );
      setData(result.items);
      setTotalCount && setTotalCount(result.totalOverallCount);
      setPaginationState((prev) => ({
        ...prev,
        totalPages: Math.ceil(result.totalCount / prev.itemsPerPage),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setPaginationState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [
    paginationState.currentPage,
    paginationState.itemsPerPage,
    sortConfig,
    filters,
    fieldValue,
    field,
    searchTerm,
    filterData,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add debounced search handler
  const handleSearch = useCallback(
    (value: string) => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }

      const timeout = setTimeout(() => {
        setSearchTerm(value);
        setPaginationState((prev) => ({ ...prev, currentPage: 1 }));
        firebaseService.clearCache();
      }, 500);

      setSearchDebounceTimeout(timeout);
    },
    [firebaseService]
  );

  // Modify pagination handlers
  const handlePageChange = (page: number) => {
    setPaginationState((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePreviousPage = () => {
    if (paginationState.currentPage > 1) {
      setPaginationState((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const handleNextPage = () => {
    if (paginationState.currentPage < paginationState.totalPages) {
      setPaginationState((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };
  // Modify filter handler to reset pagination
  const toggleFilter = useCallback(
    (column: string, value: string) => {
      setFilters((prev) => {
        const currentFilters = prev[column] || [];
        const newFilters = currentFilters.includes(value)
          ? currentFilters.filter((v) => v !== value)
          : [...currentFilters, value];

        const updatedFilters = {
          ...prev,
          [column]: newFilters,
        };

        // Reset pagination when filters change
        setPaginationState((prev) => ({ ...prev, currentPage: 1 }));
        firebaseService.clearCache();

        return updatedFilters;
      });
    },
    [firebaseService]
  );

  // Handle selection
  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedItems(e.target.checked ? data : []);
    },
    [data]
  );

  const handleSelectItem = useCallback((item: T) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  // Handle sorting
  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Get unique values for filterable columns
  const getUniqueValues = useCallback(
    (column: string) => {
      const values = new Set<string>();
      data.forEach((item) => {
        const value = getNestedValue(item, column);
        if (value !== undefined && value !== null) {
          values.add(String(value));
        }
      });
      return Array.from(values);
    },
    [data]
  );
  const onExport = () => {
    console.log("export data");
  };

  const handleOpenModal = (data: any, editMode: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...mainData } = data;

    dispatch(
      setModal({
        open: true,
        type: "profile",
        data: {
          user: editMode ? mainData : { role },
          editMode,
          onCreate,
          onEdit,
          onCancel: handleCloseModal,
          onDelete,
        },
      })
    );
  };

  const handleCloseModal = () => {
    dispatch(
      setModal({
        open: false,
        type: "",
      })
    );
  };

  useEffect(() => {
    if (alert.message !== "") {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const renderValue = (item: T, column: DataTableColumn) => {
    if (column.render) {
      return column.key === "avatar"
        ? column.render(item?.name || item?.fullname, item)
        : column.render(getNestedValue(item, column.key), item);
    }
    return String(getNestedValue(item, column.key) ?? "");
  };

  return (
    <div className="w-[87vw] md:w-full md:min-w-[80vw] md:max-w-[85vw] bg-white border-none">
      {/* Header */}
      <div className="p-4 border-b "> 
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center text-black font-geistSans font-bold">
            List
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterableColumns.length > 0 &&
              paginationState.currentPage === 1 && (
                <div className="dropdown dropdown-end">
                  <button className={`btn btn-ghost gap-2 `}>
                    <Filter size={16} />
                    Filter
                  </button>
                  <div className="dropdown-content menu p-2 bg-gray-100 scrollbar-hide  w-max z-[1000] h-48 overflow-auto">
                    {filterableColumns.map((column) => (
                      <div key={column} className="p-2 ">
                        <div className="font-medium mb-2">
                          {columns.find((c) => c.key === column)?.label ??
                            column}
                        </div>
                        {getUniqueValues(column).map((value) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 p-1 text-black font-geistMono text-xs my-2"
                          >
                            <input
                              type="checkbox"
                              checked={(filters[column] || []).includes(value)}
                              onChange={() => toggleFilter(column, value)}
                              className="checkbox rounded-none checkbox-sm custom-checkbox"
                            />
                            {value}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {searchableColumns.length > 0 &&
              paginationState.currentPage === 1 && (
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    disabled={paginationState.currentPage !== 1}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="input w-[150px] md:w-full input-bordered pl-10 bg-orange-100 border-none rounded-none focus:outline-none focus:text-black"
                  />
                </div>
              )}

            <button onClick={onExport} className="btn btn-ghost gap-2">
              <Download size={16} />
              Export
            </button>
            {role === ROLE.admin && (
              <button
                onClick={() => handleOpenModal(defaultForm, false)}
                className="btn bg-primary border-none rounded-none text-white gap-2 hover:opacity-80"
              >
                <Plus size={16} />
                Add New
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 border-b flex justify-between items-center font-geistMono">
        <div>
          Page {paginationState.currentPage} of {paginationState.totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            className="btn btn-sm text-secondary rounded-none btn-ghost disabled:bg-transparent disabled:text-gray-300"
            disabled={paginationState.currentPage === 1}
          >
            {" "}
            Previous{" "}
          </button>
          <span className="hidden md:flex">
            {Array.from({ length: paginationState.totalPages }, (_, index) => {
              if (
                index < 2 ||
                index >= paginationState.totalPages - 2 ||
                index === paginationState.currentPage - 1
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`btn btn-sm rounded-none ${
                      paginationState.currentPage === index + 1
                        ? "bg-secondary text-white border-none "
                        : "btn-ghost"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                index === 2 ||
                (index === paginationState.totalPages - 3 &&
                  paginationState.currentPage > 4 &&
                  paginationState.currentPage < paginationState.totalPages - 3)
              ) {
                return <span key={index}>...</span>;
              }
              return null;
            })}
          </span>

          <button
            onClick={handleNextPage}
            className="btn btn-sm text-secondary rounded-none btn-ghost disabled:bg-transparent disabled:text-gray-300"
            disabled={
              paginationState.currentPage === paginationState.totalPages
            }
          >
            {" "}
            Next{" "}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-none overflow-y-auto max-h-[50vh] relative scrollbar-hide pb-20 bg-gray-50">
        <table className="table w-full bg-gray-50">
          <thead className="bg-gray-100 text-secondary font-geistSans font-normal">
            <tr>
              {selectable && (
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length}
                    onChange={handleSelectAll}
                    className="checkbox custom-checkbox rounded-none"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={column.sortable ? "cursor-pointer" : ""}
                  onClick={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc size={16} />
                      ) : (
                        <SortDesc size={16} />
                      ))}
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          {paginationState.isLoading ? (
            <div className="flex absolute bottom-[-5rem] items-center justify-center w-screen md:w-full">
              {" "}
              <LoaderSpin />{" "}
            </div>
          ) : !paginationState.isLoading && data && data.length <= 0 ? (
            <div className="flex flex-col bg-gray-50 absolute bottom-[-6rem] items-center justify-center w-screen md:w-full">
              {" "}
              <SearchSlash size={50} />
              <p className="text-sm font-geistMono font-bold my-3">
                No Data yet!
              </p>
            </div>
          ) : (
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-orange-50 border-[0.5px] border-gray-300 text-black font-geistMono"
                >
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => handleSelectItem(item)}
                        className="checkbox rounded-none custom-checkbox"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.label}>{renderValue(item, column)}</td>
                  ))}
                  <td>
                    <span className="flex flex-row items-center justify-center gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleOpenModal(item, true)}
                      >
                        <UserPen size={16} className="text-orange-400" />
                      </button>
                      {collectionName === Collection.Students_Parents && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleStudentResult(item.id)}
                        >
                          <FileSliders size={16} className="text-orange-600" />
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
});
export default FirebaseSchoolDataTable;
