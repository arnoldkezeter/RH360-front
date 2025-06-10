import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';


interface SidebarLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    permissionsRequired?: string[];  // Optionnel, si une permission est nécessaire
    userPermissions?: string[];
    t: (key: string) => string;
}

const SidebarLink = ({
    to,
    icon,
    label,
    permissionsRequired = [],
    userPermissions,
    t
}: SidebarLinkProps) => {
    const { pathname } = useLocation();
    // Vérifie si l'utilisateur a au moins une des permissions nécessaires
    const hasPermission = permissionsRequired.some(permission => userPermissions?.includes(permission));

    // Si aucune permission n'est requise ou si l'utilisateur a la permission
    if (permissionsRequired.length === 0 || hasPermission) {
        
        return (
            <li>
                <NavLink
                    to={to}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-[#1e3a8a] dark:hover:bg-meta-4 ${
                        (pathname === to ) ? 'bg-[#1e3a8a] dark:bg-meta-4 text-white' : ''
                    }`}
                >
                    <div className="w-6">
                        <div className="text-[22px]">{icon}</div>
                    </div>
                    {t(label)}
                </NavLink>
            </li>
        );
    }

    // Si l'utilisateur n'a pas les permissions, on ne rend rien
    return null;
};

// Composant pour le Tableau de Bord
export const DashboardLink = ({ userPermissions, t }: { userPermissions?: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/"
        icon={<RxDashboard />}
        label="menu.tableau_de_bord"
        userPermissions={userPermissions}
        t={t}
    />
);