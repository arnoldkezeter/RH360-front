import { useState } from 'react';
import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/Sidebar/SidebarAdmin';
import { useSelector } from 'react-redux';
import { RootState } from '../_redux/store';
import { config } from '../config';
import SidebarTeacher from '../components/Sidebar/SidebarTeacher';
import SidebarStudent from '../components/Sidebar/SidebarStudent';
import Sidebar from '../components/Sidebar/Sidebar';

interface LayoutProps {
    isMobileOrTablet: boolean;
    userPermissions? : string[];
}
const Layout = ({ isMobileOrTablet, userPermissions }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(isMobileOrTablet);

    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;


    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                {
                   
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                }
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    );
};

export default Layout;
