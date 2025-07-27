import { useTranslation } from 'react-i18next';
import { IoArrowBack, IoArrowForward, IoEllipsisHorizontal } from 'react-icons/io5';

interface PaginationProps {
    count: number;
    itemsPerPage: number;
    startItem: number;
    endItem: number;
    hasPrevious: boolean;
    hasNext: boolean;
    currentPage: number;
    pageNumbers: number[];
    handlePageClick: (pageNumber: number) => void;
}

function Pagination({ 
    count, 
    itemsPerPage, 
    startItem, 
    endItem, 
    hasPrevious, 
    hasNext, 
    currentPage, 
    pageNumbers, 
    handlePageClick 
}: PaginationProps) {
    const { t } = useTranslation();

    // Fonction pour générer les numéros de page avec ellipses
    const generatePageNumbers = () => {
        const totalPages = Math.ceil(count / itemsPerPage);
        const maxVisiblePages = 7;
        
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

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    const displayPageNumbers = generatePageNumbers();

    if (pageNumbers.length <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-5 px-4">
            {/* Information sur les éléments affichés */}
            <div className="flex items-center text-sm text-[#6B7280] dark:text-[#9CA3AF] order-2 sm:order-1">
                <span className="font-medium text-[#374151] dark:text-[#F9FAFB]">
                    {startItem}
                </span>
                <span className="mx-2">-</span>
                <span className="font-medium text-[#374151] dark:text-[#F9FAFB]">
                    {endItem}
                </span>
                <span className="mx-2">{t("pagination.sur")}</span>
                <span className="font-medium text-[#374151] dark:text-[#F9FAFB]">
                    {count}
                </span>
            </div>

            {/* Contrôles de pagination */}
            <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* Bouton Précédent */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={!hasPrevious}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 
                        ${hasPrevious 
                            ? 'border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] hover:border-[#3B82F6] text-[#374151] hover:text-[#3B82F6] dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:hover:bg-[#374151] dark:hover:border-[#60A5FA]' 
                            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed dark:border-[#374151] dark:bg-[#111827] dark:text-[#6B7280]'
                        }
                    `}
                >
                    <IoArrowBack size={16} />
                </button>

                {/* Numéros de page */}
                <div className="flex items-center gap-1">
                    {displayPageNumbers.map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <div className="flex items-center justify-center w-10 h-10 text-[#9CA3AF] dark:text-[#6B7280]">
                                    <IoEllipsisHorizontal size={20} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => handlePageClick(page as number)}
                                    className={`
                                        w-10 h-10 rounded-lg border font-medium text-sm transition-all duration-200
                                        ${currentPage === page
                                            ? 'border-[#3B82F6] bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25 dark:border-[#60A5FA] dark:bg-[#60A5FA]'
                                            : 'border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] hover:border-[#3B82F6] text-[#374151] hover:text-[#3B82F6] dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:hover:bg-[#374151] dark:hover:border-[#60A5FA]'
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bouton Suivant */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={!hasNext}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
                        ${hasNext 
                            ? 'border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] hover:border-[#3B82F6] text-[#374151] hover:text-[#3B82F6] dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:hover:bg-[#374151] dark:hover:border-[#60A5FA]' 
                            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed dark:border-[#374151] dark:bg-[#111827] dark:text-[#6B7280]'
                        }
                    `}
                >
                    <IoArrowForward size={16} />
                </button>
            </div>

            {/* Version mobile compacte */}
            <div className="flex sm:hidden items-center gap-2 order-3 w-full justify-center">
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {t('label.page')} {currentPage} {t('label.sur')} {Math.ceil(count / itemsPerPage)}
                </span>
            </div>
        </div>
    );
}

export default Pagination;