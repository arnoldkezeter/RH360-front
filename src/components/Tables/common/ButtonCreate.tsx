import { IoMdAdd } from "react-icons/io";

import { useTranslation } from "react-i18next";

interface ButtonNewProps {
    onClick: () => void;
    title:string;
    isAbsence?:boolean;
}

const ButtonCreate = ({ isAbsence, onClick }: ButtonNewProps) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className="  
            w-[50px] h-[35px] lg:h-[41.5px]  lg:min-w-[210px]  lg:w-auto  text-[11.5px] lg:text-sm md:text-md gap-2 my-2   
            inline-flex items-center justify-center  bg-primary  text-center font-medium text-white 
            hover:bg-opacity-90 lg:py-4 lg:px-4 xl:px-6 rounded  "
        >
            <div className="text-[18px]  md:text-[22px] ">
                <IoMdAdd />
            </div>
            {!isAbsence?(<h1 className='hidden lg:block pr-1'>
                {t('label.ajouter')}
            </h1>):<h1 className='hidden lg:block pr-1'>
                {t('boutton.signaler_absence')}
            </h1>}
        </button>
    );
};

export default ButtonCreate;
