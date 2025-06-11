
import MonProfil from '../pages/CommonPage/Profil';
import Regions from '../pages/Admin/Regions';

import Permissions from '../pages/Admin/Permissions';
import UserPermissions from '../pages/CommonPage/UserPermissions';
import Structures from '../pages/Admin/Structures';
import Departements from '../pages/Admin/Departements';
import Communes from '../pages/Admin/Communes';
import Grades from '../pages/Admin/Grades';
import CategorieProfessionnelles from '../pages/Admin/CategorieProfessionnelle';
import Services from '../pages/Admin/Service';
import Taxes from '../pages/Admin/Taxe';
import AxeStrategiques from '../pages/Admin/AxeStrategique';
import Competences from '../pages/Admin/Competence';
import FamilleMetiers from '../pages/Admin/FamilleMetier';
import PosteDeTravails from '../pages/Admin/PosteDeTravail';




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
    path: '/elaboration-programme/formations',
    title: 'Liste des formations',
    component: undefined,
  },

  {
    path: '/elaboration-programme/programmes-formation',
    title: 'Liste des programmes de formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/formation/themes-formation',
    title: 'Liste des thèmes de formation',
    component: undefined,
  },
 
  {
    path: '/elaboration-programme/formation/theme-formation/objectifs',
    title: 'Liste des objectifs de formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/public-cible',
    title: 'Liste du public cible de la formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/tache-a-executee',
    title: 'Tache a executé durant une formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/formation/theme-formation/cohortes',
    title: 'Tache a executé durant une formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/besoins-formation/exprimer',
    title: 'Expression des besoins de formation',
    component: undefined,
  },

  {
    path: '/elaboration-programme/besoins-formation/rapports',
    title: 'Rapports sur les besoins de formation',
    component: undefined,
  },


  //  Execution programme de formation
  {
    path: '/execution-programme/calendrier-formation',
    title: 'Calendrier de formation',
    component: undefined,
  },

  {
    path: '/execution-programme/tache-executee',
    title: 'Tache a executé durant une formation',
    component: undefined,
  },

  {
    path: '/execution-programme/suivi-budgetaire',
    title: 'Suivi budgetaire sur les formations',
    component: undefined,
  },

  {
    path: '/execution-programme/supports-formation',
    title: 'Supports de formation',
    component: undefined,
  },

  {
    path: '/execution-programme/rapports-formation',
    title: 'rapports sur les formation',
    component: undefined,
  },


  //Evaluation
  {
    path: '/evaluations/cree-evaluation',
    title: 'Crée une évaluation',
    component: undefined,
  },

  {
    path: '/evaluations/effectue-evaluation-a-chaud',
    title: 'Effectuer une evaluation à chaud',
    component: undefined,
  },

  {
    path: '/evaluations/rapport/evaluation-a-chaud',
    title: 'Rapport d\'évaluation à chaud',
    component: undefined,
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
    component: undefined,
  },

  {
    path: '/stagiaires/carnet-stage',
    title: 'Elaboration du carnet de stage',
    component: undefined,
  },

  {
    path: '/stagiaires/stages',
    title: 'Enregistremenet des stages',
    component: undefined,
  },

  {
    path: '/stagiaires/attestations&convention',
    title: 'Attestation et convention de stage',
    component: undefined,
  },

  {
    path: '/stagiaires/rapports',
    title: 'rapports sur les stages',
    component: undefined,
  },


  //Suivi des chercheurs
  {
    path: '/chercheurs/gestion-chercheur',
    title: 'Gestion des chercheurs (Enregistrement, Modification, Suppression , Liste)',
    component: undefined,
  },

  {
    path: '/chercheurs/mandats',
    title: 'Enregistremenet des mandats',
    component: undefined,
  },

  {
    path: '/chercheurs/rapports',
    title: 'rapports sur les mandats',
    component: undefined,
  },


  //Utilisateur
  {
    path: '/utilisateurs/gestion-utilisateur',
    title: 'Gestion des utilisateurs (Enregistrement, Modification, Suppression , Liste)',
    component: undefined,
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
    component: undefined,
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
    component: undefined,
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
