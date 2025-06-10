import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../_redux/store";
import ButtonCustom from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { ErrorInput, LabelInput } from "./Label";
import Input from "../../../components/ui/input";
import { validatePassword } from "../../../fonctions/fonction";
import { apiUpdatePassword } from "../../../services/auth/api_reset_password";
import createToast from "../../../hooks/toastify";

interface SectionEnterNewPasswordProps {
    id: string;
}

const SectionEnterNewPassword = ({ id }: SectionEnterNewPasswordProps) => {
    const lang = useSelector((state: RootState) => state.setting.language);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [newPassword, setNewPassord] = useState('');
    const [confirmPassword, setConfirmPassord] = useState('');

    const [errorNewPassword, setErrorNewPassword] = useState('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('')



    const handleClean = async () => {
        setNewPassord('');
        setConfirmPassord('');
        setErrorConfirmPassword('');
        setErrorNewPassword('');
    }

    const handleSubmit = async () => {
        if (!newPassword && !confirmPassword) {
            if (!newPassword) {
                setErrorNewPassword(t('error.new_pass'))
            }

            if (!confirmPassword) {
                setErrorConfirmPassword(t('error.confirm_pass_field'))
            }
            return;
        }

        const notValidPassword = validatePassword(newPassword);
        if (notValidPassword) {
            setErrorConfirmPassword(t(notValidPassword));
            return;
        }

        if (confirmPassword !== newPassword) {
            setErrorConfirmPassword(t('error.confirm_pass'));
            return;
        }

        setLoading(true);
        await apiUpdatePassword({ userId: id, newPassword: newPassword }).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message[lang as keyof typeof e.message], '', 0);
                setLoading(false);
                handleClean();

                setTimeout(() => {
                    navigate('/signin');
                }, 1000)



            } else {
                setLoading(false);
                createToast(e.message[lang as keyof typeof e.message], '', 2);
            }
        }).catch((e) => {
            setLoading(false);
            createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
        })
    }

    return (
        <div className="-w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[2%]">
            <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>

                <div className="p-2  w-full  sm:p-8.5 px-5 xl:px-10">
                    <div className="mb-8 ">
                        <Link to="/signin" className="text-primary font-medium flex items-center gap-x-4 hover:underline">
                            <MdArrowBack />
                            {`${t('boutton.se_connecter')}`}
                        </Link>
                    </div>
                    {/* titre */}



                    <div className="flex flex-col items-start w-full py-5">


                        {/* email */}
                        <div className="mb-5.5 w-full ">
                            <LabelInput title={t('label.nouveau_pass')} required={true} />
                            <Input
                                type="password"
                                placeholder="********"
                                value={newPassword}
                                setValue={(value: string) => { setNewPassord(value); setErrorNewPassword(""); }}
                            />
                            {errorNewPassword && <ErrorInput title={errorNewPassword} />}
                        </div>

                        <div className="mb-5.5 w-full ">
                            <LabelInput title={t('label.confirm_pass')} required={true} />
                            <Input
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                setValue={(value: string) => { setConfirmPassord(value); setErrorConfirmPassword(""); }}
                            />
                            {errorConfirmPassword && <ErrorInput title={errorConfirmPassword} />}
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
    )

}


export default SectionEnterNewPassword;
