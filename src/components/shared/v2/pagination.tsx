import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaginationComponent: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setPage,
  setLoading,
}) => {
  const [localPage, setLocalPage] = useState<number>(currentPage);

  useEffect(() => {
    setLocalPage(currentPage);
  }, [currentPage]);

  const changePage = (newPage: number) => {
    if (setLoading) setLoading(true);
    setLocalPage(newPage);
    setPage(newPage);
  };

  return (
    <Pagination className="flex flex-col items-center justify-center gap-2 md:flex-row mt-5">
      <PaginationContent>
  
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={localPage <= 1}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (localPage > 1) changePage(localPage - 1);
            }}
            className={
              localPage <= 1
                ? "pointer-events-none opacity-50 text-gray-400"
                : "text-gray-700 hover:text-black"
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                changePage(index + 1);
              }}
              className={`px-3 py-1 ${
                localPage === index + 1
                  ? "bg-card text-black font-semibold hover:bg-card/80"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (localPage < totalPages) changePage(localPage + 1);
            }}
            className={
              localPage >= totalPages
                ? "pointer-events-none opacity-50 text-gray-400"
                : "text-gray-700 hover:text-black"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
