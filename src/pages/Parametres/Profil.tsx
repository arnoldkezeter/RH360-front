import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import { ChangePassword } from "../../components/ComponentProfil/ChangePassword";
import { PickPhoto } from "../../components/ComponentProfil/PickPhoto";
import ProfileInformation from "../../components/ComponentProfil/ProfileInformation";
import { useEffect, useState } from "react";
import { RootState } from "../../_redux/store";
import { useSelector } from "react-redux";
import { getCurrentUserData, getUtilisateur } from "../../services/utilisateurs/utilisateurAPI";
import { useFetchData } from "../../hooks/fechDataOptions";

const MonProfil = () => {
    const fetchData = useFetchData();
    const { t } = useTranslation();
    const lang:string = useSelector((state: RootState) => state.setting.language); // fr ou en
    const userState: Utilisateur = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const [currentUser, setCurrentUser]=useState<Utilisateur>(userState);
    useEffect(()=>{
        if(userState && userState._id){
            fetchData({
                apiFunction: getCurrentUserData,
                params: {userId:userState._id },
                onSuccess: (data) => {
                    setCurrentUser(data)
                }
            });
        }
    },[fetchData, userState, lang])
    return (
        <>
            <Breadcrumb pageName={t("sub_menu.profil")} />



            <div className="grid grid-cols-5 gap-8">
                {/* info de profil */}
                <ProfileInformation currentUser={currentUser}/>
                {/* ajouter une photo de profile  */}
                <div className="col-span-5 xl:col-span-2">
                    <PickPhoto currentUser={currentUser}/>
                    {/* <ChangePassword currentUser={currentUser}/> */}

                </div>
            </div>




        </>
    );
};

export default MonProfil;
