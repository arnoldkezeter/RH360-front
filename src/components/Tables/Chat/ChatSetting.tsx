import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Users, Check, UserPlus, Crown, Shield, Eye } from 'lucide-react';





interface ParticipantSelectorProps {
  entityType: string;
  entityId: string;
  onCreateChat: (data: any) => void;
  onCancel: () => void;
  existingParticipants?: ExistingParticipant[];
  isAddingToExisting?: boolean;
  chatId?: string | null;
}

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({ 
  entityType, 
  entityId, 
  onCreateChat,
  onCancel,
  existingParticipants = [],
  isAddingToExisting = false,
  chatId = null
}) => {
  const [availableUsers, setAvailableUsers] = useState<Utilisateur[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chatTitle, setChatTitle] = useState<string>('');
  const [chatType, setChatType] = useState<'group' | 'private'>('group');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAvailableParticipants();
  }, [entityType, entityId]);

  const fetchAvailableParticipants = async (): Promise<void> => {
    try {
      const response = await fetch(
        `/api/chat/available-participants/${entityType}/${entityId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const users: Utilisateur[] = await response.json();
        // Filtrer les participants déjà existants si on ajoute à un chat existant
        const filteredUsers = isAddingToExisting 
          ? users.filter(user => !existingParticipants.some(p => p.user._id === user._id))
          : users;
        setAvailableUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (user: Utilisateur): void => {
    const isSelected = selectedParticipants.some(p => p.userId === user._id);
    
    if (isSelected) {
      setSelectedParticipants(prev => 
        prev.filter(p => p.userId !== user._id)
      );
    } else {
      setSelectedParticipants(prev => [
        ...prev,
        {
          userId: user._id||"",
          nom: user.nom,
          email: user.email,
          role: getDefaultRole(user),
          permissions: getDefaultPermissions(user)
        }
      ]);
    }
  };

  const getDefaultRole = (user: Utilisateur): 'admin' | 'responsable' | 'participant' | 'viewer' => {
    if (user.role === 'admin') return 'admin';
    if (entityType === 'TacheExecutee') return 'responsable';
    return 'participant';
  };

  const getDefaultPermissions = (user: Utilisateur) => {
    const isAdmin = user.role === 'admin';
    return {
      canAddParticipants: isAdmin,
      canRemoveParticipants: isAdmin,
      canSendMessages: true
    };
  };

  const updateParticipantRole = (userId: string, newRole: 'admin' | 'responsable' | 'participant' | 'viewer'): void => {
    setSelectedParticipants(prev =>
      prev.map(p => 
        p.userId === userId 
          ? { 
              ...p, 
              role: newRole,
              permissions: {
                canAddParticipants: newRole === 'admin',
                canRemoveParticipants: newRole === 'admin',
                canSendMessages: true
              }
            }
          : p
      )
    );
  };

  const handleCreateChat = (): void => {
    if (selectedParticipants.length === 0) {
      alert('Veuillez sélectionner au moins un participant');
      return;
    }

    const chatData = {
      participants: selectedParticipants,
      title: chatTitle.trim() || null,
      chatType
    };

    if (isAddingToExisting && chatId) {
    //   onCreateChat(chatId, selectedParticipants);
    } else {
      onCreateChat(chatData);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={16} className="text-[#F59E0B]" />;
      case 'responsable': return <Shield size={16} className="text-[#3B82F6]" />;
      case 'viewer': return <Eye size={16} className="text-[#6B7280]" />;
      default: return <Users size={16} className="text-[#10B981]" />;
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'responsable': return 'Responsable';
      case 'viewer': return 'Observateur';
      default: return 'Participant';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#FFFFFF] rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6] mx-auto"></div>
          <p className="mt-4 text-center">Chargement des participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FFFFFF] rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b bg-[#EFF6FF]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#111827]">
              {isAddingToExisting ? 'Ajouter des participants' : 'Créer un nouveau chat'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-[#E5E7EB] rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          {!isAddingToExisting && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Titre du chat (optionnel)
                </label>
                <input
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder={`Chat - ${entityType}`}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Type de chat
                </label>
                <select
                  value={chatType}
                  onChange={(e) => setChatType(e.target.value as 'group' | 'private')}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="group">Groupe</option>
                  <option value="private">Privé</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Participants sélectionnés */}
        {selectedParticipants.length > 0 && (
          <div className="p-4 bg-[#F9FAFB] border-b">
            <h3 className="text-sm font-medium text-[#374151] mb-2">
              Participants sélectionnés ({selectedParticipants.length})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedParticipants.map(participant => (
                <div
                  key={participant.userId}
                  className="flex items-center space-x-2 bg-[#FFFFFF] px-3 py-2 rounded-lg border"
                >
                  <span className="text-sm font-medium">{`${participant.nom} ${participant.prenom||""}`}</span>
                  <select
                    value={participant.role}
                    onChange={(e) => updateParticipantRole(participant.userId, e.target.value as any)}
                    className="text-xs border-0 bg-transparent focus:outline-none"
                  >
                    <option value="super-admin">Super admin</option>
                    <option value="admin">Admin</option>
                    <option value="responsable">Responsable</option>
                    <option value="participant">Participant</option>
                    <option value="viewer">Observateur</option>
                  </select>
                  <button
                    onClick={() => handleUserToggle({ _id: participant.userId } as Utilisateur)}
                    className="text-[#EF4444] hover:text-[#DC2626]"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recherche */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={20} />
            <input
              type="text"
              placeholder="Rechercher des participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto max-h-96 p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280]">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucun participant disponible</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map(user => {
                const isSelected = selectedParticipants.some(p => p.userId === user._id);
                
                return (
                  <div
                    key={user._id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#EFF6FF] border-2 border-[#BFDBFE]' 
                        : 'bg-[#F9FAFB] hover:bg-[#F3F4F6] border-2 border-transparent'
                    }`}
                    onClick={() => handleUserToggle(user)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-[#3B82F6] border-[#3B82F6]' 
                        : 'border-[#D1D5DB]'
                    }`}>
                      {isSelected && <Check size={16} className="text-[#FFFFFF]" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#111827]">{`${user.nom} ${user.prenom||""}`}</span>
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{getRoleLabel(user.role)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-[#F9FAFB] flex justify-between items-center">
          <div className="text-sm text-[#6B7280]">
            {selectedParticipants.length} participant(s) sélectionné(s)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[#6B7280] bg-[#FFFFFF] border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB]"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateChat}
              disabled={selectedParticipants.length === 0}
              className="px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2563EB] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAddingToExisting ? <UserPlus size={16} /> : <Plus size={16} />}
              <span>
                {isAddingToExisting ? 'Ajouter' : 'Créer le chat'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantSelector;
  
