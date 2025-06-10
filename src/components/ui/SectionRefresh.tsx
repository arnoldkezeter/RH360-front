import { useTranslation } from "react-i18next"
import Bouton from "./Bouton";




interface SectionRefreshProps {
    refreshFunction?: () => void

}
function SectionRefresh({ refreshFunction }: SectionRefreshProps) {
    const { t } = useTranslation();

    return (
        <div className="flex w-full justify-end items-center gap-x-2">
            <p className="text-[13px] -mt-2 text-primary ">{t('boutton.rafraichir_la_page')}</p>

            <Bouton
                iconeSmall={true}
                circle={true}
                typeRefresh={true}
                titreBouton={t('boutton.actualiser')}
                onClick={refreshFunction ? refreshFunction : () => { }}
            />

            {/* bouton refresh */}
            {/* <div className="w-full mt-16">
               
            </div> */}
        </div>
    )
}

export { SectionRefresh }