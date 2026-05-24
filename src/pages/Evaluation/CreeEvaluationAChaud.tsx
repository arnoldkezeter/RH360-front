// pages/EvaluationManager.tsx
import { useEffect, useRef, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp, FileText, Settings, RefreshCw } from 'lucide-react';
import { useFetchData } from '../../hooks/fechDataOptions';
import { getGroupedEchelleReponseByType } from '../../services/evaluations/echelleReponseAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../_redux/store';
import { setEchelleReponseLoading, setErrorPageEchelleReponse } from '../../_redux/features/evaluations/echelleReponseSlice';
import {
    createEvaluationChaudSlice,
    setErrorPageEvaluationChaud,
    setEvaluationChaudLoading,
    setEvaluationChauds,
    updateEvaluationChaudSlice,
} from '../../_redux/features/evaluations/evaluationChaudSlice';
import {
    createEvaluationAChaud,
    getFilteredEvaluations,
    updateEvaluationAChaud,
    exportFichePDF,
    getEvaluationConfig,
    updateEvaluationConfig,
    regenerateRubriques,
    addObjectifPersonnalise,
    removeObjectifPersonnalise,
} from '../../services/evaluations/evaluationChaudAPI';
import InputSearch from '../../components/Tables/common/SearchTable';
import { FaFilter, FaSort } from 'react-icons/fa';
import Pagination from '../../components/Pagination/Pagination';
import createToast from '../../hooks/toastify';
import FilterList from '../../components/ui/AutoComplete';
import { getFilteredThemeFormations, getThemeById } from '../../services/elaborations/themeFormationAPI';
import { getQueryParam, truncateText } from '../../fonctions/fonction';
import { NoData } from '../../components/NoData';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import FormDelete from '../../components/Modals/Evaluation/ModalEvaluationAChaud/FormDelete';
import { setShowModalDelete } from '../../_redux/features/setting';
import Skeleton from 'react-loading-skeleton';
import { getRubriquesStatiques } from '../../services/evaluations/rubriqueStatiqueAPI';
import { getObjectifThemeForDropDown } from '../../services/elaborations/objectifThemeAPI';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES LOCAUX
// ═══════════════════════════════════════════════════════════════════════════════

interface ObjectifForm {
    _id?: string;
    libelleFr: string;
    libelleEn: string;
    ordre: number;
    isPersonnalise?: boolean;
}

interface SousQuestionForm {
    id?: string;
    libelleFr: string;
    libelleEn: string;
    commentaireObligatoire: boolean;
    ordre: number;
}

interface QuestionForm {
    code?: string;
    libelleFr: string;
    libelleEn: string;
    typeQuestion: 'simple' | 'avec_sous_questions' | 'texte_libre';
    typeEchelleId?: string | null;          
    typeEchelle?: TypeEchelleReponse | null;
    sousQuestions: SousQuestionForm[];
    commentaireGlobal: boolean;
    ordre: number;
    isPersonnalisee?: boolean;
}

interface RubriquePersoForm {
    titreFr: string;
    titreEn: string;
    ordre: number;
    questions: QuestionForm[];
}

