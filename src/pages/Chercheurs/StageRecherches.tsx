import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabDynamic';

import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { StageRechercheTab } from '../../components/Tables/Chercheur/BodyStage/TabStageRecherche';
import { getStageRechercheById } from '../../services/chercheurs/stageRechercheAPI';
import HistoriqueStageRecherches from '../../components/Tables/Chercheur/BodyStage/TabHistorique';

const StageRechercheManagement = () => {
  const [activeTab, setActiveTab] = useState("recherche");
  const [stageToEdit, setStageToEdit] = useState<StageRecherche | null>(null);
  const lang:string = useSelector((state: RootState) => state.setting.language) || 'fr';
  const [pageIsLoading, setPageIsLoading] = useState(false);

  const handleEditStageRecherche = async (stageRecherche: StageRecherche) => {
    setPageIsLoading(true)
    setActiveTab('recherche');
    
    await getStageRechercheById({id:stageRecherche._id||"", lang:lang }).then((result)=>{
      try{
        setStageToEdit(result);
      }catch(e){

      }finally{
        setPageIsLoading(false)
      }
    })
    
    // Basculer vers l'onglet approprié selon le type de stageRecherche
    
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser le stageRecherche à éditer si on change d'onglet manuellement
    if (value !== activeTab) {
      setStageToEdit(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="recherche">Stage de Recherche</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recherche">
          <StageRechercheTab 
            stageRechercheToEdit={stageToEdit}
            onEditComplete={() => setStageToEdit(null)}
            pageIsLoading={pageIsLoading}
          />
        </TabsContent>
        
        
        
        <TabsContent value="historique">
          <HistoriqueStageRecherches 
            onEditStageRecherche={handleEditStageRecherche}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StageRechercheManagement;