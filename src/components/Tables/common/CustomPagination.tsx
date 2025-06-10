// import { IoMdNavigate } from "react-icons/io";

// interface CustomPaginationProps {
//     itemsPerPage: number,
//     handlePageClick: (value: number) => void,
//     currentPage: number,
//     count: number,
// }

// function CustomPagination({ count, currentPage, itemsPerPage, handlePageClick }: CustomPaginationProps) {
//     const totalPages = Math.ceil(count / itemsPerPage);

//     return (
//         count > itemsPerPage && (
//             <div className='flex justify-between w-full items-center mt-8 mb-5'>
//                 <div>
//                     Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, count)} sur {count} entrées
//                 </div>

//                 <div className="flex">
//                     <button disabled={currentPage === 1} onClick={() => handlePageClick(currentPage - 1)}>Précédent</button>

//                     {[...Array(totalPages)].map((_, index) => (
//                         <button
//                             className={`w-[40px] h-[32px] text-sm mx-1 border border-gray-300 shadow-sm font-bold  ${currentPage === index + 1 ? 'border-2 border-primary text-white bg-primary' : 'hover:bg-boxdark hover:text-white'}`}
//                             key={index}
//                             onClick={() => handlePageClick(index + 1)} // Adding 1 to index
//                         >
//                             {index + 1} {/* Adding 1 to display correct page number */}
//                         </button>
//                     ))}

//                     <button disabled={currentPage === totalPages} onClick={() => handlePageClick(currentPage + 1)}>Suivant</button>
//                 </div>
//             </div>
//         )
//     );
// }

// export default CustomPagination;
