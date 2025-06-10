import { NavLink } from 'react-router-dom';
import LogoPng from "./../../images/logo/logo.png";
import { config } from '../../config';
function LogoNavbar() {
    return (
        <NavLink to="/" className={`flex`}>

            <div className="md:h-[60px] md:w-[60px] h-[60px] w-[60px] ml-2 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src={LogoPng} alt="logo" className="h-full w-full object-contain" />
            </div>

            <div className='flex flex-col ml-3.5 mt-3 text-white'>
                <h1 className='font-extrabold  text-[15px] lg:text-[20px] mt-2'>{config.nameApp}</h1>
            </div>

        </NavLink>)
}

export default LogoNavbar