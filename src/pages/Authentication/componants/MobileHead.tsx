import { Link } from "react-router-dom"
import { config } from "../../../config"
import LogoPng from "./../../../images/logo/logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


function MobileHead() {
    return (
        <div className='lg:hidden flex flex-col items-start justify-between w-full ml-4  mb-3 -mt-5'>
            <div className='flex items-center justify-between  mt-[10%] w-full '>
                <Link
                    to={'/'}
                    className="flex items-center justify-start w-full  ">
                    <img src={LogoPng} alt="logo" className="h-[40px] w-[40px] mr-2" />
                    <p className="text-xl  font-bold text-black-2 ">
                        {config.nameApp}
                    </p>
                </Link>


                <div className='mr-4'>

                    {/* <a
                        href={config.companyUrl}
                        className="text-sm  font-normal hover:underline text-primary hover:text-secondary">
                        Par {config.companyName}
                    </a> */}
                    <div className='flex gap-x-5 pr-5 text-lg'>
                        <a className='hover:text-primary' href={config.facebook}>
                            <FaFacebook />
                        </a>
                        <a className='hover:text-primary' href={config.twitter}>
                            <FaTwitter />
                        </a>
                        <a className='hover:text-primary' href={config.instagram}>
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
        </div>)
}

export default MobileHead