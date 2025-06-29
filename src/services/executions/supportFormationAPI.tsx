import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/theme-formation/supports-formation`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createSupportFormation(support: SupportFormation,fichier: File|null,lang: string): Promise<ReponseApiPros> {
    try {
        const formData = new FormData();
        formData.append('nomFr', support.nomFr);
        formData.append('nomEn', support.nomEn);
        if (support.descriptionFr) formData.append('descriptionFr', support.descriptionFr);
        if (support.descriptionEn) formData.append('descriptionEn', support.descriptionEn);
        if (support.theme?._id) formData.append('theme', support.theme._id);
        if(fichier) formData.append('fichier', fichier);

        const response = await axios.post(`${api}/`, formData, {
            headers: {
                'accept-language': lang,
                'authorization': token,
            },
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur création support formation :', error);
        throw error;
    }
}

export async function updateSupportFormation(support:SupportFormation,fichier: File|null,  lang: string, ): Promise<ReponseApiPros> {
  try {
        const formData = new FormData();
        if (support.nomFr) formData.append('nomFr', support.nomFr);
        if (support.nomEn) formData.append('nomEn', support.nomEn);
        if (support.descriptionFr) formData.append('descriptionFr', support.descriptionFr);
        if (support.descriptionEn) formData.append('descriptionEn', support.descriptionEn);
        if (support.theme?._id) formData.append('theme', support.theme._id);
        if (fichier) formData.append('fichier', fichier);

        const response = await axios.put(`${api}/${support._id}`, formData, {
            headers: {
                'accept-language': lang,
                'authorization': token,
            },
        });

        return response.data;
  } catch (error) {
    console.error('Erreur mise à jour support formation :', error);
    throw error;
  }
}

export async function deleteSupportFormation(id: string, lang: string): Promise<any> {
  try {
        const response = await axios.delete(`${api}/${id}`, {
            headers: {
                'accept-language': lang,
                'authorization': token,
            },
        });

        return response.data;
  } catch (error) {
    console.error('Erreur suppression support formation :', error);
    throw error;
  }
}

export async function getFilteredSupportsFormation({page = 1,limit = 10, lang, titre, themeId,}: {
  page?: number; limit?: number; lang: string; titre?: string; themeId?: string;}): Promise<SupportFormationReturnGetType> {
  try {
        const response: AxiosResponse<any> = await axios.get(`${api}/`, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang,
                'authorization': token,
            },
            params: {
                page,
                limit,
                titre,
                themeId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Erreur récupération supports de formation :', error);
        throw error;
    }
}

export async function getSupportFormationById(id: string, lang: string): Promise<SupportFormation> {
  try {
    const response = await axios.get(`${api}/${id}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Erreur récupération support par ID :', error);
    throw error;
  }
}

export async function telechargerSupportFormation(id: string, lang: string): Promise<Blob> {
  try {
    const response = await axios.get(`${api}/telecharger/${id}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
      responseType: 'blob',
    });
    console.log(response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
    const blob = error.response.data as Blob;
    if (blob.type === 'application/json') {
      // Lire le blob JSON
      const text = await blob.text(); // lire le blob en texte
      const json = JSON.parse(text);  // parser en JSON
      console.error('Erreur backend:', json.message || json);
    } else {
      console.error('Erreur backend non JSON:', error.message);
    }
  } else {
    console.error('Erreur inconnue:', error);
  }
    throw error;
  }
}
