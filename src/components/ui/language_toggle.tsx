import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import i18next from 'i18next';
import { setShowLanguage } from '../../_redux/features/setting';

function LanguageToogle() {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('lang')?.toString() || 'fr');
    const dispatch = useDispatch();
    const language = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        i18next.changeLanguage(language);
    }, [language]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        localStorage.setItem('lang', newLanguage);
        dispatch(setShowLanguage(newLanguage));
    };

    return (
        <div className='flex items-center justify-center dark:bg-boxdark'>
            <div className="flex items-center justify-center dark:bg-boxdark">
                <img src={language === 'fr' ? '/france.png' : '/united-kingdom.png'} alt='drapeau' className='h-[18px] w-[18px] mr-.5' />
                {/* <label htmlFor="lang">{t('header.langue')}</label> */}
                <select id="lang" value={selectedLanguage} onChange={handleLanguageChange} className="px-2 py-2 bg-[#1e40af] text-white dark:bg-boxdark">  
                    <option value="fr">{t('header.francais')}</option>
                    <option value="en">{t('header.anglais')}</option>
                </select>
            </div>
        </div>

    )
}

export default LanguageToogle