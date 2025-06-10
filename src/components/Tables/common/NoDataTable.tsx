import { useTranslation } from "react-i18next"

function NoDataTable({title}:{title?:string}) {
    const {t}=useTranslation();
    return (
        <thead className='mb-45 mt-35 flex justify-center items-center'>
            <tr>
                <th className="text-sm font-medium">{title?title:t('label.tableau_vide')}</th>
            </tr>
        </thead>
    )
}

export default NoDataTable