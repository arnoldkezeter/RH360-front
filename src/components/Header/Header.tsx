import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LanguageToogle from '../ui/language_toggle';
// import ModalNotificationDetails from '../Modals/ModalNotification/FormNotification';
import { useDispatch } from 'react-redux';
import { setShowModalNotificationDetails } from '../../_redux/features/setting';
import { useState } from 'react';



const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
  const handleNotificationDetails = (notification: NotificationType) => {
      setSelectedNotification(notification);
      dispatch(setShowModalNotificationDetails());
  }


  return (
    <header className="sticky top-0 z-999 flex w-full bg-[#1e40af] drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none max-h-[55px]">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
              
            }}
            className="z-99999 block rounded-sm bg-[#1e40af] p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark "
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-white delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'
                    }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-white delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'
                    }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-white delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-white delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-[0]'
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-white duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-200'
                    }`}
                ></span>
              </span>
            </span>
          </button>

        </div>


        <div className="flex items-center gap-3 2xsm:gap-7">

          <LanguageToogle />
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <DarkModeSwitcher /> */}
            <DropdownNotification onEdit={handleNotificationDetails}/>
          </ul>

          <DropdownUser />
          {/* <ModalNotificationDetails notification={selectedNotification}/> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
