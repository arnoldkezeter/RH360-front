import { IoMdAdd } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { useTranslation } from "react-i18next";

interface BoutonProps {
    iconeSmall?: boolean,
    titreBouton?: string;
    typeRefresh?: boolean;
    onClick: () => void;
    outline?: boolean; // Nouvelle prop pour activer/désactiver le style outline
    circle?: boolean; // Nouvelle prop pour activer/désactiver le style circulaire
    style?: string;
}

const BoutonTextMobile = ({ iconeSmall, typeRefresh, titreBouton, onClick, outline = false, circle = false, style }: BoutonProps) => {
    const { t } = useTranslation();

    // w-[50px] h-[35px] lg:h-[41.5px]  lg:min-w-[210px]  lg:w-auto  text-[11.5px] lg:text-sm md:text-md gap-2 my-2   
    // inline-flex items-center justify-center text-center font-medium hover:bg-opacity-90 lg:py-4 
    // ${outline ? "bg-transparent border border-primary text-primary" : "bg-primary text-white"}
    // ${circle ? "rounded-full" : "rounded"}
    return (
        <button onClick={onClick} className={`
        ${circle ? `rounded-full ${iconeSmall && !style ? "h-8 w-8" : style ? style : "h-10 w-10"}` : "rounded   w-full h-[35px] lg:h-[41.5px]  lg:min-w-[210px]  lg:w-auto  text-[11.5px] lg:text-sm md:text-md gap-2 my-2   px-4        "}

         text-[11.5px] lg:text-sm md:text-md gap-2 my-2   
        inline-flex items-center justify-center text-center font-medium hover:bg-opacity-90 lg:py-4 
        ${outline ? "bg-transparent border border-primary text-primary" : "bg-primary text-white"}
    
    `}>
            <div className={`text-[18px] ${iconeSmall ? "md:text-[18px]" : "md:text-[22px]"} `}>
                {typeRefresh ? <IoRefresh /> : <IoMdAdd />}
            </div>
            {
                !circle && <h1 className="">
                    {titreBouton && titreBouton.length > 0 ? titreBouton : t('label.ajouter')}
                </h1>
            }
        </button>
    );
};

export default BoutonTextMobile;
