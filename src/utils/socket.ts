// utils/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
    public socket: Socket | null = null;
    private userId: string | null = null;
    private connected: boolean = false;
    
    /**
     * Initialise la connexion Socket.IO
     */
    connect(apiUrl: string, userId: string, token: string): Socket {
        if (this.socket?.connected) {
            console.log('✅ Socket déjà connecté');
            return this.socket;
        }
        const socketUrl = apiUrl.replace('/api/v1', '');
        this.userId = userId;

        // Nettoyer "Bearer " si déjà présent
        const cleanToken = token.replace('Bearer ', '');

        this.socket = io(socketUrl, {
            auth: {
                token: cleanToken // ✅ Pas de "Bearer" ici
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 10000
        });

        this.setupEventListeners();
        return this.socket;
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ Socket connecté:', this.socket?.id);
            this.connected = true;
        });

        this.socket.on('authenticated', (data: { success: boolean; userId?: string }) => {
            if (data.success) {
                console.log('🔑 Authentifié avec succès!', data.userId);
            } else {
                console.error('❌ Échec authentification');
                this.disconnect();
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket déconnecté:', reason);
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('❗ Erreur connexion:', error.message);
        });
    }

    /**
     * Déconnexion
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.userId = null;
        }
    }

    /**
     * Rejoindre un chat
     */
    joinChat(chatId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('join_chat', chatId);
            console.log(`💬 Demande de rejoindre chat_${chatId}`);
        }
    }

    /**
     * Quitter un chat
     */
    leaveChat(chatId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('leave_chat', chatId);
            console.log(`👋 Quitter chat_${chatId}`);
        }
    }

    /**
     * Écouter les nouveaux messages
     */
    onNewMessage(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('new_message', callback);
        }
    }

    /**
     * Écouter les messages lus
     */
    onMessagesRead(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('messages_read', callback);
        }
    }

    /**
     * Écouter les nouvelles notifications
     */
    onNewNotification(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('nouvelle_notification', callback);
        }
    }

    /**
     * Écouter la création de chat
     */
    onChatCreated(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('chat_created', callback);
        }
    }

    /**
     * Écouter l'ajout de participants
     */
    onParticipantAdded(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('participant_added', callback);
        }
    }

    /**
     * Écouter la désactivation de chat
     */
    onChatDeactivated(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('chat_deactivated', callback);
        }
    }

    /**
     * Écouter les permissions modifiées
     */
    onPermissionsUpdated(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('participant_permissions_updated', callback);
        }
    }

    /**
     * Supprimer un listener
     */
    off(event: string, callback?: (...args: any[]) => void): void {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
        }
    }

    /**
     * Émettre un événement
     */
    emit(event: string, data: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    /**
     * Vérifier la connexion
     */
    isConnected(): boolean {
        return this.connected && this.socket?.connected === true;
    }

    /**
     * Obtenir l'instance socket
     */
    getSocket(): Socket | null {
        return this.socket;
    }
}

// Export d'une instance unique (Singleton)
export default new SocketService();