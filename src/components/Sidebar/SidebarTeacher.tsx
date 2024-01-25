import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LogoPng from "./../../images/logo/logo.png";
import { config } from '../../config';
import { RxDashboard } from "react-icons/rx";
import { PiStudentFill } from "react-icons/pi";
import { FaRegCalendarTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuBookMarked } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegCopyright } from "react-icons/fa6";
import SidebarLinkGroup from './SideGroup/SidebarLinkGroup';
import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';


interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const SidebarTeacher = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const location = useLocation();
    const { pathname } = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    // const [sidebarExpanded] = useState(
    //     storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    // );
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
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark   ${sidebarOpen ? 'translate-x-0 duration-300 lg:static lg:translate-x-0' : '-translate-x-full '
                }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:pb-5  lg:pt-9 ">
                <NavLink to="/" className={`flex`}>

                    <div className="md:h-[60px] md:w-[60px] h-25 w-25 ml-2">
                        <img src={LogoPng} alt="logo" />
                    </div>
                    <h1 className='font-extrabold pt-2 ml-4 text-white text-[15px] lg:text-[20px] mt-2'>{config.nameApp}</h1>

                </NavLink>

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
                    <h3 className="mb-2 ml-3 text-sm font-semibold text-bodydark2">
                        MENU
                    </h3>
                    <div>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* TABLEAU DE BORD */}
                            <li>
                                <NavLink
                                    to="/"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                                        pathname.includes('dashboard')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='w-6'>
                                        <div className='text-[20px]'>
                                            <RxDashboard />
                                        </div>
                                    </div>
                                    Tableau De Bord
                                </NavLink>
                            </li>
                            {/* TABLEAU DE BORD */}

                            {/* Discipline etudiant */}
                            <li>
                                <NavLink
                                    to="/teacher/discipline-students"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/teacher/discipline-students' ||
                                        pathname.includes('/teacher/discipline-students')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[18px]'>
                                            <PiStudentFill />
                                        </div>
                                    </div>
                                    Discipline étudiants
                                </NavLink>
                            </li>
                            {/* Discipline etudiant */}


                            {/* Abscences */}
                            <li>
                                <NavLink
                                    to="/teacher/abscences"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/teacher/abscence' ||
                                        pathname.includes('/teacher/abscence')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[18px]'>
                                            <FaRegCalendarTimes />
                                        </div>
                                    </div>
                                    Abscences
                                </NavLink>
                            </li>
                            {/* Abscences */}



                            {/* Matieres enseignants */}
                            {/*<li>
                                <NavLink
                                    to="/teacher/subjects"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/teacher/subjects' ||
                                        pathname.includes('teacher/subjects')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[18px]'>
                                            <LuBookMarked />
                                        </div>
                                    </div>
                                    Matières
                                </NavLink>
                            </li>*/}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/subjects' || pathname.includes('subjects')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/subjects' ||
                                                    pathname.includes('subjects')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='w-6'>
                                                    <div className='text-[17px]'>
                                                        <LuBookMarked />
                                                    </div>
                                                </div>
                                                Matières
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/subject-list"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center  pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            Liste des matières
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/progressions"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5  rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            Progréssion
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* Matieres enseignants */}



                            {/* EMPLOI DE TEMPS */}
                            <li>
                                <NavLink
                                    to="/teacher/schedule"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/teacher/schedule' ||
                                        pathname.includes('/teacher/schedule')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[22px]'>
                                            <AiOutlineSchedule />
                                        </div>
                                    </div>
                                    Emploi de temps
                                </NavLink>
                            </li>
                            {/* EMPLOI DE TEMPS */}



                            {/* calendrier academique */}
                            <li>
                                <NavLink
                                    to="/academic-calendar"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/academic-calendar' ||
                                        pathname.includes('academic-calendar')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[18px]'>
                                            <FaCalendarAlt />
                                        </div>
                                    </div>
                                    Calendrier académique
                                </NavLink>
                            </li>
                            {/*  calendrier academique*/}



                        </ul>
                    </div>

                    {/* <!-- Autres --> */}
                    <div>
                        <h3 className="mb-2 ml-4 text-sm font-semibold text-bodydark2">
                            AUTRES
                        </h3>

                        <ul className="mb-2 flex flex-col gap-1.5">
                            {/* Profil */}
                            <li>
                                <NavLink
                                    to="/profile"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/profile' ||
                                        pathname.includes('profile')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[22px]'>
                                            <RxPerson />
                                        </div>
                                    </div>
                                    Mon Profil
                                </NavLink>
                            </li>
                            {/* Profil */}

                            {/* Parametre */}
                            <li>
                                <NavLink
                                    to="/settings"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/settings' ||
                                        pathname.includes('settings')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[22px]'>
                                            <IoSettingsOutline />
                                        </div>
                                    </div>
                                    Paramètres
                                </NavLink>
                            </li>
                            {/* Parametre */}



                            <div className='w-full flex flex-col justify-center items-center -ml-4 mt-10 mb-5 text-body'>
                                <div className='flex items-center'>
                                    <div className='text-[10px]  pr-1 '>
                                        <FaRegCopyright />
                                    </div>
                                    <p className='text-[10px]'>{config.copyRight}</p>

                                </div>

                                <p className='text-[13px] ml-2'>Version <span className='font-semibold'>{config.version}</span></p>

                            </div>

                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </nav>
    );
};

export default SidebarTeacher;

