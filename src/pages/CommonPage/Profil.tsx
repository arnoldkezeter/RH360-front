import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import { ChangePassword } from "../../components/ComponentProfil/ChangePassword";
import { PickPhoto } from "../../components/ComponentProfil/PickPhoto";
import ProfileInformation from "../../components/ComponentProfil/ProfileInformation";

const MonProfil = () => {
    const { t } = useTranslation();
    return (
        <>
            <Breadcrumb pageName={t("sub_menu.profil")} />



            <div className="grid grid-cols-5 gap-8">
                {/* info de profil */}
                <ProfileInformation />
                {/* ajouter une photo de profile  */}
                <div className="col-span-5 xl:col-span-2">
                    <PickPhoto />
                    <ChangePassword />

                </div>
            </div>




        </>
    );
};

export default MonProfil;
