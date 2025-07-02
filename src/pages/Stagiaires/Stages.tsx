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

    
  
    const handleSubmit = () => {
      console.log("Données soumises:", {
        stagiaire,
        services
      });
    };

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
                onSubmit={handleSubmit}
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
