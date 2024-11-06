import React from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid';

export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / pageSize);

    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        if (endPage < totalPages) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className={`${totalPages > 1 ? 'flex' : 'hidden'} items-center justify-between border-t border-gray-200 px-4 sm:px-0 w-full`}>
            <div className="-mt-px flex w-0 flex-1">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 ${currentPage === 1 ? '' : 'hover:border-gray-300 hover:text-gray-700'}`}
                >
                    <ChevronLeftIcon aria-hidden="true" className="mr-1 h-5 w-5 text-gray-400" />
                    Prev
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {getPageNumbers().map((page, key) => (
                    typeof page === 'number' ? (
                        <button
                            key={key}
                            onClick={() => onPageChange(page)}
                            className={`inline-flex items-center ${page === currentPage ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} border-t-2 border-transparent px-4 pt-4 text-sm font-medium`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={key} className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                            ...
                        </span>
                    )
                ))}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500  ${currentPage === totalPages ? '' : 'hover:border-gray-300 hover:text-gray-700'}`}
                >
                    Next
                    <ChevronRightIcon aria-hidden="true" className="ml-1 h-5 w-5 text-gray-400" />
                </button>
            </div>
        </nav>
    );
}
