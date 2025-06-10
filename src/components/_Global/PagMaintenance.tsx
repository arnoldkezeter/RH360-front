import { useTranslation } from "react-i18next"
import MaintenanceImage from "../ui/MaintenanceImage";



export function PageMaintenance() {
    const { t } = useTranslation();

    return (
        <div className="my-15 text-center">
            <div className='flex flex-col justify-center items-center text-center gap-y-5'>
                <h1 className="text-2xl font-semibold  text-black dark:text-white">
                    {t("maintenance")}
                </h1>
                <div className="pt-4 pb-6">
                    <MaintenanceImage />

                </div>

                <h1 className="text-sm font-medium ">
                    {t("message.maintenance")}
                </h1>



            </div>
            <p className="text-sm font-medium py-1">
                {t("message.notification_terminer")}
            </p>

        </div>
    )
}