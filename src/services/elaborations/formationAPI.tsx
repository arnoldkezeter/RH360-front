import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/formations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createFormation({titreFr, titreEn, descriptionFr, descriptionEn, axeStrategique, programmeFormation }: Formation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {titreFr, titreEn, descriptionFr, descriptionEn, axeStrategique, programmeFormation },
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
        console.error('Error creating Formation:', error);
        throw error;
    }
}

export async function updateFormation({ _id, titreFr, titreEn, descriptionFr, descriptionEn, familleMetier, axeStrategique, programmeFormation }: Formation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {titreFr, titreEn, descriptionFr, descriptionEn, familleMetier, axeStrategique, programmeFormation },
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
        console.error('Error updating Formation:', error);
        throw error;
    }
}

export async function deleteFormation(formationId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${formationId}`,
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
        console.error('Error deleting Formation:', error);
        throw error;
    }
}

export async function getFilteredFormations({page, lang, programme, familleMetier, axeStrategique, dateDebut, dateFin, search }: {page: number, lang:string, programme:string, familleMetier?:string, axeStrategique?:string, dateDebut?:string, dateFin?:string, search?:string }): Promise<FormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    programme,
                    familleMetier, 
                    axeStrategique,
                    debut:dateDebut, 
                    fin:dateFin, 
                    titre:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Formations: FormationReturnGetType = response.data.data;
        
        return Formations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getFormationsForGantt({page, lang, programmeFormation, familleMetier, axeStrategique, dateDebut, dateFin, search }: {page: number, lang:string, programmeFormation:number, familleMetier?:string, axeStrategique?:string, dateDebut?:string, dateFin?:string, search?:string }): Promise<FormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/calendrier`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    familleMetier, 
                    axeStrategique,
                    debut:dateDebut, 
                    fin:dateFin, 
                    titre:search,
                    programmeAnnee:programmeFormation
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const formations: FormationReturnGetType = response.data.data;
        return formations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getFormationForDropDown({lang, programmeId }: {lang:string, programmeId:string }): Promise<FormationReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/programme/${programmeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const formation: FormationReturnGetType = response.data.data;
        
        return formation;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

//statistiques
export async function getStatsParticipants({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/participants`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getStatsParticipants:', error);
    throw error;
  }
}


export async function getNbFormateursParType({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/formateurs`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getNbFormateursParType:', error);
    throw error;
  }
}


export async function getTauxExecutionParTheme({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/taux-execution/themes`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getTauxExecutionParTheme:', error);
    throw error;
  }
}


export async function getTauxExecutionParAxe({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/taux-execution/axes`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getTauxExecutionParAxe:', error);
    throw error;
  }
}


export async function getCoutReelTTCParTheme({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/cout-reel-ttc/themes`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getCoutReelTTCParTheme:', error);
    throw error;
  }
}


export async function getCoutReelEtPrevuTTCParTheme({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any> {
  try {
    const response = await axios.get(`${api}/stats/cout-reel-prevu-ttc/themes`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getCoutReelEtPrevuTTCParTheme:', error);
    throw error;
  }
}

export async function getCoutsReelEtPrevu({ programmeId, formationId }: { programmeId?: string, formationId?: string }): Promise<any[]> {
  try {
    const response = await axios.get(`${api}/stats/couts-reel-prevu`, {
      params: { programmeId, formationId },
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur getCoutsReelEtPrevu:', error);
    throw error;
  }
}


