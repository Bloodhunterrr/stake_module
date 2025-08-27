import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
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

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => (
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
      ));
    } else {
      const pages = [];

   
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changePage(1);
            }}
            className={`px-3 py-1 ${
              localPage === 1
                ? "bg-card text-black font-semibold hover:bg-card/80"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );


      if (localPage > 3) {
        pages.push(
          <PaginationItem key="left-ellipsis">
            <PaginationEllipsis className=" text-gray-600 " />
          </PaginationItem>
        );
      }

      for (let i = localPage - 1; i <= localPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changePage(i);
                }}
                className={`px-3 py-1 ${
                  localPage === i
                    ? "bg-card text-black font-semibold hover:bg-card/80"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (localPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="right-ellipsis">
            <PaginationEllipsis className=" text-gray-600 "/>
          </PaginationItem>
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changePage(totalPages);
            }}
            className={`px-3 py-1 ${
              localPage === totalPages
                ? "bg-card text-black font-semibold hover:bg-card/80"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );

      return pages;
    }
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

        {renderPageNumbers()}

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
