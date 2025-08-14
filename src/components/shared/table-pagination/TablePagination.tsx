import React from 'react';
import ChevronLeftIcon  from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon  from '@/assets/icons/chevron-right.svg?react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="data-table-pagination">
      <button
        className="m-button m-gradient-border m-button--secondary m-button--s data-table-pagination__item data-table-pagination__prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <div className="m-icon-container">
          <ChevronLeftIcon />
        </div>
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={`page-${index}`}
          className={`m-button m-gradient-border m-button--secondary m-button--s data-table-pagination__item ${
            currentPage === page ? 'data-table-pagination__item--active' : ''
          }`}
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
        >
          <div className="m-button-content">
            {page}
          </div>
        </button>
      ))}

      <button
        className="m-button m-gradient-border m-button--secondary m-button--s data-table-pagination__item data-table-pagination__next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <div className="m-icon-container">
          <ChevronRightIcon />
        </div>
      </button>
    </div>
  );
};

export default Pagination;