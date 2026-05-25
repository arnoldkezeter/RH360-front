import React, { useEffect, useState } from 'react';
import {
    Building2, Search, Plus, Trash2, UserPlus, Info, Users
} from 'lucide-react';
import FilterList from '../../../ui/AutoComplete';
import { useTranslation } from 'react-i18next';
import { getStagiairesByEtablissements, getStagiairesByFiltres } from '../../../../services/stagiaires/stagiaireAPI';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { RootState } from '../../../../_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { searchStructure } from '../../../../services/settings/structureAPI';
import { searchEtablissement } from '../../../../services/settings/etablissementAPI';
import { createStage, updateStage } from '../../../../services/stagiaires/stageAPI';
import createToast from '../../../../hooks/toastify';
import { createStageSlice, updateStageSlice } from '../../../../_redux/features/stagiaire/stageSlice';
import Skeleton from 'react-loading-skeleton';
import { Spinner } from '../../../ui/loading';

interface BatchStageTabProps {
    stageToEdit?: Stage | null;
    onEditComplete?: () => void;
    pageIsLoading: boolean;
}

interface StagiaireAffectation {
    stagiaire: Stagiaire;
    structureId: string;
    superviseurId: string;
    dateDebut: string;
    dateFin: string;
    _structureRef?: Structure;
    _superviseurRef?: Utilisateur;
}

