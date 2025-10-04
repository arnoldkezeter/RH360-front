import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, Users, Settings, Search, FileText, X, Plus, Trash2, Check, CheckCheck } from 'lucide-react';
import { t } from 'i18next';
import FilterList from '../../components/ui/AutoComplete';
import { useFetchData } from '../../hooks/fechDataOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { addMessage, addParticipants, getChatMessages, getUtilisateurChats, markMessagesAsRead } from '../../services/executions/chatAPI';
import { useLocation } from 'react-router-dom';
import { setChatLoading, setChats, setErrorPageChat, updateChatParticipants } from '../../_redux/features/execution/chatSlice';
import createToast from '../../hooks/toastify';
import { setShowModal } from '../../_redux/features/setting';
import FormCreateChat from '../../components/Modals/Chat/FormAddChat';
import { searchUtilisateur } from '../../services/utilisateurs/utilisateurAPI';
import { useSocket } from '../../hooks/useSocket';
import { apiUrl, wstjqer } from '../../config';

// ✅ Helper pour grouper ET TRIER les messages par date (du plus ancien au plus récent)
const groupMessagesByDate = (messages: Message[]) => {
    // D'abord trier tous les messages par date croissante
    const sortedMessages = [...messages].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const groups: { [key: string]: Message[] } = {};
    
    sortedMessages.forEach(message => {
        const date = new Date(message.timestamp);
        const dateKey = date.toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(message);
    });
    
    return groups;
};

