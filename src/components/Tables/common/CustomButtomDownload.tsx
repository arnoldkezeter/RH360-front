import { IoMdDownload } from "react-icons/io";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useTranslation } from "react-i18next";

interface ButtonDownloadPropos {
    onClick: (selectedItem: string) => void; // Ajouter la fonction de rappel onSelect

    items: string[],
    defaultValue: string,
}

export default function CustomButtonDownload({ onClick, items, defaultValue }: ButtonDownloadPropos) {
    const {t}=useTranslation();
    return (
        <div className="w-full  flex justify-center items-center gap-x-2">
            {/* 1 */}
            <div className=' bg-meta-3 text-white flex justify-center items-center gap-x-2 h-[35px]  lg:h-[40px]  mt-2.5 px-6 rounded '>
                <div>
                    <IoMdDownload />
                </div>
                <h1 className="text-[12px] lg:text-sm">{t('boutton.telecharger_format')}</h1>
            </div>

            {/* 2 */}
            <div>
                <CustomDropDown items={items} title={''} defaultValue={defaultValue} onSelect={onClick} alignTop={false} paddingY={`py-[10px] lg:py-[13px]`} />
            </div>

        </div>
    )
}
