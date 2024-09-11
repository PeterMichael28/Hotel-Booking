import React from 'react';

export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination2: React.FC<Props> = ({ page, pages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalDisplayPages = 5;
    const halfDisplay = Math.floor(totalDisplayPages / 2);

    let start = Math.max(1, page - halfDisplay);
    const end = Math.min(pages, start + totalDisplayPages - 1);

    if (end - start + 1 < totalDisplayPages) {
      start = Math.max(1, end - totalDisplayPages + 1);
    }

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) pageNumbers.push('...');
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < pages) {
      if (end < pages - 1) pageNumbers.push('...');
      pageNumbers.push(pages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <ul className="flex border border-slate-300 rounded">
        {getPageNumbers().map((number, index) => (
          <li
            key={index}
            className={`px-3 py-1 ${
              page === number ? 'bg-gray-200' : ''
            } ${typeof number === 'string' ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {typeof number === 'string' ? (
              <span>{number}</span>
            ) : (
              <button onClick={() => onPageChange(number)}>{number}</button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination2;