// Helper pour formater l'heure
const formatTime = (timestamp: string, lang: string) => {
    return new Date(timestamp).toLocaleTimeString(lang, { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};


// Composant de bulle de message
const MessageBubble: React.FC<{
    message: Message;
    isCurrentUser: boolean;
    lang: string;
    showSender?: boolean;
}> = ({ message, isCurrentUser, lang, showSender }) => {
    const isRead = message.isRead && message.isRead.length > 1;
    
    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
                {showSender && !isCurrentUser && (
                    <p className="text-xs text-[#667781] mb-1 px-1">
                        {message.sender?.prenom ? `${message.sender.prenom} ${message.sender.nom}` : message.sender.nom}
                    </p>
                )}
                <div className={`relative px-3 py-2 rounded-lg ${
                    isCurrentUser 
                        ? 'bg-[#d9fdd3] rounded-tr-none' 
                        : 'bg-white rounded-tl-none shadow-sm'
                }`}>
                    <p className="text-sm text-[#111b21] break-words">{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-[#667781]">
                            {formatTime(message.timestamp, lang)}
                        </span>
                        {isCurrentUser && (
                            <span className="text-[#53bdeb]">
                                {isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Séparateur de date
const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
    <div className="flex items-center justify-center my-4">
        <div className="bg-[#e9edef] px-3 py-1 rounded-md shadow-sm">
            <span className="text-xs text-[#54656f] font-medium">{date}</span>
        </div>
    </div>
);

const ChatManager = () => {
    const { data: { chats } } = useSelector((state: RootState) => state.chatSlice);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [showParticipantsModal, setShowParticipantsModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const pageIsLoading = useSelector((state: RootState) => state.chatSlice.pageIsLoading);

    const dispatch = useDispatch();
    const fetchData = useFetchData();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const [tacheId, setTacheId] = useState<string>('');
    const [entityType, setEntityType] = useState<string>('');
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur as Utilisateur);
    
    // Socket setup
    const socketUrl = useMemo(() => apiUrl.replace('/api/v1', ''), []);
    const token = useMemo(() => localStorage.getItem(wstjqer) || '', []);
    
    const socket = useSocket({
        apiUrl: socketUrl,
        userId: currentUser?._id,
        token,
        enabled: !!(currentUser?._id && token)
    });

    useEffect(() => {
        setTacheId(query.get("tacheId") || "");
        setEntityType(query.get("entityType") || "");
    }, [search]);

        
    useEffect(() => {
        if (!selectedChat?._id) return;
        
        const pollInterval = setInterval(async () => {
            console.log('🔄 Polling des messages...');
            await loadChatMessages(selectedChat._id || "", false);
        }, 1000); // Toutes les 5 secondes
        
        return () => clearInterval(pollInterval);
    }, [selectedChat?._id]);

    const readMessages = useCallback(async (chatId: string) => {
        if (!currentUser?._id) return;
        try {
            await markMessagesAsRead({ chatId, userId: currentUser._id, lang });
        } catch (error) {
            console.error('Erreur marquage messages lus:', error);
        }
    }, [currentUser, lang]);

    // ✅ Gestion Socket.IO - Événements globaux
    useEffect(() => {
        if (!currentUser?._id || !socket.isConnected()) return;

        const handleChatCreated = (data: any) => {
            console.log('🆕 Chat créé:', data);
            createToast(t('message.nouveau_chat_cree'), '', 0);
        };

        const handleParticipantAdded = (data: any) => {
            console.log('👤 Participant ajouté:', data);
            createToast(t('message.nouveau_participant_ajoute'), '', 0);
        };

        const handleChatDeactivated = (data: any) => {
            console.log('🚫 Chat désactivé:', data);
            createToast(t('message.chat_desactive'), '', 1);
            if (selectedChat?._id === data.chatId) {
                setSelectedChat(null);
            }
        };

        socket.onChatCreated(handleChatCreated);
        socket.onParticipantAdded(handleParticipantAdded);
        socket.onChatDeactivated(handleChatDeactivated);

        return () => {
            socket.off('chat_created', handleChatCreated);
            socket.off('participant_added', handleParticipantAdded);
            socket.off('chat_deactivated', handleChatDeactivated);
        };
    }, [currentUser?._id, selectedChat?._id, socket, t]);

    // ✅ Gestion Socket.IO - Événements du chat sélectionné
    useEffect(() => {
        if (!selectedChat?._id || !currentUser?._id || !socket.isConnected()) {
            console.log('⏸️ Conditions non remplies pour rejoindre le chat');
            return;
        }

        console.log(`🔗 Rejoindre le chat: ${selectedChat._id}`);
        socket.joinChat(selectedChat._id);

        const handleNewMessage = (data: { chatId: string; message: Message }) => {
            console.log('📨 Nouveau message reçu:', data);
            if (data.chatId === selectedChat._id) {
                setMessages(prev => {
                    // Éviter les doublons
                    const exists = prev.some(msg => msg._id === data.message._id);
                    if (exists) return prev;
                    return [...prev, data.message];
                });
                
                if (data.message.sender._id !== currentUser._id) {
                    readMessages(selectedChat._id);
                }
            }
        };

        const handleMessagesRead = (data: { chatId: string; userId: string }) => {
            if (data.chatId === selectedChat._id) {
                console.log('📩 Messages lus par', data.userId);
                // Mettre à jour les indicateurs de lecture
                setMessages(prev => prev.map(msg => {
                    if (msg.sender._id === currentUser._id) {
                        const isRead = msg.isRead || [];
                        const alreadyRead = isRead.some(r => r.user === data.userId);
                        if (!alreadyRead) {
                            return {
                                ...msg,
                                isRead: [...isRead, { user: data.userId, readAt: new Date().toISOString() }]
                            };
                        }
                    }
                    return msg;
                }));
            }
        };

        const handlePermissionsUpdated = (data: any) => {
            if (data.chatId === selectedChat._id && data.participantId === currentUser._id) {
                console.log('🔐 Permissions mises à jour');
                createToast(t('message.permissions_maj'), '', 0);
            }
        };

        socket.onNewMessage(handleNewMessage);
        socket.onMessagesRead(handleMessagesRead);
        socket.onPermissionsUpdated(handlePermissionsUpdated);

        return () => {
            console.log(`👋 Quitter le chat: ${selectedChat._id}`);
            socket.leaveChat(selectedChat._id||"");
            socket.off('new_message', handleNewMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('participant_permissions_updated', handlePermissionsUpdated);
        };
    }, [selectedChat?._id, currentUser?._id, socket, readMessages, t]);

    const [messagesLoading, setMessagesLoading] = useState(false);

    const loadChatMessages = useCallback(async (chatId: string, loading:boolean) => {
        if (!currentUser?._id) return;
        if(loading){
            setMessagesLoading(true);
        }
        try {
            const data = await getChatMessages({ chatId, userId: currentUser._id, page: 1, limit: 50, lang });
            // ✅ Les messages sont déjà triés par le backend normalement, mais on s'assure
            const sortedMessages = (data.messages || []).sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Erreur chargement messages:', error);
            createToast(t('message.erreur_chargement_messages'), '', 2);
        } finally {
            setMessagesLoading(false);
        }
    }, [currentUser, lang, t]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!tacheId || !entityType || !currentUser?._id) return;

            fetchData({
                apiFunction: getUtilisateurChats,
                params: { entityType, userId: currentUser._id, lang },
                onSuccess: (data) => {
                    dispatch(setChats(data || { chats: [], currentPage: 0, totalItems: 0, totalPages: 0, pageSize: 0 }));
                },
                onError: () => dispatch(setErrorPageChat(t('message.erreur'))),
                onLoading: (isLoading) => dispatch(setChatLoading(isLoading)),
            });
        };
        loadInitialData();
    }, [tacheId, entityType, currentUser, lang, dispatch, fetchData, t]);

    useEffect(() => {
        if (chats.length > 0 && tacheId) {
            const chatToOpen = chats.find(chat => chat.entityId === tacheId && chat.entityType === entityType);
            if (chatToOpen && (!selectedChat || selectedChat._id !== chatToOpen._id)) {
                setSelectedChat(chatToOpen);
                loadChatMessages(chatToOpen._id || "", true);
            }
        }
    }, [tacheId, chats, entityType, loadChatMessages]);

    // ✅ Scroll automatique amélioré avec délai
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            // Petit délai pour laisser le DOM se mettre à jour
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [messages]);

    const [sending, setSending] = useState(false);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !currentUser?._id || sending) return;

        setSending(true);
        const messageContent = newMessage.trim();
        setNewMessage(""); // ✅ Vider immédiatement l'input

        const optimisticMessage: Message = {
            _id: `temp-${Date.now()}`,
            content: messageContent,
            messageType: "text",
            sender: {
                _id: currentUser._id,
                nom: currentUser.nom,
                prenom: currentUser.prenom,
                email: currentUser.email,
            },
            timestamp: new Date().toISOString(),
            isRead: [{ user: currentUser._id, readAt: new Date().toISOString() }],
        };

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const response: ReponseApiPros = await addMessage(
                selectedChat._id || "",
                currentUser._id,
                messageContent,
                "text",
                lang
            );

            if (response.success && response.data) {
                // ✅ Remplacer le message optimiste par le message réel
                setMessages(prev =>
                    prev.map(msg => msg._id === optimisticMessage._id ? response.data : msg)
                );
                
                // ✅ CORRECTION : Émettre l'événement socket après l'envoi réussi
                if (socket.isConnected()) {
                    socket.emit('send_message', {
                        chatId: selectedChat._id,
                        message: response.data
                    });
                    console.log('📤 Message émis via socket:', response.data);
                }
            } else {
                createToast(response.message, "", 2);
                setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
                setNewMessage(messageContent); // Restaurer le message en cas d'erreur
            }
        } catch (error: any) {
            console.error("Erreur envoi message:", error);
            createToast(error.response?.data?.message || t("message.erreur_generique"), "", 2);
            setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
            setNewMessage(messageContent); // Restaurer le message
        } finally {
            setSending(false);
        }
    };

    const selectChat = (chat: Chat) => {
        if (!chat) return;
        setSelectedChat(chat);
        setMessages([]);
        loadChatMessages(chat._id || "", true);
        readMessages(chat._id || "");
    };

    const handlePartSelect = async (selected: Utilisateur | string) => {
        if (typeof selected === "string" || !selectedChat || !currentUser?._id) return;
        
        const participant: Participant = {
            userId: selected._id || "",
            nom: selected.nom,
            prenom: selected.prenom,
            email: selected.email,
            role: selected.role?.toLowerCase() || '',
            permissions: {
                canAddParticipants: false,
                canRemoveParticipants: false,
                canSendMessages: true
            }
        };

        try {
            const response: ReponseApiPros = await addParticipants(selectedChat._id || "", currentUser._id, [participant], lang);
            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(updateChatParticipants({ id: selectedChat._id || "", participants: [participant] }));
                setSelectedChat(prev => prev ? { ...prev, participants: [...(prev.participants || []), participant] } : null);
            } else {
                createToast(response.message, '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message || t('message.erreur_generique'), '', 2);
        }
    };

    const onSearchParticipant = async (search: string) => {
        try {
            const data = await searchUtilisateur({ searchString: search, lang });
            return data?.utilisateurs || [];
        } catch (error) {
            console.error('Erreur recherche utilisateur:', error);
            return [];
        }
    };

    const removeParticipantFromChat = (userId: string) => {
        if (!selectedChat) return;
        const updatedChat = { ...selectedChat, participants: selectedChat.participants.filter(p => p.userId !== userId) };
        setSelectedChat(updatedChat);
    };

    const filteredChats = chats.filter(chat =>
        chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.entityType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getUnreadCount = (chat: Chat) => {
        if (!chat.messages) return 0;
        return chat.messages.filter(msg => !msg.isRead?.some(read => read.user === currentUser?._id)).length;
    };

    // ✅ Grouper les messages par date (déjà triés)
    const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

    return (
         <>
            <div className="flex w-full h-screen bg-[#f0f2f5]">
                {/* Sidebar des chats */}
                <div className="w-1/3 bg-white border-r border-[#e9edef] flex flex-col">
                    <div className="p-4 bg-[#f0f2f5] border-b border-[#e9edef]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[#111b21]">{t('label.messages')}</h2>
                            <button
                                onClick={() => dispatch(setShowModal())}
                                className="bg-[#00a884] text-white p-2 rounded-full hover:bg-[#008f6c] transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667781]" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-[#e9edef] rounded-lg text-sm focus:outline-none focus:border-[#00a884]"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white">
                        {pageIsLoading && chats.length === 0 ? (
                            <div className="p-4 text-center text-[#667781]">{t('label.chargement...')}</div>
                        ) : (
                            filteredChats.map(chat => {
                                const unreadCount = getUnreadCount(chat);
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => selectChat(chat)}
                                        className={`p-4 border-b border-[#f0f2f5] cursor-pointer hover:bg-[#f5f6f6] transition-colors ${
                                            selectedChat?._id === chat._id ? 'bg-[#f0f2f5]' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-[#111b21] truncate">{chat.title || `${chat.entityType} Chat`}</h3>
                                                    <span className="text-xs text-[#667781] ml-2 flex-shrink-0">
                                                        {new Date(chat.lastActivity).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-[#667781] truncate flex-1">
                                                        {lastMessage?.content || 'Aucun message'}
                                                    </p>
                                                    {unreadCount > 0 && (
                                                        <span className="bg-[#00a884] text-white text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 min-w-[20px] text-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Zone de chat principale */}
                <div className="flex-1 flex flex-col bg-[#efeae2]">
                    {selectedChat ? (
                        <>
                            {/* Header du chat */}
                            <div className="bg-[#f0f2f5] border-b border-[#e9edef] p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#111b21]">{selectedChat.title || `${selectedChat.entityType} Chat`}</h3>
                                        <div className="flex items-center gap-2 text-sm text-[#667781]">
                                            <span>{selectedChat.participants?.length} {t('label.participant')}(s)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowParticipantsModal(true)}
                                            className="p-2 text-[#54656f] hover:bg-[#f5f6f6] rounded-full transition-colors"
                                        >
                                            <Users size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div 
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 bg-[#efeae2]"
                                style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23efeae2\'/%3E%3Cpath d=\'M50 0L0 50M100 0L50 50M100 50L50 100M50 50L0 100\' stroke=\'%23d1d7db\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
                                }}
                            >
                                {messagesLoading ? (
                                    <div className="text-center text-[#667781] py-8">{t('label.chargement_messages')}</div>
                                ) : (
                                    Object.entries(groupedMessages).map(([date, msgs]) => (
                                        <div key={date}>
                                            <DateSeparator date={date} />
                                            {msgs.map((message, index) => {
                                                const isCurrentUser = message.sender._id === currentUser?._id;
                                                const prevMessage = msgs[index - 1];
                                                const showSender = !prevMessage || prevMessage.sender._id !== message.sender._id;
                                                
                                                return (
                                                    <MessageBubble
                                                        key={message._id}
                                                        message={message}
                                                        isCurrentUser={isCurrentUser}
                                                        lang={lang}
                                                        showSender={showSender}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de message */}
                            <div className="bg-[#f0f2f5] p-4">
                                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2">
                                    <input
                                        type="text"
                                        placeholder="Tapez un message"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                                        className="flex-1 bg-transparent outline-none text-[#111b21]"
                                        disabled={sending}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim() || sending}
                                        className="text-[#00a884] hover:text-[#008f6c] disabled:text-[#8696a0] disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-[#667781] mb-4">
                                    <Users size={80} className="mx-auto" />
                                </div>
                                {/* <h3 className="text-2xl font-light text-[#41525d] mb-2">WhatsApp Web</h3> */}
                                <p className="text-[#667781]">{t("label.selectionnez_chat")}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal des participants */}
                {showParticipantsModal && selectedChat && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#111b21]">{t("label.participants_maj_plu")}</h3>
                                <button onClick={() => setShowParticipantsModal(false)} className="text-[#667781] hover:text-[#111b21]">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4 mb-5">
                                <FilterList
                                    items={[]}
                                    placeholder={t('recherche.rechercher') + t('recherche.utilisateur')}
                                    displayProperty={(item: any) => `${item.nom} ${item?.prenom || ""}`}
                                    onSelect={handlePartSelect}
                                    enableBackendSearch={true}
                                    onSearch={onSearchParticipant}
                                    searchDelay={300}
                                    minSearchLength={2}
                                    defaultValue={undefined}
                                    noResultsMessage={t('label.aucun_utilisateur')}
                                    loadingMessage={t('label.recherche_utilisateur')}
                                />
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                                {selectedChat.participants?.map((participant, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-[#e9edef] rounded-lg hover:bg-[#f5f6f6]">
                                        <div>
                                            <p className="font-medium text-[#111b21]">
                                                {participant.prenom ? `${participant.prenom} ${participant.nom}` : participant.nom}
                                            </p>
                                            <p className="text-sm text-[#667781]">{participant.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 rounded bg-[#e9edef] text-[#54656f]">
                                                {participant.role}
                                            </span>
                                            {currentUser?.role === 'admin' && participant.userId !== currentUser?._id && (
                                                <button
                                                    onClick={() => removeParticipantFromChat(participant.userId)}
                                                    className="p-1 rounded-full text-[#ef4444] hover:bg-[#fecaca] transition-colors"
                                                    title="Retirer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowParticipantsModal(false)}
                                    className="px-4 py-2 text-[#00a884] hover:bg-[#f0f2f5] rounded-lg transition-colors"
                                >
                                    {t("button.fermer")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <FormCreateChat currentUser={currentUser} entityId={tacheId} />
            </div>
        </>
    );
};

export default ChatManager;