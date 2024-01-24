import Cycles from '../pages/Admin/Cycles';
import DisciplineDesEnseignants from '../pages/Admin/DisciplineEnseignant';
import DisciplineEtudiants from '../pages/Admin/DisciplineEtudiant';
import ListeDesEnseignant from '../pages/Admin/ListeEnseignants';
import ListeDesEtudiants from '../pages/Admin/ListeEtudiants';
import ListeDesMatieres from '../pages/Admin/ListeMatieres';
import Niveaux from '../pages/Admin/Niveaux';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import SallesDeCours from '../pages/Admin/SallesDeCours';
import Sections from '../pages/Admin/Sections';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
import Parametres from '../pages/CommonPage/Parametres';
import MonProfil from '../pages/CommonPage/Profil';



const coreRoutes = [
  // etudiants
  {
    path: '/students/student-list',
    title: 'Liste des étudiants',
    component: ListeDesEtudiants,
  },
  {
    path: '/students/disciplines',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
  },

  // enseignants
  {
    path: '/teachers/teacher-list',
    title: 'Liste des enseignants',
    component: ListeDesEnseignant,
  },
  {
    path: '/teachers/disciplines',
    title: 'Disciplines des enseignants',
    component: DisciplineDesEnseignants,
  },

  // matieres
  {
    path: '/subjects/subject-list',
    title: 'Liste des matières',
    component: ListeDesMatieres,
  },
  {
    path: '/subjects/progressions',
    title: 'Progréssion',
    component: ProgressionMatiere,
  },

  // salles de cours
  {
    path: '/classrooms',
    title: 'classrooms',
    component: SallesDeCours,
  },

  // structuraction academique
  {
    path: '/academic-levels/sections',
    title: 'Sections',
    component: Sections,
  },
  {
    path: '/academic-levels/grades',
    title: 'Cycles',
    component: Cycles,
  },
  {
    path: '/academic-levels/levels',
    title: 'Niveaux',
    component: Niveaux,
  },

  // emploi de temps
  {
    path: '/schedules',
    title: 'Emploi de temps',
    component: EmploiDeTemp,
  },

  // calendrier academique
  {
    path: '/academic-calendar',
    title: 'Calendrier académique',
    component: CalendrierAcademique,
  },

  // profil
  {
    path: '/profile',
    title: 'Mon profil',
    component: MonProfil,
  },

  // parametres
  {
    path: '/settings',
    title: 'Paramètres',
    component: Parametres,
  },

];

const routes = [...coreRoutes];
export default routes;
