import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import createToast from '../../../hooks/toastify';
import { createService, updateService } from '../../../services/settings/serviceAPI';
import { createServiceSlice, updateServiceSlice } from '../../../_redux/features/settings/serviceSlice';


function ModalCreateUpdate({ service, onDepartmentUpdated }: { service: Service | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [structure, setStructure] = useState<Structure>();
    const [nbPlaceStage, setNbPlaceStage] = useState<number>(0);

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorStructure, setErrorStructure] = useState("");
    

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    const { data: { structures } } = useSelector((state: RootState) => state.structureSlice) ?? [];
    useEffect(() => {
        if (service) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.service'));
            
            setNomFr(service.nomFr);
            setNomEn(service.nomEn);
            setDescriptionFr(service?.descriptionFr || "");
            setDescriptionEn(service?.descriptionEn || "");
            setStructure(service.structure);
            setNbPlaceStage(service.nbPlaceStage)
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.service'));
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setStructure(undefined);
            setNbPlaceStage(0)
        }
        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorStructure("");
            setIsFirstRender(false);
        }
    }, [service, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorStructure("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleStructureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStructureNom = e.target.value;
        var selectedStructure = null;
        if (lang === 'fr') {
            selectedStructure = structures.find(structure => structure.nomFr === selectedStructureNom);
        }else {
            selectedStructure = structures.find(structure => structure.nomEn === selectedStructureNom);
        }
        if (selectedStructure) {
            setStructure(selectedStructure);
            setErrorStructure("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || !structure) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom'));
            }
            if (!structure) {
                setErrorStructure(t('error.structure'));
            }
            return;
        } 
        // create
        if (!service) {
            if (structure._id) {
                await createService(
                    {
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        structure,
                        nbPlaceStage
                    },lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createServiceSlice({
                            service:{
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                structure: structure,
                                nbPlaceStage:e.data.nbPlaceStage,
                                _id: e.data._id,
                            }
                        }));
                        closeModal();
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else {
            if (structure._id) {
                await updateService(
                    {
                        
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        structure,
                        nbPlaceStage,
                        _id: service._id,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateServiceSlice({
                            id:e.data._id,
                            serviceData:{
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                structure: structure,
                                nbPlaceStage:e.data.nbPlaceStage,
                                _id: e.data._id,
                            }
                        }));
                        
                        closeModal();
                        onDepartmentUpdated(); // Appeler pour rafraîchir la liste
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }
    }


    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >

                <Label text={t('label.nom_chose_fr')} required />
                <Input
                    value={nomFr}
                    type='text'
                    setValue={(value) => { setNomFr(value); setErrorNomFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomFr} />

                <Label text={t('label.nom_chose_en')} required />
                <Input
                    value={nomEn}
                    type='text'
                    setValue={(value) => { setNomEn(value); setErrorNomEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomEn} />

                <Label text={t('label.description')} />
                <Input
                    value={descriptionFr}
                    type='text'
                    setValue={(value) => { setDescriptionFr(value) }}
                    hasBackground={true}
                />

                <Label text={t('label.description')} />
                <Input
                    value={descriptionEn}
                    type='text'
                    setValue={(value) => { setDescriptionEn(value)}}
                    hasBackground={true}
                />
                <Label text={t('label.nb_place_stage')} required />
                <Input
                    value={""+nbPlaceStage}
                    type='number'
                    setValue={(value) => { setNbPlaceStage(parseInt(value)) }}
                    hasBackground={true}
                />

                <Label text={t('label.structure')} required />
                <select
                    value={structure ? (lang === 'fr' ? structure.nomFr : structure.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.structure')}
                    onChange={handleStructureChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.structure')}</option>
                    {structures.map(structure => (
                        <option key={structure._id} value={lang === 'fr' ? structure.nomFr : structure.nomEn}>{lang === 'fr' ? structure.nomFr : structure.nomEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorStructure} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
