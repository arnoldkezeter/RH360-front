import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  UserPlus,
  Info,
  UserCheck,
  Calendar,
  Building,
  Shuffle,
  Clock,
  Settings,
  RotateCcw,
  MapPin
} from 'lucide-react';
import FilterList from '../../../ui/AutoComplete';
import { useTranslation } from 'react-i18next';
import { getStagiairesByFiltres, searchStagiaire } from '../../../../services/stagiaires/stagiaireAPI';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { RootState } from '../../../../_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { searchService } from '../../../../services/settings/serviceAPI';
import { createStage, updateStage } from '../../../../services/stagiaires/stageAPI';
import createToast from '../../../../hooks/toastify';
import { createStageSlice, updateStageSlice } from '../../../../_redux/features/stagiaire/stageSlice';
import Loading, { Spinner } from '../../../ui/loading';
import Skeleton from 'react-loading-skeleton';
import { searchEtablissement } from '../../../../services/settings/etablissementAPI';
import EtablissementSelector from './EtablissementSelector';

interface GroupStageTabProps {
  stageToEdit?: Stage | null;
  onEditComplete?: () => void;
  pageIsLoading?:boolean;
}

interface GroupData {
  numero: number;
  stagiaires: Stagiaire[];
  stagiaireIds: string[];
}

interface ServiceConfig {
  service: Service | undefined;
  superviseur: Utilisateur | undefined;
  serviceId: string;
  superviseurId: string;
}

interface RotationData {
  groupe: number;
  service: string;
  superviseur: string;
  dateDebut: string;
  dateFin: string;
  serviceRef?: Service;
  superviseurRef?: Utilisateur;
}

interface AffectationFinaleData {
  groupe: number;
  service: string;
  superviseur: string;
  dateDebut: string;
  dateFin: string;
  serviceRef?: Service;
  superviseurRef?: Utilisateur;
}

