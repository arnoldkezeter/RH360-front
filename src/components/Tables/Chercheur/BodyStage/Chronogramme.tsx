import { X } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";


type RotationAdvice = {
  valid: boolean;
  errors: string[];
  suggestions: string[];
};


const analyzeRotationFeasibility = (
  groupCount: number,
  serviceCount: number,
  rotationCount: number
): RotationAdvice => {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Règle 1 : un service ne peut accueillir qu'un seul groupe à la fois
  if (groupCount > serviceCount) {
    errors.push(`Il y a ${groupCount} groupes mais seulement ${serviceCount} services disponibles.`);
    suggestions.push(`➕ Ajoutez au moins ${groupCount - serviceCount} service(s) ou ➖ réduisez le nombre de groupes.`);
  }

  // Règle 2 : pour que chaque groupe passe par tous les services
  if (rotationCount < serviceCount) {
    errors.push(`Il n'y a que ${rotationCount} périodes de rotation mais ${serviceCount} services.`);
    suggestions.push(`➕ Prolongez la période de stage pour obtenir au moins ${serviceCount} périodes.`);
  }

  // Résultat final
  return {
    valid: errors.length === 0,
    errors,
    suggestions,
  };
};


// Nouveau composant pour le Chronogramme Modal
interface ChronogrammeModalProps {
  groups: Groupe[];
  services: ServiceGroupAssignment[];
  groupeParams: GroupeParams;
  onClose: () => void;
}



