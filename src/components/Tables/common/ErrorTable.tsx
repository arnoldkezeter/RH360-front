import { IoWarning } from "react-icons/io5"
import { useTranslation } from 'react-i18next';


function ErrorTable() {
    const { t } = useTranslation();


    return (

        <thead className={`mb-45 mt-35 flex flex-col justify-center items-center `}>
            <tr className=" text-meta-1 text-3xl pb-2"><IoWarning /></tr>
            <tr className=" text-meta-1 text-sm lg:text-lg">{t('message.erreur')}</tr>
        </thead>
    )
}

export default ErrorTable