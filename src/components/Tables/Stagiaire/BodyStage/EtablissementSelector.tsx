import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  UserPlus,
  Info,
  UserCheck,
  Calendar,
  Building,
  Shuffle,
  Clock,
  Settings,
  RotateCcw,
  MapPin,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getStagiairesByEtablissements } from '../../../../services/stagiaires/stagiaireAPI';
import FilterList from '../../../ui/AutoComplete';
import { useTranslation } from 'react-i18next';

// Interfaces

interface StagiairesByEtablissementData {
  etablissement: Etablissement;
  stagiaires: Stagiaire[];
}

interface EtablissementSelectorProps {
  lang: string;
  onSearchEtablissement: (search: string) => Promise<Etablissement[]>;
  onStagiairesSelected: (stagiaires: Stagiaire[], ids: string[]) => void;
  selectedStagiaireIds: string[];
  pageIsLoading?: boolean;
}

// Palette de couleurs hexadécimales
const colors = {
  // Backgrounds
  bgGray50: '#F9FAFB',
  bgGray800: '#1F2937',
  bgGray700: '#374151',
  bgGray900: '#111827',
  bgWhite: '#FFFFFF',
  bgBlue100: '#DBEAFE',
  bgBlue900: '#1E3A8A',
  bgBlue200: '#BFDBFE',
  bgBlue800: '#1E40AF',
  bgGreen600: '#059669',
  bgGreen700: '#047857',
  
  // Text colors
  textGray700: '#374151',
  textGray300: '#D1D5DB',
  textGray400: '#9CA3AF',
  textGray600: '#4B5563',
  textGray500: '#6B7280',
  textBlue700: '#1D4ED8',
  textBlue300: '#93C5FD',
  textBlue600: '#2563EB',
  textBlue400: '#60A5FA',
  textBlue500: '#3B82F6',
  textGray900: '#111827',
  textWhite: '#FFFFFF',
  textGreen600: '#059669',
  textGreen400: '#34D399',
  
  // Border colors
  borderGray200: '#E5E7EB',
  borderGray700: '#374151',
  borderGray300: '#D1D5DB',
  borderGray600: '#4B5563',
  
  // Hover colors
  hoverGray50: '#F9FAFB',
  hoverGray800: '#1F2937',
  hoverBlue200: '#BFDBFE',
  hoverBlue800: '#1E40AF',
  hoverGreen700: '#047857',
  hoverWhite: '#FFFFFF',
  hoverGray900: '#111827',
  
  // Ring colors
  ringBlue500: '#3B82F6',
};

