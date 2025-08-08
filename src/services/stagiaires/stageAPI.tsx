import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/stages`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;



export async function createStage(data: CreateStageInput): Promise<any> {
  try {
    const response = await axios.post(`${api}`, data);
    console.log(response.data)
    return response.data; // { success: true, data: {...} }
  } catch (error: any) {
    // Gestion d'erreur simple
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur API lors de la création du stage');
    } else {
      throw new Error(error.message || 'Erreur réseau');
    }
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
    
    return response.data.totalStagesTermines;
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
     
    return response.data.moyenneStagiairesParSuperviseur;
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
    
    return response.data.repartitionParService
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
    
    return response.data.repartitionParSuperviseur;
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

export async function getNombreStagesEnCours(): Promise<number> {
  try {
    const response = await axios.get(`${api}/stages-en-cours`, {
      
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
     
    return response.data.data;
  } catch (error) {
    console.error("Erreur getNombreStagiairesParStatutEtEtablissement:", error);
    throw error;
  }
}

