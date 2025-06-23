import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { getNavLinkClass } from '../../../fonctions/fonction';
import { IoIosArrowDown } from 'react-icons/io';

interface ParametreSidebarLinkProps {
    userPermissions?: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const ParametreSidebarLink = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}: ParametreSidebarLinkProps) => {
    const { pathname } = useLocation();

    // const hasProfilePermission = userPermissions?.includes('gerer_profil');
    // const hasAdminPermission = userPermissions?.includes('gerer_administrateurs');
    // const hasQrCodePermission = userPermissions?.includes('gerer_qr_code');
    // const hasServicePermission = userPermissions?.includes('gerer_services');
    // const hasFunctionPermission = userPermissions?.includes('gerer_fonctions');
    // const hasGradePermission = userPermissions?.includes('gerer_grades');
    // const hasCategoryPermission = userPermissions?.includes('gerer_categories');
    // const hasRegionPermission = userPermissions?.includes('gerer_regions');
    // const hasDepartmentPermission = userPermissions?.includes('gerer_departements_region');
    // const hasCommunePermission = userPermissions?.includes('gerer_communes');
    // const hasPermissionPermission = userPermissions?.includes('gerer_permissions');

    const hasProfilePermission = true;
    const hasServicePermission = true;
    const hasFunctionPermission = true;
    const hasGradePermission = true;
    const hasRegionPermission = true;
    const hasDepartmentPermission = true;
    const hasCommunePermission = true;

    const menuItems = [
        { permission: hasProfilePermission, path: '/parametres/profile', label: t('sub_menu.profil') },
        { permission: hasServicePermission, path: '/parametres/besoins-formation/manage', label: t('sub_menu.cree_besoin_formation') },
        { permission: hasServicePermission, path: '/parametres/etablissements', label: t('sub_menu.etablissements') },
        { permission: hasServicePermission, path: '/parametres/taches-formations', label: t('sub_menu.taches_formations') },        
        { permission: hasServicePermission, path: '/parametres/cohortes', label: t('sub_menu.cohortes') },
        { permission: hasServicePermission, path: '/parametres/taxes', label: t('sub_menu.taxes') },
        { permission: hasServicePermission, path: '/parametres/structures', label: t('sub_menu.structures') },
        { permission: hasServicePermission, path: '/parametres/services', label: t('sub_menu.services') },
        { permission: hasGradePermission, path: '/parametres/grades', label: t('sub_menu.grades') },
        { permission: hasFunctionPermission, path: '/parametres/categories-professionnelles', label: t('sub_menu.categories_professionnelles') },
        { permission: hasGradePermission, path: '/parametres/postes-de-travail', label: t('sub_menu.postes_de_travail') },
        { permission: hasRegionPermission, path: '/parametres/regions', label: t('sub_menu.regions') },
        { permission: hasDepartmentPermission, path: '/parametres/departements', label: t('sub_menu.departements') },
        { permission: hasCommunePermission, path: '/parametres/communes', label: t('sub_menu.communes') },
        // { permission: hasPermissionPermission, path: '/parametres/permissions', label: t('sub_menu.permission') }
    ];

    const accessibleItems = menuItems.filter(item => item.permission);

    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/parametres' || pathname.includes('parametres')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('parametres') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6 text-[22px]"><IoSettingsOutline /></div>
                            {t('menu.parametres')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) => getNavLinkClass(isActive)}>
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

    if (accessibleItems.length === 1) {
        const singleItem = accessibleItems[0];
        return (
            <li>
                <NavLink
                    to={singleItem.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${
                        pathname === singleItem.path ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''
                    }`}
                >
                    <div className="w-6 text-[22px]"><IoSettingsOutline /></div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/parametres' || pathname.includes('parametres')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-white duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${pathname.includes('parametres') ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''}`}
                        >
                            <div className="w-6 text-[22px]"><IoSettingsOutline /></div>
                            {t('menu.parametres')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) => getNavLinkClass(isActive)}>
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

    return null;
};

export default ParametreSidebarLink;