interface EvaluationForm {
    titreFr: string;
    titreEn: string;
    theme?: ThemeFormation;
    descriptionFr: string;
    descriptionEn: string;
    dateFormation?: string;
    actif: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOUS-COMPOSANTS POUR PERSONNALISATION
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// Éditeur de rubrique personnalisée avec gestion complète des questions
// ═══════════════════════════════════════════════════════════════════════════════

function RubriquePersonnaliseeEditor({
    rubrique,
    index,
    echellesReponses,
    lang,
    onUpdate,
    onDelete,
}: {
    rubrique: RubriquePersoForm;
    index: number;
    echellesReponses: any[];
    lang: string;
    onUpdate: (rubrique: RubriquePersoForm) => void;
    onDelete: () => void;
}) {
    const [ouvert, setOuvert] = useState(true);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    
    // Nouvelle question temporaire
    const [newQuestion, setNewQuestion] = useState({
        libelleFr: '',
        libelleEn: '',
        typeQuestion: 'simple' as const,
        typeEchelleId: '',
        commentaireGlobal: false,
        sousQuestions: [] as any[],
    });
    
    // État pour l'ajout de sous-question
    const [showSousQuestionForm, setShowSousQuestionForm] = useState<number | null>(null);
    const [newSousQuestion, setNewSousQuestion] = useState({
        libelleFr: '',
        libelleEn: '',
        commentaireObligatoire: false,
    });

    const handleAddQuestion = () => {
        if (!newQuestion.libelleFr.trim()) {
            createToast('Le libellé est requis', '', 2);
            return;
        }
        
        const questionToAdd = {
            code: `perso_q_${Date.now()}`,
            libelleFr: newQuestion.libelleFr,
            libelleEn: newQuestion.libelleEn,
            typeQuestion: newQuestion.typeQuestion,
            echelles: newQuestion.typeEchelleId ? [newQuestion.typeEchelleId] : [],
            commentaireGlobal: newQuestion.commentaireGlobal,
            ordre: rubrique.questions.length + 1,
            sousQuestions: newQuestion.sousQuestions || [],
        };
        
        onUpdate({
            ...rubrique,
            questions: [...rubrique.questions, questionToAdd],
        });
        
        setShowAddQuestion(false);
        setNewQuestion({
            libelleFr: '',
            libelleEn: '',
            typeQuestion: 'simple',
            typeEchelleId: '',
            commentaireGlobal: false,
            sousQuestions: [],
        });
    };

    const handleUpdateQuestion = (qIndex: number, updates: any) => {
        const newQuestions = [...rubrique.questions];
        newQuestions[qIndex] = { ...newQuestions[qIndex], ...updates };
        onUpdate({ ...rubrique, questions: newQuestions });
    };

    const handleDeleteQuestion = (qIndex: number) => {
        const newQuestions = rubrique.questions.filter((_, i) => i !== qIndex);
        onUpdate({ ...rubrique, questions: newQuestions });
    };

    const handleAddSousQuestion = (qIndex: number) => {
        if (!newSousQuestion.libelleFr.trim()) {
            createToast('Le libellé de la sous-question est requis', '', 2);
            return;
        }
        
        const newQuestions = [...rubrique.questions];
        const currentSousQuestions = newQuestions[qIndex].sousQuestions || [];
        newQuestions[qIndex].sousQuestions = [
            ...currentSousQuestions,
            {
                id: `temp_sq_${Date.now()}`,
                libelleFr: newSousQuestion.libelleFr,
                libelleEn: newSousQuestion.libelleEn,
                commentaireObligatoire: newSousQuestion.commentaireObligatoire,
                ordre: currentSousQuestions.length + 1,
            },
        ];
        onUpdate({ ...rubrique, questions: newQuestions });
        
        setShowSousQuestionForm(null);
        setNewSousQuestion({ libelleFr: '', libelleEn: '', commentaireObligatoire: false });
    };

    const handleUpdateSousQuestion = (qIndex: number, sqIndex: number, updates: any) => {
        const newQuestions = [...rubrique.questions];
        newQuestions[qIndex].sousQuestions[sqIndex] = {
            ...newQuestions[qIndex].sousQuestions[sqIndex],
            ...updates,
        };
        onUpdate({ ...rubrique, questions: newQuestions });
    };

    const handleDeleteSousQuestion = (qIndex: number, sqIndex: number) => {
        const newQuestions = [...rubrique.questions];
        newQuestions[qIndex].sousQuestions = newQuestions[qIndex].sousQuestions.filter((_, i) => i !== sqIndex);
        onUpdate({ ...rubrique, questions: newQuestions });
    };

    return (
        <div className="border border-[#fed7aa] rounded-lg overflow-hidden">
            {/* En-tête */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#fff7ed] border-b border-[#fed7aa]">
                <span className="text-xs font-bold text-[#9a3412] bg-[#ffedd5] px-2 py-0.5 rounded">
                    Rubrique {5 + index}
                </span>
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={rubrique.titreFr}
                        onChange={(e) => onUpdate({ ...rubrique, titreFr: e.target.value })}
                        placeholder="Titre de la rubrique (FR) *"
                        className="flex-1 text-sm font-semibold border border-[#fdba74] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    />
                    <input
                        type="text"
                        value={rubrique.titreEn}
                        onChange={(e) => onUpdate({ ...rubrique, titreEn: e.target.value })}
                        placeholder="Title (EN)"
                        className="flex-1 text-sm border border-[#fdba74] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setOuvert(!ouvert)}
                    className="p-1 text-[#9a3412] hover:bg-[#ffedd5] rounded"
                >
                    {ouvert ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 text-[#f87171] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {ouvert && (
                <div className="p-4 space-y-4 bg-white">
                    {/* Liste des questions existantes */}
                    {rubrique.questions.map((question, qIdx) => (
                        <div key={qIdx} className="p-3 border border-[#f3f4f6] rounded-lg bg-[#fafafa]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#1f2937">
                                    Question {qIdx + 1}: {question.libelleFr || '(sans titre)'}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditingQuestionIndex(editingQuestionIndex === qIdx ? null : qIdx)}
                                        className="p-1 text-[#2563eb] hover:bg-[#eff6ff] rounded"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(qIdx)}
                                        className="p-1 text-[#f87171] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Édition de la question */}
                            {editingQuestionIndex === qIdx && (
                                <div className="mt-3 space-y-3 pl-3 border-l-2 border-[#fed7aa]">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={question.libelleFr}
                                            onChange={(e) => handleUpdateQuestion(qIdx, { libelleFr: e.target.value })}
                                            placeholder="Libellé (FR)"
                                            className="text-sm border border-[#d1d5db] rounded px-2 py-1"
                                        />
                                        <input
                                            type="text"
                                            value={question.libelleEn}
                                            onChange={(e) => handleUpdateQuestion(qIdx, { libelleEn: e.target.value })}
                                            placeholder="Label (EN)"
                                            className="text-sm border border-[#d1d5db] rounded px-2 py-1"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={question.typeQuestion}
                                            onChange={(e) => handleUpdateQuestion(qIdx, { typeQuestion: e.target.value as any })}
                                            className="text-sm border border-[#d1d5db] rounded px-2 py-1"
                                        >
                                            <option value="simple">Question simple</option>
                                            <option value="avec_sous_questions">Avec sous-questions</option>
                                            <option value="texte_libre">Texte libre</option>
                                        </select>
                                        
                                        {question.typeQuestion !== 'texte_libre' && (
                                            <select
                                                value={question.typeEchelleId || ''}
                                                onChange={(e) => handleUpdateQuestion(qIdx, { typeEchelleId: e.target.value })}
                                                className="text-sm border border-[#d1d5db] rounded px-2 py-1"
                                            >
                                                <option value="">Sans échelle</option>
                                                {echellesReponses.map((type: any) => (
                                                    <option key={type.idType} value={type.idType}>
                                                        {type.nomType}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={question.commentaireGlobal}
                                            onChange={(e) => handleUpdateQuestion(qIdx, { commentaireGlobal: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-xs text-[#6b7280]">Autoriser un commentaire global</span>
                                    </label>

                                    {/* Sous-questions */}
                                    {(question.typeQuestion === 'avec_sous_questions' || question.sousQuestions?.length > 0) && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-[#6b7280]">Sous-questions</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSousQuestionForm(showSousQuestionForm === qIdx ? null : qIdx)}
                                                    className="text-xs text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Ajouter une sous-question
                                                </button>
                                            </div>

                                            {question.sousQuestions?.map((sq, sqIdx) => (
                                                <div key={sq.id || sqIdx} className="flex items-start gap-2 p-2 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={sq.libelleFr}
                                                            onChange={(e) => handleUpdateSousQuestion(qIdx, sqIdx, { libelleFr: e.target.value })}
                                                            placeholder="Sous-question (FR)"
                                                            className="text-xs border border-[#d1d5db] rounded px-2 py-1"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={sq.libelleEn}
                                                            onChange={(e) => handleUpdateSousQuestion(qIdx, sqIdx, { libelleEn: e.target.value })}
                                                            placeholder="Sub-question (EN)"
                                                            className="text-xs border border-[#d1d5db] rounded px-2 py-1"
                                                        />
                                                    </div>
                                                    <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={sq.commentaireObligatoire}
                                                            onChange={(e) => handleUpdateSousQuestion(qIdx, sqIdx, { commentaireObligatoire: e.target.checked })}
                                                            className="rounded"
                                                        />
                                                        <span className="text-[#6b7280]">Commentaire obligatoire</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSousQuestion(qIdx, sqIdx)}
                                                        className="p-1 text-[#f87171] hover:text-[#dc2626]"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {showSousQuestionForm === qIdx && (
                                                <div className="p-3 border border-[#bfdbfe] rounded-lg bg-[#eff6ff] space-y-2">
                                                    <input
                                                        type="text"
                                                        value={newSousQuestion.libelleFr}
                                                        onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleFr: e.target.value }))}
                                                        placeholder="Libellé de la sous-question (FR)"
                                                        className="w-full text-sm border border-[#93c5fd] rounded px-2 py-1"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={newSousQuestion.libelleEn}
                                                        onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleEn: e.target.value }))}
                                                        placeholder="Label (EN)"
                                                        className="w-full text-sm border border-[#93c5fd] rounded px-2 py-1"
                                                    />
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={newSousQuestion.commentaireObligatoire}
                                                            onChange={(e) => setNewSousQuestion(prev => ({ ...prev, commentaireObligatoire: e.target.checked }))}
                                                            className="rounded"
                                                        />
                                                        <span className="text-xs text-[#6b7280]">Commentaire obligatoire</span>
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAddSousQuestion(qIdx)}
                                                            className="flex-1 bg-[#2563eb] text-white px-2 py-1 rounded text-sm"
                                                        >
                                                            Ajouter
                                                        </button>
                                                        <button
                                                            onClick={() => setShowSousQuestionForm(null)}
                                                            className="flex-1 border border-[#d1d5db] px-2 py-1 rounded text-sm"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Bouton ajouter question */}
                    <button
                        type="button"
                        onClick={() => setShowAddQuestion(!showAddQuestion)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-[#fdba74] rounded-lg text-[#ea580c] hover:bg-[#fff7ed] transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter une question
                    </button>

                    {/* Formulaire ajout question */}
                    {showAddQuestion && (
                        <div className="p-3 border border-[#fdba74] rounded-lg bg-[#fff7ed] space-y-3">
                            <input
                                type="text"
                                value={newQuestion.libelleFr}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, libelleFr: e.target.value }))}
                                placeholder="Libellé de la question (FR)"
                                className="w-full text-sm border border-[#fdba74] rounded px-3 py-1.5 bg-white"
                            />
                            <input
                                type="text"
                                value={newQuestion.libelleEn}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, libelleEn: e.target.value }))}
                                placeholder="Label (EN)"
                                className="w-full text-sm border border-[#fdba74] rounded px-3 py-1.5 bg-white"
                            />
                            <select
                                value={newQuestion.typeQuestion}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, typeQuestion: e.target.value as any }))}
                                className="w-full text-sm border border-[#fdba74] rounded px-3 py-1.5 bg-white"
                            >
                                <option value="simple">Question simple</option>
                                <option value="avec_sous_questions">Avec sous-questions</option>
                                <option value="texte_libre">Texte libre</option>
                            </select>
                            <select
                                value={newQuestion.typeEchelleId}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, typeEchelleId: e.target.value }))}
                                className="w-full text-sm border border-[#fdba74] rounded px-3 py-1.5 bg-white"
                            >
                                <option value="">Sans échelle (texte libre)</option>
                                {echellesReponses.map((type: any) => (
                                    <option key={type.idType} value={type.idType}>
                                        {type.nomType}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddQuestion}
                                    className="flex-1 bg-[#ea580c] text-white px-3 py-1.5 rounded text-sm hover:bg-[#c2410c]"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={() => setShowAddQuestion(false)}
                                    className="flex-1 border border-[#d1d5db] px-3 py-1.5 rounded text-sm hover:bg-[#f9fafb]"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
// ═══════════════════════════════════════════════════════════════════════════════
// Éditeur de question avec gestion des sous-questions
// ═══════════════════════════════════════════════════════════════════════════════

function QuestionEditor({
    question,
    index,
    isPersonnalisee,
    echellesReponses,
    lang,
    onUpdate,
    onDelete,
    onAddSousQuestion,
    onUpdateSousQuestion,
    onDeleteSousQuestion,
}: {
    question: any;
    index: number;
    isPersonnalisee: boolean;
    echellesReponses: any[];
    lang: string;
    onUpdate: (updates: any) => void;
    onDelete: () => void;
    onAddSousQuestion: () => void;
    onUpdateSousQuestion: (sousIndex: number, updates: any) => void;
    onDeleteSousQuestion: (sousIndex: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSousQuestionForm, setShowSousQuestionForm] = useState(false);
    const [newSousQuestion, setNewSousQuestion] = useState({
        libelleFr: '',
        libelleEn: '',
        commentaireObligatoire: false,
    });

    const handleAddSousQuestion = () => {
        if (!newSousQuestion.libelleFr.trim()) {
            createToast('Le libellé de la sous-question est requis', '', 2);
            return;
        }
        onAddSousQuestion();
        setNewSousQuestion({ libelleFr: '', libelleEn: '', commentaireObligatoire: false });
        setShowSousQuestionForm(false);
    };

    return (
        <div className={`p-3 rounded-lg border ${isPersonnalisee ? 'border-[#fed7aa] bg-[#fff7ed]' : 'border-[#f3f4f6] bg-white'} hover:shadow-sm transition-shadow`}>
            <div className="flex items-start justify-between">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-left flex-1"
                >
                    <span className="text-sm font-medium text-[#1f2937]">
                        {index + 1}. {question.libelleFr || `Question ${index + 1}`}
                    </span>
                    {isPersonnalisee && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#fed7aa] text-[#9a3412]">personnalisée</span>
                    )}
                    {question.sousQuestions?.length > 0 && (
                        <span className="text-xs text-[#6b7280]">({question.sousQuestions.length} sous-question(s))</span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#9ca3af]" /> : <ChevronDown className="w-4 h-4 text-[#9ca3af]" />}
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 text-[#f87171] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {isOpen && (
                <div className="mt-3 pl-4 space-y-3 border-l-2 border-[#e5e7eb]">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={question.libelleFr}
                            onChange={(e) => onUpdate({ libelleFr: e.target.value })}
                            placeholder="Libellé (FR)"
                            className="text-sm border border-[#d1d5db] rounded px-2 py-1 focus:ring-2 focus:ring-[#3b82f6]"
                        />
                        <input
                            type="text"
                            value={question.libelleEn}
                            onChange={(e) => onUpdate({ libelleEn: e.target.value })}
                            placeholder="Label (EN)"
                            className="text-sm border border-[#d1d5db] rounded px-2 py-1 focus:ring-2 focus:ring-[#3b82f6]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <select
                            value={question.typeQuestion}
                            onChange={(e) => onUpdate({ typeQuestion: e.target.value })}
                            className="text-sm border border-[#d1d5db] rounded px-2 py-1 focus:ring-2 focus:ring-[#3b82f6]"
                        >
                            <option value="simple">Question simple</option>
                            <option value="avec_sous_questions">Avec sous-questions</option>
                            <option value="texte_libre">Texte libre</option>
                        </select>

                        {question.typeQuestion !== 'texte_libre' && (
                            <select
                                value={question.typeEchelleId || ''}
                                onChange={(e) => onUpdate({ typeEchelleId: e.target.value })}
                                className="text-sm border border-[#d1d5db] rounded px-2 py-1 focus:ring-2 focus:ring-[#3b82f6]"
                            >
                                <option value="">Sans échelle</option>
                                {echellesReponses.map((type: any) => (
                                    <option key={type.idType} value={type.idType}>
                                        {type.nomType}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={question.commentaireGlobal}
                            onChange={(e) => onUpdate({ commentaireGlobal: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-xs text-[#6b7280]">Autoriser un commentaire global</span>
                    </label>

                    {(question.typeQuestion === 'avec_sous_questions' || question.sousQuestions?.length > 0) && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#6b7280]">Sous-questions</span>
                                <button
                                    type="button"
                                    onClick={() => setShowSousQuestionForm(!showSousQuestionForm)}
                                    className="text-xs text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Ajouter
                                </button>
                            </div>

                            {question.sousQuestions?.map((sq: any, sqIdx: number) => (
                                <div key={sq.id || sqIdx} className="flex items-start gap-2 p-2 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={sq.libelleFr}
                                            onChange={(e) => onUpdateSousQuestion(sqIdx, { libelleFr: e.target.value })}
                                            placeholder="Sous-question (FR)"
                                            className="text-xs border border-[#d1d5db] rounded px-2 py-1"
                                        />
                                        <input
                                            type="text"
                                            value={sq.libelleEn}
                                            onChange={(e) => onUpdateSousQuestion(sqIdx, { libelleEn: e.target.value })}
                                            placeholder="Sub-question (EN)"
                                            className="text-xs border border-[#d1d5db] rounded px-2 py-1"
                                        />
                                    </div>
                                    <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={sq.commentaireObligatoire}
                                            onChange={(e) => onUpdateSousQuestion(sqIdx, { commentaireObligatoire: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-[#6b7280]">Obligatoire</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteSousQuestion(sqIdx)}
                                        className="p-1 text-[#f87171] hover:text-[#dc2626]"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {showSousQuestionForm && (
                                <div className="p-3 border border-[#bfdbfe] rounded-lg bg-[#eff6ff] space-y-2">
                                    <input
                                        type="text"
                                        value={newSousQuestion.libelleFr}
                                        onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleFr: e.target.value }))}
                                        placeholder="Sous-question (FR)"
                                        className="w-full text-sm border border-[#93c5fd] rounded px-2 py-1"
                                    />
                                    <input
                                        type="text"
                                        value={newSousQuestion.libelleEn}
                                        onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleEn: e.target.value }))}
                                        placeholder="Label (EN)"
                                        className="w-full text-sm border border-[#93c5fd] rounded px-2 py-1"
                                    />
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={newSousQuestion.commentaireObligatoire}
                                            onChange={(e) => setNewSousQuestion(prev => ({ ...prev, commentaireObligatoire: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-xs text-[#6b7280]">Commentaire obligatoire</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddSousQuestion}
                                            className="flex-1 bg-[#2563eb] text-white px-2 py-1 rounded text-sm"
                                        >
                                            Ajouter
                                        </button>
                                        <button
                                            onClick={() => setShowSousQuestionForm(false)}
                                            className="flex-1 border border-[#d1d5db] px-2 py-1 rounded text-sm"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/** Éditeur de rubrique statique avec personnalisation complète */
function RubriqueStatiqueEditor({
    rubriqueStatique,
    config,
    echellesReponses,
    lang,
    onToggleActive,
    onToggleQuestionSupprimee,
    onAddQuestionPersonnalisee,
    onRemoveQuestionPersonnalisee,
    onUpdateQuestionPersonnalisee,
    onAddSousQuestion,
    onUpdateSousQuestion,
    onDeleteSousQuestion,
}: {
    rubriqueStatique: RubriqueStatique;
    config: RubriqueConfig | undefined;
    echellesReponses: any[];
    lang: string;
    onToggleActive: (estActive: boolean) => void;
    onToggleQuestionSupprimee: (questionCode: string, estSupprimee: boolean) => void;
    onAddQuestionPersonnalisee: (question: QuestionPersonnalisee) => void;
    onRemoveQuestionPersonnalisee: (questionId: string) => void;
    onUpdateQuestionPersonnalisee: (questionId: string, updates: any) => void;
    onAddSousQuestion: (questionId: string, sousQuestion: any) => void;
    onUpdateSousQuestion: (questionId: string, sousIndex: number, updates: any) => void;
    onDeleteSousQuestion: (questionId: string, sousIndex: number) => void;
}) {
    const { t } = useTranslation();
    const [ouvert, setOuvert] = useState(false);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [editingSousQuestion, setEditingSousQuestion] = useState<{
        questionId: string;
        sousIndex: number;
    } | null>(null);
    
    const [nouvelleQuestion, setNouvelleQuestion] = useState({
        libelleFr: '',
        libelleEn: '',
        typeQuestion: 'simple' as const,
        typeEchelleId: '',
        commentaireGlobal: false,
        sousQuestions: [],
    });

    // Dans la définition de editQuestionData, ajuster le type
    const [editQuestionData, setEditQuestionData] = useState<{
        libelleFr: string;
        libelleEn: string;
        typeQuestion: 'simple' | 'avec_sous_questions' | 'texte_libre';
        typeEchelleId: string;
        commentaireGlobal: boolean;
    } | null>(null);

    // Lors de la définition de typeQuestion, filtrer les types non modifiables
    const getEditableType = (type: string): 'simple' | 'avec_sous_questions' | 'texte_libre' => {
        if (type === 'objectifs_comprehension' || type === 'objectifs_atteinte') {
            return 'simple'; // Fallback vers type simple
        }
        return type as 'simple' | 'avec_sous_questions' | 'texte_libre';
    };

    const [newSousQuestion, setNewSousQuestion] = useState({
        libelleFr: '',
        libelleEn: '',
        commentaireObligatoire: false,
    });

    const estActive = config?.estActive !== false;
    const questionsSupprimees = config?.questionsSupprimees || [];
    const questionsPersonnalisees = config?.questionsPersonnalisees || [];

    const questionsActives = rubriqueStatique.questions.filter(
        q => !questionsSupprimees.includes(q.code)
    );

    // Convertir une question statique en format éditable
    const convertToEditableFormat = (question: any) => ({
        id: question.code,
        libelleFr: question.libelleFr,
        libelleEn: question.libelleEn,
        typeQuestion: question.type,
        typeEchelleId: question.typeEchelle?._id || null,
        commentaireGlobal: question.commentaireGlobal,
        ordre: question.ordre,
        sousQuestions: question.sousQuestions?.map((sq: any) => ({
            id: sq.id,
            libelleFr: sq.libelleFr,
            libelleEn: sq.libelleEn,
            commentaireObligatoire: sq.commentaireObligatoire,
            ordre: sq.ordre,
        })) || [],
    });

    const handleAddQuestion = () => {
        if (!nouvelleQuestion.libelleFr.trim()) {
            createToast('Le libellé est requis', '', 2);
            return;
        }
        const newQuestion: QuestionPersonnalisee = {
            id: `temp_${Date.now()}`,
            libelleFr: nouvelleQuestion.libelleFr,
            libelleEn: nouvelleQuestion.libelleEn,
            typeQuestion: nouvelleQuestion.typeQuestion,
           typeEchelleId: nouvelleQuestion.typeEchelleId || null,
            commentaireObligatoire: nouvelleQuestion.commentaireGlobal,
            ordre: questionsActives.length + questionsPersonnalisees.length + 1,
            sousQuestions: [],
        };
        onAddQuestionPersonnalisee(newQuestion);
        setShowAddQuestion(false);
        setNouvelleQuestion({
            libelleFr: '',
            libelleEn: '',
            typeQuestion: 'simple',
            typeEchelleId: '',
            commentaireGlobal: false,
            sousQuestions: [],
        });
    };

    const handleUpdateQuestion = (questionId: string, updates: any) => {
        onUpdateQuestionPersonnalisee(questionId, updates);
    };

    const handleAddSousQuestionToStatic = (questionCode: string, sousQuestionData: any) => {
        // Pour les questions statiques, on crée une nouvelle question personnalisée qui remplace la statique
        const originalQuestion = rubriqueStatique.questions.find(q => q.code === questionCode);
        if (!originalQuestion) return;

        // Créer une version personnalisée de la question avec la nouvelle sous-question
        const newSousQuestions = [
            ...(originalQuestion.sousQuestions || []).map((sq: any) => ({
                id: sq.id,
                libelleFr: sq.libelleFr,
                libelleEn: sq.libelleEn,
                commentaireObligatoire: sq.commentaireObligatoire,
                ordre: sq.ordre,
            })),
            {
                id: `sq_${Date.now()}`,
                libelleFr: sousQuestionData.libelleFr,
                libelleEn: sousQuestionData.libelleEn,
                commentaireObligatoire: sousQuestionData.commentaireObligatoire,
                ordre: (originalQuestion.sousQuestions?.length || 0) + 1,
            },
        ];

        // Créer une question personnalisée qui remplace la statique
        const customQuestion: QuestionPersonnalisee = {
            id: `custom_${questionCode}_${Date.now()}`,
            libelleFr: originalQuestion.libelleFr,
            libelleEn: originalQuestion.libelleEn,
            typeQuestion: getEditableType(originalQuestion.type),
            typeEchelleId: originalQuestion.typeEchelle?._id || null,
            commentaireObligatoire: originalQuestion.commentaireGlobal,
            ordre: originalQuestion.ordre,
            sousQuestions: newSousQuestions,
        };

        // Supprimer la question statique et ajouter la version personnalisée
        onToggleQuestionSupprimee(questionCode, true);
        onAddQuestionPersonnalisee(customQuestion);
    };

    const handleUpdateSousQuestionStatic = (questionCode: string, sousIndex: number, updates: any) => {
        const originalQuestion = rubriqueStatique.questions.find(q => q.code === questionCode);
        if (!originalQuestion) return;

        // Mettre à jour la sous-question
        const updatedSousQuestions = [...(originalQuestion.sousQuestions || [])];
        updatedSousQuestions[sousIndex] = {
            ...updatedSousQuestions[sousIndex],
            ...updates,
        };

        // Créer une question personnalisée avec les sous-questions mises à jour
        const customQuestion: QuestionPersonnalisee = {
            id: `custom_${questionCode}_${Date.now()}`,
            libelleFr: originalQuestion.libelleFr,
            libelleEn: originalQuestion.libelleEn,
            typeQuestion: getEditableType(originalQuestion.type),
            typeEchelleId: originalQuestion.typeEchelle?._id || null,
            commentaireObligatoire: originalQuestion.commentaireGlobal,
            ordre: originalQuestion.ordre,
            sousQuestions: updatedSousQuestions,
        };

        // Supprimer la question statique et ajouter la version personnalisée
        onToggleQuestionSupprimee(questionCode, true);
        onAddQuestionPersonnalisee(customQuestion);
    };

    const handleDeleteSousQuestionStatic = (questionCode: string, sousIndex: number) => {
        const originalQuestion = rubriqueStatique.questions.find(q => q.code === questionCode);
        if (!originalQuestion) return;

        // Supprimer la sous-question
        const updatedSousQuestions = (originalQuestion.sousQuestions || []).filter((_: any, i: number) => i !== sousIndex);

        if (updatedSousQuestions.length === 0) {
            // Plus de sous-questions, on garde la question statique
            // Pour l'instant, on ne fait rien car on ne peut pas modifier les statiques
            createToast('La question n\'a plus de sous-questions', '', 2);
        } else {
            // Créer une question personnalisée avec les sous-questions restantes
            const customQuestion: QuestionPersonnalisee = {
                id: `custom_${questionCode}_${Date.now()}`,
                libelleFr: originalQuestion.libelleFr,
                libelleEn: originalQuestion.libelleEn,
                typeQuestion: getEditableType(originalQuestion.type),
                typeEchelleId: originalQuestion.typeEchelle?._id || null,
                commentaireObligatoire: originalQuestion.commentaireGlobal,
                ordre: originalQuestion.ordre,
                sousQuestions: updatedSousQuestions,
            };

            onToggleQuestionSupprimee(questionCode, true);
            onAddQuestionPersonnalisee(customQuestion);
        }
    };

    // Composant interne pour éditer une question
    const QuestionEditForm = ({ question, onSave, onCancel }: { 
        question: any; 
        onSave: (updates: any) => void; 
        onCancel: () => void;
    }) => {
        const [formData, setFormData] = useState({
            libelleFr: question.libelleFr,
            libelleEn: question.libelleEn,
            typeQuestion: question.typeQuestion,
            typeEchelleId: question.typeEchelleId || '',
            commentaireGlobal: question.commentaireGlobal,
        });

        return (
            <div className="mt-2 p-3 border border-blue-200 rounded-lg bg-blue-50 space-y-2">
                <input
                    type="text"
                    value={formData.libelleFr}
                    onChange={(e) => setFormData(prev => ({ ...prev, libelleFr: e.target.value }))}
                    placeholder="Libellé (FR)"
                    className="w-full text-sm border border-blue-300 rounded px-2 py-1"
                />
                <input
                    type="text"
                    value={formData.libelleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, libelleEn: e.target.value }))}
                    placeholder="Label (EN)"
                    className="w-full text-sm border border-blue-300 rounded px-2 py-1"
                />
                <select
                    value={formData.typeQuestion}
                    onChange={(e) => setFormData(prev => ({ ...prev, typeQuestion: e.target.value as any }))}
                    className="w-full text-sm border border-blue-300 rounded px-2 py-1"
                >
                    <option value="simple">Question simple</option>
                    <option value="avec_sous_questions">Avec sous-questions</option>
                    <option value="texte_libre">Texte libre</option>
                </select>
                {formData.typeQuestion !== 'texte_libre' && (
                    <select
                        value={formData.typeEchelleId}
                        onChange={(e) => setFormData(prev => ({ ...prev, typeEchelleId: e.target.value }))}
                        className="w-full text-sm border border-blue-300 rounded px-2 py-1"
                    >
                        <option value="">Sans échelle</option>
                        {echellesReponses.map((type: any) => (
                            <option key={type.idType} value={type.idType}>
                                {type.nomType}
                            </option>
                        ))}
                    </select>
                )}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.commentaireGlobal}
                        onChange={(e) => setFormData(prev => ({ ...prev, commentaireGlobal: e.target.checked }))}
                        className="rounded"
                    />
                    <span className="text-xs">Commentaire global</span>
                </label>
                <div className="flex gap-2">
                    <button onClick={() => onSave(formData)} className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-sm">Enregistrer</button>
                    <button onClick={onCancel} className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm">Annuler</button>
                </div>
            </div>
        );
    };

    return (
        <div className={`border rounded-lg overflow-hidden ${!estActive ? 'bg-[#f9fafb] border-[#e5e7eb]' : 'border-[#e5e7eb]'}`}>
            {/* En-tête */}
            <div className={`flex items-center justify-between px-4 py-3 ${estActive ? 'bg-[#f9fafb]' : 'bg-[#f3f4f6]'} border-b border-[#e5e7eb]`}>
                <div className="flex items-center gap-3 flex-1">
                    <button
                        type="button"
                        onClick={() => setOuvert(!ouvert)}
                        className="flex items-center gap-2 text-left flex-1"
                    >
                        <span className="text-sm font-semibold text-[#1f2937]">
                            Rubrique {rubriqueStatique.ordre} — {rubriqueStatique.titreFr}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280]">
                            {rubriqueStatique.code}
                        </span>
                        {ouvert ? <ChevronUp className="w-4 h-4 text-[#9ca3af]" /> : <ChevronDown className="w-4 h-4 text-[#9ca3af]" />}
                    </button>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={estActive}
                            onChange={(e) => onToggleActive(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d1d5db] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb] relative"></div>
                        <span className="text-xs text-[#6b7280]">{estActive ? t('label.actif') : t('label.inactif')}</span>
                    </label>
                </div>
            </div>

            {ouvert && (
                <div className="p-4 space-y-3 bg-white">
                    {/* Questions statiques - maintenant éditables */}
                    {questionsActives.map((question, idx) => {
                        const questionForEditor = convertToEditableFormat(question);
                        const isEditing = editingQuestionId === question.code;
                        
                        return (
                            <div key={question.code} className="p-3 border border-[#f3f4f6] rounded-lg hover:bg-[#f9fafb]">
                                {isEditing ? (
                                    <QuestionEditForm
                                        question={questionForEditor}
                                        onSave={(updates) => {
                                            // Créer une question personnalisée qui remplace la statique
                                            const customQuestion: QuestionPersonnalisee = {
                                                id: `custom_${question.code}_${Date.now()}`,
                                                libelleFr: updates.libelleFr,
                                                libelleEn: updates.libelleEn,
                                                typeQuestion: updates.typeQuestion,
                                                typeEchelleId: updates.typeEchelleId || null,
                                                commentaireObligatoire: updates.commentaireGlobal,
                                                ordre: question.ordre,
                                                sousQuestions: questionForEditor.sousQuestions,
                                            };
                                            onToggleQuestionSupprimee(question.code, true);
                                            onAddQuestionPersonnalisee(customQuestion);
                                            setEditingQuestionId(null);
                                            createToast('Question modifiée avec succès (version personnalisée créée)', '', 0);
                                        }}
                                        onCancel={() => setEditingQuestionId(null)}
                                    />
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#1f2937]">
                                                    {idx + 1}. {question.libelleFr}
                                                </p>
                                                <p className="text-xs text-[#9ca3af] mt-1">
                                                    Type: {question.type} | {question.typeEchelle?.nomFr || 'Sans échelle'}
                                                </p>
                                                {/* Sous-questions */}
                                                {question.sousQuestions && question.sousQuestions.length > 0 && (
                                                    <div className="mt-2 pl-3 border-l-2 border-[#e5e7eb] space-y-1">
                                                        {question.sousQuestions.map((sq: any, sqIdx: number) => (
                                                            <div key={sq.id || sqIdx} className="flex items-center justify-between text-xs text-[#6b7280] group">
                                                                <span>• {sq.libelleFr}</span>
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingSousQuestion({ questionId: question.code, sousIndex: sqIdx });
                                                                            setEditQuestionData({
                                                                                libelleFr: sq.libelleFr,
                                                                                libelleEn: sq.libelleEn,
                                                                                typeQuestion: getEditableType(question.type),
                                                                                typeEchelleId: question.typeEchelle?._id || '',
                                                                                commentaireGlobal: question.commentaireGlobal,
                                                                            });
                                                                        }}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                    >
                                                                        <Edit className="w-3 h-3" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteSousQuestionStatic(question.code, sqIdx)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Formulaire d'ajout de sous-question */}
                                                {editingSousQuestion?.questionId === question.code && editingSousQuestion.sousIndex === -1 && (
                                                    <div className="mt-2 p-2 border border-blue-200 rounded bg-blue-50">
                                                        <input
                                                            type="text"
                                                            value={newSousQuestion.libelleFr}
                                                            onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleFr: e.target.value }))}
                                                            placeholder="Sous-question (FR)"
                                                            className="w-full text-sm border rounded px-2 py-1 mb-1"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={newSousQuestion.libelleEn}
                                                            onChange={(e) => setNewSousQuestion(prev => ({ ...prev, libelleEn: e.target.value }))}
                                                            placeholder="Sub-question (EN)"
                                                            className="w-full text-sm border rounded px-2 py-1 mb-1"
                                                        />
                                                        <label className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={newSousQuestion.commentaireObligatoire}
                                                                onChange={(e) => setNewSousQuestion(prev => ({ ...prev, commentaireObligatoire: e.target.checked }))}
                                                                className="rounded"
                                                            />
                                                            <span className="text-xs">Commentaire obligatoire</span>
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    handleAddSousQuestionToStatic(question.code, newSousQuestion);
                                                                    setEditingSousQuestion(null);
                                                                    setNewSousQuestion({ libelleFr: '', libelleEn: '', commentaireObligatoire: false });
                                                                }}
                                                                className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-sm"
                                                            >
                                                                Ajouter
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingSousQuestion(null)}
                                                                className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm"
                                                            >
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-1 ml-2">
                                                <button
                                                    onClick={() => setEditingQuestionId(question.code)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                                                    title="Modifier la question"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingSousQuestion({ questionId: question.code, sousIndex: -1 })}
                                                    className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded"
                                                    title="Ajouter une sous-question"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onToggleQuestionSupprimee(question.code, true)}
                                                    className="p-1 text-[#f87171] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded"
                                                    title="Supprimer la question"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* Questions personnalisées (modifiables) */}
                    {questionsPersonnalisees.map((question, idx) => (
                        <QuestionEditor
                            key={question.id}
                            question={question}
                            index={questionsActives.length + idx}
                            isPersonnalisee={true}
                            echellesReponses={echellesReponses}
                            lang={lang}
                            onUpdate={(updates) => onUpdateQuestionPersonnalisee(question.id, updates)}
                            onDelete={() => onRemoveQuestionPersonnalisee(question.id)}
                            onAddSousQuestion={() => onAddSousQuestion(question.id, {})}
                            onUpdateSousQuestion={(sousIndex, updates) => onUpdateSousQuestion(question.id, sousIndex, updates)}
                            onDeleteSousQuestion={(sousIndex) => onDeleteSousQuestion(question.id, sousIndex)}
                        />
                    ))}

                    {/* Bouton ajouter question personnalisée */}
                    <button
                        type="button"
                        onClick={() => setShowAddQuestion(!showAddQuestion)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-[#60a5fa] rounded-lg text-[#2563eb] hover:bg-[#eff6ff] transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter une question personnalisée
                    </button>

                    {/* Formulaire ajout question personnalisée */}
                    {showAddQuestion && (
                        <div className="p-3 border border-[#bfdbfe] rounded-lg bg-[#eff6ff] space-y-3">
                            <input
                                type="text"
                                value={nouvelleQuestion.libelleFr}
                                onChange={(e) => setNouvelleQuestion(prev => ({ ...prev, libelleFr: e.target.value }))}
                                placeholder="Libellé de la question (FR)"
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            />
                            <input
                                type="text"
                                value={nouvelleQuestion.libelleEn}
                                onChange={(e) => setNouvelleQuestion(prev => ({ ...prev, libelleEn: e.target.value }))}
                                placeholder="Label (EN)"
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            />
                            <select
                                value={nouvelleQuestion.typeQuestion}
                                onChange={(e) => setNouvelleQuestion(prev => ({ ...prev, typeQuestion: e.target.value as any }))}
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            >
                                <option value="simple">Question simple</option>
                                <option value="avec_sous_questions">Avec sous-questions</option>
                                <option value="texte_libre">Texte libre</option>
                            </select>
                            <select
                                value={nouvelleQuestion.typeEchelleId}
                                onChange={(e) => setNouvelleQuestion(prev => ({ ...prev, typeEchelleId: e.target.value }))}
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            >
                                <option value="">Sans échelle (texte libre)</option>
                                {echellesReponses.map((type: any) => (
                                    <option key={type.idType} value={type.idType}>
                                        {type.nomType}
                                    </option>
                                ))}
                            </select>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={nouvelleQuestion.commentaireGlobal}
                                    onChange={(e) => setNouvelleQuestion(prev => ({ ...prev, commentaireGlobal: e.target.checked }))}
                                    className="rounded"
                                />
                                <span className="text-xs">Commentaire global</span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddQuestion}
                                    className="flex-1 bg-[#2563eb] text-white px-3 py-1.5 rounded text-sm hover:bg-[#1d4ed8]"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={() => setShowAddQuestion(false)}
                                    className="flex-1 border border-[#d1d5db] px-3 py-1.5 rounded text-sm hover:bg-[#f9fafb]"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/** Éditeur des objectifs (3.2 et 3.3) */
function ObjectifsEditor({
    objectifsBase,
    objectifsPersonnalises,
    objectifsSupprimes,
    objectifsPersonnalisesSupprimes,
    isActive,
    lang,
    onToggleActive,
    onToggleBaseSupprime,
    onAddPersonnalise,
    onRemovePersonnalise,
}: {
    objectifsBase: ObjectifTheme[];
    objectifsPersonnalises: ObjectifPersonnalise[];
    objectifsSupprimes: string[];
    objectifsPersonnalisesSupprimes: string[];
    isActive: boolean;
    lang: string;
    onToggleActive: (estActive: boolean) => void;
    onToggleBaseSupprime: (objectifId: string, estSupprime: boolean) => void;
    onAddPersonnalise: (libelleFr: string, libelleEn: string) => void;
    onRemovePersonnalise: (objectifId: string) => void;
}) {
    const [ouvert, setOuvert] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newObjectifFr, setNewObjectifFr] = useState('');
    const [newObjectifEn, setNewObjectifEn] = useState('');

    const objectifsBaseActifs = objectifsBase.filter(
        obj => !objectifsSupprimes.includes(obj._id!)
    );
    const objectifsPersoActifs = objectifsPersonnalises.filter(
        obj => !objectifsPersonnalisesSupprimes.includes(obj.id)
    );

    const handleAdd = () => {
        if (!newObjectifFr.trim()) {
            createToast('Le libellé est requis', '', 2);
            return;
        }
        onAddPersonnalise(newObjectifFr, newObjectifEn);
        setShowAddForm(false);
        setNewObjectifFr('');
        setNewObjectifEn('');
    };

    return (
        <div className={`border rounded-lg overflow-hidden ${!isActive ? 'bg-[#f9fafb]' : 'border-[#bfdbfe]'}`}>
            <div className={`flex items-center justify-between px-4 py-3 ${isActive ? 'bg-[#eff6ff]' : 'bg-[#f3f4f6]'} border-b border-[#e5e7eb]`}>
                <button
                    type="button"
                    onClick={() => setOuvert(!ouvert)}
                    className="flex items-center gap-2 flex-1"
                >
                    <span className="text-sm font-semibold text-[#1e40af]">
                        Objectifs pédagogiques (Rubriques 3.2 et 3.3)
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8]">
                        {objectifsBaseActifs.length + objectifsPersoActifs.length} objectif(s)
                    </span>
                    {ouvert ? <ChevronUp className="w-4 h-4 text-[#60a5fa]" /> : <ChevronDown className="w-4 h-4 text-[#60a5fa]" />}
                </button>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => onToggleActive(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#d1d5db] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d1d5db] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb] relative"></div>
                </label>
            </div>

            {ouvert && isActive && (
                <div className="p-4 space-y-3 bg-white">
                    <p className="text-xs text-[#2563eb] italic">
                        Ces objectifs alimentent automatiquement les questions 3.2 (compréhension) et 3.3 (atteinte).
                    </p>

                    {objectifsBaseActifs.map((obj, idx) => (
                        <div key={obj._id} className="flex items-start gap-2 p-2 border border-[#f3f4f6] rounded-lg">
                            <div className="flex-1">
                                <p className="text-sm text-[#1f2937]">{idx + 1}. {obj.nomFr}</p>
                                {obj.nomEn && <p className="text-xs text-[#9ca3af]">{obj.nomEn}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={() => onToggleBaseSupprime(obj._id!, true)}
                                className="p-1 text-[#f87171] hover:text-[#dc2626] rounded"
                                title="Supprimer cet objectif"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {objectifsPersoActifs.map((obj, idx) => (
                        <div key={obj.id} className="flex items-start gap-2 p-2 border border-[#fed7aa] rounded-lg bg-[#fff7ed]">
                            <div className="flex-1">
                                <p className="text-sm text-[#9a3412]">
                                    {objectifsBaseActifs.length + idx + 1}. {obj.libelleFr}
                                    <span className="text-xs text-[#ea580c] ml-2">(personnalisé)</span>
                                </p>
                                {obj.libelleEn && <p className="text-xs text-[#6b7280]">{obj.libelleEn}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemovePersonnalise(obj.id)}
                                className="p-1 text-[#f87171] hover:text-[#dc2626] rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {showAddForm ? (
                        <div className="p-3 border border-[#bfdbfe] rounded-lg bg-[#eff6ff] space-y-3">
                            <input
                                type="text"
                                value={newObjectifFr}
                                onChange={(e) => setNewObjectifFr(e.target.value)}
                                placeholder="Libellé de l'objectif (FR)"
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            />
                            <input
                                type="text"
                                value={newObjectifEn}
                                onChange={(e) => setNewObjectifEn(e.target.value)}
                                placeholder="Label (EN)"
                                className="w-full text-sm border border-[#93c5fd] rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                            />
                            <div className="flex gap-2">
                                <button onClick={handleAdd} className="flex-1 bg-[#2563eb] text-white px-3 py-1.5 rounded text-sm hover:bg-[#1d4ed8]">
                                    Ajouter
                                </button>
                                <button onClick={() => setShowAddForm(false)} className="flex-1 border border-[#d1d5db] px-3 py-1.5 rounded text-sm hover:bg-[#f9fafb]">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-[#60a5fa] rounded-lg text-[#2563eb] hover:bg-[#eff6ff] text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter un objectif personnalisé
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const EvaluationManager = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { data: { evaluationChauds } } = useSelector((state: RootState) => state.evaluationChaudSlice);

    const [echellesReponses, setEchelleReponses] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('list');
    const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);
    const [themeFormation, setThemeFormation] = useState<ThemeFormation | undefined>(undefined);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationChaud | undefined>(undefined);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [exportingId, setExportingId] = useState<string | null>(null);

    const [objectifsBase, setObjectifsBase] = useState<ObjectifTheme[]>([]);
    const [templateConfig, setTemplateConfig] = useState<LocalTemplateConfig | null>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    const [form, setForm] = useState<EvaluationForm>({
        titreFr: '', titreEn: '', theme: undefined,
        descriptionFr: '', descriptionEn: '', dateFormation: '',
        actif: true,
    });

    const [rubriquesPersonnalisees, setRubriquesPersonnalisees] = useState<RubriquePersoForm[]>([]);
    const [objectifsPersonnalises, setObjectifsPersonnalises] = useState<ObjectifPersonnalise[]>([]);
    const [objectifsSupprimes, setObjectifsSupprimes] = useState<string[]>([]);
    const [objectifsPersonnalisesSupprimes, setObjectifsPersonnalisesSupprimes] = useState<string[]>([]);
    const [objectifsSectionActive, setObjectifsSectionActive] = useState(true);

    const fetchData = useFetchData();
    const themeId = getQueryParam('themeId');
    const itemsPerPage = useSelector((state: RootState) => state.evaluationChaudSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.evaluationChaudSlice.data.totalItems);
    const loading = useSelector((state: RootState) => state.evaluationChaudSlice.pageIsLoading);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const pageNumbers: number[] = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) pageNumbers.push(i);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    const [rubriquesStatiques, setRubriquesStatiques] = useState<RubriqueStatique[]>([]);
    const [isLoadingRubriques, setIsLoadingRubriques] = useState(true);

    // Dans EvaluationManager, remplacer les useEffect problématiques par :

    // État pour savoir si on est en mode création ou édition
    const isCreating = activeTab === 'create' && !editingEvaluationId;
    const isEditing = activeTab === 'create' && editingEvaluationId !== null;

    // Chargement initial des rubriques statiques (une seule fois)
    useEffect(() => {
        const loadRubriquesStatiques = async () => {
            // Ne pas recharger si on est en édition (les rubriques viendront de loadEvaluationConfig)
            if (isEditing) return;
            
            setIsLoadingRubriques(true);
            try {
                const result = await getRubriquesStatiques(lang);
                if (result?.rubriquesStatiques && result.rubriquesStatiques.length > 0) {
                    setRubriquesStatiques(result.rubriquesStatiques);
                    
                    // Créer la config par défaut uniquement en mode création
                    if (isCreating && !templateConfig) {
                        setTemplateConfig({
                            rubriquesConfig: result.rubriquesStatiques.map(r => ({
                                rubriqueReference: r.code,
                                estActive: true,
                                questionsPersonnalisees: [],
                                questionsSupprimees: [],
                                questionsModifiees: [], 
                            })),
                            objectifsConfig: {
                                estActive: true,
                                personnalisationAutorisee: true,
                                objectifsPersonnalises: [],
                                objectifsSupprimes: [],
                                objectifsPersonnalisesSupprimes: [],
                            },
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur chargement rubriques statiques:', error);
            } finally {
                setIsLoadingRubriques(false);
            }
        };
        
        loadRubriquesStatiques();
    }, [lang, isCreating, isEditing]); // Dépendances importantes

    // Chargement de la config en mode édition (appelé uniquement quand on édite)
    useEffect(() => {
        if (!isEditing || !editingEvaluationId) return;
        
        const loadConfig = async () => {
            setIsLoadingRubriques(true);
            setIsLoadingConfig(true);
            try {
                const result = await getEvaluationConfig(editingEvaluationId, lang);
                
                if (result.rubriquesStatiques && result.rubriquesStatiques.length > 0) {
                    setRubriquesStatiques(result.rubriquesStatiques);
                }
                
                setObjectifsBase(result.objectifsBase);
                
                if (result.config) {
                    setTemplateConfig({
                        rubriquesConfig: result.config.rubriquesConfig || result.rubriquesStatiques.map(r => ({
                            rubriqueReference: r.code,
                            estActive: true,
                            questionsPersonnalisees: [],
                            questionsSupprimees: [],
                        })),
                        objectifsConfig: result.config.objectifsConfig || {
                            estActive: true,
                            personnalisationAutorisee: true,
                            objectifsPersonnalises: [],
                            objectifsSupprimes: [],
                            objectifsPersonnalisesSupprimes: [],
                        },
                    });
                    
                    if (result.config?.objectifsConfig) {
                        setObjectifsPersonnalises(result.config.objectifsConfig.objectifsPersonnalises || []);
                        setObjectifsSupprimes(result.config.objectifsConfig.objectifsSupprimes || []);
                        setObjectifsPersonnalisesSupprimes(result.config.objectifsConfig.objectifsPersonnalisesSupprimes || []);
                        setObjectifsSectionActive(result.config.objectifsConfig.estActive !== false);
                    }
                }
            } catch (error) {
                console.error('Erreur chargement config:', error);
            } finally {
                setIsLoadingRubriques(false);
                setIsLoadingConfig(false);
            }
        };
        
        loadConfig();
    }, [isEditing, editingEvaluationId, lang]); // Dépendances spécifiques à l'édition
    
    useEffect(() => {
        fetchData({
            apiFunction: getGroupedEchelleReponseByType,
            params: { lang },
            onSuccess: (data) => setEchelleReponses(data || []),
            onError: () => dispatch(setErrorPageEchelleReponse(t('message.erreur'))),
            onLoading: (isLoading) => dispatch(setEchelleReponseLoading(isLoading)),
        });
    }, [lang]);
    

    useEffect(() => {
        dispatch(setEvaluationChaudLoading(true));
        fetchData({
            apiFunction: getFilteredEvaluations,
            params: { lang, page: currentPage },
            onSuccess: (data) => dispatch(setEvaluationChauds(data || { evaluationChauds: [], currentPage: 0, totalItems: 0, totalPages: 0, pageSize: 0 })),
            onError: () => dispatch(setErrorPageEvaluationChaud(t('message.erreur'))),
            onLoading: (isLoading) => dispatch(setEvaluationChaudLoading(isLoading)),
        });
    }, [currentPage, lang, dispatch]);

    const latestQuery = useRef('');
    useEffect(() => {
        if (!isSearch) return;
        dispatch(setEvaluationChaudLoading(true));
        latestQuery.current = searchText;
        fetchData({
            apiFunction: getFilteredEvaluations,
            params: { lang, page: 1, search: searchText || undefined },
            onSuccess: (data) => dispatch(setEvaluationChauds(data || { evaluationChauds: [], currentPage: 0, totalItems: 0, totalPages: 0, pageSize: 0 })),
            onError: () => dispatch(setErrorPageEvaluationChaud(t('message.erreur'))),
            onLoading: (isLoading) => { if (latestQuery.current === searchText) dispatch(setEvaluationChaudLoading(isLoading)); },
        });
    }, [searchText, isSearch, lang, dispatch]);

    const loadEvaluationConfig = async (evaluationId: string) => {
        setIsLoadingConfig(true);
        try {
            const result = await getEvaluationConfig(evaluationId, lang);
            
            // Mettre à jour les rubriques statiques avec celles de la config
            if (result.rubriquesStatiques && result.rubriquesStatiques.length > 0) {
                setRubriquesStatiques(result.rubriquesStatiques);
            }
            
            setObjectifsBase(result.objectifsBase);
            
            // ✅ Convertir la config backend en format local
            if (result.config) {
                setTemplateConfig({
                    rubriquesConfig: result.config.rubriquesConfig || result.rubriquesStatiques.map(r => ({
                        rubriqueReference: r.code,
                        estActive: true,
                        questionsPersonnalisees: [],
                        questionsSupprimees: [],
                    })),
                    objectifsConfig: result.config.objectifsConfig || {
                        estActive: true,
                        personnalisationAutorisee: true,
                        objectifsPersonnalises: [],
                        objectifsSupprimes: [],
                        objectifsPersonnalisesSupprimes: [],
                    },
                });
                
                if (result.config?.objectifsConfig) {
                    setObjectifsPersonnalises(result.config.objectifsConfig.objectifsPersonnalises || []);
                    setObjectifsSupprimes(result.config.objectifsConfig.objectifsSupprimes || []);
                    setObjectifsPersonnalisesSupprimes(result.config.objectifsConfig.objectifsPersonnalisesSupprimes || []);
                    setObjectifsSectionActive(result.config.objectifsConfig.estActive !== false);
                }
            } else {
                // Configuration par défaut
                setTemplateConfig({
                    rubriquesConfig: result.rubriquesStatiques.map(r => ({
                        rubriqueReference: r.code,
                        estActive: true,
                        questionsPersonnalisees: [],
                        questionsSupprimees: [],
                          questionsModifiees: [], 
                    })),
                    objectifsConfig: {
                        estActive: true,
                        personnalisationAutorisee: true,
                        objectifsPersonnalises: [],
                        objectifsSupprimes: [],
                        objectifsPersonnalisesSupprimes: [],
                    },
                });
            }
            
            // Indiquer que les rubriques sont chargées
            setIsLoadingRubriques(false);
        } catch (error) {
            console.error('Erreur chargement config:', error);
        } finally {
            setIsLoadingConfig(false);
        }
    };

    const loadObjectifsFromTheme = async (themeId: string) => {
        try {
            const data = await getObjectifThemeForDropDown({ lang, themeId });
            
            if (data && data.length > 0) {
                const objectifsFormattes: ObjectifTheme[] = data.map((o: any) => ({
                    _id: o._id,
                    nomFr: o.nomFr || o.libelleFr || '',
                    nomEn: o.nomEn || o.libelleEn || '',
                    theme: themeId,
                }));

                setObjectifsBase(objectifsFormattes);
                createToast(`${objectifsFormattes.length} objectif(s) chargé(s) depuis le thème`, '', 0);
                return objectifsFormattes;
            } else {
                setObjectifsBase([]);
                return [];
            }
        } catch (error) {
            console.error('Erreur chargement objectifs:', error);
            setObjectifsBase([]);
            return [];
        }
    };

    const handleThemeSelect = async (selectedTheme: ThemeFormation|string) => {
      
        if (!selectedTheme || typeof selectedTheme === 'string') return;
        
        setThemeFormation(selectedTheme);
        setForm(prev => ({ ...prev, theme: selectedTheme }));
        
        // Charger les objectifs du thème
        if (selectedTheme._id) {
            await loadObjectifsFromTheme(selectedTheme._id);
        }
    };

    // Dans EvaluationManager, ajouter ces fonctions :

    const updateQuestionPersonnalisee = (rubriqueCode: string, questionId: string, updates: any) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const rubriqueIndex = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (rubriqueIndex !== -1) {
                const questionIndex = newRubriquesConfig[rubriqueIndex].questionsPersonnalisees.findIndex(
                    q => q.id === questionId
                );
                if (questionIndex !== -1) {
                    newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex] = {
                        ...newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex],
                        ...updates,
                    };
                }
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const addSousQuestion = (rubriqueCode: string, questionId: string, sousQuestion: any) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const rubriqueIndex = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (rubriqueIndex !== -1) {
                const questionIndex = newRubriquesConfig[rubriqueIndex].questionsPersonnalisees.findIndex(
                    q => q.id === questionId
                );
                if (questionIndex !== -1) {
                    const currentSousQuestions = newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions || [];
                    const newSousQuestion: SousQuestionPersonnalisee = {
                        id: `temp_sq_${Date.now()}`,
                        libelleFr: '',
                        libelleEn: '',
                        commentaireObligatoire: false,
                        ordre: currentSousQuestions.length + 1,
                    };
                    newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions = [
                        ...currentSousQuestions,
                        newSousQuestion
                    ];
                }
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const updateSousQuestion = (rubriqueCode: string, questionId: string, sousIndex: number, updates: any) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const rubriqueIndex = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (rubriqueIndex !== -1) {
                const questionIndex = newRubriquesConfig[rubriqueIndex].questionsPersonnalisees.findIndex(
                    q => q.id === questionId
                );
                if (questionIndex !== -1 && newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions) {
                    newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions[sousIndex] = {
                        ...newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions[sousIndex],
                        ...updates,
                    };
                }
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const deleteSousQuestion = (rubriqueCode: string, questionId: string, sousIndex: number) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const rubriqueIndex = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (rubriqueIndex !== -1) {
                const questionIndex = newRubriquesConfig[rubriqueIndex].questionsPersonnalisees.findIndex(
                    q => q.id === questionId
                );
                if (questionIndex !== -1 && newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions) {
                    newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions = 
                        newRubriquesConfig[rubriqueIndex].questionsPersonnalisees[questionIndex].sousQuestions.filter((_, i) => i !== sousIndex);
                }
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const saveConfig = async () => {
        if (!editingEvaluationId) return;
        
        if (!templateConfig) {
            createToast('Aucune configuration à sauvegarder', '', 2);
            return;
        }
        
        setIsSavingConfig(true);
        try {
            await updateEvaluationConfig(editingEvaluationId, {
                rubriquesConfig: templateConfig.rubriquesConfig,
                objectifsConfig: templateConfig.objectifsConfig,
            }, lang);
            createToast('Configuration sauvegardée', '', 0);
        } catch (error) {
            createToast('Erreur lors de la sauvegarde', '', 2);
        } finally {
            setIsSavingConfig(false);
        }
    };

   

    const handleRegenerate = async () => {
        if (!editingEvaluationId) return;
        
        setIsLoadingConfig(true);
        try {
            await regenerateRubriques(editingEvaluationId, lang);
            await loadEvaluationConfig(editingEvaluationId);
            createToast('Rubriques régénérées avec succès', '', 0);
        } catch (error) {
            createToast('Erreur lors de la régénération', '', 2);
        } finally {
            setIsLoadingConfig(false);
        }
    };

    const toggleRubriqueActive = (rubriqueCode: string, estActive: boolean) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const index = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (index !== -1) {
                newRubriquesConfig[index] = { ...newRubriquesConfig[index], estActive };
            } else {
                newRubriquesConfig.push({
                  rubriqueReference: rubriqueCode as any,
                  estActive,
                  questionsPersonnalisees: [],
                  questionsSupprimees: [],
                  questionsModifiees: []
                });
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const toggleQuestionSupprimee = (rubriqueCode: string, questionCode: string, estSupprimee: boolean) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const index = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (index !== -1) {
                if (estSupprimee) {
                    if (!newRubriquesConfig[index].questionsSupprimees.includes(questionCode)) {
                        newRubriquesConfig[index].questionsSupprimees.push(questionCode);
                    }
                } else {
                    newRubriquesConfig[index].questionsSupprimees = newRubriquesConfig[index].questionsSupprimees.filter(
                        code => code !== questionCode
                    );
                }
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const addQuestionPersonnalisee = (rubriqueCode: string, question: QuestionPersonnalisee) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const index = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (index !== -1) {
                newRubriquesConfig[index].questionsPersonnalisees.push(question);
            } else {
                newRubriquesConfig.push({
                  rubriqueReference: rubriqueCode as any,
                  estActive: true,
                  questionsPersonnalisees: [question],
                  questionsSupprimees: [],
                  questionsModifiees: []
                });
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const removeQuestionPersonnalisee = (rubriqueCode: string, questionId: string) => {
        setTemplateConfig(prev => {
            if (!prev) return prev;
            const newRubriquesConfig = [...prev.rubriquesConfig];
            const index = newRubriquesConfig.findIndex(rc => rc.rubriqueReference === rubriqueCode);
            if (index !== -1) {
                newRubriquesConfig[index].questionsPersonnalisees = newRubriquesConfig[index].questionsPersonnalisees.filter(
                    q => q.id !== questionId
                );
            }
            return { ...prev, rubriquesConfig: newRubriquesConfig };
        });
    };

    const addObjectifPersonnaliseLocal = async (libelleFr: string, libelleEn: string) => {
        if (!editingEvaluationId) {
            const newObjectif: ObjectifPersonnalise = {
                id: `temp_${Date.now()}`,
                libelleFr,
                libelleEn,
                ordre: objectifsPersonnalises.length + objectifsBase.length + 1,
            };
            setObjectifsPersonnalises(prev => [...prev, newObjectif]);
        } else {
            try {
                const result = await addObjectifPersonnalise(editingEvaluationId, { libelleFr, libelleEn }, lang);
                if (result.success) {
                    await loadEvaluationConfig(editingEvaluationId);
                    createToast('Objectif ajouté', '', 0);
                }
            } catch (error) {
                createToast('Erreur lors de l\'ajout', '', 2);
            }
        }
    };

    const removeObjectifPersonnaliseLocal = async (objectifId: string) => {
        if (!editingEvaluationId) {
            setObjectifsPersonnalises(prev => prev.filter(o => o.id !== objectifId));
        } else {
            try {
                const result = await removeObjectifPersonnalise(editingEvaluationId, objectifId, lang);
                if (result.success) {
                    await loadEvaluationConfig(editingEvaluationId);
                    createToast('Objectif supprimé', '', 0);
                }
            } catch (error) {
                createToast('Erreur lors de la suppression', '', 2);
            }
        }
    };

    const toggleObjectifBaseSupprime = (objectifId: string, estSupprime: boolean) => {
        if (estSupprime) {
            setObjectifsSupprimes(prev => [...prev, objectifId]);
        } else {
            setObjectifsSupprimes(prev => prev.filter(id => id !== objectifId));
        }
    };

    useEffect(() => {
        if (!themeId) { setThemeFormation(undefined); return; }
        fetchData({
            apiFunction: getThemeById,
            params: { lang, themeId },
            onSuccess: (data) => {
                setThemeFormation(data);
                setForm(prev => ({ ...prev, theme: data }));
                setActiveTab('create');
            },
            onError: () => {},
            onLoading: () => {},
        });
    }, [themeId, lang]);

    const resetForm = () => {
        setEditingEvaluationId(null);
        setThemeFormation(themeId ? themeFormation : undefined);
        setForm({
            titreFr: '', titreEn: '', theme: themeId ? themeFormation : undefined,
            descriptionFr: '', descriptionEn: '', dateFormation: '',
            actif: true,
        });
        setRubriquesPersonnalisees([]);
        // Ne pas vider rubriquesStatiques ici, elles sont chargées une fois
        setObjectifsBase([]);
        setTemplateConfig(null);
        setObjectifsPersonnalises([]);
        setObjectifsSupprimes([]);
        setObjectifsPersonnalisesSupprimes([]);
        setObjectifsSectionActive(true);
        setIsLoadingRubriques(true); // Forcer le rechargement
    };

    const editerEvaluation = async (evaluation: EvaluationChaud) => {
        setEditingEvaluationId(evaluation._id || null);
        setThemeFormation(evaluation.theme as ThemeFormation);
        setForm({
            titreFr: evaluation.titreFr,
            titreEn: evaluation.titreEn,
            theme: evaluation.theme as ThemeFormation,
            descriptionFr: evaluation.descriptionFr || '',
            descriptionEn: evaluation.descriptionEn || '',
            dateFormation: evaluation.dateFormation
                ? new Date(evaluation.dateFormation).toISOString().slice(0, 10)
                : '',
            actif: evaluation.actif,
        });
        
        // ✅ Extraire les rubriques personnalisées de l'évaluation
        const rubriquesPerso = evaluation.rubriques?.filter(
            (r: any) => r.code && r.code.startsWith('perso_')
        ) || [];
        
        const rubriquesPersoFormatees: RubriquePersoForm[] = rubriquesPerso.map((r: any) => ({
            titreFr: r.titreFr,
            titreEn: r.titreEn,
            ordre: r.ordre,
            questions: r.questions.map((q: any) => ({
                code: q.code,
                libelleFr: q.libelleFr,
                libelleEn: q.libelleEn,
                typeQuestion: q.type === 'simple' ? 'simple' : (q.type === 'avec_sous_questions' ? 'avec_sous_questions' : 'texte_libre'),
                typeEchelleId: q.typeEchelle?._id || null,
                commentaireGlobal: q.commentaireGlobal,
                ordre: q.ordre,
                sousQuestions: q.sousQuestions?.map((sq: any) => ({
                    id: sq.code,
                    libelleFr: sq.libelleFr,
                    libelleEn: sq.libelleEn,
                    commentaireObligatoire: sq.commentaireObligatoire,
                    ordre: sq.ordre,
                })) || [],
            })),
        }));
        
        setRubriquesPersonnalisees(rubriquesPersoFormatees);
        
        if (evaluation._id) {
            await loadEvaluationConfig(evaluation._id);
        }
        
        setActiveTab('create');
    };

    const sauvegarderEvaluation = async () => {
        if (!form.titreFr.trim()) {
            createToast(t('message.titre_obligatoire'), '', 2);
            return;
        }
        if (!form.theme?._id) {
            createToast(t('message.theme_obligatoire'), '', 2);
            return;
        }

        const payload = {
            titreFr: form.titreFr,
            titreEn: form.titreEn,
            theme: form.theme._id,
            descriptionFr: form.descriptionFr,
            descriptionEn: form.descriptionEn,
            dateFormation: form.dateFormation ? new Date(form.dateFormation) : undefined,
            objectifs: [],
            rubriquesPersonnalisees: rubriquesPersonnalisees
                .filter(r => r.titreFr.trim())
                .map((r, i) => ({
                    titreFr: r.titreFr,
                    titreEn: r.titreEn,
                    ordre: 5 + i,
                    questions: r.questions
                        .filter(q => q.libelleFr.trim())
                        .map((q, qi) => ({
                            libelleFr: q.libelleFr,
                            libelleEn: q.libelleEn,
                            typeEchelleId: q.typeEchelleId || null,
                            commentaireGlobal: q.commentaireGlobal,
                            ordre: qi + 1,
                            sousQuestions: q.sousQuestions.filter(sq => sq.libelleFr.trim()),
                        })),
                })),
            actif: form.actif,
        };

        try {
            let response;
            if (editingEvaluationId) {
                response = await updateEvaluationAChaud(editingEvaluationId, payload, lang);
                if (response.success) {
                    createToast(response.message, '', 0);
                    dispatch(updateEvaluationChaudSlice({ id: response.data._id, evaluationChaudData: response.data }));
                    await saveConfig();
                } else {
                    createToast(response.message, '', 2);
                    return;
                }
            } else {
                response = await createEvaluationAChaud(payload, lang);
                if (response.success) {
                    createToast(response.message, '', 0);
                    dispatch(createEvaluationChaudSlice({ evaluationChaud: response.data }));
                } else {
                    createToast(response.message, '', 2);
                    return;
                }
            }
            resetForm();
            setActiveTab('list');
        } catch (error: any) {
            createToast(error.response?.data?.message || t('message.erreur'), '', 2);
        }
    };

    const toggleEvaluationStatus = async (id: string) => {
        const evaluation = evaluationChauds.find(e => e._id === id);
        if (!evaluation) return;
        try {
            const response = await updateEvaluationAChaud(id, { actif: !evaluation.actif }, lang);
            if (response.success) {
                dispatch(updateEvaluationChaudSlice({ id, evaluationChaudData: response.data }));
                createToast(response.message, '', 0);
            } else {
                createToast(response.message, '', 2);
            }
        } catch {
            createToast(t('message.erreur'), '', 2);
        }
    };

    const handleExportPDF = async (evaluationId: string, vierge = true) => {
        setExportingId(evaluationId);
        try {
            await exportFichePDF(evaluationId, lang, vierge ? undefined : undefined);
            createToast('PDF téléchargé avec succès', '', 0);
        } catch {
            createToast('Erreur lors de la génération du PDF', '', 2);
        } finally {
            setExportingId(null);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const getRubriqueConfig = (code: string) => {
        return templateConfig?.rubriquesConfig.find(rc => rc.rubriqueReference === code);
    };

    return (
        <>
            <BreadcrumbPageDescription
                pageDescription={t('page_description.evaluation_a_chaud')}
                titleColor="text-[#1e3a8a]"
                pageName={t('sub_menu.cree_evaluation')}
            />
            <div className="min-h-screen bg-[#f8fafc] p-4 mt-3">
                <div className="max-w-7xl mx-auto">

                    <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] mb-6">
                        <div className="flex border-b border-[#e2e8f0]">
                            {['list', 'create'].map(tab => (
                                <button key={tab}
                                    onClick={() => { if (activeTab !== tab) resetForm(); setActiveTab(tab); }}
                                    className={`px-6 py-3 font-medium transition-colors ${
                                        activeTab === tab
                                            ? 'text-[#2563eb] border-b-2 border-[#2563eb] bg-[#eff6ff]'
                                            : 'text-[#64748b] hover:text-[#334155]'
                                    }`}>
                                    {tab === 'list'
                                        ? t('label.liste_evaluations')
                                        : editingEvaluationId ? t('label.modifier_evaluation') : t('label.cree_evaluation')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'list' ? (
                        <div className="space-y-4">
                            <div className="block lg:hidden">
                                <button onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                                    className="px-2.5 py-1 border border-[#d1d5db] text-[12px] mb-2 flex justify-center items-center gap-x-2 mt-3">
                                    <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
                                </button>
                                {isDropdownVisible && (
                                    <InputSearch hintText={t('recherche.rechercher') + t('recherche.evaluation_a_chaud')}
                                        value={searchText} onSubmit={(text) => { setIsSearch(true); setSearchText(text); }} />
                                )}
                            </div>
                            <div className="hidden lg:block">
                                <InputSearch hintText={t('recherche.rechercher') + t('recherche.evaluation_a_chaud')}
                                    value={searchText} onSubmit={(text) => { setIsSearch(true); setSearchText(text); }} />
                            </div>

                            {evaluationChauds.length === 0 ? <NoData /> : (
                                loading ? <Skeleton height={300} /> : (
                                    evaluationChauds.map((evaluation, index) => (
                                        <div key={evaluation._id || index}
                                            className="bg-white rounded-lg border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="text-lg font-semibold text-[#1e293b]">{evaluation.titreFr}</h3>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer"
                                                                checked={evaluation.actif}
                                                                onChange={() => evaluation._id && toggleEvaluationStatus(evaluation._id)} />
                                                            <div className="w-11 h-6 bg-[#d1d5db] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#93c5fd] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d1d5db] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]" />
                                                        </label>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${evaluation.actif ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                                                            {evaluation.actif ? t('label.actif') : t('label.inactif')}
                                                        </span>
                                                    </div>
                                                    {lang === 'fr'
                                                        ? evaluation.descriptionFr && <p className="text-sm text-[#64748b] mb-3">{evaluation.descriptionFr}</p>
                                                        : evaluation.descriptionEn && <p className="text-sm text-[#64748b] mb-3">{evaluation.descriptionEn}</p>
                                                    }
                                                    <div className="flex items-center gap-4 text-sm text-[#64748b] flex-wrap">
                                                        <span>{t('label.rubriques')}: {evaluation.rubriques?.length || 0}</span>
                                                        <span>{t('label.creee_le')}: {formatDate(evaluation.createdAt?.toString() || '')}</span>
                                                        <span>{t('label.theme')}: {lang === 'fr' ? truncateText((evaluation.theme as any)?.titreFr || '', 60) : truncateText((evaluation.theme as any)?.titreEn || '', 60)}</span>
                                                        {evaluation.dateFormation && (
                                                            <span>Date: {new Date(evaluation.dateFormation).toLocaleDateString('fr-FR')}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                                    <button
                                                        onClick={() => evaluation._id && handleExportPDF(evaluation._id, true)}
                                                        disabled={exportingId === evaluation._id}
                                                        title="Télécharger la fiche vierge (PDF)"
                                                        className="p-2 text-[#64748b] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors disabled:opacity-50">
                                                        {exportingId === evaluation._id
                                                            ? <div className="w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
                                                            : <FileText className="w-5 h-5" />
                                                        }
                                                    </button>

                                                    <button onClick={() => editerEvaluation(evaluation)}
                                                        className="p-2 text-[#64748b] hover:text-[#059669] hover:bg-[#ecfdf5] rounded-lg transition-colors">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => { setSelectedEvaluation(evaluation); dispatch(setShowModalDelete()); }}
                                                        className="p-2 text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}

                            {searchText === '' && evaluationChauds.length > 0 && (
                                <Pagination count={count} itemsPerPage={itemsPerPage} startItem={startItem} endItem={endItem}
                                    hasPrevious={hasPrevious} hasNext={hasNext} currentPage={currentPage}
                                    pageNumbers={pageNumbers} handlePageClick={setCurrentPage} />
                            )}
                        </div>

                    ) : (
                        <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 space-y-6">

                            <div>
                                <h2 className="text-xl font-semibold text-[#1e293b] mb-4">
                                    {editingEvaluationId ? t('label.modifier_evaluation') : 'Informations générales'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.titre_fr')}</label>
                                        <input type="text" value={form.titreFr}
                                            onChange={e => setForm(prev => ({ ...prev, titreFr: e.target.value }))}
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                            placeholder={t('label.titre_evaluation_fr')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.titre_en')}</label>
                                        <input type="text" value={form.titreEn}
                                            onChange={e => setForm(prev => ({ ...prev, titreEn: e.target.value }))}
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                            placeholder={t('label.titre_evaluation_en')} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.theme')}</label>
                                        <FilterList 
                                            items={[]}
                                            placeholder={t('recherche.rechercher') + t('recherche.theme_formation')}
                                            displayProperty={(item: ThemeFormation) => lang === 'fr' ? item.titreFr : item.titreEn}
                                            onSelect={(selected) => {
                                                // if (selected && typeof selected !== 'string') {
                                                    handleThemeSelect(selected);
                                                // }
                                            }}
                                            enableBackendSearch 
                                            onSearch={async (value: string) => {
                                                const data = await getFilteredThemeFormations({ page: 1, lang, search: value });
                                                return data?.themeFormations || [];
                                            }}
                                            searchDelay={300} 
                                            minSearchLength={2} 
                                            defaultValue={themeFormation}
                                            noResultsMessage={t('label.aucun_theme')} 
                                            loadingMessage={t('label.recherche_theme_formation')}
                                            disable={themeId !== null} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Date de la formation</label>
                                        <input type="date" value={form.dateFormation || ''}
                                            onChange={e => setForm(prev => ({ ...prev, dateFormation: e.target.value }))}
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.descrip_fr')}</label>
                                        <textarea value={form.descriptionFr} rows={3}
                                            onChange={e => setForm(prev => ({ ...prev, descriptionFr: e.target.value }))}
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                            placeholder={t('label.description_evaluation_fr')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">{t('label.descrip_en')}</label>
                                        <textarea value={form.descriptionEn} rows={3}
                                            onChange={e => setForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                                            placeholder={t('label.description_evaluation_en')} />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-[#374151]">{t('label.etat_evaluation')}:</span>
                                    <input type="checkbox" className="sr-only peer" checked={form.actif}
                                        onChange={e => setForm(prev => ({ ...prev, actif: e.target.checked }))} />
                                    <div className="relative w-11 h-6 bg-[#d1d5db] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#93c5fd] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d1d5db] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${form.actif ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                                        {form.actif ? t('label.actif') : t('label.inactif')}
                                    </span>
                                </label>
                            </div>

                            {editingEvaluationId && (
                                <div className="flex items-center justify-end gap-3 p-3 bg-[#f9fafb] rounded-lg">
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={isLoadingConfig}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#2563eb] border border-[#93c5fd] rounded-lg hover:bg-[#eff6ff]"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoadingConfig ? 'animate-spin' : ''}`} />
                                        Régénérer les rubriques
                                    </button>
                                    <button
                                        onClick={saveConfig}
                                        disabled={isSavingConfig}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSavingConfig ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="text-md font-semibold text-[#1f2937] flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Personnalisation des rubriques
                                </h3>
                                <p className="text-xs text-[#6b7280] italic">
                                    Vous pouvez activer/désactiver chaque rubrique, supprimer des questions existantes ou en ajouter.
                                </p>
                                
                                {/* Afficher le skeleton pendant le chargement */}
                                {isLoadingRubriques && (
                                    <div className="space-y-3">
                                        <Skeleton height={80} />
                                        <Skeleton height={80} />
                                        <Skeleton height={80} />
                                        <Skeleton height={80} />
                                    </div>
                                )}
                                
                                {/* Afficher le message si aucune rubrique */}
                                {!isLoadingRubriques && rubriquesStatiques.length === 0 && (
                                    <div className="text-center py-8 text-[#6b7280] border border-dashed border-[#d1d5db] rounded-lg">
                                        <p>Aucune rubrique statique trouvée.</p>
                                        <button 
                                            onClick={async () => {
                                                const { initRubriquesStatiques } = await import('../../services/evaluations/rubriqueStatiqueAPI');
                                                await initRubriquesStatiques(lang);
                                                const result = await getRubriquesStatiques(lang);
                                                if (result?.rubriquesStatiques) {
                                                    setRubriquesStatiques(result.rubriquesStatiques);
                                                    setIsLoadingRubriques(false);
                                                }
                                            }}
                                            className="mt-2 text-sm text-[#2563eb] hover:underline"
                                        >
                                            Initialiser les rubriques par défaut
                                        </button>
                                    </div>
                                )}
                                
                                {/* Afficher les rubriques */}
                                {!isLoadingRubriques && rubriquesStatiques.length > 0 && (
                                    rubriquesStatiques.map(rubrique => (
                                        <RubriqueStatiqueEditor
                                            key={rubrique.code}
                                            rubriqueStatique={rubrique}
                                            config={getRubriqueConfig(rubrique.code)}
                                            echellesReponses={echellesReponses}
                                            lang={lang}
                                            onToggleActive={(estActive) => toggleRubriqueActive(rubrique.code, estActive)}
                                            onToggleQuestionSupprimee={(questionCode, estSupprimee) => 
                                                toggleQuestionSupprimee(rubrique.code, questionCode, estSupprimee)
                                            }
                                            onAddQuestionPersonnalisee={(question) => 
                                                addQuestionPersonnalisee(rubrique.code, question)
                                            }
                                            onRemoveQuestionPersonnalisee={(questionId) => 
                                                removeQuestionPersonnalisee(rubrique.code, questionId)
                                            }
                                            onUpdateQuestionPersonnalisee={(questionId, updates) => 
                                                updateQuestionPersonnalisee(rubrique.code, questionId, updates)
                                            }
                                            onAddSousQuestion={(questionId, sousQuestion) => 
                                                addSousQuestion(rubrique.code, questionId, sousQuestion)
                                            }
                                            onUpdateSousQuestion={(questionId, sousIndex, updates) => 
                                                updateSousQuestion(rubrique.code, questionId, sousIndex, updates)
                                            }
                                            onDeleteSousQuestion={(questionId, sousIndex) => 
                                                deleteSousQuestion(rubrique.code, questionId, sousIndex)
                                            }
                                        />
                                    ))
                                )}
                            </div>

                            <ObjectifsEditor
                                objectifsBase={objectifsBase}
                                objectifsPersonnalises={objectifsPersonnalises}
                                objectifsSupprimes={objectifsSupprimes}
                                objectifsPersonnalisesSupprimes={objectifsPersonnalisesSupprimes}
                                isActive={objectifsSectionActive}
                                lang={lang}
                                onToggleActive={setObjectifsSectionActive}
                                onToggleBaseSupprime={toggleObjectifBaseSupprime}
                                onAddPersonnalise={addObjectifPersonnaliseLocal}
                                onRemovePersonnalise={removeObjectifPersonnaliseLocal}
                            />

                            {/* Rubriques personnalisées avec éditeur complet */}
                            <div className="border border-[#fed7aa] rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 bg-[#fff7ed]">
                                    <span className="text-sm font-semibold text-[#9a3412]">
                                        Rubriques personnalisées supplémentaires
                                    </span>
                                    <button
                                        onClick={() => {
                                            setRubriquesPersonnalisees(prev => [...prev, {
                                                titreFr: '', titreEn: '', ordre: 5 + prev.length,
                                                questions: [],
                                            }]);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ea580c] text-white text-xs font-medium rounded-lg hover:bg-[#c2410c]"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Ajouter une rubrique
                                    </button>
                                </div>
                                <div className="p-4 space-y-4 bg-white">
                                    {rubriquesPersonnalisees.length === 0 && (
                                        <p className="text-sm text-[#9ca3af] italic text-center py-4">
                                            Aucune rubrique personnalisée. Cliquez sur "Ajouter" pour en créer.
                                        </p>
                                    )}
                                    {rubriquesPersonnalisees.map((r, i) => (
                                        <RubriquePersonnaliseeEditor
                                            key={i}
                                            rubrique={r}
                                            index={i}
                                            echellesReponses={echellesReponses}
                                            lang={lang}
                                            onUpdate={(updated) => {
                                                const newRubriques = [...rubriquesPersonnalisees];
                                                newRubriques[i] = updated;
                                                setRubriquesPersonnalisees(newRubriques);
                                            }}
                                            onDelete={() => {
                                                setRubriquesPersonnalisees(prev => prev.filter((_, idx) => idx !== i));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e2e8f0]">
                                <button onClick={() => { resetForm(); setActiveTab('list'); }}
                                    className="flex items-center gap-2 px-4 py-2 text-[#64748b] hover:text-[#334155] border border-[#d1d5db] rounded-lg hover:bg-[#f8fafc] transition-colors">
                                    <X className="w-4 h-4" />
                                    {t('button.annuler')}
                                </button>
                                <button onClick={sauvegarderEvaluation}
                                    className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors">
                                    <Save className="w-4 h-4" />
                                    {editingEvaluationId ? t('button.mettre_a_jour') : t('button.sauvegarder')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FormDelete evaluationChaud={selectedEvaluation} />
        </>
    );
};

export default EvaluationManager;