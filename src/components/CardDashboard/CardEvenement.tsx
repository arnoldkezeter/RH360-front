import { useTranslation } from "react-i18next";
import { CurrentYearDate } from "./_CommonYear";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import LoadingTable from "../Tables/common/LoadingTable";

interface CardEvenementProps {
    additionalStyle?: String,
    listEvenement: EvenementType[] | undefined,
    pageIsLoading?: boolean;
}

export const CardEvenement = ({ additionalStyle, listEvenement, pageIsLoading }: CardEvenementProps) => {
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    return (
        <div className={`relative ${additionalStyle} rounded-sm border border-stroke bg-white py-6 px-5 shadow-default dark:border-strokedark dark:bg-boxdark w-full`}>
            {/* titre */}
            <div className="flex justify-between">
                <h3 className="mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start font-semibold w-full">
                    {t('tableau_de_bord.evenements_titre')}
                </h3>
            </div>

            {/* contenu */}
            {pageIsLoading ? (
                <LoadingTable />
            ) : (
                <div className="w-full mb-10">
                    {listEvenement && listEvenement.length === 0 ? (
                        <h4 className="text-[15px] font-normal text-body dark:text-white py-[100px] text-center mt-0 lg:py-[150px] w-full">
                            {t('tableau_de_bord.evenements_aucun')}
                        </h4>
                    ) : (
                        <div>
                            {listEvenement && listEvenement.map((evenement, index) => (
                                <div key={index} className={`${index % 2 === 0 ? "bg-gray-2 dark:bg-black" : ""} border-b border-[#eee] py-0 lg:py-2 px-2 dark:border-strokedark w-full`}>
                                    <p>{t('label.periode')} : {lang === 'fr' ? evenement.periodeFr : evenement.periodeEn}</p>
                                    <p>{t('label.libelle')} : {lang === 'fr' ? evenement.libelleFr : evenement.libelleEn}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* texte en absolute */}
            <CurrentYearDate />
        </div>
    );
};