export const BatchStageTab = ({ stageToEdit, onEditComplete, pageIsLoading }: BatchStageTabProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang: string = useSelector((state: RootState) => state.setting.language) || 'fr';

    const [nomFr, setNomFr] = useState('');
    const [nomEn, setNomEn] = useState('');
    const [etablissement, setEtablissement] = useState<Etablissement | undefined>();
    const [affectations, setAffectations] = useState<StagiaireAffectation[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoadingStagiaires, setIsLoadingStagiaires] = useState(false);

    // ── Pré-remplissage en mode édition ──────────────────────────────────────
    useEffect(() => {
        if (stageToEdit && stageToEdit.type === 'BATCH') {
            setNomFr(stageToEdit.nomFr || '');
            setNomEn(stageToEdit.nomEn || '');
            setEtablissement(stageToEdit.etablissement);

            if (stageToEdit.stagiaires && stageToEdit.affectationsFinales) {
                const aff: StagiaireAffectation[] = stageToEdit.stagiaires.map((s) => {
                    const affectation = stageToEdit.affectationsFinales?.find(
                        (a) => a.stagiaire?._id === s._id
                    );
                    return {
                        stagiaire: s,
                        structureId: affectation?.structure?._id || '',
                        superviseurId: affectation?.superviseur?._id || '',
                        dateDebut: affectation?.dateDebut
                            ? new Date(affectation.dateDebut).toISOString().split('T')[0]
                            : '',
                        dateFin: affectation?.dateFin
                            ? new Date(affectation.dateFin).toISOString().split('T')[0]
                            : '',
                        _structureRef: affectation?.structure,
                        _superviseurRef: affectation?.superviseur,
                    };
                });
                setAffectations(aff);
            }
        } else {
            resetForm();
        }
    }, [stageToEdit]);

    const resetForm = () => {
        setNomFr('');
        setNomEn('');
        setEtablissement(undefined);
        setAffectations([]);
    };

    // ── Recherches ────────────────────────────────────────────────────────────
    const onSearchEtablissement = async (search: string) => {
        const data = await searchEtablissement({ searchString: search, lang });
        return data?.etablissements || [];
    };

    const onSearchStructure = async (search: string) => {
        const data = await searchStructure({ searchString: search, lang });
        return data?.structures || [];
    };

    const onSearchSuperviseur = async (search: string) => {
        const data = await searchUtilisateur({ searchString: search, lang });
        return data?.utilisateurs || [];
    };

    const onSearchStagiaire = async (search: string) => {
        const data = await getStagiairesByFiltres({ page: 1, search, lang });
        return data?.stagiaires || [];
    };

    // ── Sélection établissement → charger ses stagiaires ─────────────────────
    const handleEtablissementSelect = async (selected: Etablissement | string) => {
        if (typeof selected === 'string') return;
        setEtablissement(selected);
        setNomFr(`Stage ${lang === 'fr' ? selected.nomFr : selected.nomEn}`);
        setNomEn(`Internship ${selected.nomEn || selected.nomFr}`);

        // Charger automatiquement les stagiaires de cet établissement
        setIsLoadingStagiaires(true);
        const etsIds : string[]=[selected._id||""]
        try {
            const data = await getStagiairesByEtablissements({
                etablissementIds: etsIds,
                lang
            });
            const stagiaires: Stagiaire[] =
                data?.stagiairesByEtablissement?.[selected._id || '']?.stagiaires || [];

            if (stagiaires.length === 0) {
                createToast(
                    t('label.aucun_stage_trouve'),
                    '',
                    1
                );
                setAffectations([]);
                return;
            }

            // Créer une affectation vide par stagiaire
            const nouvellesAffectations: StagiaireAffectation[] = stagiaires.map((s) => ({
                stagiaire: s,
                structureId: '',
                superviseurId: '',
                dateDebut: '',
                dateFin: '',
            }));
            setAffectations(nouvellesAffectations);
            createToast(
                `${stagiaires.length} stagiaire(s) chargé(s)`,
                '',
                0
            );
        } catch {
            createToast(t('error.erreur_chargement'), '', 2);
        } finally {
            setIsLoadingStagiaires(false);
        }
    };

    // ── Ajout manuel d'un stagiaire ───────────────────────────────────────────
    const handleAddStagiaire = (selected: Stagiaire | string) => {
        if (typeof selected === 'string') return;
        const already = affectations.some((a) => a.stagiaire._id === selected._id);
        if (already) {
            createToast(
                t('label.stagiaire_deja_ajoute'),
                '',
                1
            );
            return;
        }
        setAffectations([
            ...affectations,
            {
                stagiaire: selected,
                structureId: '',
                superviseurId: '',
                dateDebut: '',
                dateFin: '',
            },
        ]);
    };

    const handleRemoveStagiaire = (index: number) => {
        setAffectations(affectations.filter((_, i) => i !== index));
    };

    // ── Mise à jour d'une affectation ─────────────────────────────────────────
    const handleAffectationChange = (
        index: number,
        field: keyof StagiaireAffectation,
        value: any,
        extraFields?: Partial<StagiaireAffectation>  // ← ajout
    ) => {
        setAffectations(
            affectations.map((a, i) =>
                i === index ? { ...a, [field]: value, ...extraFields } : a
            )
        );
    };

    // ── Appliquer les mêmes dates à tous ──────────────────────────────────────
    const [globalDateDebut, setGlobalDateDebut] = useState('');
    const [globalDateFin, setGlobalDateFin] = useState('');

    const applyGlobalDates = () => {
        if (!globalDateDebut || !globalDateFin) {
            createToast(
                t('error.renseigner_date'),
                '',
                2
            );
            return;
        }
        setAffectations(
            affectations.map((a) => ({
                ...a,
                dateDebut: globalDateDebut,
                dateFin: globalDateFin,
            }))
        );
        createToast(
            t('message.date_appliquee'),
            '',
            0
        );
    };

    // ── Soumission ────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        // Validations
        if (!etablissement) {
            createToast(
                t('message.selection_etablissement'),
                '',
                2
            );
            return;
        }
        console.log(affectations)
        if (affectations.length < 2) {
            createToast(
                t('error.bacth_min_2_stagiaires'),
                '',
                2
            );
            return;
        }
        const invalid = affectations.filter(
            (a) => !a.structureId || !a.dateDebut || !a.dateFin
        );
        
        if (invalid.length > 0) {
            createToast(`
                ${invalid.length} ${t('error.stagiaires_sans_structure')}`,
                '',
                2
            );
            return;
        }

        const dateDebutGlobale = affectations
            .map((a) => new Date(a.dateDebut).getTime())
            .sort((a, b) => a - b)[0];
        const dateFinGlobale = affectations
            .map((a) => new Date(a.dateFin).getTime())
            .sort((a, b) => b - a)[0];

        const affectationsFinales = affectations.map((a) => ({
            stagiaire: a.stagiaire._id,
            structure: a.structureId,
            superviseur: a.superviseurId || undefined,
            dateDebut: a.dateDebut,
            dateFin: a.dateFin,
        }));

        const payload = {
            nomFr,
            nomEn,
            type: 'BATCH' as const,
            stagiaires: affectations.map((a) => a.stagiaire._id!),
            etablissement: etablissement._id!,
            affectationsFinales,
            dateDebut: new Date(dateDebutGlobale).toISOString(),
            dateFin: new Date(dateFinGlobale).toISOString(),
            anneeStage: new Date(dateDebutGlobale).getFullYear(),
            statut: 'EN_ATTENTE' as const,
        };

        setIsCreating(true);
        try {
            if (!stageToEdit) {
                await createStage(payload, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(
                            createStageSlice({
                                stage: {
                                    _id: e.data._id,
                                    nomFr: e.data.nomFr,
                                    nomEn: e.data.nomEn,
                                    type: e.data.type,
                                    statut: e.data.statut,
                                    dateDebut: e.data.dateDebut,
                                    dateFin: e.data.dateFin,
                                    anneeStage: e.data.anneeStage,
                                },
                            })
                        );
                        resetForm();
                    } else {
                        createToast(e.message, '', 2);
                    }
                });
            } else {
                await updateStage(payload, stageToEdit._id || '', lang).then(
                    (e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message, '', 0);
                            dispatch(
                                updateStageSlice({
                                    id: e.data._id,
                                    stageData: {
                                        _id: e.data._id,
                                        nomFr: e.data.nomFr,
                                        nomEn: e.data.nomEn,
                                        type: e.data.type,
                                        statut: e.data.statut,
                                        dateDebut: e.data.dateDebut,
                                        dateFin: e.data.dateFin,
                                        anneeStage: e.data.anneeStage,
                                    },
                                })
                            );
                            onEditComplete?.();
                        } else {
                            createToast(e.message, '', 2);
                        }
                    }
                );
            }
        } catch (err: any) {
            createToast(err.message || t('message.erreur'), '', 2);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] dark:from-[#1f2937] dark:to-[#374151] rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#16a34a]" />
                    {stageToEdit
                        ? t('label.modifier_stage_batch') || 'Modifier le stage (établissement)'
                        : t('label.stage_batch') || 'Stage par établissement (BATCH)'}
                </h3>
                <p className="text-[#4b5563] dark:text-[#d1d5db] text-sm">
                    {t('page_description.stage_batch') ||
                        'Plusieurs stagiaires du même établissement avec une affectation individuelle par stagiaire — une seule note de service générée.'}
                </p>
            </div>

            {/* Noms du stage */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <h4 className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] mb-4">
                    {t('label.information_stage') || 'Informations du stage'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pageIsLoading ? (
                        <Skeleton height={40} />
                    ) : (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[#4b5563] uppercase tracking-wide">
                                {t('label.nom_chose_fr')}
                            </label>
                            <input
                                type="text"
                                value={nomFr}
                                onChange={(e) => setNomFr(e.target.value)}
                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                            />
                        </div>
                    )}
                    {pageIsLoading ? (
                        <Skeleton height={40} />
                    ) : (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[#4b5563] uppercase tracking-wide">
                                {t('label.nom_chose_en')}
                            </label>
                            <input
                                type="text"
                                value={nomEn}
                                onChange={(e) => setNomEn(e.target.value)}
                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Sélection de l'établissement */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <h4 className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#16a34a]" />
                    {t('label.etablissement') || 'Établissement'}
                    <span className="text-red-500">*</span>
                </h4>
                {pageIsLoading ? (
                    <Skeleton height={40} />
                ) : (
                    <FilterList
                        items={[]}
                        placeholder={
                            t('recherche.rechercher') + (t('recherche.etablissement') || ' un établissement')
                        }
                        displayProperty={(item) =>
                            lang === 'fr' ? item.nomFr : item.nomEn
                        }
                        onSelect={handleEtablissementSelect}
                        enableBackendSearch={true}
                        onSearch={onSearchEtablissement}
                        searchDelay={300}
                        minSearchLength={2}
                        defaultValue={etablissement}
                        noResultsMessage={t('label.aucun_etablissement') || 'Aucun établissement trouvé'}
                        loadingMessage={t('label.recherche_etablissement') || 'Recherche...'}
                    />
                )}
                {isLoadingStagiaires && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#16a34a]">
                        <Spinner />
                        {/* {t("label.chargement...")} */}
                    </div>
                )}
            </div>

            {/* Ajout manuel d'un stagiaire supplémentaire */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <h4 className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#16a34a]" />
                    {t('label.ajouter_manuellement_stage')}
                </h4>
                {pageIsLoading ? (
                    <Skeleton height={40} />
                ) : (
                    <FilterList
                        items={[]}
                        placeholder={
                            t('recherche.rechercher') + t('recherche.stagiaire')
                        }
                        displayProperty={(item) =>
                            `${item.nom} ${item?.prenom || ''}`
                        }
                        onSelect={handleAddStagiaire}
                        enableBackendSearch={true}
                        onSearch={onSearchStagiaire}
                        searchDelay={300}
                        minSearchLength={2}
                        noResultsMessage={t('label.aucun_stagiaire')}
                        loadingMessage={t('label.recherche_stagiaire')}
                    />
                )}
            </div>

            {/* Dates communes (raccourci) */}
            {affectations.length > 0 && (
                <div className="bg-[#f0fdf4] dark:bg-[#14532d]/20 border border-[#bbf7d0] dark:border-[#166534] rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-[#166534] dark:text-[#4ade80] mb-3">
                        ⚡{' '}
                        {t('label.appliquer_memes_dates')}
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="space-y-1 flex-1">
                            <label className="text-xs font-medium text-[#4b5563] uppercase tracking-wide">
                                {t('label.date_debut')}
                            </label>
                            <input
                                type="date"
                                value={globalDateDebut}
                                onChange={(e) => setGlobalDateDebut(e.target.value)}
                                className="w-full h-10 border border-[#e5e7eb] rounded-md px-3 text-sm
                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-1 flex-1">
                            <label className="text-xs font-medium text-[#4b5563] uppercase tracking-wide">
                                {t('label.date_fin')}
                            </label>
                            <input
                                type="date"
                                value={globalDateFin}
                                onChange={(e) => setGlobalDateFin(e.target.value)}
                                className="w-full h-10 border border-[#e5e7eb] rounded-md px-3 text-sm
                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={applyGlobalDates}
                            className="h-10 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm
                                     font-medium rounded-md transition-colors whitespace-nowrap"
                        >
                            {t('button.appliquer_tous')}
                        </button>
                    </div>
                </div>
            )}

            {/* Tableau des affectations par stagiaire */}
            {affectations.length > 0 && (
                <div className="bg-white dark:bg-[#1f2937] rounded-xl border border-[#e5e7eb] dark:border-[#374151] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#374151] flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#16a34a]" />
                            {`${t("label.affectation_stagiaire")} (${affectations.length})`}
                        </h4>
                    </div>

                    {pageIsLoading ? (
                        <div className="p-6">
                            <Skeleton height={200} />
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                            {affectations.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-5 hover:bg-[#f9fafb] dark:hover:bg-[#374151]/50 transition-colors"
                                >
                                    {/* Nom du stagiaire + bouton supprimer */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#dcfce7] dark:bg-[#14532d] flex items-center justify-center text-sm font-bold text-[#16a34a]">
                                                {index + 1}
                                            </div>
                                            <span className="font-semibold text-[#111827] dark:text-white">
                                                {item.stagiaire.nom}{' '}
                                                {item.stagiaire.prenom || ''}
                                            </span>
                                            {item.stagiaire.genre && (
                                                <span className="text-xs text-[#6b7280] bg-[#f3f4f6] dark:bg-[#374151] px-2 py-0.5 rounded-full">
                                                    {item.stagiaire.genre === 'M'
                                                        ? 'M.'
                                                        : 'Mme'}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStagiaire(index)}
                                            className="p-1.5 text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Structure + Superviseur + Dates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                        {/* Structure */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                                {t('label.structure')}{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <FilterList
                                                items={[]}
                                                placeholder={
                                                    t('recherche.rechercher') +
                                                    t('recherche.structure')
                                                }
                                                displayProperty={(it) =>
                                                    lang === 'fr' ? it.nomFr : it.nomEn
                                                }
                                                onSelect={(selected) => {
                                                    if (typeof selected === 'string') return;
                                                    handleAffectationChange(
                                                        index,
                                                        'structureId',
                                                        selected._id,
                                                        { _structureRef: selected }  // ← les deux en un seul appel
                                                    );
                                                }}
                                                enableBackendSearch={true}
                                                onSearch={onSearchStructure}
                                                searchDelay={300}
                                                minSearchLength={2}
                                                defaultValue={item._structureRef}
                                                noResultsMessage={t('label.aucune_structure')}
                                                loadingMessage={t('label.recherche_structure')}
                                            />
                                        </div>

                                        {/* Superviseur */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                                {t('label.superviseur')}{' '}
                                                <span className="text-[#9ca3af] text-xs normal-case">
                                                    (optionnel)
                                                </span>
                                            </label>
                                            <FilterList
                                                items={[]}
                                                placeholder={
                                                    t('recherche.rechercher') +
                                                    t('recherche.superviseur')
                                                }
                                                displayProperty={(it) =>
                                                    `${it.nom} ${it.prenom || ''}`
                                                }
                                                onSelect={(selected) => {
                                                    if (typeof selected === 'string') return;
                                                    handleAffectationChange(
                                                        index,
                                                        'superviseurId',
                                                        selected._id,
                                                        { _superviseurRef: selected }  // ← idem
                                                    );
                                                }}
                                                enableBackendSearch={true}
                                                onSearch={onSearchSuperviseur}
                                                searchDelay={300}
                                                minSearchLength={2}
                                                defaultValue={item._superviseurRef}
                                                noResultsMessage={t('label.aucun_superviseur')}
                                                loadingMessage={t('label.recherche_superviseur')}
                                            />
                                        </div>

                                        {/* Date début */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                                {t('label.date_debut')}{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={item.dateDebut}
                                                onChange={(e) =>
                                                    handleAffectationChange(
                                                        index,
                                                        'dateDebut',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                                            />
                                        </div>

                                        {/* Date fin */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                                {t('label.date_fin')}{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={item.dateFin}
                                                onChange={(e) =>
                                                    handleAffectationChange(
                                                        index,
                                                        'dateFin',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                         bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                         focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bouton de soumission */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || affectations.length < 2 || !etablissement}
                    className={`px-8 py-3 bg-gradient-to-r from-[#16a34a] to-[#15803d]
                               hover:from-[#15803d] hover:to-[#166534] text-white font-semibold rounded-xl
                               shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                               transition-all duration-200 flex items-center justify-center gap-2
                               ${isCreating || affectations.length < 2 || !etablissement
                                   ? 'opacity-75 cursor-not-allowed'
                                   : ''}`}
                >
                    {isCreating ? (
                        <>
                            <Spinner />
                            {stageToEdit
                                ? t('label.modification_en_cours')
                                : t('label.creation_en_cours')}
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            {stageToEdit
                                ? t('label.modifier_stage')
                                : t('button.cree_stage_batch')}
                        </>
                    )}
                </button>
            </div>

            {/* Note d'aide */}
            <div className="bg-[#f0fdf4] dark:bg-[#14532d]/20 border border-[#bbf7d0] dark:border-[#166534] rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#16a34a] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#166534] dark:text-[#4ade80]">
                    <p className="font-medium mb-1">
                        {t('label.conseil')}
                    </p>
                    <p className="text-[#15803d] dark:text-[#86efac]">
                        {t('label.conseil_stage_batch')}
                    </p>
                </div>
            </div>
        </div>
    );
};