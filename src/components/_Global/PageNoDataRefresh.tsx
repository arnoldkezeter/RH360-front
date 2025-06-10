import { useTranslation } from "react-i18next"
import Bouton from "../ui/Bouton";
import EmptyImage from "../ui/EmptyImage";


interface PageNoDataProps {
    titrePage: string,
    refreshFunction?: () => void

}
export function PageNoDataRefresh({ titrePage, refreshFunction }: PageNoDataProps) {
    const { t } = useTranslation();

    return (
        <div className="my-20">
            <div className='flex flex-col justify-center items-center text-center gap-y-5'>
                <EmptyImage />

                <h1 className="text-sm font-medium">
                    {titrePage}
                </h1>

                <div className="w-full mt-6">
                    <Bouton
                        circle={true}
                        typeRefresh={true}
                        titreBouton={t('bouton.actualiser')}
                        onClick={refreshFunction ? refreshFunction : () => { }}
                    />
                    <p className="text-[13px] -mt-2 lowercase">{t('bouton.actualiser')}</p>
                </div>

            </div>

        </div>
    )
}

