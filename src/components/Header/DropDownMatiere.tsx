import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import ImageAdmin from './../../images/user/admin.png';
import ImageTeacher from './../../images/user/teacher.png';
import ImageDelegate from './../../images/user/delegate.png';
import ImageStudent from './../../images/user/student.png';
import { logoutFunction } from '../../services/auth/logout';
import { useSelector } from 'react-redux';
import { RootState } from "./../../_redux/store";
import { config } from '../../config';
import { formatRoleName } from '../../fonctions/fonction';
import { BiLogOutCircle } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";


const DropDownMatiere = () => {
  // const pageIsLoading = useSelector((state: RootState) => state.setting.pageIsLoading);
  const pageIsLoading = false;

  const roles = config.roles;

  const userState = useSelector((state: RootState) => state.user);

  const user = { username: userState.username, role: userState.role };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);



  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <svg
          className={`hidden fill-current sm:block ${dropdownOpen ? 'rotate-180' : ''
            }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >

        <ul className="flex flex-col  border-b border-stroke   dark:border-strokedark">
          <NavLink
            to="/profile"
            onClick={() => { setDropdownOpen(false) }}
            className="flex items-center gap-3.5 py-3 pt-3 px-5 text-sm font-medium duration-300 ease-in-out lg:text-base hover:bg-gray dark:hover:bg-black"
          >
            <div className='text-lg text-[23px]'>
              <RxPerson />

            </div>
            Mon profil
          </NavLink>


          <NavLink
            to="/settings"
            onClick={() => { setDropdownOpen(false) }}
            className=" flex items-center gap-3.5 py-3 px-5 text-sm font-medium duration-300 ease-in-out  lg:text-base hover:bg-gray dark:hover:bg-black">
            <div className='text-lg text-[23px]'>
              <IoSettingsOutline />

            </div>
            Paramètres
          </NavLink>
        </ul>


        <button
          onClick={() => {
            logoutFunction();
          }}
          className=" flex items-center gap-3.5 py-3 pb-3.5 px-5 text-sm font-medium duration-300 ease-in-out text-meta-7 hover:text-meta-1 lg:text-base hover:bg-gray dark:hover:bg-black">
          <div className='text-lg text-[25px]'>
            <BiLogOutCircle />

          </div>
          Se déconnecter
        </button>


      </div>
    </div>
  );
};

export default DropDownMatiere;
