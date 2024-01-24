import DisciplineEtudiants from '../pages/Admin/DisciplineEtudiant';
import Abscences from '../pages/CommonPage/Abscences';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
import Matieres from '../pages/CommonPage/Matieres';
import Parametres from '../pages/CommonPage/Parametres';
import MonProfil from '../pages/CommonPage/Profil';



const coreRoutes = [
  // discipline etudiant
  {
    path: '/teacher/discipline-students',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
  },
  // abscence 
  {
    path: '/teacher/abscences',
    title: 'Abscences enseignant',
    component: Abscences,
  },

  // emploi de temps
  {
    path: '/teacher/subjects',
    title: 'Matières',
    component: Matieres,
  },


  // emploi de temps
  {
    path: '/teacher/schedule',
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
