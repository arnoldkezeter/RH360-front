import { IoIosNavigate } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";


interface ButtomCustomProps {
    title: String,
    onClick: () => void,
    next?: boolean,
    outline?: boolean,
    desactivated?: boolean,
    loading: boolean,

}



function ButtonCustom({ title, onClick, next, outline, desactivated, loading }: ButtomCustomProps) {
    const lang = useSelector((state: RootState) => state.setting.language);

    return (
        <button

            className={` 
        ${loading && 'opacity-50'} min-w-[180px] flex justify-center rounded hover:bg-opacity-70 

            ${desactivated ? 'cursor-not-allowed pointer-events-none ' : ' cursor-pointer'}
            duraction-300
            ${outline ? "text-white hover:bg-primary hover:text-white" : "border-primary bg-primary text-white hover:bg-[#3d3a95] hover:border-[#3d3a95] "}
            flex items-center justify-center gap-x-4 w-full cursor-pointer
             rounded-lg border  px-4 py-2 
              transition hover:bg-opacity-90`}
            onClick={onClick}
        >
            {loading && (
                <div className="flex items-center justify-center bg-transparent pr-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                </div>
            )}
            {loading ? <p className="-ml-2">{lang === 'en' ? 'Loading' : 'Chargement'}...</p> : <p>{title}</p>}


            {!loading && (next && <div className="text-white text-[25px]">  <IoIosNavigate /> </div>)}
        </button>)
}

export default ButtonCustom