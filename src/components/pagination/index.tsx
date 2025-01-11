import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (x: number) => void;
}) => {
  return (
    <div className="flex justify-center mt-4 font-geistMono">
      <div className="join">
        <button
          className="join-item btn bg-secondary border-0 rounded-none text-white disabled:opacity-80 disabled:text-white disabled:bg-secondary disabled:border-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn hover:bg-primary bg-primary border-0 rounded-none text-white">
          Page {currentPage} of {totalPages}
        </button>
        <button
          className="join-item btn bg-secondary rounded-none border-0 text-white disabled:opacity-80 disabled:text-white disabled:bg-secondary disabled:border-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);
