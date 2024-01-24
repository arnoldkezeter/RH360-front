import DisciplineDesEnseignants from '../pages/Admin/DisciplineEnseignant';

const coreRoutes = [
    // etudiants
    {
        path: '/delegate/teachers',
        title: 'Discipline enseignants',
        component: DisciplineDesEnseignants,
    }

];

const routes = [...coreRoutes];
export default routes;
