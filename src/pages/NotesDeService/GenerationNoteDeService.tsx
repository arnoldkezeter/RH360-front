import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabDynamic';

import StageTab from '../../components/Tables/NoteService/Generation/TabStage';
import MandatTab from '../../components/Tables/NoteService/Generation/TabMandat';
import { useTranslation } from 'react-i18next';

const GenerationNoteDeServiceManager = () => {
  const [activeTab, setActiveTab] = useState("stage");
  const {t}=useTranslation()
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
  };
  return (
    
    <div className="p-6 space-y-6 bg-white">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="stage">{t('label.stage')} </TabsTrigger>
          <TabsTrigger value="stage_recherche">{t('label.mandat_recherche')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stage">
          <StageTab
            
          />
        </TabsContent>
        
        <TabsContent value="stage_recherche">
          <MandatTab 
           
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerationNoteDeServiceManager;