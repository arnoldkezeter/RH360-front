interface Participant {
  userId: string;
  nom: string;
  prenom?:string;
  email: string;
  role: string;
  permissions: {
    canAddParticipants: boolean;
    canRemoveParticipants: boolean;
    canSendMessages: boolean;
  };
}

interface ExistingParticipant {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  role: string;
}
interface MessageSender {
  _id: string;
  nom: string;
  prenom?:string;
  email: string;
}
interface Message {
  _id?: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  messageType: 'text' | 'file' | 'system';
  isRead: Array<{
    user: string;
    readAt: string;
  }>;
}

interface Chat {
     _id?: string;
    entityType: string;
    entityId: string;
    createdBy: string;
    title?: string;
    chatType: string;
    participants: Participant[];
    messages: Message[];
    isActive: boolean;
    lastActivity: string;
}

interface ChatInitialData {
    data: {
        chats: Chat[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateChatPayload {
    chat: Chat; // Données de l'événement à créer
}

interface UpdateChatPayload {
    id: string; // ID de l'événement à mettre à jour
    chatData: Partial<Chat>; // Données mises à jour de l'événement
}
interface DeleteChatPayload {
    id: string; // ID de l'événement à supprimer
}
interface UpdateRolePayload {
    id: string; // ID de l'événement à mettre à jour
    chatData: Partial<Chat>; // Données mises à jour de l'événement
}
interface ChatReturnGetType {
    chats: Chat[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Interface pour les propriétés minimales de l'chat
interface PropsChatsMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}