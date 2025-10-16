// utils/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private isConnecting = false;

    connect(apiUrl: string, userId: string, token: string) {
        // Éviter les doubles connexions
        if (this.socket?.connected) {
            console.log('✅ Socket déjà connecté');
            return;
        }

        if (this.isConnecting) {
            console.log('⏳ Connexion en cours...');
            return;
        }

        this.isConnecting = true;
        console.log('🔌 Connexion Socket.IO vers:', apiUrl);

        this.socket = io(apiUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connecté:', this.socket?.id);
            this.isConnecting = false;
        });

        this.socket.on('authenticated', (data) => {
            console.log('🔐 Authentification réussie:', data);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket déconnecté:', reason);
            this.isConnecting = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Erreur de connexion:', error.message);
            this.isConnecting = false;
        });

        this.socket.on('error', (error) => {
            console.error('❌ Erreur Socket:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            console.log('👋 Déconnexion Socket');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // ✅ Méthodes de gestion des chats
    joinChat(chatId: string) {
        if (this.socket?.connected) {
            console.log(`🔗 Rejoindre chat: ${chatId}`);
            this.socket.emit('join_chat', chatId);
        } else {
            console.warn('⚠️ Socket non connecté, impossible de rejoindre le chat');
        }
    }

    leaveChat(chatId: string) {
        if (this.socket?.connected) {
            console.log(`👋 Quitter chat: ${chatId}`);
            this.socket.emit('leave_chat', chatId);
        }
    }

    // ✅ Écouter les nouveaux messages
    onNewMessage(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('new_message', (data) => {
                console.log('📨 [SOCKET] new_message reçu:', data);
                callback(data);
            });
        }
    }

    // ✅ Écouter les messages lus
    onMessagesRead(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('messages_read', callback);
        }
    }

    // ✅ Événements globaux
    onChatCreated(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('chat_created', callback);
        }
    }

    onParticipantAdded(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('participant_added', callback);
        }
    }

    onChatDeactivated(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('chat_deactivated', callback);
        }
    }

    onPermissionsUpdated(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('participant_permissions_updated', callback);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // ✅ Nettoyer les listeners
    off(event: string, callback?: any) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // ✅ Émettre un événement
    emit(event: string, data: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn(`⚠️ Impossible d'émettre ${event}: socket déconnecté`);
        }
    }

    // ✅ Obtenir l'instance socket (pour debug)
    getSocket(): Socket | null {
        return this.socket;
    }
}

// Export singleton
const socketService = new SocketService();
export default socketService;