export const GroupStageInterface = ({ stageToEdit, onEditComplete, pageIsLoading }: GroupStageTabProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const lang: string = useSelector((state: RootState) => state.setting.language) || 'fr';
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");

    // Étape 1: Sélection des stagiaires et configuration des groupes
    const [selectedStagiaires, setSelectedStagiaires] = useState<Stagiaire[]>([]);
    const [selectedStagiaireIds, setSelectedStagiaireIds] = useState<string[]>([]);
    const [stagiaireParGroupe, setStagiaireParGroupe] = useState<number>(3);
    const [groupes, setGroupes] = useState<GroupData[]>([]);
    const [groupesGeneres, setGroupesGeneres] = useState<boolean>(false);

    // Étape 2: Configuration des services et rotations
    const [servicesConfig, setServicesConfig] = useState<ServiceConfig[]>([]);
    const [dateDebutStage, setDateDebutStage] = useState<string>("");
    const [dateFinStage, setDateFinStage] = useState<string>("");
    const [joursParRotation, setJoursParRotation] = useState<number>(7);
    const [rotations, setRotations] = useState<RotationData[]>([]);
    const [rotationsGenerees, setRotationsGenerees] = useState<boolean>(false);
    const [isCreating, setIsCreation] = useState<boolean>(false);
    // Étape 3: Affectations finales
    const [affectationsFinales, setAffectationsFinales] = useState<AffectationFinaleData[]>([]);
    
    // Effect pour remplir le formulaire en mode édition
    useEffect(() => {
        console.log(stageToEdit);
        if (stageToEdit) {
            // Informations de base
            setNomFr(stageToEdit.nomFr || "");
            setNomEn(stageToEdit.nomEn || "");
            
            // Dates du stage
            setDateDebutStage(stageToEdit.dateDebut ? stageToEdit.dateDebut.split('T')[0] : "");
            setDateFinStage(stageToEdit.dateFin ? stageToEdit.dateFin.split('T')[0] : "");
            
            // Remplissage des groupes et stagiaires
            if (stageToEdit.groupes && stageToEdit.groupes.length > 0) {
                // Extraire tous les stagiaires de tous les groupes
                const tousLesStagiaires: Stagiaire[] = [];
                const stagiaireIds: string[] = [];
                
                stageToEdit.groupes.forEach(groupe => {
                    if (groupe.stagiaires && groupe.stagiaires.length > 0) {
                        groupe.stagiaires.forEach(stagiaire => {
                            tousLesStagiaires.push(stagiaire);
                            stagiaireIds.push(stagiaire._id||"");
                        });
                    }
                });
                
                setSelectedStagiaires(tousLesStagiaires);
                setSelectedStagiaireIds(stagiaireIds);
                
                // Reconstituer les groupes dans le format GroupData attendu
                const groupesFormates: GroupData[] = stageToEdit.groupes.map(groupe => ({
                    numero: groupe.numero,
                    stagiaires: groupe.stagiaires, // Objets Stagiaire complets
                    stagiaireIds: groupe.stagiaires.map(stagiaire => stagiaire._id||"") // IDs seulement
                }));
                
                setGroupes(groupesFormates);
                setGroupesGeneres(true);
                
                // Calculer la moyenne de stagiaires par groupe
                const moyenneStagiaires = Math.ceil(tousLesStagiaires.length / stageToEdit.groupes.length);
                setStagiaireParGroupe(moyenneStagiaires);
            }
            
            // Remplissage des rotations
            if (stageToEdit.rotations && stageToEdit.rotations.length > 0) {
                // Reconstituer les rotations dans le format RotationData attendu
                const rotationsFormatees: RotationData[] = stageToEdit.rotations.map(rotation => ({
                    groupe: rotation.groupe ? rotation.groupe.numero : 0, // number requis
                    service: rotation.service._id||"",
                    superviseur: rotation?.superviseur?._id||"",
                    dateDebut: rotation.dateDebut.split('T')[0],
                    dateFin: rotation.dateFin.split('T')[0],
                    serviceRef: rotation.service,
                    superviseurRef: rotation.superviseur
                }));
                
                setRotations(rotationsFormatees);
                setRotationsGenerees(true);
                
                // Extraire les services configurés des rotations
                const servicesUtilises = new Map<string, ServiceConfig>();
                stageToEdit.rotations.forEach(rotation => {
                    const serviceId = rotation.service._id;
                    if (!servicesUtilises.has(serviceId||"")) {
                        servicesUtilises.set(serviceId||"", {
                            serviceId: serviceId||"",
                            superviseurId: rotation.superviseur?._id||"",
                            service: rotation.service,
                            superviseur: rotation.superviseur
                        });
                    }
                });
                
                setServicesConfig(Array.from(servicesUtilises.values()));
                
                // Calculer les jours par rotation (prendre la première rotation comme référence)
                if (stageToEdit.rotations.length > 0) {
                    const premiereRotation = stageToEdit.rotations[0];
                    const dateDebut = new Date(premiereRotation.dateDebut);
                    const dateFin = new Date(premiereRotation.dateFin);
                    const joursCalcules = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    setJoursParRotation(joursCalcules);
                }
            }
            
            // Remplissage des affectations finales
            if (stageToEdit.affectationsFinales && stageToEdit.affectationsFinales.length > 0) {
                const affectationsFormatees: AffectationFinaleData[] = stageToEdit.affectationsFinales.map(affectation => ({
                    groupe: affectation.groupe ? affectation.groupe.numero : 0, // number requis
                    service: affectation?.service?._id||"",
                    superviseur: affectation.superviseur ? affectation.superviseur._id||"" : "",
                    dateDebut: affectation.dateDebut.split('T')[0],
                    dateFin: affectation.dateFin.split('T')[0],
                    serviceRef: affectation.service,
                    superviseurRef: affectation.superviseur || undefined
                }));
                
                setAffectationsFinales(affectationsFormatees);
            }
                        
            
        } else {
            // Réinitialiser le formulaire
            resetForm();
        }
    }, [stageToEdit]);

    // Version mise à jour de resetForm pour s'assurer que tous les champs sont réinitialisés
    const resetForm = () => {
        setNomFr("");
        setNomEn("");
        setSelectedStagiaires([]);
        setSelectedStagiaireIds([]);
        setStagiaireParGroupe(3);
        setGroupes([]);
        setGroupesGeneres(false);
        setServicesConfig([]);
        setDateDebutStage("");
        setDateFinStage("");
        setJoursParRotation(5);
        setRotations([]);
        setRotationsGenerees(false);
        setAffectationsFinales([]);
    };

    const onSearchStagiaire = async (search: string) => {
        const data = await getStagiairesByFiltres({ page: 1, search: search, lang });
        return data?.stagiaires || [];
    };

    const onSearchEtablissement = async (search: string) => {
        const data = await searchEtablissement({ searchString: search, lang });
        return data?.etablissements || [];
    };

    const onSearchSuperviseur = async (search: string) => {
        const data = await searchUtilisateur({ searchString: search, lang });
        return data?.utilisateurs || [];
    };

    const onSearchService = async (search: string) => {
        const data = await searchService({ searchString: search, lang });
        return data?.services || [];
    };

    // ÉTAPE 1: Gestion des stagiaires et groupes
    const handleStagiaireAdd = (selected: Stagiaire | string) => {
        if (typeof selected === "string") return;

        if (selected._id && !selectedStagiaireIds.includes(selected._id)) {
            setSelectedStagiaires([...selectedStagiaires, selected]);
            setSelectedStagiaireIds([...selectedStagiaireIds, selected._id]);
        }
    };

    const handleStagiaireRemove = (stagiaireIndex: number) => {
        const updatedStagiaires = selectedStagiaires.filter((_, idx) => idx !== stagiaireIndex);
        const updatedIds = selectedStagiaireIds.filter((_, idx) => idx !== stagiaireIndex);
        setSelectedStagiaires(updatedStagiaires);
        setSelectedStagiaireIds(updatedIds);
    };

    const genererGroupesAutomatiquement = () => {
        if (selectedStagiaires.length === 0) {
            createToast("Veuillez sélectionner au moins un stagiaire", "", 2);
            return;
        }

        // Mélanger les stagiaires pour une répartition aléatoire
        const stagiairesMelanges = [...selectedStagiaires].sort(() => Math.random() - 0.5);
        const nombreGroupes = Math.ceil(stagiairesMelanges.length / stagiaireParGroupe);
        const nouveauxGroupes: GroupData[] = [];

        for (let i = 0; i < nombreGroupes; i++) {
            const debut = i * stagiaireParGroupe;
            const fin = Math.min(debut + stagiaireParGroupe, stagiairesMelanges.length);
            const stagiairesGroupe = stagiairesMelanges.slice(debut, fin);

            nouveauxGroupes.push({
                numero: i + 1,
                stagiaires: stagiairesGroupe,
                stagiaireIds: stagiairesGroupe.map(s => s?._id||"")
            });
        }

        setGroupes(nouveauxGroupes);
        setGroupesGeneres(true);
        createToast(`${nombreGroupes} groupes générés automatiquement`, "", 0);
    };

    const deplacerStagiaire = (
  groupeSource: number,
  groupeDestination: number,
  stagiaireId: string
) => {
  const stagiaire = groupes[groupeSource - 1]?.stagiaires.find(s => s._id === stagiaireId);
  if (!stagiaire) return;

  // On met à jour les groupes
  const nouveauxGroupes = groupes
    .map(groupe => {
      if (groupe.numero === groupeSource) {
        const stagiairesRestants = groupe.stagiaires.filter(s => s._id !== stagiaireId);
        const stagiaireIdsRestants = groupe.stagiaireIds.filter(id => id !== stagiaireId);

        // 🔹 Retourne null si le groupe est désormais vide
        if (stagiairesRestants.length === 0) {
          return null;
        }

        return {
          ...groupe,
          stagiaires: stagiairesRestants,
          stagiaireIds: stagiaireIdsRestants,
        };
      }

      if (groupe.numero === groupeDestination) {
        return {
          ...groupe,
          stagiaires: [...groupe.stagiaires, stagiaire],
          stagiaireIds: [...groupe.stagiaireIds, stagiaireId],
        };
      }

      return groupe;
    })
    // 🔹 Filtrer les groupes supprimés (null)
    .filter((groupe): groupe is GroupData => groupe !== null);

  setGroupes(nouveauxGroupes);
};



    // ÉTAPE 2: Gestion des services et rotations
    const ajouterService = () => {
        setServicesConfig([...servicesConfig, {
            service: undefined,
            superviseur: undefined,
            serviceId: "",
            superviseurId: ""
        }]);
    };

    const supprimerService = (index: number) => {
        setServicesConfig(servicesConfig.filter((_, i) => i !== index));
    };

    const handleServiceSelect = (selected: Service | string, index:number) => {
        if (typeof selected === "string") return
         const updatedServices = servicesConfig.map((service, i) =>
            // i === index ? { ...service, [field]: value } : service

            i === index ? { 
                ...service, 
                'serviceId': selected?._id || "",
                'service': selected, // Conserver la référence pour l'affichage
            } : service
        );
        setServicesConfig(updatedServices);
    };

    const handleSuperviseurSelect = (selected: Utilisateur | string, index:number) => {
        if (typeof selected === "string") return
         const updatedServices = servicesConfig.map((service, i) =>
            // i === index ? { ...service, [field]: value } : service

            i === index ? { 
                ...service, 
                'superviseurId': selected?._id || "",
                'superviseur': selected, // Conserver la référence pour l'affichage
            } : service
        );
        console.log(updatedServices)
        setServicesConfig(updatedServices);
    };
    
    const genererRotationsAutomatiquement = (): void => {
        if (groupes.length === 0) {
            createToast("Veuillez d'abord générer les groupes", "", 2);
            return;
        }

        if (servicesConfig.length === 0 || !dateDebutStage || !dateFinStage) {
            createToast("Veuillez configurer les services et les dates", "", 2);
            return;
        }

        const servicesValides: ServiceConfig[] = servicesConfig.filter((s: ServiceConfig) => s.serviceId && s.superviseurId);
        if (servicesValides.length === 0) {
            createToast("Veuillez configurer au moins un service avec superviseur", "", 2);
            return;
        }

        // Fonctions utilitaires pour les jours ouvrables
        const estJourOuvrable = (date: Date): boolean => {
            const jour = date.getDay();
            return jour >= 1 && jour <= 5;
        };

        const calculerJoursOuvrables = (dateDebut: Date, dateFin: Date): number => {
            let count = 0;
            const current = new Date(dateDebut);
            
            while (current <= dateFin) {
                if (estJourOuvrable(current)) {
                    count++;
                }
                current.setDate(current.getDate() + 1);
            }
            
            return count;
        };

        const ajouterJoursOuvrables = (dateDebut: Date, nombreJoursOuvrables: number): Date => {
            const result = new Date(dateDebut);
            let joursAjoutes = 0;
            
            while (joursAjoutes < nombreJoursOuvrables) {
                result.setDate(result.getDate() + 1);
                if (estJourOuvrable(result)) {
                    joursAjoutes++;
                }
            }
            
            return result;
        };

        const prochainJourOuvrable = (date: Date): Date => {
            const result = new Date(date);
            while (!estJourOuvrable(result)) {
                result.setDate(result.getDate() + 1);
            }
            return result;
        };

        // Configuration du problème
        const debut: Date = prochainJourOuvrable(new Date(dateDebutStage));
        const fin: Date = new Date(dateFinStage);
        const dureeStageOuvrables: number = calculerJoursOuvrables(debut, fin);
        const nombrePeriodes: number = Math.floor(dureeStageOuvrables / joursParRotation);
        const nbGroupes = groupes.length;
        const nbServices = servicesValides.length;

        console.log(`Paramètres: ${nbGroupes} groupes, ${nbServices} services, ${nombrePeriodes} périodes`);

        // Vérifications de faisabilité
        if (nombrePeriodes < nbServices) {
            createToast(`Durée insuffisante: ${nombrePeriodes} périodes pour ${nbServices} services`, "", 2);
            return;
        }

        if (nbGroupes > nbServices) {
            createToast(`Impossible: ${nbGroupes} groupes > ${nbServices} services`, "", 2);
            return;
        }

        const rotationsNecessaires = nbGroupes * nbServices;
        const creneauxDisponibles = nombrePeriodes * Math.min(nbGroupes, nbServices);
        
        if (rotationsNecessaires > creneauxDisponibles) {
            createToast(`Impossible: ${rotationsNecessaires} rotations > ${creneauxDisponibles} créneaux`, "", 2);
            return;
        }

        // Classe pour représenter l'état du problème
        class EtatProbleme {
            solution: number[][];
            occupationPeriode: boolean[][];
            occupationService: boolean[][];

            constructor() {
                this.solution = Array(nbGroupes).fill(null).map(() => Array(nbServices).fill(-1));
                this.occupationPeriode = Array(nombrePeriodes).fill(null).map(() => Array(nbGroupes).fill(false));
                this.occupationService = Array(nbServices).fill(null).map(() => Array(nombrePeriodes).fill(false));
            }

            clone(): EtatProbleme {
                const nouvelEtat = new EtatProbleme();
                nouvelEtat.solution = this.solution.map(row => [...row]);
                nouvelEtat.occupationPeriode = this.occupationPeriode.map(row => [...row]);
                nouvelEtat.occupationService = this.occupationService.map(row => [...row]);
                return nouvelEtat;
            }

            peutAssigner(groupe: number, service: number, periode: number): boolean {
                return !this.occupationPeriode[periode][groupe] && !this.occupationService[service][periode];
            }

            assigner(groupe: number, service: number, periode: number): void {
                this.solution[groupe][service] = periode;
                this.occupationPeriode[periode][groupe] = true;
                this.occupationService[service][periode] = true;
            }

            desassigner(groupe: number, service: number): void {
                const periode = this.solution[groupe][service];
                if (periode !== -1) {
                    this.solution[groupe][service] = -1;
                    this.occupationPeriode[periode][groupe] = false;
                    this.occupationService[service][periode] = false;
                }
            }

            estComplete(): boolean {
                return this.solution.every(row => row.every(periode => periode !== -1));
            }

            nombreAssignations(): number {
                return this.solution.flat().filter(p => p !== -1).length;
            }
        }

        // Solveur avec multiple stratégies
        class SolveurRotations {
            private maxTentatives: number = 1000000;
            private timeoutMs: number = 30000; // 30 secondes max

            // Stratégie 1: Assignation par cycles optimisés
            resoudreParCycles(etat: EtatProbleme): boolean {
                console.log("Tentative: assignation par cycles");
                
                // Calculer le décalage optimal pour éviter les collisions
                const decalage = Math.floor(nombrePeriodes / nbGroupes);
                
                for (let groupe = 0; groupe < nbGroupes; groupe++) {
                    for (let service = 0; service < nbServices; service++) {
                        // Calculer plusieurs candidats de période
                        const candidats = [
                            (service + groupe * decalage) % nombrePeriodes,
                            (service * nbGroupes + groupe) % nombrePeriodes,
                            (groupe + service) % nombrePeriodes
                        ];

                        let assigne = false;
                        for (const periode of candidats) {
                            if (etat.peutAssigner(groupe, service, periode)) {
                                etat.assigner(groupe, service, periode);
                                assigne = true;
                                break;
                            }
                        }

                        if (!assigne) {
                            // Chercher n'importe quelle période libre
                            for (let p = 0; p < nombrePeriodes; p++) {
                                if (etat.peutAssigner(groupe, service, p)) {
                                    etat.assigner(groupe, service, p);
                                    assigne = true;
                                    break;
                                }
                            }
                        }

                        if (!assigne) {
                            return false;
                        }
                    }
                }
                
                return etat.estComplete();
            }

            // Stratégie 2: Backtracking avec heuristiques avancées
            resoudreParBacktracking(etat: EtatProbleme): boolean {
                console.log("Tentative: backtracking avancé");
                return this.backtrackAvecHeuristiques(etat, 0, Date.now());
            }

            private backtrackAvecHeuristiques(etat: EtatProbleme, tentatives: number, debut: number): boolean {
                if (Date.now() - debut > this.timeoutMs) {
                    console.log("Timeout atteint");
                    return false;
                }

                if (tentatives > this.maxTentatives) {
                    console.log("Nombre max de tentatives atteint");
                    return false;
                }

                if (etat.estComplete()) {
                    return true;
                }

                // Trouver la prochaine assignation à faire avec heuristique MRV (Most Restrictive Variable)
                const prochaine = this.choisirProchaineAssignation(etat);
                if (!prochaine) return false;

                const { groupe, service } = prochaine;

                // Ordonner les périodes par nombre de contraintes (heuristique LCV - Least Constraining Value)
                const periodesTortier = [];
                for (let periode = 0; periode < nombrePeriodes; periode++) {
                    if (etat.peutAssigner(groupe, service, periode)) {
                        const contraintesAjoutees = this.compterContraintesAjoutees(etat, groupe, service, periode);
                        periodesTortier.push({ periode, contraintes: contraintesAjoutees });
                    }
                }

                periodesTortier.sort((a, b) => a.contraintes - b.contraintes);

                for (const { periode } of periodesTortier) {
                    etat.assigner(groupe, service, periode);
                    
                    if (this.backtrackAvecHeuristiques(etat, tentatives + 1, debut)) {
                        return true;
                    }
                    
                    etat.desassigner(groupe, service);
                }

                return false;
            }

            private choisirProchaineAssignation(etat: EtatProbleme): { groupe: number, service: number } | null {
                let meilleure = null;
                let minOptions = Infinity;

                for (let groupe = 0; groupe < nbGroupes; groupe++) {
                    for (let service = 0; service < nbServices; service++) {
                        if (etat.solution[groupe][service] === -1) {
                            let options = 0;
                            for (let periode = 0; periode < nombrePeriodes; periode++) {
                                if (etat.peutAssigner(groupe, service, periode)) {
                                    options++;
                                }
                            }
                            
                            if (options === 0) {
                                return null; // Impasse détectée
                            }
                            
                            if (options < minOptions) {
                                minOptions = options;
                                meilleure = { groupe, service };
                            }
                        }
                    }
                }

                return meilleure;
            }

            private compterContraintesAjoutees(etat: EtatProbleme, groupe: number, service: number, periode: number): number {
                let contraintes = 0;
                
                // Compter combien d'autres assignations deviennent impossibles
                for (let g = 0; g < nbGroupes; g++) {
                    if (g !== groupe && !etat.occupationPeriode[periode][g]) {
                        contraintes++;
                    }
                }
                
                for (let p = 0; p < nombrePeriodes; p++) {
                    if (p !== periode && !etat.occupationService[service][p]) {
                        contraintes++;
                    }
                }
                
                return contraintes;
            }

            // Stratégie 3: Recherche locale avec redémarrage aléatoire
            resoudreParRechercheLocale(etat: EtatProbleme): boolean {
                console.log("Tentative: recherche locale");
                const debut = Date.now();
                
                for (let redemarrage = 0; redemarrage < 10; redemarrage++) {
                    if (Date.now() - debut > this.timeoutMs) break;
                    
                    // Génération d'une solution partielle aléatoire
                    const etatLocal = new EtatProbleme();
                    this.genererSolutionPartielleAleatoire(etatLocal);
                    
                    // Amélioration locale
                    if (this.ameliorerSolutionLocale(etatLocal, debut)) {
                        // Copier la solution trouvée
                        for (let g = 0; g < nbGroupes; g++) {
                            for (let s = 0; s < nbServices; s++) {
                                etat.solution[g][s] = etatLocal.solution[g][s];
                            }
                        }
                        return true;
                    }
                }
                
                return false;
            }

            private genererSolutionPartielleAleatoire(etat: EtatProbleme): void {
                const assignations = [];
                for (let g = 0; g < nbGroupes; g++) {
                    for (let s = 0; s < nbServices; s++) {
                        assignations.push({ groupe: g, service: s });
                    }
                }
                
                // Mélanger les assignations
                for (let i = assignations.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [assignations[i], assignations[j]] = [assignations[j], assignations[i]];
                }
                
                // Assigner autant que possible
                for (const { groupe, service } of assignations) {
                    const periodesLibres = [];
                    for (let p = 0; p < nombrePeriodes; p++) {
                        if (etat.peutAssigner(groupe, service, p)) {
                            periodesLibres.push(p);
                        }
                    }
                    
                    if (periodesLibres.length > 0) {
                        const periode = periodesLibres[Math.floor(Math.random() * periodesLibres.length)];
                        etat.assigner(groupe, service, periode);
                    }
                }
            }

            private ameliorerSolutionLocale(etat: EtatProbleme, debut: number): boolean {
                let amelioration = true;
                
                while (amelioration && Date.now() - debut < this.timeoutMs) {
                    amelioration = false;
                    const scoreInitial = etat.nombreAssignations();
                    
                    // Essayer des échanges et des réassignations
                    for (let g1 = 0; g1 < nbGroupes && !amelioration; g1++) {
                        for (let s1 = 0; s1 < nbServices && !amelioration; s1++) {
                            if (etat.solution[g1][s1] === -1) {
                                // Essayer de libérer une place en déplaçant d'autres assignations
                                for (let p = 0; p < nombrePeriodes && !amelioration; p++) {
                                    if (etat.peutAssigner(g1, s1, p)) {
                                        etat.assigner(g1, s1, p);
                                        if (etat.nombreAssignations() > scoreInitial) {
                                            amelioration = true;
                                        } else {
                                            etat.desassigner(g1, s1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if (etat.estComplete()) {
                        return true;
                    }
                }
                
                return false;
            }

            // Méthode principale qui essaie toutes les stratégies
            resoudre(): EtatProbleme | null {
                const strategies = [
                    (etat: EtatProbleme) => this.resoudreParCycles(etat),
                    (etat: EtatProbleme) => this.resoudreParBacktracking(etat),
                    (etat: EtatProbleme) => this.resoudreParRechercheLocale(etat)
                ];

                for (let i = 0; i < strategies.length; i++) {
                    console.log(`Essai stratégie ${i + 1}/${strategies.length}`);
                    const etat = new EtatProbleme();
                    
                    if (strategies[i](etat)) {
                        console.log(`Solution trouvée avec stratégie ${i + 1}`);
                        return etat;
                    }
                }

                return null;
            }
        }

        // Exécution du solveur
        console.log("Démarrage du solveur universel...");
        const tempsDebut = performance.now();
        
        const solveur = new SolveurRotations();
        const resultat = solveur.resoudre();
        
        const tempsFin = performance.now();
        console.log(`Solveur terminé en ${(tempsFin - tempsDebut).toFixed(2)}ms`);
        
        if (!resultat) {
            createToast("Impossible de générer une solution avec les contraintes données", "", 2);
            return;
        }

        // Convertir la solution en rotations
        const nouvellesRotations: RotationData[] = [];
        
        for (let groupe = 0; groupe < nbGroupes; groupe++) {
            for (let service = 0; service < nbServices; service++) {
                const periode = resultat.solution[groupe][service];
                const serviceConfig = servicesValides[service];
                const groupeObj = groupes[groupe];
                
                let dateDebutRotation = new Date(debut);
                if (periode > 0) {
                    dateDebutRotation = ajouterJoursOuvrables(debut, periode * joursParRotation);
                }
                
                const dateFinRotation = ajouterJoursOuvrables(dateDebutRotation, joursParRotation - 1);

                nouvellesRotations.push({
                    groupe: groupeObj.numero,
                    service: serviceConfig.serviceId,
                    superviseur: serviceConfig.superviseurId,
                    dateDebut: dateDebutRotation.toISOString().split('T')[0],
                    dateFin: dateFinRotation.toISOString().split('T')[0],
                    serviceRef: serviceConfig.service,
                    superviseurRef: serviceConfig.superviseur
                });
            }
        }

        // Trier par date puis par groupe
        nouvellesRotations.sort((a, b) => {
            const dateCompare = new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
            return dateCompare !== 0 ? dateCompare : a.groupe - b.groupe;
        });

        // Statistiques
        const periodesUtilisees = new Set(Object.values(resultat.solution).flat().filter(p => p !== -1)).size;
        const efficacite = ((periodesUtilisees / nombrePeriodes) * 100).toFixed(1);

        setRotations(nouvellesRotations);
        setRotationsGenerees(true);
        createToast(`✓ ${nouvellesRotations.length} rotations générées (${dureeStageOuvrables} jours ouvrables, ${efficacite}% d'efficacité, ${(tempsFin - tempsDebut).toFixed(0)}ms)`, "", 0);
    };

    // ÉTAPE 3: Gestion des affectations finales
    const ajouterAffectationFinale = () => {
        setAffectationsFinales([...affectationsFinales, {
            groupe: groupes[0]?.numero || 1,
            service: "",
            superviseur: "",
            dateDebut: "",
            dateFin: "",
        }]);
    };

    const supprimerAffectationFinale = (index: number) => {
        setAffectationsFinales(affectationsFinales.filter((_, i) => i !== index));
    };

    const modifierAffectationFinale = (index: number, field: keyof AffectationFinaleData, value: any) => {
        const nouvelles = affectationsFinales.map((aff, i) =>
            i === index ? { ...aff, [field]: value } : aff
        );
        setAffectationsFinales(nouvelles);
    };

    const handleCreateStage = async () => {
        try {

            if (!groupesGeneres || groupes.length === 0) {
                throw new Error("Veuillez d'abord générer les groupes");
            }
            setIsCreation(true)
            // Préparer les données pour l'API
            const groupesForApi = groupes.map(groupe => ({
                numero: groupe.numero,
                stagiaires: groupe.stagiaireIds
            }));
            
            const rotationsForApi = rotations.map(rot => ({
                groupe: rot.groupe,
                service: rot.service,
                superviseur: rot.superviseur,
                dateDebut: rot.dateDebut,
                dateFin: rot.dateFin,
            }));

            const affectationsForApi = affectationsFinales.map(aff => ({
                groupe: aff.groupe,
                service: aff.service,
                superviseur: aff.superviseur,
                dateDebut: aff.dateDebut,
                dateFin: aff.dateFin,
            }));

            if(!stageToEdit){
                await createStage({
                    nomFr,
                    nomEn,
                    type: 'GROUPE',
                    groupes: groupesForApi,
                    rotations: rotationsForApi,
                    affectationsFinales: affectationsForApi,
                    dateDebut: dateDebutStage,
                    dateFin: dateFinStage,
                    anneeStage: new Date(dateDebutStage).getFullYear(),
                    statut: 'EN_ATTENTE',
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createStageSlice({
                            stage: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                type: e.data.type,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneeStage
                            }
                        }));
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response?.data?.message || "Erreur lors de la création", '', 2);
                });
            }else{
                await updateStage({
                    nomFr,
                    nomEn,
                    type: 'GROUPE',
                    groupes: groupesForApi,
                    rotations: rotationsForApi,
                    affectationsFinales: affectationsForApi,
                    dateDebut: dateDebutStage,
                    dateFin: dateFinStage,
                    anneeStage: new Date(dateDebutStage).getFullYear(),
                    statut: 'EN_ATTENTE',
                },stageToEdit._id, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateStageSlice({
                            id:e.data._id,
                            stageData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                type: e.data.type,
                                statut: e.data.statut,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                anneeStage: e.data.anneeStage
                            }
                        }));
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response?.data?.message || "Erreur lors de la création", '', 2);
                });
            }
        } catch (err: any) {
            console.error('Erreur création stage groupe:', err.message);
            createToast(err.message, '', 2);
        }finally{
            setIsCreation(false)
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] dark:from-[#1f2937] dark:to-[#374151] rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#0ea5e9]" />
                    {stageToEdit ?t('label.modifier_stage_groupe') : t('label.stage_groupe_automatisé')}
                </h3>
                <p className="text-[#4b5563] dark:text-[#d1d5db] text-sm">
                    {t('page_description.groupe_stage')}
                </p>
            </div>

            {/* Information sur le stage */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#0ea5e9]" />
                        {t('label.information_stage')}
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            {t('label.nom_chose_fr')}
                        </label>
                        {pageIsLoading?<Skeleton height={50}/>:<input
                            type="text"
                            value={nomFr}
                            onChange={(e) => setNomFr(e.target.value)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            {t('label.nom_chose_en')}
                        </label>
                        {pageIsLoading?<Skeleton height={50}/>:<input
                            type="text"
                            value={nomEn}
                            onChange={(e) => setNomEn(e.target.value)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />}
                    </div>
                </div>
            </div>

            {/* ÉTAPE 1: Sélection des stagiaires et génération des groupes */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#0ea5e9]" />
                        {t('label.selection_repartition')}
                    </label>
                </div>
                {/* Sélection par établissement - NOUVEAU */}
                <EtablissementSelector
                    lang={lang}
                    onSearchEtablissement={onSearchEtablissement}
                    onStagiairesSelected={(stagiaires, ids) => {
                        // Fusionner avec la sélection existante sans doublons
                        const newStagiaires = [...selectedStagiaires];
                        const newIds = [...selectedStagiaireIds];
                        
                        stagiaires.forEach((stagiaire, index) => {
                            if (!newIds.includes(ids[index])) {
                                newStagiaires.push(stagiaire);
                                newIds.push(ids[index]);
                            }
                        });
                        
                        setSelectedStagiaires(newStagiaires);
                        setSelectedStagiaireIds(newIds);
                        
                        createToast(`${stagiaires.length} stagiaire(s) ajouté(s)`, '', 0);
                    }}
                    selectedStagiaireIds={selectedStagiaireIds}
                    pageIsLoading={pageIsLoading}
                />

                {/* Séparateur */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-[#1f2937] text-gray-500 dark:text-gray-400">
                            ou
                        </span>
                    </div>
                </div>

                {/* Recherche de stagiaires */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide mb-2 block">
                        {t("label.recherche_ajout_stagiaire")}
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                        <FilterList
                            items={[]}
                            placeholder={t('recherche.rechercher') + t('recherche.stagiaire')}
                            displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                            onSelect={handleStagiaireAdd}
                            enableBackendSearch={true}
                            onSearch={onSearchStagiaire}
                            searchDelay={300}
                            minSearchLength={2}
                            noResultsMessage={t('label.aucun_stagiaire')}
                            loadingMessage={t('label.recherche_stagiaire')}
                        />
                    </div>
                </div>

                {/* Liste des stagiaires sélectionnés */}
                {pageIsLoading?<Skeleton height={200}/>:<>{selectedStagiaires.length > 0 && (
                    <div className="mb-4">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide mb-2 block">
                            {t('label.stagiaires_selectionnes')} ({selectedStagiaires.length})
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {selectedStagiaires.map((stagiaire, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-[#fafafa] dark:bg-[#374151] rounded-lg border border-[#e5e7eb] dark:border-[#4b5563]">
                                    <span className="text-sm font-medium text-[#111827] dark:text-white">
                                        {stagiaire.nom} {stagiaire.prenom}
                                    </span>
                                    <button
                                        onClick={() => handleStagiaireRemove(index)}
                                        className="p-1 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 rounded transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}</>}

                {/* Configuration des groupes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            {t('label.nombre_stagiaire_groupe')}
                        </label>
                        {pageIsLoading?<Skeleton height={50}/>:<input
                            type="number"
                            min="1"
                            max="10"
                            value={stagiaireParGroupe}
                            onChange={(e) => setStagiaireParGroupe(parseInt(e.target.value) || 3)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />}
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={genererGroupesAutomatiquement}
                            disabled={selectedStagiaires.length === 0}
                            className="h-10 px-4 bg-gradient-to-r from-[#16a34a] to-[#15803d]
                                     hover:from-[#15803d] hover:to-[#166534] text-white font-medium rounded-md
                                     shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                                     transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Shuffle className="w-4 h-4" />
                            {t("label.generer_groupe")}
                        </button>
                    </div>
                </div>

                {/* Aperçu des groupes générés */}
                {pageIsLoading?<Skeleton height={300}/>:<>
                    {groupesGeneres && groupes.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                    {t('label.groupes_generes')} ({groupes.length})
                                </label>
                                <span className="text-xs text-[#16a34a] dark:text-[#22c55e]">
                                    {t("label.deplace_stagiaires")}
                                </span>
                            </div>

                            {groupes.map((groupe, groupIndex) => (
                                <div key={groupIndex} className="p-4 bg-[#fafafa] dark:bg-[#374151] rounded-lg border-l-4 border-[#16a34a]">
                                    <h4 className="text-lg font-semibold text-[#111827] dark:text-white mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#16a34a]" />
                                        {t('label.groupe')} {groupe.numero} ({groupe.stagiaires.length} stagiaires)
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {groupe.stagiaires.map((stagiaire, stagiaireIndex) => (
                                            <div key={stagiaireIndex} className="flex items-center justify-between p-2 bg-white dark:bg-[#1f2937] rounded border border-[#e5e7eb] dark:border-[#4b5563]">
                                                <span className="text-sm font-medium text-[#111827] dark:text-white">
                                                    {stagiaire.nom} {stagiaire.prenom}
                                                </span>
                                                <select
                                                    value={groupe.numero}
                                                    onChange={(e) => deplacerStagiaire(groupe.numero, parseInt(e.target.value), stagiaire?._id||"")}
                                                    className="text-xs border border-[#e5e7eb] dark:border-[#4b5563] rounded px-2 py-1
                                                            bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white"
                                                >
                                                    {groupes.map(g => (
                                                        <option key={g.numero} value={g.numero}>
                                                            {t('label.groupe')} {g.numero}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>}
            </div>

            {/* ÉTAPE 2: Configuration des services et génération des rotations */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#0ea5e9]" />
                        {t('label.etape_config_rotations')}
                    </label>
                    <button
                        onClick={ajouterService}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#e0f2fe] dark:bg-[#0c4a6e]
                                 text-[#0369a1] dark:text-[#7dd3fc] rounded-lg hover:bg-[#bae6fd] dark:hover:bg-[#075985]
                                 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('label.ajout_service')}
                    </button>
                </div>

                {/* Configuration des services */}
                <div className="space-y-4 mb-6">
                    {servicesConfig.map((serviceConfig, index) => (
                        <div key={index} className="p-4 bg-[#fafafa] dark:bg-[#374151] rounded-lg border-l-4 border-[#0ea5e9]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.service')}
                                    </label>
                                    <FilterList
                                        items={[]}
                                        placeholder={t('recherche.rechercher') + t('recherche.service')}
                                        displayProperty={(item) => `${lang === 'fr' ? item?.nomFr : item?.nomEn}`}
                                        onSelect={(selected) => {
                                            if (typeof selected !== "string") {
                                                handleServiceSelect(selected, index)
                                                // modifierServiceConfig(index, 'service', selected);
                                                // modifierServiceConfig(index, 'serviceId', selected?._id);
                                            }
                                        }}
                                        enableBackendSearch={true}
                                        onSearch={onSearchService}
                                        searchDelay={300}
                                        minSearchLength={2}
                                        defaultValue={serviceConfig.service}
                                        noResultsMessage={t('label.aucun_service')}
                                        loadingMessage={t('label.recherche_service')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                       {t('label.superviseur')}
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <FilterList
                                                items={[]}
                                                placeholder={t('recherche.rechercher') + t('recherche.utilisateur')}
                                                displayProperty={(item) => `${item?.nom} ${item?.prenom || ""}`}
                                                onSelect={(selected) => {
                                                    if (typeof selected !== "string") {
                                                        handleSuperviseurSelect(selected, index)
                                                        // modifierServiceConfig(index, 'superviseur', selected);
                                                        // modifierServiceConfig(index, 'superviseurId', selected?._id);
                                                    }
                                                }}
                                                enableBackendSearch={true}
                                                onSearch={onSearchSuperviseur}
                                                searchDelay={300}
                                                minSearchLength={2}
                                                defaultValue={serviceConfig.superviseur}
                                                noResultsMessage={t('label.aucun_superviseur')}
                                                loadingMessage={t('label.recherche_superviseur')}
                                            />
                                        </div>
                                        {servicesConfig.length > 1 && (
                                            <button
                                                onClick={() => supprimerService(index)}
                                                className="p-2 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 rounded transition-colors self-start"
                                                aria-label="Supprimer ce service"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Configuration des dates et de la durée des rotations */}
                {pageIsLoading?<Skeleton height={50} className='mb-5'/>:<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            <Calendar className="inline-block w-4 h-4 mr-1 text-[#0ea5e9]" /> {t('label.date_debut_stage')}
                        </label>
                        <input
                            type="date"
                            value={dateDebutStage}
                            onChange={(e) => setDateDebutStage(e.target.value)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            <Calendar className="inline-block w-4 h-4 mr-1 text-[#0ea5e9]" /> {t('label.date_fin_stage')}
                        </label>
                        <input
                            type="date"
                            value={dateFinStage}
                            onChange={(e) => setDateFinStage(e.target.value)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            <Clock className="inline-block w-4 h-4 mr-1 text-[#0ea5e9]" /> {t('label.jour_rotation')}
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={joursParRotation}
                            onChange={(e) => setJoursParRotation(parseInt(e.target.value) || 7)}
                            className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                     bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                     focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                        />
                    </div>
                </div>}

                <div className="flex justify-end">
                    <button
                        onClick={genererRotationsAutomatiquement}
                        disabled={!groupesGeneres || servicesConfig.length === 0 || !dateDebutStage || !dateFinStage}
                        className="h-10 px-4 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]
                                 hover:from-[#0284c7] hover:to-[#0c4a6e] text-white font-medium rounded-md
                                 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                                 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t('label.generer_rotation')}
                    </button>
                </div>

                {/* Aperçu des rotations générées */}
                {pageIsLoading?<Skeleton height={300}/>:<>{rotationsGenerees && rotations.length > 0 && (
                    <div className="space-y-4">
                        <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                            {t('label.rotation_generer')}
                        </label>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#374151] rounded-lg border border-[#e5e7eb] dark:border-[#374151]">
                                <thead className="bg-[#f9fafb] dark:bg-[#374151]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider">
                                            {t('label.groupe')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider">
                                            {t('label.service')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider">
                                            {t('label.superviseur')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider">
                                            {t('label.dates')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                                    {rotations.map((rotation, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827] dark:text-white">
                                                {t('label.groupe')} {rotation.groupe}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b5563] dark:text-[#d1d5db]">
                                                {lang === 'fr' ? rotation.serviceRef?.nomFr : rotation.serviceRef?.nomEn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b5563] dark:text-[#d1d5db]">
                                                {rotation.superviseurRef?.nom} {rotation.superviseurRef?.prenom}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b5563] dark:text-[#d1d5db]">
                                                {t('label.du')} {new Date(rotation.dateDebut).toLocaleDateString()} {t('label.au')} {new Date(rotation.dateFin).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}</>}
            </div>

            {/* ÉTAPE 3: Affectations finales */}
            <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-[#374151] dark:text-[#d1d5db] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0ea5e9]" />
                        {t('label.etape_affectation_finale')}
                    </label>
                    <button
                        onClick={ajouterAffectationFinale}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#e0f2fe] dark:bg-[#0c4a6e]
                                 text-[#0369a1] dark:text-[#7dd3fc] rounded-lg hover:bg-[#bae6fd] dark:hover:bg-[#075985]
                                 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('label.ajout_affectation')}
                    </button>
                </div>

                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-4">
                    {t('label.description_aff_spe')}
                </p>

                {pageIsLoading?<Skeleton height={200}/>:<div className="space-y-4">
                    {affectationsFinales.map((affectation, index) => (
                        <div key={index} className="p-4 bg-[#fafafa] dark:bg-[#374151] rounded-lg border-l-4 border-[#eab308]">
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => supprimerAffectationFinale(index)}
                                    className="p-1 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 rounded transition-colors"
                                    aria-label="Supprimer cette affectation"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.groupe')}
                                    </label>
                                    <select
                                        value={affectation.groupe}
                                        onChange={(e) => modifierAffectationFinale(index, 'groupe', parseInt(e.target.value))}
                                        className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                                    >
                                        {groupes.map(g => (
                                            <option key={g.numero} value={g.numero}>
                                                {t('label.groupe')} {g.numero}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.service')}
                                    </label>
                                    <FilterList
                                        items={[]}
                                        placeholder={t('recherche.rechercher') + t('recherche.service')}
                                        displayProperty={(item) => `${lang === 'fr' ? item.nomFr : item.nomEn}`}
                                        onSelect={(selected) => {
                                            if (typeof selected !== "string") {
                                                modifierAffectationFinale(index, 'serviceRef', selected);
                                                modifierAffectationFinale(index, 'service', selected._id);
                                            }
                                        }}
                                        enableBackendSearch={true}
                                        onSearch={onSearchService}
                                        searchDelay={300}
                                        minSearchLength={2}
                                        defaultValue={affectation.serviceRef}
                                        noResultsMessage={t('label.aucun_service')}
                                        loadingMessage={t('label.recherche_service')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.superviseur')}
                                    </label>
                                    <FilterList
                                        items={[]}
                                        placeholder={t('recherche.rechercher') + t('recherche.utilisateur')}
                                        displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                                        onSelect={(selected) => {
                                            if (typeof selected !== "string") {
                                                modifierAffectationFinale(index, 'superviseurRef', selected);
                                                modifierAffectationFinale(index, 'superviseur', selected._id);
                                            }
                                        }}
                                        enableBackendSearch={true}
                                        onSearch={onSearchSuperviseur}
                                        searchDelay={300}
                                        minSearchLength={2}
                                        defaultValue={affectation.superviseurRef}
                                        noResultsMessage={t('label.aucun_superviseur')}
                                        loadingMessage={t('label.recherche_superviseur')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.date_debut')}
                                    </label>
                                    <input
                                        type="date"
                                        value={affectation.dateDebut}
                                        onChange={(e) => modifierAffectationFinale(index, 'dateDebut', e.target.value)}
                                        className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                        {t('label.date_fin')}
                                    </label>
                                    <input
                                        type="date"
                                        value={affectation.dateFin}
                                        onChange={(e) => modifierAffectationFinale(index, 'dateFin', e.target.value)}
                                        className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                                bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                                focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={handleCreateStage}
                    className={`px-6 py-2 bg-gradient-to-r from-[#16a34a] to-[#15803d]
                            hover:from-[#15803d] hover:to-[#166534] text-white font-semibold rounded-md
                            shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2
                            ${(isCreating || !groupesGeneres || !rotationsGenerees) 
                                ? 'opacity-75 cursor-not-allowed' 
                                : 'hover:shadow-lg'}`}
                    disabled={isCreating || !groupesGeneres || !rotationsGenerees}
                >
                    {isCreating ? (
                        <>
                            <Spinner />
                            {stageToEdit ? t('label.modification_en_cours') : t('label.creation_en_cours')}
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            {stageToEdit ? t('label.modifier_stage') : t('label.cree_stage')}
                        </>
                    )}
                </button>
                <button
                    onClick={resetForm}
                    className={`px-6 py-2 bg-white dark:bg-[#1f2937] text-[#374151] dark:text-[#d1d5db]
                            border border-[#e5e7eb] dark:border-[#4b5563] font-semibold rounded-md
                            hover:bg-[#f3f4f6] dark:hover:bg-[#374151] transition-colors flex items-center gap-2
                            ${(isCreating ) 
                                ? 'opacity-75 cursor-not-allowed' 
                                : 'hover:shadow-lg'}`}
                    disabled={isCreating} // Désactiver aussi ce bouton pendant le chargement
                >
                    <RotateCcw className="w-5 h-5" />
                    {t('button.reinitialiser')}
                </button>
            </div>
        </div>
    );
};

export default GroupStageInterface