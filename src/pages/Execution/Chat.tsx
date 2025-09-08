import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, Search, FileText, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { t } from 'i18next';
import FilterList from '../../components/ui/AutoComplete';
import { useFetchData } from '../../hooks/fechDataOptions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { addMessage, addParticipants, createChat, getAvailableParticipants, getChatMessages, getUtilisateurChats } from '../../services/executions/chatAPI';
import { useLocation } from 'react-router-dom';
import { createChatSlice, setChatLoading, setChats, setErrorPageChat, updateChatParticipants, updateChatSlice } from '../../_redux/features/execution/chatSlice';
import createToast from '../../hooks/toastify';
import { setShowModal } from '../../_redux/features/setting';
import FormCreateChat from '../../components/Modals/Chat/FormAddChat';
import { searchUtilisateur } from '../../services/utilisateurs/utilisateurAPI';




// Composant principal de Chat
const ChatManager = () => {
    const { data: { chats } } = useSelector((state: RootState) => state.chatSlice);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const dispatch = useDispatch();
    const fetchData = useFetchData();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { search } = useLocation(); // récupère la partie "?tacheId=..."
    const query = new URLSearchParams(search);
    const [tacheId, setTacheId] = useState('');
    const [entityType, setEntityType] = useState('');


    

    // Nouveaux états pour la recherche d'utilisateurs
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [foundUsers, setFoundUsers] = useState<Participant[]>([]);

    

  const [availableUsers, setAvailableUsers] = useState<Participant[]>([]);

  // Simuler l'utilisateur actuel (remplacer par votre système d'auth)
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  
    useEffect(() => {
        setTacheId(query.get("tacheId")||"");
        setEntityType(query.get("entityType")||"");
    }, []);

  // Charger les chats de l'utilisateur et gérer l'ouverture automatique
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Données de test
        if(tacheId && entityType){
            fetchData({
                        
                apiFunction: getUtilisateurChats,
                params: {
                    entityType: entityType||"",
                    userId:currentUser._id||"",
                    lang,
                },
                onSuccess: (data) => {  
                    console.log(data)
                    dispatch(setChats(data || {
                        chats:[],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                },
                onError: () => {
                    dispatch(setErrorPageChat(t('message.erreur')));
                },
                onLoading: (isLoading) => {
                    dispatch(setChatLoading(isLoading));
                },
            });

            fetchData({
                        
                apiFunction: getAvailableParticipants,
                params: {
                    userId:currentUser._id||"",
                    entityType: entityType||"", 
                    entityId: tacheId||"",
                    lang,
                },
                onSuccess: (data) => {  
                    setAvailableUsers(data);
                },
                
            });
            if (tacheId) {
                const chatToOpen = chats.find(chat => chat.entityType === 'TacheExecutee' && chat.entityId === tacheId);
                if (chatToOpen) {
                    setSelectedChat(chatToOpen);
                    loadChatMessages(chatToOpen._id||"");
                }
            }
        }

        
      } catch (error) {
        console.error('Erreur lors du chargement des chats:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [tacheId, lang, entityType]);

  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatMessages = async (chatId: string) => {
    setLoading(true);
    
    try {
        fetchData({
                    
            apiFunction: getChatMessages,
            params: {
                chatId, 
                userId:currentUser._id||"",
                page:1, 
                limit:50,
                lang,
            },
            onSuccess: (data) => {  
                setMessages(data.messages||[]);
            },
            
        });
      
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      let newMsg: Message = { sender: { _id: currentUser._id||"", nom: currentUser.nom, prenom: currentUser.prenom, email: currentUser.email }, content: newMessage, timestamp: new Date().toISOString(), messageType: 'text', isRead: [{ user: currentUser._id||"", readAt: new Date().toISOString() }] };
        await addMessage(selectedChat?._id||"", currentUser._id||"" , newMessage.trim(), 'text', lang).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message, '', 0);
                
                newMsg._id = e.data._id
                newMsg.sender = e.data.sender
                newMsg.content = e.data.content
                setMessages(prev => [...prev, newMsg]);
                setNewMessage('');
            } else {
                createToast(e.message, '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        })

      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    loadChatMessages(chat._id||"");
  };

    const handleParticipantSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return;
        const participant : Participant ={
            userId: selected?._id||"",
            nom: selected?.nom||"",
            prenom:selected?.prenom||"",
            email: selected?.email||"",
            role: selected?.role?.toLowerCase()||"",
            permissions: {
                canAddParticipants: false,
                canRemoveParticipants: false,
                canSendMessages: true
            }}
        setSelectedParticipants(prev => [...prev, participant]); // le "!" dit à TS : jamais undefined
        
    };

    const handlePartSelect = async (selected: Utilisateur | string) => {
        if (typeof selected === "string") return;
        const participant : Participant ={
            userId: selected?._id||"",
            nom: selected?.nom||"",
            prenom:selected?.prenom||"",
            email: selected?.email||"",
            role: selected?.role?.toLowerCase()||"",
            permissions: {
                canAddParticipants: false,
                canRemoveParticipants: false,
                canSendMessages: true
            }
        }

        await addParticipants(selectedChat?._id||"", currentUser._id||"",[participant], lang).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message, '', 0);
                // const updatedChat = { ...selectedChat, participants: [...(selectedChat.participants || []), ...selectedParticipants] };
                dispatch(updateChatParticipants({
                    id:selectedChat?._id||"",
                    participants:[participant]
                }));
                // setSelectedChat(updatedChat);
                setShowAddParticipantModal(false);
                setSelectedParticipants([]);
                setFoundUsers([]);
                setUserSearchTerm('');
                
            } else {
                createToast(e.message, '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        })
        
    };



    const onSearchParticipant = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        return data?.utilisateurs || [];
    };
  
    const addParticipantsToChat = async () => {
        if (!selectedChat) return;
        // console.log(selectedParticipants)
        // const newParticipants = foundUsers.filter(user => selectedParticipants.includes(user.userId));
        // console.log(newParticipants)
        await addParticipants(selectedChat?._id||"", currentUser._id||"",selectedParticipants, lang).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message, '', 0);
                // const updatedChat = { ...selectedChat, participants: [...(selectedChat.participants || []), ...selectedParticipants] };
                dispatch(updateChatParticipants({
                    id:selectedChat._id||"",
                    participants:selectedParticipants
                }));
                // setSelectedChat(updatedChat);
                setShowAddParticipantModal(false);
                setSelectedParticipants([]);
                setFoundUsers([]);
                setUserSearchTerm('');
                
            } else {
                createToast(e.message, '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        })
        
    };

    const removeParticipantFromChat = (userId: string) => {
        if (!selectedChat) return;
        const updatedChat = { ...selectedChat, participants: selectedChat.participants?.filter(p => p.userId !== userId) };
        // setChats(chats.map(chat => chat._id === selectedChat._id ? updatedChat : chat));
        setSelectedChat(updatedChat);
    };

  
  const filteredChats = chats.filter(chat =>
    chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1].content;
    }
    return 'Aucun message';
  };

  const getUnreadCount = (chat: Chat) => {
    if (!chat.messages) return 0;
    return chat.messages.filter(msg => !msg.isRead.some(read => read.user === currentUser._id)).length;
  };

  const getParticipantDisplayName = (participant: Participant) => {
    return participant.prenom ? `${participant.prenom} ${participant.nom}` : participant.nom;
  };

  const getMessageSenderDisplayName = (sender: MessageSender) => {
    return sender.prenom ? `${sender.prenom} ${sender.nom}` : sender.nom;
  };
  
  const usersToInvite = foundUsers.filter(user => !selectedChat?.participants?.some(p => p.userId === user.userId));

  return (
    <>
    <div className="flex w-full h-screen bg-[#f8fafc]">
      {/* Sidebar des chats */}
      <div className="w-1/3 bg-[#ffffff] border-r border-[#e2e8f0] flex flex-col">
        {/* Header */}
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
          {loading ? (<div className="p-4 text-center text-[#64748b]">Chargement...</div>) : (filteredChats.map(chat => {
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
                    <p className="text-sm text-[#475569] truncate mb-1">{getLastMessagePreview(chat)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#94a3b8]">{chat.entityType}</span>
                      <span className="text-xs text-[#94a3b8]">{formatTime(chat.lastActivity)}</span>
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
              {messages.map(message => (<div key={message._id} className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === currentUser._id ? 'bg-[#3b82f6] text-[#ffffff]' : 'bg-[#e2e8f0] text-[#1e293b]'}`}>
                  {message.sender._id !== currentUser._id && (<p className="text-xs font-medium mb-1 opacity-75">{getMessageSenderDisplayName(message.sender)}</p>)}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender._id === currentUser._id ? 'text-[#bfdbfe]' : 'text-[#64748b]'}`}>{formatTime(message.timestamp)}</p>
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
                    placeholder={t('recherche.rechercher')+t('recherche.utilisateur')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
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
                    <p className="font-medium text-[#0f172a]">{getParticipantDisplayName(participant)}</p>
                    <p className="text-sm text-[#475569]">{participant.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${(participant.role === 'super-admin' || participant.role === 'admin') ? 'bg-[#fef3c7] text-[#d97706]' : participant.role === 'responsable' ? 'bg-[#dbeafe] text-[#2563eb]' : participant.role === 'participant' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>{participant.role}</span>
                    {currentUser.role === 'admin' && participant.userId !== currentUser._id && (<button onClick={() => removeParticipantFromChat(participant.userId)} title="Retirer" className="p-1 rounded-full text-[#ef4444] hover:bg-[#fecaca]"><Trash2 size={16} /></button>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {/* <button onClick={() => setShowAddParticipantModal(true)} className="bg-[#3b82f6] text-[#ffffff] px-4 py-2 rounded-lg hover:bg-[#2563eb] flex items-center gap-1">
                <Plus size={16} />
                Ajouter
              </button> */}
              <button onClick={() => setShowParticipantsModal(false)} className="px-4 py-2 text-[#475569] border border-[#d1d5db] rounded-lg hover:bg-[#f8fafc]">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de participants */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#ffffff] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0f172a]">Ajouter des participants</h3>
              <button onClick={() => setShowAddParticipantModal(false)} className="text-[#94a3b8] hover:text-[#475569]"><X size={20} /></button>
            </div>

            <div className="space-y-4">
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.utilisateur')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
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
            
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddParticipantModal(false)} className="px-4 py-2 text-[#475569] border border-[#d1d5db] rounded-lg hover:bg-[#f8fafc]">Annuler</button>
              <button onClick={addParticipantsToChat} disabled={selectedParticipants.length === 0} className="px-4 py-2 bg-[#3b82f6] text-[#ffffff] rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed">
                Ajouter ({selectedParticipants.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <FormCreateChat currentUser={currentUser} entityId={tacheId}/>
    </>
  );
};

export default ChatManager;