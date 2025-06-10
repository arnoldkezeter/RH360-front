import { useTranslation } from "react-i18next";
import { CurrentYearDate } from "./_CommonYear";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { jours } from "../../pages/CommonPage/EmploiDeTemp";
import LoadingTable from "../Tables/common/LoadingTable";

interface CardCourProgrammerPros {
    additionalStyle?: String,
    listCourProgrammer: PeriodeType[] 
    pageIsLoading?:boolean,
}

export const CardCourProgrammer = ({ additionalStyle,listCourProgrammer, pageIsLoading }: CardCourProgrammerPros) => {
    const {t}=useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const typesEnseignement=useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement); 
    const sallesCours=useSelector((state: RootState) => state.dataSetting.dataSetting.sallesDeCours); 
    return (
        <div className={`relative ${additionalStyle} rounded-sm border border-stroke bg-white py-6 px-5 shadow-default dark:border-strokedark dark:bg-boxdark  w-full`}>

            {/* titre */}
            <div className="flex justify-between">
                <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                    {t('tableau_de_bord.cours_programmes')}
                </h3>
            </div>

            {/* contenu */}
            {pageIsLoading ?
                <LoadingTable />:<div className='flex justify-center w-full mb-10'>

               {listCourProgrammer && listCourProgrammer.length === 0 ? (
                    <h4 className="text-[15px] font-normal text-body dark:text-white py-[100px] text-center mt-0 lg:py-[150px] w-full">
                        {t('tableau_de_bord.aucun_cour')}
                    </h4>
                ) :(
                    <div className="w-full">
                        {listCourProgrammer && listCourProgrammer.map((periode, index) => {
                            const jourLibelle = lang === 'fr' 
                            ? jours.find(jour => jour.ordre === periode.jour)?.libelleFr || "" 
                            : jours.find(jour => jour.ordre === periode.jour)?.libelleEn || "";

                            const sallesLibelle = periode.enseignements && periode.enseignements.length > 0 
                                ? [...new Set(periode.enseignements.map(e => sallesCours?.find(sc => sc._id === e.salleCours)?.[lang === 'fr' ? 'libelleFr' : 'libelleEn'] || ''))]
                                .filter(libelle => libelle) // Filtrer les valeurs vides ou nulles
                                    .join('/ ')
                                : '';

                            // Itération sur les matières
                            const matieresLibelle = periode.enseignements && periode.enseignements.length > 0
                                ? periode.enseignements.map(e => lang === 'fr' ? e.matiere.libelleFr : e.matiere.libelleEn).join('/ ')
                                : '';

                            return (
                                <div 
                                    key={index} 
                                    className={`border-b border-[#eee] py-0 lg:py-2 px-2 dark:border-strokedark w-full ${
                                    index % 2 === 0 ? "bg-gray-2 dark:bg-black" : ""
                                    }`}
                                >
                                    <p>{t('label.horaire')} : {periode.heureDebut} - {periode.heureFin}</p>
                                    <p>{t('label.jour')} : {jourLibelle}</p>
                                    <p>{t('label.matiere')} : {periode.pause ? t('label.pause') : matieresLibelle}</p>
                                    {!periode.pause && <p>{t('label.salle_cour')} : {sallesLibelle}</p>}
                                </div>
                            );
                        })}
                        </div>)
                }

            </div>}

            {/* texte en absolute */}
            <CurrentYearDate />

        </div>
    );
};
