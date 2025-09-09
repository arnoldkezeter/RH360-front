import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Users, Settings, Search, FileText, X, Plus, Trash2 } from 'lucide-react';
import { t } from 'i18next';
import FilterList from '../../components/ui/AutoComplete';
import { useFetchData } from '../../hooks/fechDataOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { addMessage, addParticipants, getAvailableParticipants, getChatMessages, getUtilisateurChats, markMessagesAsRead } from '../../services/executions/chatAPI';
import { useLocation } from 'react-router-dom';
import { setChatLoading, setChats, setErrorPageChat, updateChatParticipants } from '../../_redux/features/execution/chatSlice';
import createToast from '../../hooks/toastify';
import { setShowModal } from '../../_redux/features/setting';
import FormCreateChat from '../../components/Modals/Chat/FormAddChat';
import { searchUtilisateur } from '../../services/utilisateurs/utilisateurAPI';
import { truncateText } from '../../fonctions/fonction';


// Composant principal de Chat
const ChatManager = () => {
    const { data: { chats } } = useSelector((state: RootState) => state.chatSlice);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [showParticipantsModal, setShowParticipantsModal] = useState<boolean>(false);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pageIsLoading = useSelector((state: RootState) => state.chatSlice.pageIsLoading)

    const dispatch = useDispatch();
    const fetchData = useFetchData();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const [tacheId, setTacheId] = useState<string>('');
    const [entityType, setEntityType] = useState<string>('');
    const [nom, setNom] = useState<string>('');
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur as Utilisateur);

    // Initialiser les paramètres de l'URL
    useEffect(() => {
        setTacheId(query.get("tacheId") || "");
        setEntityType(query.get("entityType") || "");
        setNom(query.get("nom") || "")
    }, [search]);

    // Fonctions de chargement des messages et de lecture
    const loadChatMessages = useCallback(async (chatId: string) => {
        if (!currentUser?._id) return;
        dispatch(setChatLoading(true));
        try {
            await getChatMessages({
                chatId,
                userId: currentUser._id,
                page: 1,
                limit: 50,
                lang,
            }).then((data)=>{
              console.log(data)
              setMessages(data.messages || []);
            });
            
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
            createToast(t('message.erreur_chargement_messages'), '', 2);
        } finally {
            dispatch(setChatLoading(false));
        }
    }, [dispatch, currentUser, lang, t]);

    const readMessages = useCallback(async (chatId: string) => {
        if (!currentUser?._id) return;
        try {
            await markMessagesAsRead({
                chatId,
                userId: currentUser._id,
                lang,
            });
        } catch (error) {
            console.error('Erreur lors du marquage des messages comme lus:', error);
            createToast(t('message.erreur_lecture_messages'), '', 2);
        }
    }, [currentUser, lang, t]);


    // Charger les chats de l'utilisateur et gérer l'ouverture automatique
    useEffect(() => {
        const loadInitialData = async () => {
            if (!tacheId || !entityType || !currentUser?._id) return;

            // Charger tous les chats de l'utilisateur
            fetchData({
                apiFunction: getUtilisateurChats,
                params: {
                    entityType,
                    userId: currentUser._id,
                    lang,
                },
                onSuccess: (data) => {
                    dispatch(setChats(data || {
                        chats: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                },
                onError: () => dispatch(setErrorPageChat(t('message.erreur'))),
                onLoading: (isLoading) => dispatch(setChatLoading(isLoading)),
            });
        };
        loadInitialData();
    }, [tacheId, entityType, currentUser, lang, dispatch, fetchData, t]);

    // Gérer l'ouverture automatique du chat
    useEffect(() => {
        if (chats.length > 0 && tacheId) {
            const chatToOpen = chats.find(chat => chat.entityId === tacheId && chat.entityType === entityType);
            if (chatToOpen && (!selectedChat || selectedChat._id !== chatToOpen._id)) {
                setSelectedChat(chatToOpen);
                loadChatMessages(chatToOpen._id||"");
            }
        }
    }, [chats, tacheId, entityType, selectedChat, loadChatMessages]);

    // Gérer le défilement automatique
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !currentUser?._id) return;
        try {
            const response: ReponseApiPros = await addMessage(selectedChat._id||"", currentUser._id, newMessage.trim(), 'text', lang);
            if (response.success) {
                createToast(response.message, '', 0);
                setMessages(prev => [...prev, response.data]);
                setNewMessage('');
            } else {
                createToast(response.message, '', 2);
            }
        } catch (error: any) {
            console.error('Erreur lors de l\'envoi du message:', error);
            createToast(error.response?.data?.message || t('message.erreur_generique'), '', 2);
        }
    };

    const selectChat = (chat: Chat) => {
        if (!chat) return;
        setSelectedChat(chat);
        loadChatMessages(chat._id||"");
        readMessages(chat._id||"");
    };

    const handlePartSelect = async (selected: Utilisateur | string) => {
        if (typeof selected === "string" || !selectedChat || !currentUser?._id) return;
        const participant: Participant = {
            userId: selected._id||"",
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
            const response: ReponseApiPros = await addParticipants(selectedChat._id||"", currentUser._id, [participant], lang);
            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(updateChatParticipants({
                    id: selectedChat._id||"",
                    participants: [participant]
                }));
                setShowParticipantsModal(false);
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
            console.error('Erreur de recherche d\'utilisateur:', error);
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
    
    return (
        <>
            <div className="flex w-full h-screen bg-[#f8fafc]">
                {/* Sidebar des chats */}
                <div className="w-1/3 bg-[#ffffff] border-r border-[#e2e8f0] flex flex-col">
                    <div className="p-4 border-b border-[#e2e8f0]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[#1e293b]">Mes Chats</h2>
                            <button
                                onClick={() => dispatch(setShowModal())}
                                className="bg-[#3b82f6] text-[#ffffff] px-3 py-1 rounded-lg hover:bg-[#2563eb] flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Nouveau
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8]" size={16} />
                            <input type="text" placeholder="Rechercher un chat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {pageIsLoading && chats.length === 0 ? (<div className="p-4 text-center text-[#64748b]">Chargement...</div>) : (filteredChats.map(chat => {
                            const unreadCount = getUnreadCount(chat);
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => selectChat(chat)}
                                    className={`p-4 border-b border-[#f1f5f9] cursor-pointer hover:bg-[#f8fafc] transition-colors ${selectedChat?._id === chat._id ? 'bg-[#eff6ff] border-l-4 border-l-[#3b82f6]' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-[#0f172a] truncate">{chat.title || `${chat.entityType} Chat`}</h3>
                                                {unreadCount > 0 && (<span className="bg-[#ef4444] text-[#ffffff] text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{unreadCount}</span>)}
                                            </div>
                                            <p className="text-sm text-[#475569] truncate mb-1">{chat.messages[chat.messages.length - 1]?.content || 'Aucun message'}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-[#94a3b8]">{`${chat.entityType==='TacheExecutee'?t('label.type_tache_executee'):""} `}</span>
                                                <span className="text-xs text-[#94a3b8]">{new Date(chat.lastActivity).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }))}
                    </div>
                </div>

                {/* Zone de chat principale */}
                <div className="flex-1 flex flex-col">
                    {selectedChat ? (
                        <>
                            <div className="bg-[#ffffff] border-b border-[#e2e8f0] p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#0f172a]">{selectedChat.title || `${selectedChat.entityType} Chat`}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-[#475569]">{selectedChat.participants?.length} participant(s)</p>
                                            {selectedChat.entityType === 'TacheExecutee' && (<button onClick={() => {}} className="text-sm text-[#3b82f6] hover:text-[#2563eb] hover:underline flex items-center gap-1" title="Ouvrir la tâche"><FileText size={14} />Voir la tâche</button>)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setShowParticipantsModal(true)} className="p-2 text-[#475569] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg"><Users size={20} /></button>
                                        <button className="p-2 text-[#475569] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg"><Settings size={20} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map(message => (<div key={message._id} className={`flex ${message.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === currentUser?._id ? 'bg-[#3b82f6] text-[#ffffff]' : 'bg-[#e2e8f0] text-[#1e293b]'}`}>
                                        {message.sender._id !== currentUser?._id && (<p className="text-xs font-medium mb-1 opacity-75">{message.sender?.prenom ? `${message.sender.prenom} ${message.sender.nom}` : message.sender.nom}</p>)}
                                        <p className="text-sm">{message.content}</p>
                                        <p className={`text-xs mt-1 ${message.sender._id === currentUser?._id ? 'text-[#bfdbfe]' : 'text-[#64748b]'}`}>{new Date(message.timestamp).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="bg-[#ffffff] border-t border-[#e2e8f0] p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Tapez votre message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        className="flex-1 px-4 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                                    />
                                    <button className="p-2 text-[#475569] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg"><FileText size={20} /></button>
                                    <button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-[#3b82f6] text-[#ffffff] px-4 py-2 rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><Send size={16} />Envoyer</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
                            <div className="text-center">
                                <div className="text-[#94a3b8] mb-4"><Users size={64} className="mx-auto" /></div>
                                <h3 className="text-lg font-medium text-[#0f172a] mb-2">Sélectionnez un chat</h3>
                                <p className="text-[#475569]">Choisissez un chat dans la liste pour commencer la conversation</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal des participants */}
                {showParticipantsModal && selectedChat && (
                    <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#ffffff] rounded-lg p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#0f172a]">Participants</h3>
                                <button onClick={() => setShowParticipantsModal(false)} className="text-[#94a3b8] hover:text-[#475569]"><X size={20} /></button>
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
                                    <div key={index} className="flex items-center justify-between p-2 border border-[#e5e7eb] rounded-lg">
                                        <div>
                                            <p className="font-medium text-[#0f172a]">{participant.prenom ? `${participant.prenom} ${participant.nom}` : participant.nom}</p>
                                            <p className="text-sm text-[#475569]">{participant.email}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`text-xs px-2 py-1 rounded ${participant.role === 'super-admin' || participant.role === 'admin' ? 'bg-[#fef3c7] text-[#d97706]' : participant.role === 'responsable' ? 'bg-[#dbeafe] text-[#2563eb]' : participant.role === 'participant' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>{participant.role}</span>
                                            {currentUser?.role === 'admin' && participant.userId !== currentUser?._id && (<button onClick={() => removeParticipantFromChat(participant.userId)} title="Retirer" className="p-1 rounded-full text-[#ef4444] hover:bg-[#fecaca]"><Trash2 size={16} /></button>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setShowParticipantsModal(false)} className="px-4 py-2 text-[#475569] border border-[#d1d5db] rounded-lg hover:bg-[#f8fafc]">Fermer</button>
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