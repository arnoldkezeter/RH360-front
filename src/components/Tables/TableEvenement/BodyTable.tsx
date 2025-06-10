import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonCrudTable from "../common/ButtonActionTable";
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";

const BodyTable = ({ data, onEdit }: { data: EvenementType[], onEdit: (evenement: EvenementType) => void }) => {
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const etats = useSelector((state: RootState) => state.dataSetting.dataSetting.etatsEvenement) ?? [];
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageCalendarPermission = userPermissions.includes('gerer_calendrier_academique');

    // State pour stocker la valeur de l'état sélectionné pour chaque événement
    const [selectedEtatMap, setSelectedEtatMap] = useState<{ [key: string]: CommonSettingProps | undefined }>({});

    // Fonction pour gérer le changement d'état sélectionné dans le dropdown pour un événement donné
    const handleEtatSelect = (selected: CommonSettingProps | undefined, eventId: string) => {
        setSelectedEtatMap({ ...selectedEtatMap, [eventId]: selected });
        // Mettre à jour l'état de l'événement dans la base de données ou l'état interne de votre application
    };

    // Effect pour initialiser les états sélectionnés au chargement de la page
    useEffect(() => {
        // Initialiser les états sélectionnés pour chaque événement dans le state
        const initialSelectedEtatMap: { [key: string]: CommonSettingProps | undefined } = {};
        data.forEach((item) => {
            // Trouver l'état correspondant à l'événement
            
            const selectedEtat = etats.find((etat) => etat._id === item.etat.toString());
            
            // Si un état correspondant est trouvé, l'ajouter au state
            if (selectedEtat) {
                initialSelectedEtatMap[item.code] = selectedEtat;
            }
        });
        setSelectedEtatMap(initialSelectedEtatMap);
    }, [data, etats]);

    return (
        <tbody>
            {data.map((item, index) => (
                <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* numero */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                        <h5>{index+1}</h5>
                    </td>

                    {/* libelle */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <h5>{lang === 'fr' ? item.libelleFr : item.libelleEn}</h5>
                    </td>

                    {/* periode */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                        <h5>{lang === 'fr' ? item.periodeFr : item.periodeEn}</h5>
                    </td>

                    {/* personnel */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                        <h5>{lang === 'fr' ? item.personnelFr : item.personnelEn}</h5>
                    </td>

                    {/* description/observation */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                        <h5>{lang === 'fr' ? item.descriptionObservationFr : item.descriptionObservationEn}</h5>
                    </td>

                    {/* État */}
                    {hasManageCalendarPermission ? (
                        <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                            <select
                                value={selectedEtatMap[item.code] ? lang === 'fr' ? selectedEtatMap[item.code]?.libelleFr : selectedEtatMap[item.code]?.libelleEn : ""}
                                onChange={() => handleEtatSelect(selectedEtatMap[item.code], item.code)}
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            >
                                {etats.map(etat => (
                                    <option key={etat._id} value={lang === 'fr' ? etat.libelleFr : etat.libelleEn}>{lang === 'fr' ? etat.libelleFr : etat.libelleEn}</option>
                                ))}
                            </select>
                        </td>
                    ) : (
                        <td className="border-b border-[#eee] py-0 px-4 dark:border-strokedark">
                            <h5>{selectedEtatMap[item.code] ? lang === 'fr' ? selectedEtatMap[item.code]?.libelleFr : selectedEtatMap[item.code]?.libelleEn : ""}</h5>
                        </td>
                    )}

                    {/* Action  bouton pour edit*/}
                    {hasManageCalendarPermission && (
                        <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                            <ButtonCrudTable
                                onClickEdit={() => {
                                    onEdit(item);
                                    dispatch(setShowModal());
                                }}
                                onClickDelete={() => {
                                    onEdit(item);
                                    dispatch(setShowModalDelete());
                                }}
                            />
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;