// Composant pour la sélection par établissement
const EtablissementSelector: React.FC<EtablissementSelectorProps> = ({ 
  lang, 
  onSearchEtablissement, 
  onStagiairesSelected,
  selectedStagiaireIds,
  pageIsLoading 
}) => {
  const [selectedEtablissements, setSelectedEtablissements] = useState<Etablissement[]>([]);
  const [stagiairesByEtablissement, setStagiairesByEtablissement] = useState<Record<string, StagiairesByEtablissementData>>({});
  const [isLoadingStagiaires, setIsLoadingStagiaires] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [expandedEtablissements, setExpandedEtablissements] = useState<Set<string>>(new Set());
  const {t}= useTranslation();

  // Charger les stagiaires quand les établissements changent
  useEffect(() => {
    if (selectedEtablissements.length > 0) {
      loadStagiaires();
    } else {
      setStagiairesByEtablissement({});
      setTempSelectedIds([]);
    }
  }, [selectedEtablissements]);

  const loadStagiaires = async (): Promise<void> => {
    setIsLoadingStagiaires(true);
    try {
      const etablissementIds = selectedEtablissements.map(e => e._id!);
      
      const response = await getStagiairesByEtablissements({
        etablissementIds,
        lang
      });
      setStagiairesByEtablissement(response.stagiairesByEtablissement);
      
      // Expand tous les établissements par défaut
      setExpandedEtablissements(new Set(Object.keys(response.stagiairesByEtablissement)));
    } catch (error) {
      console.error('Erreur chargement stagiaires:', error);
    } finally {
      setIsLoadingStagiaires(false);
    }
  };

  const handleEtablissementSelect = (etablissement: Etablissement | string): void => {
    if (typeof etablissement === 'string') return;
    if (!selectedEtablissements.find(e => e._id === etablissement._id)) {
      setSelectedEtablissements([...selectedEtablissements, etablissement]);
    }
  };

  const handleEtablissementRemove = (etablissementId: string): void => {
    setSelectedEtablissements(selectedEtablissements.filter(e => e._id !== etablissementId));
    
    // Retirer les stagiaires de cet établissement de la sélection temporaire
    const stagiaireIdsToRemove = stagiairesByEtablissement[etablissementId]?.stagiaires.map(s => s._id) || [];
    setTempSelectedIds(tempSelectedIds.filter(id => !stagiaireIdsToRemove.includes(id)));
  };

  const handleStagiaireToggle = (stagiaireId: string): void => {
    if (tempSelectedIds.includes(stagiaireId)) {
      setTempSelectedIds(tempSelectedIds.filter(id => id !== stagiaireId));
    } else {
      setTempSelectedIds([...tempSelectedIds, stagiaireId]);
    }
  };

  const handleSelectAllInEtablissement = (etablissementId: string): void => {
    const stagiaires = stagiairesByEtablissement[etablissementId]?.stagiaires || [];
    const stagiaireIds = stagiaires.map(s => s._id);
    
    const allSelected = stagiaireIds.every(id => tempSelectedIds.includes(id!));
    
    if (allSelected) {
      // Désélectionner tous
      setTempSelectedIds(tempSelectedIds.filter(id => !stagiaireIds.includes(id)));
    } else {
      // Sélectionner tous
      const newIds = [...tempSelectedIds];
      stagiaireIds.forEach(id => {
        if (!newIds.includes(id!)) {
          newIds.push(id!);
        }
      });
      setTempSelectedIds(newIds);
    }
  };

  const handleValidateSelection = (): void => {
    // Récupérer tous les stagiaires sélectionnés
    const selectedStagiaires: Stagiaire[] = [];
    Object.values(stagiairesByEtablissement).forEach(({ stagiaires }) => {
      stagiaires.forEach(stagiaire => {
        if (tempSelectedIds.includes(stagiaire._id!)) {
          selectedStagiaires.push(stagiaire);
        }
      });
    });
    
    onStagiairesSelected(selectedStagiaires, tempSelectedIds);
    
    // Réinitialiser
    setSelectedEtablissements([]);
    setTempSelectedIds([]);
    setStagiairesByEtablissement({});
  };

  const toggleEtablissement = (etablissementId: string): void => {
    const newExpanded = new Set(expandedEtablissements);
    if (newExpanded.has(etablissementId)) {
      newExpanded.delete(etablissementId);
    } else {
      newExpanded.add(etablissementId);
    }
    setExpandedEtablissements(newExpanded);
  };

  const filterStagiaires = (stagiaires: Stagiaire[]): Stagiaire[] => {
    if (!searchTerm) return stagiaires;
    return stagiaires.filter(s => 
      `${s.nom} ${s.prenom || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: colors.bgGray50,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.borderGray200}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h4 style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: colors.textGray700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Building style={{ width: '1rem', height: '1rem', color: colors.textBlue500 }} />
        {t("label.selection_etablissement")}
      </h4>

      {/* Recherche d'établissement */}
      <div style={{ position: 'relative' }}>
        <FilterList
          items={[]}
          placeholder={t('recherche.rechercher') + t('recherche.etablissement')}
          displayProperty={(item: Etablissement) => lang === 'fr' ? item.nomFr : item.nomEn}
          onSelect={handleEtablissementSelect}
          enableBackendSearch={true}
          onSearch={onSearchEtablissement}
          searchDelay={300}
          minSearchLength={2}
        />
      </div>

      {/* Établissements sélectionnés */}
      {selectedEtablissements.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {selectedEtablissements.map((etablissement) => (
            <div
              key={etablissement._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: colors.bgBlue100,
                color: colors.textBlue700,
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}
            >
              <span>{lang === 'fr' ? etablissement.nomFr : etablissement.nomEn}</span>
              <button
                onClick={() => handleEtablissementRemove(etablissement._id!)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.125rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBlue200}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Retirer l'établissement"
              >
                <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Liste des stagiaires par établissement */}
      {isLoadingStagiaires ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 0'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: `2px solid ${colors.borderGray200}`,
            borderTopColor: colors.textBlue500,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{
            marginLeft: '0.75rem',
            color: colors.textGray600
          }}>{t("label.chargement...")}</span>
        </div>
      ) : Object.keys(stagiairesByEtablissement).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Barre de recherche dans la liste */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textGray400,
              width: '1rem',
              height: '1rem',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('recherche.rechercher') + t('recherche.stagiaire')}
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: `1px solid ${colors.borderGray300}`,
                borderRadius: '0.5rem',
                backgroundColor: colors.bgWhite,
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.ringBlue500}`;
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = colors.borderGray300;
              }}
            />
          </div>

          {Object.entries(stagiairesByEtablissement).map(([etablissementId, { etablissement, stagiaires }]) => {
            const filteredStagiaires = filterStagiaires(stagiaires);
            const selectedCount = filteredStagiaires.filter(s => tempSelectedIds.includes(s._id!)).length;
            const isExpanded = expandedEtablissements.has(etablissementId);
            
            return (
              <div key={etablissementId} style={{
                border: `1px solid ${colors.borderGray200}`,
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                {/* En-tête de l'établissement */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: colors.bgWhite,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => toggleEtablissement(etablissementId)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverGray50}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.bgWhite}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isExpanded ? 
                      <ChevronUp style={{ width: '1rem', height: '1rem' }} /> : 
                      <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                    }
                    <Building style={{ width: '1rem', height: '1rem', color: colors.textBlue500 }} />
                    <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                      {lang === 'fr' ? etablissement.nomFr : etablissement.nomEn}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: colors.textGray500 }}>
                      ({selectedCount}/{filteredStagiaires.length})
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllInEtablissement(etablissementId);
                    }}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: colors.bgBlue100,
                      color: colors.textBlue600,
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBlue200}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.bgBlue100}
                  >
                    {selectedCount === filteredStagiaires.length ? t("label.unselect_all") : t("label.select_all")}
                  </button>
                </div>

                {/* Liste des stagiaires */}
                {isExpanded && (
                  <div style={{
                    maxHeight: '16rem',
                    overflowY: 'auto',
                    backgroundColor: colors.bgGray50
                  }}>
                    {filteredStagiaires.length === 0 ? (
                      <div style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: colors.textGray500,
                        fontSize: '0.875rem'
                      }}>
                        {t("label.aucun_stagiaire")}
                      </div>
                    ) : (
                      filteredStagiaires.map((stagiaire) => {
                        const isSelected = tempSelectedIds.includes(stagiaire._id!);
                        const isAlreadyAdded = selectedStagiaireIds.includes(stagiaire._id!);
                        
                        return (
                          <div
                            key={stagiaire._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem',
                              borderBottom: `1px solid ${colors.borderGray200}`,
                              cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                              opacity: isAlreadyAdded ? 0.5 : 1,
                              transition: 'background-color 0.2s'
                            }}
                            onClick={() => !isAlreadyAdded && handleStagiaireToggle(stagiaire._id!)}
                            onMouseEnter={(e) => {
                              if (!isAlreadyAdded) {
                                e.currentTarget.style.backgroundColor = colors.hoverWhite;
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {isSelected ? (
                              <CheckSquare style={{
                                width: '1.25rem',
                                height: '1.25rem',
                                color: colors.textBlue500,
                                flexShrink: 0
                              }} />
                            ) : (
                              <Square style={{
                                width: '1.25rem',
                                height: '1.25rem',
                                color: colors.textGray400,
                                flexShrink: 0
                              }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: colors.textGray900,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {stagiaire.nom} {stagiaire.prenom}
                              </p>
                              {stagiaire.parcours && stagiaire.parcours.length > 0 && (
                                <p style={{
                                  fontSize: '0.75rem',
                                  color: colors.textGray500,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {stagiaire.parcours[0].niveau} - {stagiaire.parcours[0].filiere}
                                </p>
                              )}
                            </div>
                            {isAlreadyAdded && (
                              <span style={{
                                fontSize: '0.75rem',
                                color: colors.textGreen600,
                                flexShrink: 0
                              }}>
                                {t("label.deja_ajoute")}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bouton de validation */}
          <button
            onClick={handleValidateSelection}
            disabled={tempSelectedIds.length === 0}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: tempSelectedIds.length === 0 ? colors.bgGray700 : colors.bgGreen600,
              color: colors.textWhite,
              borderRadius: '0.5rem',
              fontWeight: '500',
              border: 'none',
              cursor: tempSelectedIds.length === 0 ? 'not-allowed' : 'pointer',
              opacity: tempSelectedIds.length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (tempSelectedIds.length > 0) {
                e.currentTarget.style.backgroundColor = colors.hoverGreen700;
              }
            }}
            onMouseLeave={(e) => {
              if (tempSelectedIds.length > 0) {
                e.currentTarget.style.backgroundColor = colors.bgGreen600;
              }
            }}
          >
            <UserPlus style={{ width: '1rem', height: '1rem' }} />
            {t("button.valider_selection")} ({tempSelectedIds.length} {t('label.stagiaire')}{tempSelectedIds.length > 1 ? 's' : ''})
          </button>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default EtablissementSelector;