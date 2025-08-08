import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/selects';
import { IndividualStageTab } from '../../components/Tables/Stagiaire/BodyStage/TabStageIndividuel';
import GroupStageInterface from '../../components/Tables/Stagiaire/BodyStage/TabStageGroupe';
import { createStage } from '../../services/stagiaires/stageAPI';

const StageManagement = () => {
    const [stagiaire, setStagiaire] = useState<Stagiaire>();
    const [services, setServices] = React.useState<ServiceAssignment[]>([
        { serviceId: "", superviseurId: "", dateDebut: "", dateFin: "" } // Au moins un élément par défaut
    ]);
    
    const handleServiceAdd = () => {
    setServices([...services, {
        serviceId: "",
        superviseurId: "",
        dateDebut: "",
        dateFin: ""
    }]);
    };
    
    const handleServiceRemove = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleServiceChange = (index: number, field: keyof ServiceAssignment, value: string) => {
        const updatedServices = services.map((service, i) => 
            i === index ? { ...service, [field]: value } : service
        );
        setServices(updatedServices);
    };

    const handleCreateStage = async () => {
      try {
        // Filtrer services valides
        const validServices = services.filter(s => s.serviceId && s.superviseurId && s.dateDebut && s.dateFin);
        if (validServices.length === 0) throw new Error("Au moins un service complet requis.");

        // Créer les rotations, une par service
        const rotations = validServices.map(s => ({
          stagiaire: stagiaire?._id,
          service: s.serviceId||"",
          superviseur: s.superviseurId||"",
          dateDebut: s.dateDebut||"",
          dateFin: s.dateFin||"",
        }));

        // Créer une affectation finale par service parcouru (correspondant à une rotation)
        const affectationsFinales = validServices.map(s => ({
          stagiaire: stagiaire?._id,
          service: s.serviceId||"",
          superviseur: s.superviseurId||"",
          dateDebut: s.dateDebut||"",
          dateFin: s.dateFin||"",
        }));

        // Déterminer dateDebut globale = plus tôt, dateFin globale = plus tard
        const dateDebutGlobale = new Date(Math.min(...validServices.map(s => new Date(s.dateDebut||"").getTime()))).toISOString();
        const dateFinGlobale = new Date(Math.max(...validServices.map(s => new Date(s.dateFin||"").getTime()))).toISOString();

        const stageData = {
          type: 'INDIVIDUEL',
          stagiaire: stagiaire?._id,
          rotations,
          affectationsFinales,
          dateDebut: dateDebutGlobale||"",
          dateFin: dateFinGlobale||"",
          anneeStage: new Date(dateDebutGlobale).getFullYear(),
          statut: 'EN_ATTENTE',
        };

         await createStage(stageData).then((e: ReponseApiPros) => {
          console.log('Stage individuel créé:',e);
         })
        
      } catch (err: any) {
        console.error('Erreur création stage individuel:', err.message);
      }
    }


  return (
    <div className="p-6 space-y-6 bg-white">
      <Tabs defaultValue="individuel">
        <TabsList>
          <TabsTrigger value="individuel">Stage Individuel</TabsTrigger>
          <TabsTrigger value="groupe">Stage en Groupe</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        
        <TabsContent value="individuel">
            <IndividualStageTab
                stagiaire={stagiaire}
                onStagiaireChange={setStagiaire}
                services={services}
                onServiceAdd={handleServiceAdd}
                onServiceRemove={handleServiceRemove}
                onServicesChange={handleServiceChange}
                onSubmit={handleCreateStage}
            />
        </TabsContent>
        

        <TabsContent value="groupe">
          <GroupStageInterface/>
        </TabsContent>

        <TabsContent value="historique">
          <h3 className="text-lg font-semibold mb-4">Historique des Affectations</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select>
              <SelectTrigger>
                <SelectValue>Filtrer par structure</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Structure A</SelectItem>
                <SelectItem value="2">Structure B</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue>Filtrer par service</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Service A</SelectItem>
                <SelectItem value="2">Service B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <table className="w-full table-auto border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Stagiaire</th>
                <th className="p-2 border">Période</th>
                <th className="p-2 border">Superviseur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Alice Dupont</td>
                <td className="p-2 border">01/05/2025 - 30/05/2025</td>
                <td className="p-2 border">M. Jean Leroy</td>
              </tr>
              <tr>
                <td className="p-2 border">Bob Durand</td>
                <td className="p-2 border">01/06/2025 - 30/06/2025</td>
                <td className="p-2 border">Mme Sophie Blanc</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StageManagement;
