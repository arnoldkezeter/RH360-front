import { useTranslation } from "react-i18next";
import { RiLockPasswordLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useState } from "react";
import { apiUpdatePassword } from "../../services/auth/api_reset_password";
import createToast from "../../hooks/toastify";
import { validatePassword } from "../../fonctions/fonction";
import { ErrorInput, LabelInput } from "../../pages/Authentication/componants/Label";
import Input from "../ui/input";
import { apiVerifierMotDePasse } from "../../services/auth/api_verifier-password";
import ButtonLoading from "../ui/ButtonLoading";
import ButtonOutline from "../ui/ButtonOutline";

export function ChangePassword() {
    const { t } = useTranslation();
    const userState: UserState = useSelector((state: RootState) => state.user);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPassword, setCurrentPassord] = useState('');
    const [newPassword, setNewPassord] = useState('');
    const [confirmPassword, setConfirmPassord] = useState('');
    const [errorCurrentPassword, setErrorCurrentPassword] = useState('')
    const [errorNewPassword, setErrorNewPassword] = useState('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('')

    const [loadingVerifyPwd, setLoadingVerifyPwd] = useState<boolean>(false);
    const [loadingUpdatePwd, setLoadingUpdatePwd] = useState<boolean>(false);

    const [passwordIsVerify, setIsPasswordIsVerify] = useState<boolean>(false);

    const handleClean = async () => {
        setNewPassord('');
        setCurrentPassord('')
        setConfirmPassord('')
        setErrorConfirmPassword('')
        setErrorCurrentPassword('')
        setErrorNewPassword('')
    }

    const handleUpdate = async () => {

        if (!currentPassword && !newPassword && !confirmPassword) {
            if (!currentPassword) {
                setErrorCurrentPassword(t('error.current_pass'))
            }
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

        setLoadingUpdatePwd(true);
        await apiUpdatePassword({ userId: userState._id, newPassword: newPassword }).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message[lang as keyof typeof e.message], '', 0);
                setLoadingVerifyPwd(false);
                setIsPasswordIsVerify(false);
                handleClean();

            } else {
                setLoadingVerifyPwd(false);
                createToast(e.message[lang as keyof typeof e.message], '', 2);
            }
        }).catch((e) => {
            setLoadingVerifyPwd(false);
            createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
        })
    }

    const handleVerifierPassword = async () => {
        if (!currentPassword) {
            if (!currentPassword) {
                setErrorCurrentPassword(t('error.current_pass'))
            }

            return;
        }

        if (currentPassword.trim().length < 8) {
            return setErrorCurrentPassword(t("toast.mot_de_passe_min_longueur"));
        }


        setLoadingVerifyPwd(true);

        await apiVerifierMotDePasse({ userId: userState._id, motDePasse: currentPassword }).then((e: ReponseApiPros) => {
            setLoadingVerifyPwd(false);

            if (e.success) {
                handleClean();
                createToast(e.message[lang as keyof typeof e.message], '', 0);
                setIsPasswordIsVerify(true);
                // setIsPasswordIsVerify(e.data)

            } else {
                setIsPasswordIsVerify(false);
                createToast(e.message[lang as keyof typeof e.message], '', 2);
            }
        }).catch((e) => {
            setLoadingVerifyPwd(false);
            setIsPasswordIsVerify(false);
            createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
        })
    }



    return (
        <div className="col-span-5 xl:col-span-3 mt-4">

            <div className="max-h-[525px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        {t('label.changer_pass')}
                    </h3>
                </div>
                <div className="p-7">


                    {/* ------ input et bouton pour verifier le mot de passe  */}
                    {
                        !passwordIsVerify &&
                        <>
                            <div className="mb-5.5 w-full ">
                                <LabelInput title={t('label.actuel_pass')} required={true} />
                                <Input
                                    type="password"
                                    placeholder="********"
                                    value={currentPassword}
                                    setValue={(value: string) => { setCurrentPassord(value); setErrorCurrentPassword(""); }}
                                />
                                {errorCurrentPassword && <ErrorInput title={errorCurrentPassword} />}
                            </div>


                            {/* verifier le mot de passe */}
                            <div className="flex justify-end gap-4.5 pt-5 ">
                                <ButtonOutline
                                    title={t('boutton.annuler')}
                                    handle={() => { setLoadingVerifyPwd(false); setCurrentPassord('') }} />

                                <ButtonLoading
                                    title={t('message.verifier')}
                                    loading={loadingVerifyPwd}
                                    handle={handleVerifierPassword} />
                            </div></>
                    }


                    {/* ------ input et bouton pour mettre a jour le mot de passe */}

                    {
                        passwordIsVerify &&
                        <>
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




                            {/* verifier le mot de passe */}
                            <div className="flex justify-end gap-4.5 pt-5 ">
                                <ButtonOutline
                                    title={t('boutton.annuler')}
                                    handle={() => { setLoadingVerifyPwd(false); handleClean(); }} />

                                <ButtonLoading
                                    title={t('boutton.modifier_mot_de_passe')}
                                    loading={loadingUpdatePwd}
                                    handle={handleUpdate} />
                            </div>
                        </>
                    }



                </div>
            </div>
        </div>
    )
}

