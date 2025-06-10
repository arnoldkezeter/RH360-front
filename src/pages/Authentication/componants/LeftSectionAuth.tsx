import { FaRegCopyright } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

import { config } from '../../../config'
import LogoPng from "./../../../images/logo/logo.png";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function LeftSectionAuth() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-start items-start h-screen w-full">
            <div className='mx-30'>
                {/* entete */}
                <div className='flex items-center justify-center gap-x-5 mt-[20%]'>
                    <Link
                    to="/signin"
                    className="md:h-[200px] md:w-[200px] bg-white rounded-full flex items-center justify-center overflow-hidden"
                    >
                        <img src={LogoPng} alt="logo" className="h-full w-full object-cover" />
                    </Link>
                    
                </div>

                {/* body */}
                <div className='mt-[10%]'>
                    <h1 className='text-white font-normal text-4xl w-[400px]'>
                    {t('label.bienvenue')}
                    </h1>
                    <p className='text-md text-white pt-4'>
                        {t('label.message_bienvenue')}
                    </p>
                </div>
            </div>

            <div className='flex mt-[15%] items-center justify-between w-full px-20 text-white'>


                <div className='flex'>
                    <div className='flex items-center justify-center'>
                        <div className='text-[10px] pr-1 '>
                            <FaRegCopyright />
                        </div>
                        <p className='text-[12px]'>{config.copyRight},{t('label.droit_reserver')}</p>
                    </div>
                    <p className='text-[12px] ml-2'>{t('label.version')} <span className=''>{config.version}</span></p>

                </div>

                <div className='flex gap-x-5 pr-5 text-xl'>
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


            {/* footer */}
        </div>
    )
}

export default LeftSectionAuth

