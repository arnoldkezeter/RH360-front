import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/notes-service`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createNoteService(
  { titreFr, titreEn, theme, stage, mandat, designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG }: CreateNoteInput,
  lang: string
): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/`, 
      { titreFr, titreEn, theme, stage, mandat,designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
        responseType: 'blob', // 👈 important pour recevoir un fichier
      }
    );

    // ✅ Créer une URL temporaire pour télécharger le fichier
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // Nom de fichier depuis le header backend si dispo
    const disposition = response.headers['content-disposition'];
    let fileName = 'note-service.pdf';
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) fileName = match[1];
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Nettoyer après téléchargement
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la note de service:', error);
    throw error;
  }
}


export async function createNoteServiceStage(
  { titreFr, titreEn, stage, designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG }: CreateNoteInput,
  lang: string
): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/note-service/stage`, 
      { titreFr, titreEn, stage,designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
        responseType: 'blob', // 👈 important pour recevoir un fichier
      }
    );

    // ✅ Créer une URL temporaire pour télécharger le fichier
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // Nom de fichier depuis le header backend si dispo
    const disposition = response.headers['content-disposition'];
    let fileName = 'note-service.pdf';
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) fileName = match[1];
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Nettoyer après téléchargement
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la note de service:', error);
    throw error;
  }
}

export async function updateNoteService({ _id, titreFr, titreEn, theme, stage, mandat,designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG }: UpdateNoteInput, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {titreFr, titreEn, theme, stage, mandat,designationTuteur, miseEnOeuvre, typeNote, copieA, creePar, valideParDG},
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
        console.error('Error updating noteservice:', error);
        throw error;
    }
}

export async function deleteNoteService(noteserviceId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${noteserviceId}`,
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
        console.error('Error deleting noteservice:', error);
        throw error;
    }
}

export async function getFilteredNoteServices({page, lang, search }: {page?: number, lang:string, search?:string }): Promise<NoteServiceReturnGetType> {
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
                    titre:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const noteServices: NoteServiceReturnGetType = response.data.data;
        
        return noteServices;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






