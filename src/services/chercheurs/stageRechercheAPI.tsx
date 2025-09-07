import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/stages-recherche`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;



export async function createStageRecherche({ nomFr,nomEn, chercheur, superviseur, structure,  dateDebut, dateFin, anneeStage, statut}:CreateStageRechercheInput, lang:string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr,nomEn, chercheur, superviseur, structure,  dateDebut, dateFin, anneeStage, statut},
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
      throw new Error(error.response.data.message || 'Erreur API lors de la création du stagerecherche');
    } else {
      throw new Error(error.message || 'Erreur réseau');
    }
  }
}

export async function updateStageRecherche({ nomFr,nomEn, chercheur, superviseur, structure,  dateDebut, dateFin, anneeStage, statut}:CreateStageRechercheInput,id:string, lang:string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.put(
            `${api}/${id}`,
            {nomFr,nomEn, chercheur, superviseur, structure,  dateDebut, dateFin, anneeStage, statut},
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
      throw new Error(error.response.data.message || 'Erreur API lors de la création du stagerecherche');
    } else {
      throw new Error(error.message || 'Erreur réseau');
    }
  }
}

export async function deleteStageRecherche(stagerechercheId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${stagerechercheId}`,
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
        console.error('Error deleting stagerecherche:', error);
        throw error;
    }
}

export async function getStageRechercheById({id, lang }: {id:string, lang:string }): Promise<StageRecherche> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stagerecherches: StageRecherche = response.data.data;
        
        return stagerecherches;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
export async function getFilteredStageRecherches({page, search,statut, lang }: {search?:string, type?:string, statut?:string, page: number, lang:string }): Promise<StageRechercheReturnGetType> {
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
                    statut
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stagerecherches: StageRechercheReturnGetType = response.data.data;
        
        return stagerecherches;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTotalChercheurs(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/total-chercheurs`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    return response.data.totalChercheurs;
  } catch (error) {
    console.error("Erreur getTotalChercheurs:", error);
    throw error;
  }
}

export async function getTotalStageRecherchesTermines(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/total-chercheurs-termines`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.totalStageRecherchesTermines;
  } catch (error) {
    console.error("Erreur getTotalStageRecherchesTermines:", error);
    throw error;
  }
}

export async function getMoyenneChercheursParSuperviseur(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/moyenne-chercheurs-par-superviseur`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
     
    return response.data.moyenneChercheursParSuperviseur;
  } catch (error) {
    console.error("Erreur getMoyenneChercheursParSuperviseur:", error);
    throw error;
  }
}

export async function getDureeMoyenneStageRecherches(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/duree-moyenne-stagerecherches`, {
      
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
    console.error("Erreur getDureeMoyenneStageRecherches:", error);
    throw error;
  }
}

export async function getTauxStatutStageRecherches(dateDebut:string, dateFin:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/taux-statut-stage-recherches`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.tauxStatutStageRecherches;
  } catch (error) {
    console.error("Erreur getTauxStatutStageRecherches:", error);
    throw error;
  }
}

export async function getRepartitionChercheursParStructure(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-chercheurs-par-structure`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.repartitionParStructure
;
  } catch (error) {
    console.error("Erreur getRepartitionChercheursParStructure:", error);
    throw error;
  }
}

export async function getRepartitionChercheursParSuperviseur(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-chercheurs-par-superviseur`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      params:{
        dateDebut,
        dateFin
      }
    });
    
    return response.data.repartitionParSuperviseur;
  } catch (error) {
    console.error("Erreur getRepartitionChercheursParSuperviseur:", error);
    throw error;
  }
}

export async function getNombreChercheursParEtablissement(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/repartition-chercheurs-par-etablissement`, {
      
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
    console.error("Erreur getNombreChercheursParEtablissement:", error);
    throw error;
  }
}

export async function getNombreChercheursParStatutEtEtablissement(dateDebut:string, dateFin:string): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/stage-recherches-par-statut-et-etablissement`, {
      
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
    console.error("Erreur getNombreChercheursParStatutEtEtablissement:", error);
    throw error;
  }
}

export async function getNombreStageRecherchesEnCours(dateDebut?:string, dateFin?:string): Promise<number> {
  try {
    const response = await axios.get(`${api}/stage-recherches-en-cours`, {
      
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
    console.error("Erreur getNombreStageRecherchesEnCours:", error);
    throw error;
  }
}

