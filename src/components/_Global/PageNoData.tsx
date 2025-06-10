import { useTranslation } from "react-i18next"
import EmptyImage from "../ui/EmptyImage";
import BoutonTextMobile from "../ui/BoutonTextMobile";


function PageNoDataTable({ title }: { title?: string }) {
    const { t } = useTranslation();
    return (
        <thead className='mb-45 mt-35 flex justify-center items-center'>
            <tr>
                <th className="text-sm font-medium">{title ? title : t('label.tableau_vide')}</th>
            </tr>
        </thead>
    )
}



interface PageNoDataProps {
    titrePage: string,
    titreBouton?: string,
    showModalCreate?: () => void,
    refreshFunction?: () => void,
    afficherBoutonCreer?: boolean,

}
function PageNoData({ titrePage, titreBouton, showModalCreate, refreshFunction, afficherBoutonCreer = true }: PageNoDataProps) {
    const { t } = useTranslation();

    return (
        <div>
            <div className=" text-center flex flex-col items-center justify-center">
                {!afficherBoutonCreer && <div className="mt-20"></div>}
                <div className='flex flex-col justify-center items-center text-center gap-y-5'>
                    <EmptyImage />

                    <h1 className="text-sm font-medium">
                        {titrePage}
                    </h1>
                    <div className="flex flex-col gap-x-3">

                        {afficherBoutonCreer && <BoutonTextMobile
                            titreBouton={titreBouton}
                            onClick={showModalCreate ? showModalCreate : () => { }}
                        />}

                        {!afficherBoutonCreer && <div className="-mt-10"></div>}

                        {/* bouton refresh */}
                        <div className="w-full mt-16">
                            <BoutonTextMobile
                                circle={true}
                                typeRefresh={true}
                                titreBouton={t('boutton.actualiser')}
                                onClick={refreshFunction ? refreshFunction : () => { }}
                            />
                            <p className="text-[13px] -mt-2 lowercase">{t('boutton.actualiser')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ModalCreateUpdateBatiment batiment={null} /> */}

        </div>
    )
}

export { PageNoDataTable, PageNoData }