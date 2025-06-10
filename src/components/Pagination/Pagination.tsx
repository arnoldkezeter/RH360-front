import { useTranslation } from 'react-i18next';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

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

function Pagination({ count, itemsPerPage, startItem, endItem, hasPrevious, hasNext, currentPage, pageNumbers, handlePageClick }: PaginationProps) {

    const { t } = useTranslation();
    return (
        <>
            { pageNumbers.length>1 && (
                <div className='flex items-center mt-8 mb-5'>
                    <div className="flex justify-between items-center w-full">
                        <div>
                            {/* <p>{t("pagination.affichage_des_elements")}{" "}
                                <span className="font-semibold">{!(count > itemsPerPage) ? '1' : startItem}</span>
                                {" "}{t("gestion_absence.a")}{" "}
                                <span className="font-semibold">{endItem}</span>
                                {" "}
                                {t("pagination.sur_un_total_de")}
                                <span className="font-semibold">{" "}{count}{" "}</span>
                                {t("pagination.entree")}
                            </p> */}
                            <p>
                                <span className="font-semibold">{!(count > itemsPerPage) ? '1' : startItem}</span>
                                <span> - </span>
                                <span className="font-semibold">{endItem} </span>
                                {t("pagination.sur")}
                                <span className="font-semibold"> {count} </span>

                            </p>
                        </div>
                        <div className="flex">
                            {hasPrevious ? (
                                <button
                                    className="pr-3 text-black text hover:text-primary duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 hover:dark:text-primary"
                                    onClick={() => handlePageClick(currentPage - 1)}
                                >
                                    <div className="text-[20px]  ">
                                        <IoArrowBack />
                                    </div>
                                    {/* {t("pagination.precedent")} */}

                                </button>
                            ) : (
                                <button
                                    className={` ${count > itemsPerPage ? 'text-black ' : 'text-[#aaa6a6]'} pr-3  hover:text-gray-500 duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 cursor-not-allowed`}
                                    disabled
                                >
                                    <div className="text-[20px] ">
                                        <IoArrowBack />
                                    </div>

                                    {/* {t("pagination.precedent")} */}

                                </button>
                            )}
                            <ul className="flex gap-x-1">
                                {pageNumbers.map((pageNumber) => (
                                    <li key={pageNumber}>
                                        <button
                                            className={`w-[40px] h-[32px] duration-300 text-sm  border border-gray-300 shadow-sm font-bold  ${currentPage === pageNumber ? 'border border-strokedark text-white  bg-strokedark' : 'hover:bg-primary border border-primary hover:text-white'}`}
                                            onClick={() => {
                                                handlePageClick(pageNumber);
                                            }}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {hasNext ? (
                                <button
                                    className="pl-3 text-black  hover:text-primary duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 hover:dark:text-primary"
                                    onClick={() => handlePageClick(currentPage + 1)}
                                >
                                    {/* {t("pagination.suivant")} */}

                                    <div className="text-[20px] ">
                                        <IoArrowForward />
                                    </div>
                                </button>
                            ) : (
                                <button
                                    className={` ${count > itemsPerPage ? 'text-black ' : 'text-[#aaa6a6]'} pl-3  hover:text-gray-500 duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 cursor-not-allowed`}
                                    disabled
                                >
                                    {/* {t("pagination.suivant")} */}

                                    <div className="text-[20px]">
                                        <IoArrowForward />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Pagination;