export const ChronogrammeModal: React.FC<ChronogrammeModalProps> = ({ groups, services, groupeParams, onClose }) => {
    
    const lang: string = useSelector((state: RootState) => state.setting.language) || 'fr';

    const getRotationPeriods = (dateDebut: string, dateFin: string, joursRotation: string) => {
        const dates: { start: string; end: string }[] = [];
        let currentStart = new Date(dateDebut);
        const end = new Date(dateFin);
        const rotationInterval = parseInt(joursRotation);

        if (isNaN(rotationInterval) || rotationInterval <= 0) {
            console.error("Invalid joursRotation value. Please provide a positive number.");
            return dates;
        }

        while (currentStart <= end) {
            const periodStart = new Date(currentStart);
            let periodEnd = new Date(currentStart);
            periodEnd.setDate(periodEnd.getDate() + rotationInterval - 1);

            if (periodEnd > end) {
                periodEnd = end;
            }

            dates.push({
                start: periodStart.toISOString().split('T')[0],
                end: periodEnd.toISOString().split('T')[0],
            });

            currentStart.setDate(currentStart.getDate() + rotationInterval);
        }
        return dates;
    };

    const rotationPeriods = useMemo(() =>
        getRotationPeriods(groupeParams.dateDebut, groupeParams.dateFin, groupeParams.joursRotation),
        [groupeParams.dateDebut, groupeParams.dateFin, groupeParams.joursRotation]
    );

    const rotationAdvice = useMemo(() => {
        return analyzeRotationFeasibility(
            groups.length,
            services.length,
            rotationPeriods.length
        );
    }, [groups.length, services.length, rotationPeriods.length]);

    // CRÉATION DE LA LISTE COMPLÈTE DES SERVICES (COMMUNS + FINAUX)
    const allServicesForDisplay = useMemo(() => {
        const sortedServices = [...services].sort((a, b) => {
            const nomA = lang === 'fr' ? a.nomFr : a.nomEn;
            const nomB = lang === 'fr' ? b.nomFr : b.nomEn;
            return nomA.localeCompare(nomB);
        });

        const sortedGroups = [...groups].sort((a, b) => a.id - b.id);

        // Collecter tous les services finaux dans l'ordre des groupes (même s'ils existent déjà en commun)
        const serviceFinalList: any[] = [];
        const addedServiceFinalIds = new Set<string>();

        sortedGroups.forEach(group => {
            if (group.serviceFinal && group.serviceFinal.service) {
                const serviceId = group.serviceFinal.service._id || "";
                if (serviceId && !addedServiceFinalIds.has(serviceId)) {
                    // Ajouter TOUS les services finaux, même s'ils existent en commun
                    serviceFinalList.push({
                        _id: serviceId,
                        nomFr: group.serviceFinal.service.nomFr || "Service Final",
                        nomEn: group.serviceFinal.service.nomEn || "Final Service",
                        isServiceFinal: true, // Marqueur pour identifier les services finaux
                        uniqueId: `${serviceId}_final` // ID unique pour éviter les conflits
                    });
                    addedServiceFinalIds.add(serviceId);
                }
            }
        });

        // Retourner services communs PUIS services finaux
        return [
            ...sortedServices.map(s => ({ ...s, isServiceFinal: false, uniqueId: s._id })), 
            ...serviceFinalList
        ];
    }, [services, groups, lang]);

    // LOGIQUE GÉNÉRIQUE : Système de rotation pour N groupes et N services
    const displayMatrix = useMemo(() => {
        // Structure finale : { [serviceId]: { [groupId]: { periodIndex, period } } }
        const matrix: { 
            [serviceId: string]: { 
                [groupId: number]: { periodIndex: number; period: { start: string; end: string } } | null
            } 
        } = {};

        if (services.length === 0 || groups.length === 0 || rotationPeriods.length === 0) {
            return matrix;
        }

        const sortedServices = [...services].sort((a, b) => {
            const nomA = lang === 'fr' ? a.nomFr : a.nomEn;
            const nomB = lang === 'fr' ? b.nomFr : b.nomEn;
            return nomA.localeCompare(nomB);
        });

        const sortedGroups = [...groups].sort((a, b) => a.id - b.id);

        // Initialiser la matrice avec tous les services (de allServicesForDisplay)
        allServicesForDisplay.forEach(service => {
            const serviceKey = service.uniqueId || service._id || "";
            matrix[serviceKey] = {};
            sortedGroups.forEach(group => {
                matrix[serviceKey][group.id] = null;
            });
        });

        // ÉTAPE 4: Appliquer la logique de rotation pour les services communs
        sortedGroups.forEach((group, groupIndex) => {
            rotationPeriods.forEach((period, periodIndex) => {
                // Calcul du service assigné pour ce groupe à cette période
                // Formule : (periodIndex + groupIndex) % nombreDeServicesCommuns
                const serviceAssignedIndex = (periodIndex + groupIndex) % sortedServices.length;
                const assignedService = sortedServices[serviceAssignedIndex];
                
                // Assigner le groupe au service pour cette période
                matrix[assignedService._id || ""][group.id] = {
                    periodIndex: periodIndex + 1, // Index basé sur 1 pour l'affichage
                    period: {
                        start: period.start,
                        end: period.end
                    }
                };
            });
        });

        // ÉTAPE 5: Ajouter les affectations des services finaux
        sortedGroups.forEach(group => {
            if (group.serviceFinal && group.serviceFinal.service && group.serviceFinal.dateDebut && group.serviceFinal.dateFin) {
                const serviceId = group.serviceFinal.service._id || "";
                const serviceFinalKey = `${serviceId}_final`; // Utiliser la clé unique pour les services finaux
                
                if (serviceFinalKey && matrix[serviceFinalKey]) {
                    matrix[serviceFinalKey][group.id] = {
                        periodIndex: 0, // 0 pour indiquer que c'est une période spéciale (service final)
                        period: {
                            start: group.serviceFinal.dateDebut,
                            end: group.serviceFinal.dateFin
                        }
                    };
                }
            }
        });
        
        console.log("Matrix:", matrix);
        return matrix;
    }, [services, groups, rotationPeriods, lang, allServicesForDisplay]);

    // Fonction pour obtenir la première période où un groupe est assigné à un service
    const getFirstAssignmentForCell = useCallback((serviceKey: string | undefined, groupId: number) => {
        if (!serviceKey) return null;
        return displayMatrix[serviceKey]?.[groupId] || null;
    }, [displayMatrix]);

    // Couleurs pour l'alternance
    const color1 = "#DBEAFE"; // bg-blue-100
    const color2 = "#BFDBFE"; // bg-blue-200

    return (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#ffffff] rounded-lg shadow-xl p-8 w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#6b7280] hover:text-[#1f2937] transition-colors duration-200"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-[#1f2937] mb-6">Chronogramme des Stages</h2>

                {rotationPeriods.length === 0 || groups.length === 0 || allServicesForDisplay.length === 0 ? (
                    <p className="text-center text-[#6b7280] py-10">
                        Veuillez générer des groupes, sélectionner des services et définir toutes les dates/jours de rotation.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#e5e7eb] border border-[#e5e7eb]">
                            <thead className="bg-[#f9fafb]">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider sticky left-0 bg-[#f9fafb] z-10">
                                        Service
                                    </th>
                                    {groups.map(group => (
                                        <th key={group.id} className="px-4 py-2 text-center text-xs font-medium text-[#4b5563] uppercase tracking-wider border-l border-[#e5e7eb]">
                                            {group.nom}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-[#ffffff] divide-y divide-[#e5e7eb]">
                                {allServicesForDisplay.map((service, serviceIndex) => (
                                    <tr key={service.uniqueId || service._id || serviceIndex} className={service.isServiceFinal ? "bg-green-50" : ""}>
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-[#1f2937] sticky left-0 bg-inherit z-10 border-r border-[#e5e7eb]">
                                            <div className="flex items-center gap-2">
                                                {service.isServiceFinal && (
                                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Service Final"></span>
                                                )}
                                                <span>{lang === 'fr' ? service?.nomFr : service?.nomEn}</span>
                                                {service.isServiceFinal && (
                                                    <span className="text-xs text-green-600 font-medium">(Final)</span>
                                                )}
                                            </div>
                                        </td>
                                        {groups.map((group, groupIndex) => {
                                            const cellColor = service.isServiceFinal 
                                                ? "#F0FDF4" // Couleur spéciale pour les services finaux
                                                : (serviceIndex + groupIndex) % 2 === 0 ? color1 : color2;
                                            
                                            // Récupérer l'affectation pour cette cellule (service, groupe)
                                            const cellAssignment = getFirstAssignmentForCell(service.uniqueId || service._id, group.id);

                                            return (
                                                <td
                                                    key={`${service.uniqueId || service._id}-${group.id}`}
                                                    className="px-4 py-3 border-l border-[#e5e7eb] text-sm text-[#374151] text-center"
                                                    style={{ backgroundColor: cellColor }}
                                                >
                                                    {cellAssignment ? (
                                                        <>
                                                            <div className="font-semibold">{cellAssignment.period.start}</div>
                                                            <div className="text-xs text-[#6b7280]">à {cellAssignment.period.end}</div>
                                                            {cellAssignment.periodIndex > 0 ? (
                                                                <div className="text-xs text-[#9ca3af]">P{cellAssignment.periodIndex}</div>
                                                            ) : (
                                                                <div className="text-xs text-green-600 font-medium">Service Final</div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-[#9ca3af]">N/A</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!rotationAdvice.valid && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">⚠️ Problème de configuration</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {rotationAdvice.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                        <div className="mt-2 text-sm italic text-yellow-700">
                            Suggestions :
                            <ul className="list-disc pl-5 mt-1">
                                {rotationAdvice.suggestions.map((sugg, i) => (
                                    <li key={i}>{sugg}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Informations sur la rotation */}
                <div className="mt-8 p-4 bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
                    <h3 className="text-lg font-semibold text-[#374151] mb-2">Informations sur la rotation</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#4b5563]">
                        <div><strong>Nombre de groupes:</strong> {groups.length}</div>
                        <div><strong>Services communs:</strong> {services.length}</div>
                        <div><strong>Services finaux:</strong> {allServicesForDisplay.filter(s => s.isServiceFinal).length}</div>
                        <div><strong>Nombre de périodes:</strong> {rotationPeriods.length}</div>
                        <div><strong>Jours par rotation:</strong> {groupeParams.joursRotation}</div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-[#374151] mb-2">Logique de rotation:</h4>
                        <p className="text-sm text-[#4b5563]">
                            Chaque groupe suit un cycle de rotation à travers tous les services communs disponibles. 
                            Le décalage entre les groupes assure qu'ils ne sont jamais dans le même service en même temps.
                            Les services finaux sont affichés séparément avec leurs dates spécifiques.
                            {groups.length > services.length && (
                                <span className="text-amber-600 font-medium">
                                    {" "}⚠️ Attention: Vous avez plus de groupes ({groups.length}) que de services communs ({services.length}). 
                                    Certains groupes pourraient partager des services durant certaines périodes.
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#ef4444] text-[#ffffff] rounded-lg hover:bg-[#dc2626] transition-colors duration-200"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};