import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { FaUserGraduate } from 'react-icons/fa';

// Définir les types des props
interface StagiaireSidebarLinkProps {
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
    currentUser:Utilisateur
}

const StagiaireSidebarLink: React.FC<StagiaireSidebarLinkProps> = ({
    sidebarExpanded,
    setSidebarExpanded,
    t,
    currentUser
}) => {
    const { pathname } = useLocation();


    // Liste des éléments de menu avec conditions de permission
    const menuItems = [
         
        {path: '/stagiaires/gestion-stagiaire', label: t('sub_menu.gerer_stagiaires'), roles:["SUPER-ADMIN", "ADMIN", "GESTIONNAIRE", "SUPERVISEUR"] },
        {path: '/stagiaires/stages', label: t('sub_menu.stages'), roles:["SUPER-ADMIN", "ADMIN", "GESTIONNAIRE"] },
        {path: '/stagiaires/rapports', label: t('sub_menu.rapports_stages'), roles:["SUPER-ADMIN", "ADMIN"] },

    ];

    // Filtrer les éléments du menu en fonction des permissions
    // const accessibleItems = menuItems.filter(item => item.permission);
    const accessibleItems = menuItems.filter((item) =>
        item.roles.some((role) => currentUser.roles && currentUser.roles.includes(role))
    );
    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/stagiaires' || pathname.includes('stagiaires')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('stagiaires') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6">
                                <FaUserGraduate  className="text-[22px]" />
                            </div>
                            {t('menu.stagiaires')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) => 
                                            `group relative flex items-center pb-2 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`}
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </SidebarLinkGroup>
        );
    }

    // Cas où l'utilisateur a une seule permission
    if (accessibleItems.length === 1) {
        const singleItem = accessibleItems[0];
        return (
            <li>
                <NavLink
                    to={singleItem.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname === singleItem.path ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                >
                    <div className="w-6">
                        <FaUserGraduate  className="text-[18px]" />
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'utilisateur a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/stagiaires' || pathname.includes('stagiaires')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('stagiaires') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6">
                                <FaUserGraduate  className="text-[22px]" />
                            </div>
                            {t('menu.stagiaires')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) =>
                                            `group relative flex items-center pb-2 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`}
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </SidebarLinkGroup>
        );
    }

    // Cas où l'utilisateur n'a aucune permission
    return null;
};

export default StagiaireSidebarLink;
