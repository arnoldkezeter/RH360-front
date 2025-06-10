

interface ButtonCrudProps {
    onClickEdit?: () => void; //Editer un élément
    onClickDelete?: () => void; //Supprimer un élèment
    onClickAddHour?:()=>void; //Ajouter les heures d'absences
    onClickRemovHour?:()=>void; //Diminuer les erreurs d'absences
    onClickOpenChapitres?:()=>void;
    onClickSondage?:()=>void;
    onClickDownload?:()=>void;
    onClickDetails?:()=>void;
    border?: boolean;    
}

const ButtonCrudTable = ({ onClickEdit, onClickDelete, onClickAddHour, onClickRemovHour, onClickOpenChapitres, onClickSondage,onClickDownload, onClickDetails, border}: ButtonCrudProps) => {

    
    return (
        <div className="flex items-center justify-center text-sm">
            {/* Button Edit */}
            {onClickEdit && (<button className={`${border && 'border  border-gray'}   dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5  dark:text-gray `}
                onClick={onClickEdit}>
                <svg
                    className="feather feather-edit"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"

                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </button>)}
            {/* ! Edit SVG Path */}

            {/* button Delete */}
            {onClickDelete && (<button className={`${border && 'border  border-gray'}   hover:bg-meta-1 flex text-sm gap-2 text-body hover:text-white  items-center py-4 px-5  dark:text-gray`} onClick={onClickDelete}>
                
                <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                        fill=""
                    />
                    <path
                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                        fill=""
                    />
                    <path
                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                        fill=""
                    />
                    <path
                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                        fill=""
                    />
                </svg>
            </button>)}
            {/* Button ajout heure d'absence */}
            {onClickAddHour && (<button className={`${border && 'border  border-gray'}   dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5  dark:text-gray `}
                onClick={onClickAddHour}>
                <svg
                    className="feather feather-plus"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>)}
            {/* ! Edit SVG Path */}
            {/* Button reduction heure d'absence */}
            {onClickRemovHour && (<button className={`${border && 'border  border-gray'}   dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5  dark:text-gray `}
                onClick={onClickRemovHour}>
                <svg
                    className="feather feather-minus"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M4 12h16" />
                </svg>

            </button>)}
            {/*Download*/}
            {onClickDownload && (<button className={`${border && 'border  border-gray'}   dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5  dark:text-gray `}
                onClick={onClickDownload}>
                <svg
                    className="feather feather-download"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </button>)}
            {/*Détails*/}
            {onClickDetails && (<button className={`${border && 'border  border-gray'}   dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5  dark:text-gray `}
                onClick={onClickDetails}>
            <svg
                className="feather feather-eye"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>

            </button>)}
            {/* ! Edit SVG Path */}
            {onClickOpenChapitres && (
                <button className={`${border && 'border  border-gray'} dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5 dark:text-gray`} onClick={onClickOpenChapitres}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h14v-2H4V22z" />
                        <path d="M14 18v2H4v-2h10z" />
                        <path d="M16 14l-4 4l-4-4" />
                        <path d="M10 8v6l4-2l4 2V8" />
                    </svg>
                </button>
            )}
            {onClickSondage && (
                <button className={`${border && 'border  border-gray'} dark:border-body hover:bg-body hover:dark:bg-gray flex text-sm gap-0 text-body hover:text-white hover:dark:text-body items-center py-4 px-5 dark:text-gray`} onClick={onClickSondage}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h14v-2H4V22z" />
                        <path d="M14 18v2H4v-2h10z" />
                        <path d="M16 14l-4 4l-4-4" />
                        <path d="M10 8v6l4-2l4 2V8" />
                    </svg>
                </button>
            )}

            
        </div>        
    );
};

export default ButtonCrudTable;
