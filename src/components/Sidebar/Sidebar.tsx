import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../../config';
import { FaRegCopyright } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import LogoNavbar from './LogoNavbar';
import ElaborationSidebarLink from './SideSection/ElaborationFormationSection';
import ParametreSidebarLink from './SideSection/ParametreSection';
import { DashboardLink } from './SideSection/SidebarLink';
import ExecutionSidebarLink from './SideSection/ExecutionFormationSection';
import EvaluationSidebarLink from './SideSection/EvaluationFormationSection';
import StagiaireSidebarLink from './SideSection/StagiaireSection';
import ChercheurSidebarLink from './SideSection/ChercheurSection';
import UtilisateurSidebarLink from './SideSection/UtilisateurSection';
import NoteServiceSidebarLink from './SideSection/NoteServiceSection';
import MesFormationsSidebarLink from './SideSection/MesFormationsSection';



interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    currentUser:Utilisateur
    // userPermissions?:string[];
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentUser }: SidebarProps) => {
    const location = useLocation();
    const { pathname } = location;
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const { t } = useTranslation();
    const userPermissions = true;
    
    
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );


    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <nav
            ref={sidebar}
            className={`
            text-[14px]  lg:text-[15px] 

            absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#1e40af] duration-300 ease-linear dark:bg-boxdark   ${sidebarOpen ? 'translate-x-0 duration-300 lg:static lg:translate-x-0' : '-translate-x-full '
                }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:pb-5  lg:pt-9 ">
                <LogoNavbar />
                {/* Bouton pour fermer la sidebar */}


                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>

            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-0 py-4 px-4 lg:mt- lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <h3 className="mb-2 ml-3 text-sm font-semibold text-white">
                        {t('menu.menu')}
                    </h3>
                    <div>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* TABLEAU DE BORD */}
                            {userPermissions && <DashboardLink
                                // userPermissions={userPermissions}
                                t={t}
                            />}
                            {/* TABLEAU DE BORD */}

                             {/* Mes formations */}
                             {userPermissions && <MesFormationsSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/* Mes formations  */}

                            {/* Elaboration : list group */}
                            {userPermissions && <ElaborationSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/* ! Elaboration */}

                            {/* Execution */}
                            {userPermissions && <ExecutionSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/*!Execution */}

                            {/**Evaluations */}
                            {userPermissions && <EvaluationSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/**!Evaluations */}

                            {/**Stagiaires */}
                            {userPermissions && <StagiaireSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/**!Stagiaires */}

                            {/**Chercheur */}
                            {userPermissions && <ChercheurSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/**!Chercheur */}


                            {/**Utilisateur */}
                            {userPermissions && <UtilisateurSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/**!Utilisateur */}


                            {/**Note de service */}
                             {userPermissions && <NoteServiceSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/**!Note de service */}






    
                         
                            {/* <!-- Autres --> */}

                            <h3 className="mt-8 mb-2 ml-4 text-sm font-semibold text-white">
                                {t('menu.autres')}
                            </h3>


                            {/* Parametre */}
                            {userPermissions && <ParametreSidebarLink
                                // userPermissions={userPermissions}
                                currentUser={currentUser}
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                t={t}
                            />}
                            {/* ! Parametre */}
                            
                        </ul>
                    </div>





                    {/* Copyright */}

                    <div className='w-full flex flex-col justify-center items-center -ml-4 mt-10 mb-5 text-white'>
                        <div className='flex items-center'>
                            <div className='text-[10px]  pr-1 '>
                                <FaRegCopyright />
                            </div>
                            <p className='text-[10px]'>{config.copyRight}</p>

                        </div>

                        <p className='text-[13px] ml-2'>{t('label.version')} <span className='font-semibold'>{config.version}</span></p>

                    </div>
                    {/* ! Copyright */}


                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </nav>
    );
};

export default Sidebar;

