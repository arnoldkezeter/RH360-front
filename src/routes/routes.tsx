
import Regions from '../pages/Parametres/Regions';

import Permissions from '../pages/Parametres/Permissions';
import UserPermissions from '../pages/CommonPage/UserPermissions';
import Structures from '../pages/Parametres/Structures';
import Departements from '../pages/Parametres/Departements';
import Communes from '../pages/Parametres/Communes';
import Grades from '../pages/Parametres/Grades';
import CategorieProfessionnelles from '../pages/Parametres/CategorieProfessionnelle';
import Services from '../pages/Parametres/Service';
import Taxes from '../pages/Parametres/Taxe';
import AxeStrategiques from '../pages/Elaboration/AxeStrategique';
import Competences from '../pages/Elaboration/Competence';
import FamilleMetiers from '../pages/Elaboration/FamilleMetier';
import PosteDeTravails from '../pages/Parametres/PosteDeTravail';
import BesoinFormationPredefinis from '../pages/Parametres/BesoinFormationPredefinis';
import Etablissements from '../pages/Parametres/Etablissements';
import Utilisateurs from '../pages/Utilisateurs/Utilisateurs';
import Stagiaires from '../pages/Stagiaires/Stagiaires';
import Chercheurs from '../pages/Chercheurs/Chercheurs';
import ProgrammeFormations from '../pages/Elaboration/ProgrammesFormation';
import ThemeFormations from '../pages/Elaboration/ThemeFormation/ThemeFormations';
import Cohortes from '../pages/Parametres/Cohortes';
import CohorteUserManager from '../pages/Parametres/CohorteUserManager';
import LieuFormations from '../pages/Elaboration/ThemeFormation/LieuFormation';
import ObjectifThemes from '../pages/Elaboration/ThemeFormation/ObjectifsTheme';
import Formateurs from '../pages/Elaboration/ThemeFormation/Formateurs';
import TachesGeneriques from '../pages/Parametres/TachesGeneriques';
import TacheThemeFormations from '../pages/Elaboration/ThemeFormation/TacheThemeFormation';
import CalendrierFormations from '../pages/Execution/CalendrierFormation';
import BudgetFormations from '../pages/Elaboration/Formation/BudgetFormation';
import SuiviBudgetaires from '../pages/Execution/SuiviBudgetaire';
import RapportFormations from '../pages/Execution/RapportFormation';
import SupportFormationManager from '../pages/Execution/SupportFormation';
import CarnetsStage from '../pages/Stagiaires/CarnetStage';
import Rapports from '../pages/Stagiaires/Rapports';
import StageManagement from '../pages/Stagiaires/Stages';
import Formations from '../pages/Elaboration/Formation/Formations';
import AutoEvaluationBesoins from '../pages/Elaboration/BesoinFormation/AutoEvaluation';
import RapportAutoEvaluation from '../pages/Elaboration/BesoinFormation/RapportBesoinFormation';
import BesoinAjouteUtilisateur from '../pages/Elaboration/BesoinFormation/BesoinAjouteUtilisateur';
import EvaluationResults from '../pages/Evaluation/EvaluationAChaudRapport';
import EvaluationManager from '../pages/Evaluation/CreeEvaluationAChaud';
import EchelleReponses from '../pages/Evaluation/EchelleReponse';
import TypeEchelleReponses from '../pages/Evaluation/TypeEchelleReponse';
import EvaluationAChaud from '../pages/Evaluation/EvaluationAChaud';
import EvaluationForm from '../pages/Evaluation/EvaluationAChaudForm';
import TachesExecutees from '../pages/Execution/TachesExecutees';
import StageRechercheManagement from '../pages/Chercheurs/StageRecherches';
import RapportStage from '../pages/Chercheurs/RapportsStageRecherche';
import GenerationNoteDeServiceManager from '../pages/NotesDeService/GenerationNoteDeService';
import ChatManager from '../pages/Execution/Chat';
import ParticipantsTheme from '../pages/Elaboration/ThemeFormation/ParticipantFormation';
import MonProfil from '../pages/Parametres/Profil';




