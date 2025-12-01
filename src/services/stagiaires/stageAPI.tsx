import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/stages`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;



export async function createStage({ nomFr,nomEn,type,stagiaire, groupes, rotations, affectationsFinales, dateDebut, dateFin, anneeStage, statut}:CreateStageInput, lang:string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr,nomEn,type,stagiaire,groupes, rotations, affectationsFinales, dateDebut, dateFin, anneeStage, statut},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );
    return response.data; // { success: true, data: {...} }
  } catch (error: any) {
    // Gestion d'erreur simple
    if (error.response) {
      console.log(error)
      throw new Error(error.response.data.message || 'Erreur API lors de la création du stage');
    } else {
      throw new Error(error.message || 'Erreur réseau');
    }
  }
}

export async function updateStage({ nomFr,nomEn,type,stagiaire,groupes, rotations, affectationsFinales, dateDebut, dateFin, anneeStage, statut}:CreateStageInput,id:string, lang:string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.put(
            `${api}/${id}`,
            {nomFr,nomEn,type,stagiaire,groupes, rotations, affectationsFinales, dateDebut, dateFin, anneeStage, statut},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );
    return response.data; // { success: true, data: {...} }
  } catch (error: any) {
    // Gestion d'erreur simple
    if (error.response) {
      console.log(error)
      throw new Error(error.response.data.message || 'Erreur API lors de la création du stage');
    } else {
      throw new Error(error.message || 'Erreur réseau');
    }
  }
}

export async function  changerStatutStageService({stageId, statut, noteServiceFile, lang}:{stageId:string, statut:string, lang:string, noteServiceFile:File|null}): Promise<ReponseApiPros> {
  try {
    let formData = new FormData();
    formData.append("statut", statut);

    // si accepté, on ajoute le fichier
    if (statut === "ACCEPTE" && noteServiceFile) {
      formData.append("noteServiceFile", noteServiceFile);
    }
    console.log(formData)
    const response = await axios.put(
      `${api}/${stageId}/changer-statut`,
      formData,
      {
        headers: {
          // 'Content-Type': 'application/json',
          'accept-language':lang,
          'authorization': token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur changerStatutStageService:", error);
    throw error;
  }
};

export async function deleteStage(stageId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${stageId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting stage:', error);
        throw error;
    }
}

export async function getStageByIdAndType({id, type, lang }: {id:string, type:string, lang:string }): Promise<Stage> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}/${type}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stages: Stage = response.data.data;
        
        return stages;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
export async function getFilteredStages({page, search, type, statut, lang }: {search?:string, type?:string, statut?:string, page: number, lang:string }): Promise<StageReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    search,
                    type,
                    statut
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stages: StageReturnGetType = response.data.data;
        return stages;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTotalStagiaires(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/total-stagiaires`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    return response.data.totalStagiaires;
  } catch (error) {
    console.error("Erreur getTotalStagiaires:", error);
    throw error;
  }
}

export async function getTotalStagesTermines(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/total-stagiaires-termines`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    
    return response.data.totalStagiairesTermines;
  } catch (error) {
    console.error("Erreur getTotalStagesTermines:", error);
    throw error;
  }
}

export async function getMoyenneStagiairesParSuperviseur(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/moyenne-stagiaires-par-superviseur`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
     
    
    return response.data.data.moyenneStagiairesParSuperviseur;
  } catch (error) {
    console.error("Erreur getMoyenneStagiairesParSuperviseur:", error);
    throw error;
  }
}

export async function getDureeMoyenneStages(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/duree-moyenne-stages`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    return response.data.dureeMoyenneMois;
  } catch (error) {
    console.error("Erreur getDureeMoyenneStages:", error);
    throw error;
  }
}

export async function getTauxStatutStages(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/taux-statut-stages`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.tauxStatutStages;
  } catch (error) {
    console.error("Erreur getTauxStatutStages:", error);
    throw error;
  }
}

export async function getRepartitionStagiairesParService(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-stagiaires-par-service`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.data
;
  } catch (error) {
    console.error("Erreur getRepartitionStagiairesParService:", error);
    throw error;
  }
}

export async function getRepartitionStagiairesParSuperviseur(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-stagiaires-par-superviseur`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur getRepartitionStagiairesParSuperviseur:", error);
    throw error;
  }
}

export async function getNombreStagiairesParEtablissement(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-stagiaires-par-etablissement`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    console.log(response.data)
    return response.data.data;
  } catch (error) {
    console.error("Erreur getNombreStagiairesParEtablissement:", error);
    throw error;
  }
}

export async function getNombreStagiairesParStatutEtEtablissement(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/stages-par-statut-et-etablissement`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
     
    return response.data.data;
  } catch (error) {
    console.error("Erreur getNombreStagiairesParStatutEtEtablissement:", error);
    throw error;
  }
}

export async function getNombreStagesEnCours(dateDebut?:string, dateFin?:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/stages-en-cours`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
     
    return response.data.data;
  } catch (error) {
    console.error("Erreur getNombreStagesEnCours:", error);
    throw error;
  }
}

