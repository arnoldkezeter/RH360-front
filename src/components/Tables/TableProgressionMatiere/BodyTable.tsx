import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import createToast from "../../../hooks/toastify";
import { apiUpdateEtatObjectif } from "../../../services/api_objectif";
import { updateObjectif } from "../../../_redux/features/objectif_slice";

const BodyTable = ({ data }: { data: ObjectifType[]}) => {
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageProgressionPermission = userPermissions.includes('gerer_progression_cours_objectif');

    const handleCheckboxChange = async (objectifIndex: number) => {
        if (hasManageProgressionPermission) {
            if (data) {
                data.map((objectif, idx) => {
                    if (idx === objectifIndex && objectif._id) {
                        // Créez un nouvel objet Objectif avec l'état mis à jour
                        const updatedObjectif = { ...objectif, etat: objectif.etat === 1 ? 0 : 1 };

                        // Appel de l'API de mise à jour du chapitre
                        apiUpdateEtatObjectif({
                            objectifId:objectif._id, 
                            etat:updatedObjectif.etat,
                        }).then((response) => {
                            // Gestion de la réponse de l'API
                            if (response.success) {
                                // Mettez à jour l'état de la matière avec les objectifs mis à jour
                                // setMatiereData((prevData: MatiereType | undefined) => {
                                //     if (!prevData || !prevData.objectifs) return prevData; // Retourne le state inchangé si prevData est undefined
                                //     return { ...prevData, objectifs: prevData.objectifs.map((o, idx) => idx === objectifIndex ? updatedObjectif : o) };
                                // });
                                
                                dispatch(
                                    updateObjectif({
                                        id: response.data._id,
                                        objectifData: {
                                            _id: response.data._id,
                                            annee:response.data.annee,
                                            semestre:response.data.semestre,
                                            code:response.data.code,
                                            libelleFr:response.data.libelleFr,
                                            libelleEn:response.data.libelleEn,
                                            etat:response.data.etat,
                                            matiere:response.data.matiere,
                                        }
                                    }));
                                // dispatch(
                                //     updateMatiere({
                                //         id: matiereData._id,
                                //         matiereData: {
                                //             ...matiereData,
                                //             objectifs: matiereData.objectifs.map((o, idx) => idx === objectifIndex ? updatedObjectif : o),
                                //         },
                                //     })
                                // );
                                
                                createToast(response.message[lang as keyof typeof response.message], '', 0);
                            } else {
                                createToast(response.message[lang as keyof typeof response.message], '', 2);
                            }
                        }).catch((error) => {
                            console.error('Error updating chapter:', error);
                            createToast(error.message, '', 2);
                        });

                        return updatedObjectif;
                    }
                    return objectif;
                });

                // Mettez à jour l'état de la matière avec les objectifs mis à jour
                // setMatiereData((prevData: MatiereType | undefined) => {
                //     if (!prevData) return prevData; // Retourne le state inchangé si prevData est undefined
                //     return { ...prevData, objectifs: updatedObjectifs };
                // });
            }
        }
    };

    return (
        <tbody>
            {data && data.map((objectif: ObjectifType, indexObjectif: number) => (
                <tr key={indexObjectif} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* Objectif de la matière */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                        <h5>{lang === 'fr' ? objectif.libelleFr : objectif.libelleEn }</h5>
                    </td>
                    {/* Case à cocher pour l'état de l'objectif */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <input className={`${(!hasManageProgressionPermission) ? '' : 'cursor-pointer'}`} type="checkbox" checked={objectif.etat === 1} onChange={() => handleCheckboxChange(indexObjectif)} />
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;
