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
  columns: DataTableColumn[];
  defaultForm: Record<string, any> | null;
  selectable?: boolean;
  role: string;
  filterableColumns?: string[];
  searchableColumns?: string[];
  editableKeys: string[];
  isMain?: boolean;
  onCreate: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
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
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Filter,
  Search,
  MoreHorizontal,
  Download,
  Plus,
  SortAsc,
  SortDesc,
  FileSliders,
} from "lucide-react";
import EditDeleteModal from "./editDelete";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";

const DataTable = React.memo(function DataTable<T extends Record<string, any>>({
  data,
  columns,
  defaultForm,
  selectable = true,
  filterableColumns = [],
  searchableColumns = [],
  editableKeys = [],
  isMain = false,
  role,
  onCreate,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "error" });
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<T | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const dispatch = useDispatch();

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

  // Handle filtering
  const toggleFilter = useCallback((column: string, value: string) => {
    setFilters((prev) => {
      const currentFilters = prev[column] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((v) => v !== value)
        : [...currentFilters, value];

      return {
        ...prev,
        [column]: newFilters,
      };
    });
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

  // Process data with filters, search, and sort
  const processedData = useMemo(() => {
    let processed = [...data];

    // Apply filters
    Object.entries(filters).forEach(([column, selectedValues]) => {
      if (selectedValues.length > 0) {
        processed = processed.filter((item) =>
          selectedValues.includes(String(getNestedValue(item, column)))
        );
      }
    });

    // Apply search
    if (searchTerm && searchableColumns.length > 0) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter((item) =>
        searchableColumns.some((column) => {
          const value = getNestedValue(item, column);
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Apply sort
    if (sortConfig) {
      processed.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (typeof aValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    return processed;
  }, [data, searchTerm, sortConfig, filters, searchableColumns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const onExport = () => {
    console.log("export data");
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Modal

  const handleSchool = (id: string) => {
    window.open(`/admin/school/${id}`, "_blank");
  };

  const handleOpenModal = (data: any, editMode: boolean) => {
    if (isMain) {
      dispatch(
        setModal({
          open: true,
          type: "profile",
          data: {
            user: editMode ? data : { role },
            editMode,
            onCreate,
            onEdit,
            onCancel: handleCloseModal,
            onDelete,
          },
        })
      );
    } else {
      setModalData(data);
      setIsEditMode(editMode);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    if (isMain) {
      dispatch(
        setModal({
          open: false,
          type: "",
        })
      );
    } else {
      setModalData(null);
      setShowModal(false);
      setModalData(null);
    }
  };

  const handleEditItem = (updatedItem: T) => {
    // Update the item in the main data
    onEdit(updatedItem);
    // Update the state with the new data
    setAlert({
      message: "Successful",
      type: "success",
    });
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  const handleCreateItem = (data: any) => {
    // Perform create action here
    onCreate(data);
    console.log("Created Data:", data);
    setAlert({
      message: "Successful",
      type: "success",
    });
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  const handleDeleteItem = (data: any) => {
    // Update the state with the new data
    if (role === "school") {
      onDelete(data.code);
    } else if (role === "class") {
      onDelete(data.classId);
    } else if (role === "subject") {
      onDelete(data.subjectId);
    }
    setAlert({
      message: "Successful",
      type: "success",
    });
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  useEffect(() => {
    if (alert.message !== "") {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="w-full min-w-[85vw] md:min-w-[80vw] md:max-w-[85vw] bg-white border-none">
      {/* Header */}
      <div className="p-4 border-b ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center text-black font-geistSans font-bold">
            List
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterableColumns.length > 0 && currentPage === 1 && (
              <div className="dropdown dropdown-end">
                <button className={`btn btn-ghost gap-2 `}>
                  <Filter size={16} />
                  Filter
                </button>
                <div className="dropdown-content menu p-2 bg-gray-100 scrollbar-hide  w-max z-[1000] h-48 overflow-auto">
                  {filterableColumns.map((column) => (
                    <div key={column} className="p-2 ">
                      <div className="font-medium mb-2">
                        {columns.find((c) => c.key === column)?.label ?? column}
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

            {searchableColumns.length > 0 && currentPage === 1 && (
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  disabled={currentPage !== 1}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-[150px] md:w-full input-bordered pl-10 bg-orange-100 border-none rounded-none focus:outline-none focus:text-black"
                />
              </div>
            )}

            <button onClick={onExport} className="btn btn-ghost gap-2">
              <Download size={16} />
              Export
            </button>

            <button
              onClick={() => handleOpenModal(defaultForm, false)}
              className="btn bg-primary border-none rounded-none text-white gap-2 hover:opacity-80"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 border-b flex justify-between items-center font-geistMono">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            className="btn btn-sm text-secondary rounded-none btn-ghost disabled:bg-transparent disabled:text-gray-300"
            disabled={currentPage === 1}
          >
            {" "}
            Previous{" "}
          </button>
          <span className="hidden md:flex">
            {Array.from({ length: totalPages }, (_, index) => {
              if (
                index < 2 ||
                index >= totalPages - 2 ||
                index === currentPage - 1
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`btn btn-sm rounded-none ${
                      currentPage === index + 1
                        ? "bg-secondary text-white border-none "
                        : "btn-ghost"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                index === 2 ||
                (index === totalPages - 3 &&
                  currentPage > 4 &&
                  currentPage < totalPages - 3)
              ) {
                return <span key={index}>...</span>;
              }
              return null;
            })}
          </span>

          <button
            onClick={handleNextPage}
            className="btn btn-sm text-secondary rounded-none btn-ghost disabled:bg-transparent disabled:text-gray-300"
            disabled={currentPage === totalPages}
          >
            {" "}
            Next{" "}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-none overflow-y-auto max-h-[50vh] scrollbar-hide pb-20">
        <table className="table w-full">
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
          <tbody>
            {paginatedData?.map((item, index) => (
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
                {columns.map((column) => {
                  // Extracted rendering logic
                  const renderedValue =
                    column.render && column.key === "avatar"
                      ? column.render(item?.name || item?.fullname, item)
                      : column.render && column.key !== "avatar"
                      ? column.render(getNestedValue(item, column.key), item)
                      : String(getNestedValue(item, column.key) ?? "");

                  return <td key={column.label}>{renderedValue}</td>;
                })}
                <td>
                  <span className="flex flex-row items-center justify-center gap-1">
                    <button
                      disabled={role === "session"}
                      className="btn btn-ghost btn-sm disabled:bg-transparent"
                      onClick={() => handleOpenModal(item, true)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {role === "school" && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleSchool(item.code)}
                      >
                        <FileSliders size={16} className="text-orange-600" />
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {!isMain && (
        <EditDeleteModal
          showModal={showModal}
          modalData={modalData}
          handleCloseModal={handleCloseModal}
          handleEditItem={handleEditItem}
          alert={alert}
          handleDeleteItem={handleDeleteItem}
          handleCreateItem={handleCreateItem}
          setModalData={setModalData}
          editableKeys={editableKeys}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
});
export default React.memo(DataTable);
