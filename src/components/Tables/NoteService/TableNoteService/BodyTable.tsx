import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete, setShowModalUploadDoc } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";
import { useTranslation } from "react-i18next";
import { formatDate, getTitleElement, getTypeNoteService } from "../../../../fonctions/fonction";
import { SelectButton } from "../../common/composants/SelectButton";
import { telechargerNoteService } from "../../../../services/notes/noteServiceAPI";
import createToast from "../../../../hooks/toastify";

const BodyTable = ({ data, onEdit}: { data: NoteService[], onEdit: (noteService: NoteService) => void }) => {

    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const {t} = useTranslation();
    const handleDownload = async (note: NoteService) => {
        try {
            await telechargerNoteService(note._id||"", lang).then((e: Blob) => {
                if (e) {
                    const url = window.URL.createObjectURL(e);
                    const link = document.createElement('a');
                    
                    // Nom du fichier : extrait depuis le chemin du backend ou par défaut
                    const fileName = note.filePath?.split('/').pop() || 'document.pdf';
                    
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link); // Nécessaire pour Firefox
                    link.click();
                    link.remove();
            
                    window.URL.revokeObjectURL(url);

                } else {
                    
                    createToast('message.erreur', '', 2);

                }
            }).catch(async (e) => {
                const blob = e.response.data as Blob;
                if (blob.type === 'application/json') {
                    // Lire le blob JSON
                    const text = await blob.text(); // lire le blob en texte
                    const json = JSON.parse(text);  // parser en JSON
                    createToast(json.message || json, '', 2);
                } else {
                    console.error('Erreur backend non JSON:', e.message);
                }
                
            })
            
                // Libère la mémoire

        } catch (e) {
            console.error('Erreur lors du téléchargement du support :', e);
        }
    };
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{index + 1}</h5>
                    </div>
                </td>

                {/* reference */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.reference||""}</h5>
                    </div>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{lang==='fr'?item.titreFr:item.titreEn}</h5>
                    </div>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{getTypeNoteService(item.typeNote,item.sousTypeConvocation||"",t)}</h5>
                    </div>
                </td>

                {/* Elment */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark  align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{getTitleElement(item, lang)}</h5>
                    </div>
                </td>

                {/* Valide */}
                 <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.valideParDG?t('label.oui'):t('label.non')}</h5>
                    </div>
                </td>

                {/* Date de création */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark  align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{formatDate(item.updatedAt||"")}</h5>
                    </div>
                </td>

                 {/* Date de modification */}
                 <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{formatDate(item.createdAt||"")}</h5>
                    </div>
                </td>
                
                

                {/* Action bouton pour edit */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-0 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center justify-center">
                        <ButtonCrudTable
                            onClickDelete={() => {
                                onEdit(item);
                                dispatch(setShowModalDelete())
                            }}
                        />
                        {(() => {
                        // Construire dynamiquement la liste des pages en fonction des permissions
                            const listPage = [];

                            listPage.push({
                                name: t('label.valide'),
                                handleClick: () => {
                                    onEdit(item);
                                    dispatch(setShowModalUploadDoc())
                                },
                            });

                            listPage.push({
                                name: t('label.telecharger'),
                                handleClick:  () => {
                                    handleDownload(item)
                                },
                            });


                            return listPage.length > 0 ? (
                                <SelectButton listPage={listPage} />
                            ) : null;
                        })()}
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable