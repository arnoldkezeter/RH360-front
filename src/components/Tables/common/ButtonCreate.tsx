import { IoMdAdd } from "react-icons/io";

import { useTranslation } from "react-i18next";

interface ButtonNewProps {
    onClick: () => void;
    title:string;
    useTitle?:boolean
    removeIcon?:boolean
}

const ButtonCreate = ({ useTitle, onClick, title, removeIcon }: ButtonNewProps) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className="  
            w-[30px] h-[35px] lg:h-[41.5px]  lg:min-w-[210px]  lg:w-auto  text-[11.5px] lg:text-sm md:text-md gap-2 my-2   
            inline-flex items-center justify-center  bg-primary  text-center font-medium text-white 
            hover:bg-opacity-90 lg:py-4 lg:px-4 xl:px-6 rounded  "
        >
            {!removeIcon && <div className="text-[18px]  md:text-[22px] ">
                <IoMdAdd />
            </div>}
            
            {!useTitle?(<h1 className='hidden lg:block pr-1'>
                {t('label.ajouter')}
            </h1>):<h1 className='hidden lg:block pr-1'>
                {title}
            </h1>}
        </button>
    );
};

export default ButtonCreate;
