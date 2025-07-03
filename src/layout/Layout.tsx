// Solution 1: Utiliser useLocation pour détecter la route
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import HeaderPage from '../components/HeaderPage';

interface LayoutProps {
    isMobileOrTablet: boolean;
    userPermissions?: string[];
}

const Layout = ({ isMobileOrTablet, userPermissions }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(isMobileOrTablet);
    const location = useLocation();
    
    // Liste des routes où HeaderPage ne doit pas être affiché
    const routesWithoutHeaderPage = [
        '/',
        '/elaboration-programme/axes-strategique',
        '/elaboration-programme/competences',
        '/elaboration-programme/familles-metier',
        '/parametres/profile',
        '/parametres/besoins-formation/manage',
        '/parametres/etablissements',
        '/parametres/taxes',
        '/parametres/structures',
        '/parametres/cohortes',
        '/parametres/taches-formations',
        '/parametres/cohorte/utilisateur',
        '/parametres/services',
        '/parametres/categories-professionnelles',
        '/parametres/grades',
        '/parametres/postes-de-travail',
        '/parametres/regions',
        '/parametres/departements',
        '/parametres/communes',
        '/parametres/permissions',
        '/user/permissions'
    ];
    
    // Vérifier si la route actuelle doit masquer HeaderPage
    const shouldHideHeaderPage = routesWithoutHeaderPage.some(route => location.pathname === route || location.pathname.startsWith(route + '/'));

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    
                    {/* HeaderPage conditionnel */}
                    {!shouldHideHeaderPage && <HeaderPage />}
                    
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-3 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;