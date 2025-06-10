// import React from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     onPageChange: (pageNumber: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//     currentPage,
//     totalPages,
//     totalItems,
//     onPageChange,
// }) => {
//     const handlePageClick = (pageNumber: number) => {
//         onPageChange(pageNumber);
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             onPageChange(currentPage + 1);
//         }
//     };

//     const handlePrevPage = () => {
//         if (currentPage > 1) {
//             onPageChange(currentPage - 1);
//         }
//     };

//     return (
//         <div className="relative flex flex-col lg:flex-row justify-center items-center text-center mt-10">
//             <div className="hidden lg:block absolute right-0 justify-center items-center mr-3">
//                 Page {currentPage} / {totalPages}
//             </div>

//             <div className="hidden lg:block absolute right-0 justify-center items-center mr-3">
//                 Page {currentPage} / {totalPages}
//             </div>
//             <div>
//                 {/* Affichage des icônes sur mobile */}
//                 <button
//                     className={`p-2 rounded-full
//                  ${currentPage === 1 ?
//                             "text-[#e8e6e6] dark:text-[#454343]"
//                             : "bg-gray-300 text-gray-800 hover:bg-boxdark hover:text-white duration-300 "
//                         }`}
//                     onClick={handlePrevPage}
//                     disabled={currentPage === 1}
//                 >
//                     <div className="text-md">
//                         <FaChevronLeft />
//                     </div>
//                 </button>


//                 {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                         key={index}
//                         className={` h-9 w-9 mx-1 rounded-sm mb-4 ${currentPage === index + 1
//                             ? "bg-boxdark dark:bg-primary text-white"
//                             : "bg-[#eae8e8] text-[#7e7d7d]"
//                             }`}
//                         onClick={() => handlePageClick(index + 1)}
//                     >
//                         {index + 1}
//                     </button>
//                 ))}
//                 <button
//                     className={` items-center justify-center p-3 mr-3 rounded-full
//                  ${currentPage === totalPages ?
//                             "text-[#e8e6e6] dark:text-[#454343]"
//                             : "bg-gray-300 text-gray-800 hover:bg-boxdark hover:text-white duration-300 "
//                         }`}
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                 >
//                     <FaChevronRight />
//                 </button>
//             </div>

//             {/* Affichage du texte avec des icônes à partir de lg */}
//             <div className="block lg:hidden left-0 justify-center items-center">
//                 <FaChevronLeft onClick={handlePrevPage} className={`mx-0 px-3 py-1 rounded ${currentPage === 1 ? "text-gray-500" : "text-gray-800"} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`} />
//                 Page {currentPage} / {totalItems}
//                 <FaChevronRight onClick={handleNextPage} className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? "text-gray-500" : "text-gray-800"} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`} />
//             </div>
//         </div>
//     );
// };

// export default Pagination;
