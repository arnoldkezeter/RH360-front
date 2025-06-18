import { Link } from "react-router-dom";
import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import { signInApi } from "../../../services/auth/api_signin";
import Input from "../../../components/ui/input";
import ButtonCustom from "../../../components/ui/button";
import createToast from "../../../hooks/toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePassword } from "../../../fonctions/fonction";
// import { setUser } from "../../../_redux/features/user_slice";
import { useNavigate } from 'react-router-dom';
import { setUser } from "../../../_redux/features/utilisateurs/utilisateurSlice";

function RightSectionSigin() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    var lang = useSelector((state: RootState) => state.setting.language) || 'fr';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // error
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');

    let notValidEmail = '';
    let notValidPassword = '';

    const handleSubmit = async () => {
        setError2('');
        setError3('');
        notValidEmail = validateEmail(email);
        if (notValidEmail) {
            setError2(t(notValidEmail));
        }

        // notValidPassword = validatePassword(password);
        // if (notValidPassword) {
        //     setError3(t(notValidPassword));
        // }

        // declencher 
        if (email && password && notValidEmail == "" && notValidPassword == "") {
            setLoading(true);
            var signUpResult = null;
            try {
                signUpResult = await signInApi({ email: email, motDePasse: password, lang:lang });
                if (signUpResult.success) {
                    if (signUpResult.message !== null && signUpResult.message !== undefined) {
                        createToast((signUpResult.message as any), '', 0)
                    }
                } else {
                    if (signUpResult.message !== null && signUpResult.message !== undefined) {
                        createToast((signUpResult.message as any), '', 2)
                    }
                }

                if (signUpResult?.success === true) {

                    const userData = signUpResult.data as Utilisateur;
                    

                    if (userData.role) {
                        window.location.href = '/';
                    } else {
                        navigate('/choose-account');
                        // window.location.href = '/choose-account';

                    }
                    setLoading(false)
                }

            } catch (e: any) {
                console.log(e);
                setLoading(false);
                createToast(t('message.serveur_inactif'), "", 2);
            }finally{
                setLoading(false);
            }
        }
    }


    useEffect(() => {
        setError2('')
    }, [email])
    useEffect(() => {
        setError3('')
    }, [password])


    return (
        <div>
            <div className="w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[2%]">
                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-0'>
                    <div className="flex flex-col items-center justify-start w-full p-2 sm:p-12.5 px-5 py-8 xl:px-10">
                        {/* titre */}
                        <h1 className="mb-8 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                            {t('boutton.se_connecter')}
                        </h1>

                        <div className="flex flex-col items-start w-full">


                            {/* email */}
                            <div className="mb-4 w-full ">
                                <LabelInput title={t('label.email')} />
                                <Input
                                    type="text"
                                    placeholder={t('label.entree_email')}
                                    value={email}
                                    setValue={setEmail}
                                />
                                {(!email || !notValidEmail) && <ErrorInput title={error2} />}
                            </div>

                            {/* mot de passe */}
                            <div className="mb-4 w-full">
                                <LabelInput title={t('label.mot_de_passe')} />
                                <Input
                                    type="password"
                                    placeholder={t('label.entree_pass')}
                                    value={password}
                                    setValue={setPassword}
                                />
                                {(!password || !notValidPassword) && <ErrorInput title={error3} />}
                            </div>




                            {/* Bouton */}
                            <div className="mt-5 w-full">

                                {

                                    <ButtonCustom
                                        loading={loading}
                                        title={t('boutton.se_connecter')}
                                        onClick={handleSubmit}
                                        next={true}
                                    />
                                }
                            </div>

                            <div className="mt-6 text-center text-[15px] flex justify-end items-end w-full">
                                <Link to="/reset-password" className="text-primary font-medium hover:underline">
                                    {t('boutton.oublie_pass')}
                                </Link>
                            </div>
                            {/*  rediriger vers se connecter */}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSectionSigin