import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import RapportStageBody from '../../components/Tables/Stagiaire/BodyRapport/BodyRapport';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import { useStatsStageRecherches } from '../../hooks/useFetchStatStageRechercheData';


const RapportStage=()=> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<Date | null>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | null>(lastDayOfMonth);

  const {t}=useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
 

 

  const { loading, error, data } = useStatsStageRecherches({ dateDebut:startDate?.toString()||"", dateFin:endDate?.toString()||"" });

  
  if (error) return <div className="p-4 text-red-500">Erreur de chargement des statistiques</div>;
  const handleDateChange = (startDate: Date | null, endDate:Date | null) => {
      setStartDate(startDate);
      setEndDate(endDate)
  };

  
  return (
    <>
      <BreadcrumbPageDescription 
          pageDescription={t('page_description.rapport_stage_recherche')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.rapports_stages')} 
      />
      <RapportStageBody data={data} onDateChange={handleDateChange} isLoading={loading} startDate={startDate} endDate={endDate}/>
    </>
  );
}
export default RapportStage
