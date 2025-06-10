import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Download() {
    const {t}=useTranslation(); 
    const [currentButton, setCurrentButton] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentButton(prev => (prev + 1) % 3); // Alterner les boutons
        }, 500); // Intervalle de changement de bouton en millisecondes

        return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    }, []);

    return (
        <div className={`flex justify-center items-center`}>
        <p>{t('label.download')}</p>
        <div className="flex ml-2">
            <button className={`h-2 w-2 mr-1 animate-pulse ${currentButton === 0 ? 'bg-primary' : 'bg-transparent border-2 border-solid border-primary rounded-full'}`}></button>
            <button className={`h-2 w-2 mr-1 animate-pulse ${currentButton === 1 ? 'bg-primary' : 'bg-transparent border-2 border-solid border-primary rounded-full'}`}></button>
            <button className={`h-2 w-2 animate-pulse ${currentButton === 2 ? 'bg-primary' : 'bg-transparent border-2 border-solid border-primary rounded-full'}`}></button>
        </div>
        </div>
    );
}

export default Download;