const coreRoutes = [
  // Elaboration programme de formation
  {
    path: '/elaboration-programme/axes-strategique',
    title: 'Liste des compétences',
    component: AxeStrategiques,
  },

  {
    path: '/elaboration-programme/competences',
    title: 'Liste des compétences',
    component: Competences,
  },

  {
    path: '/elaboration-programme/familles-metier',
    title: 'Liste des famille de metier',
    component: FamilleMetiers,
  },


  {
    path: '/elaboration-programme/programmes-formation',
    title: 'Liste des programmes de formation',
    component: ProgrammeFormations,
  },

  {
    path: '/elaboration-programme/formations',
    title: 'Liste des formations',
    component: Formations,
  },

  {
    path: '/elaboration-programme/formation/themes-formation',
    title: 'Liste des thèmes de formation',
    component: ThemeFormations,
  },
 
  {
    path: '/elaboration-programme/formation/theme-formation/objectifs',
    title: 'Liste des objectifs de formation',
    component: ObjectifThemes,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/participants',
    title: 'Liste des participants de la formation',
    component: ParticipantsTheme,
  },

  

  {
    path: '/elaboration-programme/formation/theme-formation/lieux-formation',
    title: 'Les lieux de formation',
    component: LieuFormations,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/formateurs',
    title: 'Formateurs',
    component: Formateurs,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/taches-a-executee',
    title: 'Tache a executé durant une formation',
    component: TacheThemeFormations,
  },

  {
    path: '/elaboration-programme/formation/budgets',
    title: 'Budget de formation',
    component: BudgetFormations,
  },

  

  {
    path: '/elaboration-programme/besoins-formation/exprimer',
    title: 'Expression des besoins de formation',
    component: AutoEvaluationBesoins,
  },

  {
    path: '/elaboration-programme/besoins-formation/exprimer/nouvelle-competence',
    title: 'Expression des besoins de formation',
    component: BesoinAjouteUtilisateur,
  },

  {
    path: '/elaboration-programme/besoins-formation/rapports',
    title: 'Rapports sur les besoins de formation',
    component: RapportAutoEvaluation,
  },


  //  Execution programme de formation
  {
    path: '/execution-programme/calendrier-formation',
    title: 'Calendrier de formation',
    component: CalendrierFormations,
  },

  {
    path: '/execution-programme/tache-executee',
    title: 'Tache a executé durant une formation',
    component: TachesExecutees,
  },

  {
    path: '/chat',
    title: 'Chat',
    component: ChatManager,
  },

  {
    path: '/execution-programme/suivi-budgetaire',
    title: 'Suivi budgetaire sur les formations',
    component: SuiviBudgetaires,
  },

  {
    path: '/execution-programme/supports-formation',
    title: 'Supports de formation',
    component: SupportFormationManager,
  },

  {
    path: '/execution-programme/rapports-formation',
    title: 'rapports sur les formation',
    component: RapportFormations,
  },


  //Evaluation
  {
    path:'/evaluations/type-echelle-reponse',
    title: 'Gérer les types d\'échelle de réponse',
    component: TypeEchelleReponses,
  },
  {
    path:'/evaluations/type-echelle-reponse/echelle-reponse',
    title: 'Gérer les échelle de réponse',
    component: EchelleReponses,
  },
  {
    path: '/evaluations/cree-evaluation',
    title: 'Crée une évaluation',
    component: EvaluationManager,
  },

  {
    path: '/evaluations/evaluation-a-chaud',
    title: 'Liste des évaluations à chaud',
    component: EvaluationAChaud,
  },

  {
    path: '/evaluations/evaluation-a-chaud/effectuer',
    title: 'Effectuer une evaluation à chaud',
    component: EvaluationForm,
  },

  {
    path: '/evaluations/rapport/evaluation-a-chaud',
    title: 'Rapport d\'évaluation à chaud',
    component: EvaluationResults,
  },

  {
    path: '/evaluations/rapport/evaluation-formateur',
    title: 'Rapport d\'évaluation par le formateur',
    component: undefined,
  },


  //Suivi des stagiaires
  {
    path: '/stagiaires/gestion-stagiaire',
    title: 'Gestion des stagiaires (Enregistrement, Modification, Suppression , Liste)',
    component: Stagiaires,
  },

  {
    path: '/stagiaire/carnet-stage',
    title: 'Elaboration du carnet de stage',
    component: CarnetsStage,
  },

  {
    path: '/stagiaires/stages',
    title: 'Enregistremenet des stages',
    component: StageManagement,
  },

  {
    path: '/stagiaire/attestations&convention',
    title: 'Attestation et convention de stage',
    component: undefined,
  },

  {
    path: '/stagiaires/rapports',
    title: 'rapports sur les stages',
    component: Rapports,
  },


  //Suivi des chercheurs
  {
    path: '/chercheurs/gestion-chercheur',
    title: 'Gestion des chercheurs (Enregistrement, Modification, Suppression , Liste)',
    component: Chercheurs,
  },

  {
    path: '/chercheurs/mandats',
    title: 'Enregistremenet des mandats',
    component: StageRechercheManagement,
  },

  {
    path: '/chercheurs/rapports',
    title: 'rapports sur les mandats',
    component: RapportStage,
  },


  //Utilisateur
  {
    path: '/utilisateurs/gestion-utilisateur',
    title: 'Gestion des utilisateurs (Enregistrement, Modification, Suppression , Liste)',
    component: Utilisateurs,
  },

  {
    path: '/utilisateurs/historiques',
    title: 'Historique des actions d\'un utilisateur',
    component: undefined,
  },


  //Notes de service
  {
    path: '/notes-service/generer_notes',
    title: 'Générer une note de service',
    component: GenerationNoteDeServiceManager,
  },

  {
    path: '/notes-service/historiques',
    title: 'Historique des notes de service',
    component: undefined,
  },



  // parametres
  {
    path: '/parametres/profile',
    title: 'Mon profil',
    component: MonProfil,
  },

  {
    path: '/parametres/besoins-formation/manage',
    title: 'Mon Enregistrer des besoins de formation',
    component: BesoinFormationPredefinis,
  },

  {
    path: '/parametres/etablissements',
    title: 'Etablissements',
    component: Etablissements,
  },

  {
    path: '/parametres/taxes',
    title: 'Taxes',
    component: Taxes,
  },

  {
    path: '/parametres/structures',
    title: 'Structure',
    component: Structures,
  },

  {
    path: '/parametres/cohortes',
    title: 'Cohorte',
    component: Cohortes,
  },

  {
    path: '/parametres/taches-formations',
    title: 'Taches de formation générique',
    component: TachesGeneriques,
  },

  {
    path: '/parametres/cohorte/utilisateur',
    title: 'Cohorte utilisateur',
    component: CohorteUserManager,
  },

  {
    path: '/parametres/services',
    title: 'Services',
    component: Services,
  },


  {
    path: '/parametres/categories-professionnelles',
    title: 'Categorie professionnellle',
    component: CategorieProfessionnelles,
  },

  {
    path: '/parametres/grades',
    title: 'Grades',
    component: Grades,
  },

  {
    path: '/parametres/postes-de-travail',
    title: 'Postes de travail',
    component: PosteDeTravails,
  },


  {
    path: '/parametres/regions',
    title: 'Régions',
    component: Regions,
  },
  {
    path: '/parametres/departements',
    title: 'Départements',
    component: Departements,
  },
  {
    path: '/parametres/communes',
    title: 'Communes',
    component: Communes,
  },

  {
    path: '/parametres/permissions',
    title: 'Permissions',
    component: Permissions,
  },
  
  {
    path: '/user/permissions',
    title: 'Permissions utilisateur',
    component: UserPermissions,
  },

];

const routes = [...coreRoutes];
export default routes;
