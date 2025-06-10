import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../_redux/store"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import React from "react"
import { useTranslation } from "react-i18next"
import { getPeriodesByNiveau } from "../../../api/api_periode"

interface BodyPeriodeEnseignementProps {
    data: PeriodeEnseignementType | undefined;
}

const BodyTable = ({ data}: BodyPeriodeEnseignementProps) => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [periodes, setPeriodes] = useState<PeriodeType[] | null>(null);
    

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [nbSeanceCalcule, setNbSeanceCalcul]=useState<Map<MatiereEnseignement, number>>();
    // Récupérer le premier niveau du premier cycle
    
    useEffect(() => {
        const fetchPeriodes = async () => {
            try {

                if (data && data.niveau) {
                    const fetchedPeriodes = await getPeriodesByNiveau({ niveauId: data.niveau, annee: currentYear, semestre: currentSemester });
                    setPeriodes(fetchedPeriodes.periodes);
                }
            } catch (error) {
                // createToast(t('message.erreur'), "", 2);
            } finally {
            }
        };

        fetchPeriodes();
    }, [data]);

    return <tbody>
        {data?.enseignements && data?.enseignements.map((periode, index) => (
            <React.Fragment key={index}>
                <tr>
                    <th className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black text-center " colSpan={4}>
                        {lang === 'fr' ? periode.matiere.libelleFr : periode.matiere.libelleEn}
                    </th>
                </tr>
                <tr>
                    <td className="text-center">{t('label.nb_seance_periode')}</td>
                    <td className="text-center">{t('label.nb_seance_pratique')}</td>
                    <td className="text-center">{t('label.gap')}</td>
                    <td className="text-center">{t('label.taux_presence')}</td>
                </tr>
                <tr>
                    <td className="text-center">{periode.nombreSeance}</td>
                    <td className="text-center">{periode.nbSeancesPratiquees}</td>
                    <td className="text-center">{periode.nombreSeance-periode.nbSeancesPratiquees}</td>
                    <td className="text-center">{(periode.nbSeancesPratiquees/(periode.nombreSeance) * 100).toFixed(2)}%</td>
                </tr>
                {/* <tr>
                    <td className="text-center">{periode.nombreSeance}</td>
                    <td className="text-center">{calculateSeancesEffectuees(periode, periodes)}</td>
                    <td className="text-center">{periode.nombreSeance-calculateSeancesEffectuees(periode, periodes)}</td>
                    <td className="text-center">{(calculateSeancesEffectuees(periode, periodes)/(periode.nombreSeance) * 100).toFixed(2)}%</td>
                </tr> */}
            </React.Fragment>
        ))}
    </tbody>
}

export default BodyTable