import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/auto-evaluations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createAutoEvaluation({
  utilisateur,
  besoin,
  niveau,
  insuffisancesFr,
  insuffisancesEn,
  formulationBesoinsFr,
  formulationBesoinsEn
}: {
  utilisateur: string;
  besoin: string;
  niveau: number;
  insuffisancesFr?: string;
  insuffisancesEn?: string;
  formulationBesoinsFr?: string;
  formulationBesoinsEn?: string;
}, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${api}/`,
      {
        utilisateur,
        besoin,
        niveau,
        insuffisancesFr,
        insuffisancesEn,
        formulationBesoinsFr,
        formulationBesoinsEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating auto evaluation:', error);
    throw error;
  }
}

export async function updateAutoEvaluation({
  _id,
  niveau,
  insuffisancesFr,
  insuffisancesEn,
  formulationBesoinsFr,
  formulationBesoinsEn
}: {
  _id: string;
  niveau?: number;
  insuffisancesFr?: string;
  insuffisancesEn?: string;
  formulationBesoinsFr?: string;
  formulationBesoinsEn?: string;
}, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.put(
      `${api}/${_id}`,
      {
        niveau,
        insuffisancesFr,
        insuffisancesEn,
        formulationBesoinsFr,
        formulationBesoinsEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating auto evaluation:', error);
    throw error;
  }
}

export async function deleteAutoEvaluation(id: string, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${api}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting auto evaluation:', error);
    throw error;
  }
}

export async function getEvaluationsByUser(utilisateurId: string, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/user/${utilisateurId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting evaluations by user:', error);
    throw error;
  }
}

export async function getAllEvaluations(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all evaluations:', error);
    throw error;
  }
}

export async function getBesoinsPredefinisAvecAutoEvaluation({lang, page, search, userId}:{lang: string, page:number, search?:string, userId?:string }): Promise<AutoEvaluationBesoinReturnGetType> {
  const pageSize = 10;
  
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/besoin-evaluation`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
        params:{
          limit:pageSize,
          userId,
          search,
          page
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error getting all evaluations:', error);
    throw error;
  }
}

export async function validateEvaluation(
  id: string,
  statut: 'VALIDE' | 'REJETE',
  commentaireAdminFr?: string,
  commentaireAdminEn?: string,
  lang?: string
): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.put(
      `${api}/validate/${id}`,
      {
        statut,
        commentaireAdminFr,
        commentaireAdminEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang || 'fr',
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error validating evaluation:', error);
    throw error;
  }
}

// Rapports / analyses

export async function getTauxValidationEvaluations(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/taux-validation`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting taux validation:', error);
    throw error;
  }
}

export async function getMoyenneNiveauParBesoin(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/moyenne-niveau-par-besoin`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error getting moyenne niveau par besoin:', error);
    throw error;
  }
}

export async function getEvaluationsParMois(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/evaluations-par-mois`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting evaluations par mois:', error);
    throw error;
  }
}

export async function getTopBesoinsAjoutes(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/top-besoins-ajoutes`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting top besoins ajoutes:', error);
    throw error;
  }
}

export async function getStatsParUtilisateur(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/par-utilisateur`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting stats par utilisateur:', error);
    throw error;
  }
}

export async function getBesoinsFaiblesPrioritaires(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/faibles-prioritaires`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting besoins faibles prioritaires:', error);
    throw error;
  }
}

export async function getMotsClesInsuffisances(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/mots-cles-insuffisances`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting mots cles insuffisances:', error);
    throw error;
  }
}

export async function getEvolutionNiveauBesoin(besoinId: string, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/evolution-niveau/${besoinId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting evolution niveau besoin:', error);
    throw error;
  }
}

export async function getRepartitionNiveauxParBesoin(besoinId: string, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/repartition-niveaux/${besoinId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting repartition niveaux par besoin:', error);
    throw error;
  }
}


export async function repartitionBesoinsParPoste(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/repartition-poste`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data.data;
    
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}

export async function repartitionBesoinsNiveauParPoste({lang, posteId}:{lang: string, posteId:string|undefined}): Promise<any> {
  if(!posteId)return []
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/repartition-poste/${posteId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data.data.repartitionBesoinNiveauPoste;
    
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}


export async function getGroupedAutoEvaluations({page = 1, lang = "fr", search}: {page?: number, lang?: string, search?:string}): Promise<GroupedBesoinReturnGetType> {
  const pageSize = 10;
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/auto-evaluation-grouped`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
        params:{
          page,
          limit:pageSize,
          search
        }
      }
    );
    return response.data.data;
    
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}
