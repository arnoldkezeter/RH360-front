import { ErrorInput, LabelInput } from "./Label";
import { useEffect, useState } from 'react';
import createToast from "../../../hooks/toastify";
import Input from "../../../components/ui/input";
import ButtonCustom from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { apiVerifyCodeSendByEmail } from "../../../api/auth/api_verify_code_email";
import SectionEnterNewPassword from "./SectionEnterNewPassword";

export function RightSectionVerificationCode() {
    const lang = useSelector((state: RootState) => state.setting.language);

    const { id } = useParams();

    const { t } = useTranslation();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // error
    const [error2, setError2] = useState('');

    let notValidCode = '';


    const [successCode, setSuccessCode] = useState(false);


    const handleSubmit = async () => {

        if (!code) {
            setError2(lang === 'en' ? "Code is required" : "Le code est requis");
        } else {
            const onlyDigits = /^\d+$/;

            if (code.length < 6) {
                setError2(lang === 'en' ? "Code must be at least 6 characters long" : "Le code doit comporter au moins 6 caractères");
                notValidCode = 'invalid';
            } else if (!onlyDigits.test(code)) {
                setError2(lang === 'en' ? "Code must contain only digits" : "Le code doit contenir uniquement des chiffres");
                notValidCode = 'invalid';
            } else {
                setError2('');
                notValidCode = ''; // Assuming you want to clear notValidCode if the code is valid
            }
        }


        // declencher 
        if (code && notValidCode == "") {
            try {
                setLoading(true);

                if (id) {
                    await apiVerifyCodeSendByEmail({ userId: id, code: code })
                        .then((e: any) => {
                            setLoading(false);


                            if (e.success) {
                                setSuccessCode(true);

                                createToast((e.message as any)[lang], '', 0);
                            }

                        })
                        .catch((e: any) => {

                            setLoading(false);
                            createToast((e.response.data.message as any)[lang], '', 2)
                        });
                }
            } catch (e: any) {
                setLoading(false);
                createToast((e.response.data.message as any)[lang], '', 2)

                createToast((e.message as any)[lang], '', 2);
            }
        }


    }


    useEffect(() => {
        setError2('');
    }, [code]);


    return (

        <div>
            {
                successCode && id ? <SectionEnterNewPassword id={id} /> :
                    <div className="-w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[2%]">
                        <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>

                            <div className="p-2  w-full   sm:p-8.5 px-5 xl:px-10">
                                <div className="mb-8 ">
                                    <Link to="/signin" className="text-primary font-medium flex items-center gap-x-4 hover:underline">
                                        <MdArrowBack />
                                        {`${t('boutton.se_connecter')}`}
                                    </Link>
                                </div>
                                {/* titre */}

                                <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white  text-center">
                                    {lang === 'en' ? 'Enter the verification code received by email' : 'Entrez le code de vérification reçu par mail'}
                                </h1>

                                <div className="flex flex-col items-start w-full">


                                    {/* email */}
                                    <div className="mb-4 w-full ">
                                        <LabelInput title={'Code'} />
                                        <Input
                                            type="text"
                                            placeholder="Entrez le code"
                                            value={code}
                                            setValue={setCode} />
                                        {(!code || !notValidCode) && <ErrorInput title={error2} />}
                                    </div>




                                    {/* Bouton */}
                                    <div className="w-full  mt-5">
                                        <ButtonCustom
                                            loading={loading}
                                            title={t('boutton.soumettre')}
                                            onClick={handleSubmit}
                                            next={true}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }


        </div>
    );
}
