import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabDynamic';
import { IndividualStageTab } from '../../components/Tables/Stagiaire/BodyStage/TabStageIndividuel';
import GroupStageInterface from '../../components/Tables/Stagiaire/BodyStage/TabStageGroupe';
import HistoriqueStages from '../../components/Tables/Stagiaire/BodyStage/TabHistorique';
import { getStageByIdAndType } from '../../services/stagiaires/stageAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';

const StageManagement = () => {
  const [activeTab, setActiveTab] = useState("individuel");
  const [stageToEdit, setStageToEdit] = useState<Stage | null>(null);
  const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const {t}=useTranslation();
  const handleEditStage = async (stage: Stage) => {
    setPageIsLoading(true)
    if (stage.type === 'INDIVIDUEL') {
      setActiveTab('individuel');
    } else {
      setActiveTab('groupe');
    }
    await getStageByIdAndType({id:stage._id, type:stage.type,lang:lang }).then((result)=>{
      try{
        setStageToEdit(result);
      }catch(e){

      }finally{
        setPageIsLoading(false)
      }
    })
    
    // Basculer vers l'onglet approprié selon le type de stage
    
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser le stage à éditer si on change d'onglet manuellement
    if (value !== activeTab) {
      setStageToEdit(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="individuel">{t('label.stage_individuel')}</TabsTrigger>
          <TabsTrigger value="groupe">{t('label.stage_groupe')}</TabsTrigger>
          <TabsTrigger value="historique">{t('label.historique')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individuel">
          <IndividualStageTab 
            stageToEdit={stageToEdit}
            onEditComplete={() => setStageToEdit(null)}
            pageIsLoading={pageIsLoading}
          />
        </TabsContent>
        
        <TabsContent value="groupe">
          <GroupStageInterface 
            stageToEdit={stageToEdit}
            onEditComplete={() => setStageToEdit(null)}
            pageIsLoading={pageIsLoading}
          />
        </TabsContent>
        
        <TabsContent value="historique">
          <HistoriqueStages 
            onEditStage={handleEditStage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StageManagement;