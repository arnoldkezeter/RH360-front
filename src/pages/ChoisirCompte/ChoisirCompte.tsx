import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { logoutFunction } from '../../api/auth/logout';
import ButtonCustom from '../../components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, updateUser } from '../../_redux/features/user_slice';
import createToast from '../../hooks/toastify';
import { signInApi } from '../../api/auth/api_signin';
import { reJwtApi } from '../../api/auth/api_re_jwt';
import LoaderCircular from '../../components/Loader/LoaderCircular';
import Loading from '../../components/ui/loading';
import LanguageToogle from '../../components/ui/language_toggle';
import MobileHead from '../Authentication/componants/MobileHead';
import { config } from '../../config';
import LogoPng from "./../../images/logo/logo.png";

function ChoisirCompte() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const stateUser = useSelector((state: RootState) => state.user)
    const userRoles = stateUser.roles.length > 0 ? stateUser.roles : []; //

    const [selectRole, setSelectRole] = useState<string>('');

    const handleSelectRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectRole(value);
        console.log(value); // Vous pouvez mettre le code de console.log ici
    };

    const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
    const lang = useSelector((state: RootState) => state.setting.language);



    return (
        <div className='flex flex-col h-screen w-screen justify-center items-center  bg-black'>
            <div className='flex items-center justify-start gap-x-5 -mt-[1%] pb-5'>
                <Link
                    to={'/signin'}
                    className="md:h-[50px] md:w-[50px]">
                    <img src={LogoPng} alt="logo" />
                </Link>
                <div className='flex flex-col items-start justify-center'>
                    <p className="text-4xl  font-normal text-white mt-0.5">
                        {config.nameApp}
                    </p>
                    {/* <a
                            href={config.companyUrl}
                            className="text-[12px]  font-normal hover:underline text-secondary hover:text-primary">
                            Par {config.companyName}
                        </a> */}
                </div>
            </div>

            <div className='mx-5 px-8 lg:px-16  pt-20 pb-10 border border-0.5 border-[#b1ababb1] items-center justify-center flex flex-col rounded-lg gap-y-10 bg-transparent'>
                <h1 className='text-center text-lg font-semibold text-white'>
                    Avec quel compte souhaitez-vous continuer ?
                </h1>

                <div>
                    <select id="role" value={selectRole} onChange={handleSelectRole} className="px-2 py-2 dark:bg-boxdark   lg:w-60 rounded border border-[#61708f88] text-lg lg:text-lg">
                        <option className='h-60' value="" disabled hidden>Entrez votre choix</option>
                        {userRoles.map((role: string, index: number) => (
                            <option className='text-sm lg:text-lg' key={index} value={role}>{t(role)}</option>
                        ))}
                    </select>
                </div>


                <div className='w-60'>

                    {
                        pageIsLoading ? <Loading /> :
                            <ButtonCustom
                                next={true}
                                desactivated={selectRole == '' ? true : false}
                                outline={selectRole === '' ? true : false} title={'Continuer'} onClick={async () => {

                                    try {
                                        setPageIsLoading(true);

                                        const signUpResult = await reJwtApi({ role: selectRole, userId: stateUser._id });


                                        if (signUpResult.success) {
                                            if (signUpResult.message !== null) {
                                                createToast((signUpResult.message as any)[lang], '', 0)

                                            }
                                        } else {
                                            if (signUpResult.message !== null) {
                                                createToast((signUpResult.message as any)[lang], '', 1)

                                            }
                                        }

                                        if (signUpResult?.success === true) {
                                            const userData = signUpResult.data as UserState;

                                            dispatch(setUser(userData))


                                            if (userData.role !== '') {
                                                window.location.href = '/';
                                            } else {
                                                createToast(t('message.erreur'), "", 2)

                                            }

                                            setPageIsLoading(false);
                                        }
                                    } catch (e) {
                                        setPageIsLoading(false);
                                        createToast(t('message.erreur'), "", 2)
                                    }


                                }} />
                    }

                    <div className='w-60 mt-20'>
                        <ButtonCustom

                            title={'Revenir en arrière'}
                            outline={true}
                            onClick={() => { logoutFunction() }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ChoisirCompte;
