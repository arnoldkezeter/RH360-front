import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { useNavigate } from "react-router-dom"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { setMatiereSelected } from "../../../_redux/features/matiere_slice"

interface BodyMatiereProps {
    data: MatiereType[];
    onEdit: (matiere: MatiereType) => void;
    semestre:number|undefined;
    annee:number|undefined
}

const BodyTable = ({ data, semestre,annee, onEdit }: BodyMatiereProps) => {
    // const [selectedMatiere, setSelectedMatiere] = useState<MatiereType>();
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageSubjectPermission = userPermissions.includes('gerer_matieres');
    const hasManageChapterPermission = userPermissions.includes('gerer_chapitres') || userPermissions.includes('consulter_liste_chapitres');
    const hasManageObjectivePermission = userPermissions.includes('gerer_objectifs') || userPermissions.includes('consulter_liste_objectifs')
    const hasManageActPedPermission = userPermissions.includes('gerer_activites_pedagogiques');
    const hasUpdateSubjectPermission = userPermissions.includes('modifier_information_matiere');
    
    const {t}=useTranslation();
  
    const dispatch = useDispatch();
    
    function nombreDeChapitres(matiere: MatiereType) {
        // Vérifier si la matière existe et si elle a une liste de chapitres
        if (matiere && matiere.chapitres && Array.isArray(matiere.chapitres)) {
            if(!annee && !semestre){
                // Retourner la longueur de la liste des chapitres
                return matiere.chapitres.length;
            }else{
                const chapitres = matiere.chapitres.filter(chap=> chap.annee==annee && chap.semestre==semestre);
                return chapitres.length;
            }
        } else {
            // Si la matière est invalide ou n'a pas de chapitres, retourner 0
            return 0;
        }
    }

    function volumeHoraireGlobal(matiere: MatiereType) {
        let volumeTotal = 0;

        // Vérifier si la matière existe et si elle a une liste de chapitres
        if (matiere && matiere.chapitres && Array.isArray(matiere.chapitres)) {
            // Parcourir tous les chapitres de la matière
            let chapitres = matiere.chapitres;
            if(annee && semestre){
                chapitres = matiere.chapitres.filter(chap=> chap.annee==annee && chap.semestre==semestre);
            }
            chapitres.forEach(chapitre => {
                // Vérifier si le chapitre a une liste de types d'enseignement
                if (chapitre.typesEnseignement && Array.isArray(chapitre.typesEnseignement)) {
                    // Ajouter le volume horaire de chaque type d'enseignement du chapitre au volume total
                    
                    chapitre.typesEnseignement.forEach(typeEnseignement => {
                        if (typeEnseignement.volumeHoraire) {
                            volumeTotal += typeEnseignement.volumeHoraire;
                        }
                    });
                }
            });
        }

        return volumeTotal;
    }
    



    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0  pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* code */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* libelle */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> {lang === 'fr' ? item.libelleFr : item.libelleEn}</h5>
                </td>

                {/* nombre de chapitre */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{nombreDeChapitres(item)}</h5>
                </td>

                {/* volume horaire */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{volumeHoraireGlobal(item)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark flex justify-center items-center">
                    {(hasManageActPedPermission || hasManageChapterPermission || hasManageObjectivePermission) && (() => {
                        // Construire dynamiquement la liste des pages en fonction des permissions
                        const listPage = [];

                        if (hasManageActPedPermission) {
                            listPage.push({
                                name: t('label.types_ens'),
                                handleClick: () => {
                                    dispatch(setMatiereSelected(item));
                                    navigate('/subjects/enseignements/manage');
                                },
                            });
                        }

                        if (hasManageChapterPermission) {
                            listPage.push({
                                name: t('label.chapitres'),
                                handleClick: () => {
                                    dispatch(setMatiereSelected(item));
                                    navigate('/subjects/chapitres/manage');
                                },
                            });
                        }

                        if (hasManageObjectivePermission) {
                            listPage.push({
                                name: t('label.objectifs'),
                                handleClick: () => {
                                    dispatch(setMatiereSelected(item));
                                    navigate('/subjects/objectifs/manage');
                                },
                            });
                        }

                        return listPage.length > 0 ? (
                            <SelectButton listPage={listPage} />
                        ) : null;
                    })()}
                    
                    <ButtonCrudTable
                        onClickEdit={
                            (hasUpdateSubjectPermission)
                                ? () => {
                                    onEdit(item);
                                    dispatch(setShowModal());
                                }
                                : undefined
                        }
                        onClickDelete={
                            hasManageSubjectPermission
                                ? () => {
                                    onEdit(item);
                                    dispatch(setShowModalDelete());
                                }
                                : undefined
                        }
                    />
                </td>

            </tr>
        ))}
    </tbody>
}

export default BodyTable