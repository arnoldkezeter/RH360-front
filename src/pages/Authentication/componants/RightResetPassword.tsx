import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import Input from "../../../components/ui/input";
import ButtonCustom from "../../../components/ui/button";
import { useTranslation } from 'react-i18next';
import { isValidEmail } from "../../../fonctions/fonction";
import { MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { apiSendVerificationCodeByEmail } from "../../../api/auth/api_send_verification_code";
import createToast from "../../../hooks/toastify";


function RightSectionResetPassword() {
    const { t } = useTranslation();

    const [successSend, setSuccessSend] = useState<boolean>(false);
    const [count, setCount] = useState<number>(5);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    // error
    const [error2, setError2] = useState('');

    let notValidEmail = '';


    useEffect(() => {
        if (successSend && count > 0) {
            const timer = setTimeout(() => {
                setCount(count - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [successSend, count]);



    const handleSubmit = async () => {
        if (!email) {
            setError2(lang === 'en' ? "Email is required" : "Email est requis");
        }

        // 
        if (!email) {
            setError2(lang === 'en' ? "Email is required" : "Email est requis");
        } else {
            notValidEmail = isValidEmail(email);
            if (notValidEmail) {
                setError2(notValidEmail);
            }
        }

        // declencher 
        if (email && notValidEmail == "") {
            try {
                setLoading(true);

                await apiSendVerificationCodeByEmail({ email: email })
                    .then((e: any) => {
                        setLoading(false);
                        setSuccessSend(true);
                        createToast((e.message as any)[lang], '', 0)

                        // setTimeout(() => {
                        //     setSuccessSend(false);
                        // }, 1000);

                        setTimeout(() => {
                            navigate(`/verification-code/${e.data}`);
                        }, 6000);





                    })
                    .catch((e: any) => {
                        setLoading(false);
                        createToast((e.message as any)[lang], '', 2);
                        setSuccessSend(false);

                    })
            } catch (e: any) {
                setLoading(false);
                createToast((e.message as any)[lang], '', 2);
                setSuccessSend(false);

            }
        }


    }


    useEffect(() => {
        setError2('')
    }, [email])


    return (
        <div>
            <div className="w-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[2%]">

                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>

                    {
                        successSend ?
                            <div className="py-[180px]  text-center">
                                <h1 className="">{lang === 'en' ? 'Please. ' : 'Patientez. '} {count} sec ...</h1>
                            </div>

                            : <div className="p-2  w-full   sm:p-8.5 px-5 xl:px-10">
                                <div className="mb-8 ">
                                    <Link to="/signin" className="text-primary font-medium flex items-center gap-x-4 hover:underline">
                                        <MdArrowBack />
                                        {`${t('boutton.se_connecter')}`}
                                    </Link>
                                </div>
                                {/* titre */}

                                <div className="flex flex-col items-center justify-center py-0 ">
                                    <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                                        {t('boutton.reinit_pass')}
                                    </h1>

                                    <div className="flex flex-col items-start w-full">


                                        {/* email */}
                                        <div className="mb-4 w-full ">
                                            <LabelInput title={t('label.email')} />
                                            <Input
                                                type="email"
                                                placeholder={t('label.entree_email')}
                                                value={email}
                                                setValue={setEmail}
                                            />
                                            {(!email || !notValidEmail) && <ErrorInput title={error2} />}
                                        </div>

                                        {/* Bouton */}
                                        <div className="w-full  mt-5">

                                            {
                                                <ButtonCustom
                                                    loading={loading}
                                                    title={t('boutton.recevoir_un_nouveau_mdp')}
                                                    onClick={handleSubmit}
                                                    next={true}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default RightSectionResetPassword