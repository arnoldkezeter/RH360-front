import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { GraduationCapIcon } from 'lucide-react';

// Définir les types des props
interface MesFormationsSidebarLinkProps {
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
    currentUser:Utilisateur
}

const MesFormationsSidebarLink: React.FC<MesFormationsSidebarLinkProps> = ({
    sidebarExpanded,
    setSidebarExpanded,
    t,
    currentUser
}) => {
    const { pathname } = useLocation();


    // Liste des éléments de menu avec conditions de permission
    const menuItems = [
        {path: '/mes-formations/responsable', label: t('sub_menu.responsable'), roles:["RESPONSABLE-FORMATION"] },
        {path: '/mes-formations/participant', label: t('sub_menu.participant'), roles:["UTILISATEUR"]}
    ];

    // Filtrer les éléments du menu en fonction des permissions
    // const accessibleItems = menuItems.filter(item => item.permission);
    const accessibleItems = menuItems.filter((item) =>
        item.roles.some((role) => currentUser.roles && currentUser.roles.includes(role))
    );
    // Cas où l'MesFormations a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/mes-formations' || pathname.includes('mes-formations')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('mes-formations') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6">
                                <GraduationCapIcon className="text-[22px]" />
                            </div>
                            {t('menu.mes_formations')}
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

    // Cas où l'MesFormations a une seule permission
    if (accessibleItems.length === 1) {
        const singleItem = accessibleItems[0];
        return (
            <li>
                <NavLink
                    to={singleItem.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === singleItem.path ? 'bg-g[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                >
                    <div className="w-6">
                        <GraduationCapIcon className="text-[18px]" />
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'MesFormations a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/mes-formations' || pathname.includes('mes-formations')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('mes-formations') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6">
                                <GraduationCapIcon className="text-[22px]" />
                            </div>
                            {t('menu.etudiants')}
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

    // Cas où l'MesFormations n'a aucune permission
    return null;
};

export default MesFormationsSidebarLink;
