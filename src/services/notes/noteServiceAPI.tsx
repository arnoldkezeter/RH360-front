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

export async function createNoteServiceStageGroupe(
  { titreFr, titreEn,descriptionFr, descriptionEn, stage, designationTuteur, miseEnOeuvre, dispositions, personnesResponsables, typeNote, copieA, creePar, valideParDG }: CreateNoteInput,
  lang: string
): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/note-service/stage/groupe`, 
      { titreFr, titreEn,descriptionFr, descriptionEn, stage,designationTuteur, miseEnOeuvre, dispositions, personnesResponsables, typeNote, copieA, creePar, valideParDG },
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

export async function createNoteServiceConvocationFormateur(
  {theme, titreFr, titreEn,descriptionFr, descriptionEn, copieA, creePar, typeNote }: CreateNoteInput,
  tacheFormationId:string,lang: string
): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/convocation/formateurs`, 
      { theme, titreFr, titreEn,descriptionFr, descriptionEn, copieA, creePar, typeNote, tacheFormationId },
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

export async function createNoteServiceConvocationParticipant(
  {theme, titreFr, titreEn, copieA, creePar, typeNote }: CreateNoteInput,
  tacheFormationId:string,lang: string
): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/note-service/convocation/participants`, 
      { theme, titreFr, titreEn, copieA, creePar, typeNote, tacheFormationId },
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

export async function createNoteServiceFichePresence(
  {theme, titreFr, titreEn, copieA, creePar, typeNote, lieuId }: CreateNoteInput,
  tacheFormationId:string,lang: string, isParticipant:boolean
): Promise<boolean> {
  try {
    const ficheType = isParticipant?`participants/${lieuId}`:"formateurs"
    const response: AxiosResponse<Blob> = await axios.post(
      `${api}/formations/fiches-presence/${ficheType}`, 
      { theme, titreFr, titreEn, copieA, creePar, typeNote, tacheFormationId },
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

export async function  validerNoteService({noteId, noteServiceFile, lang}:{noteId:string, lang:string, noteServiceFile:File}): Promise<ReponseApiPros> {
  try {
    let formData = new FormData();

    // si accepté, on ajoute le fichier
    formData.append("noteServiceFile", noteServiceFile);
    
    const response = await axios.put(
      `${api}/${noteId}`,
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
                    search:search
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

export async function telechargerNoteService(id: string, lang: string): Promise<Blob> {
  try {
    const response = await axios.get(`${api}/telecharger/${id}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
      responseType: 'blob',
    });
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






