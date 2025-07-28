import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle, Star, MessageSquare, User, Calendar, BookOpen } from 'lucide-react';


const EvaluationForm = () => {
  const [currentRubrique, setCurrentRubrique] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [commentaires, setCommentaires] = useState<Record<string, string>>({});
  const [commentaireGeneral, setCommentaireGeneral] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Données d'exemple d'une évaluation (adaptées aux nouveaux types)
  const evaluation: EvaluationChaud = {
    _id: '507f1f77bcf86cd799439011',
    titreFr: "Évaluation - Formation Leadership Digital",
    titreEn: "Evaluation - Digital Leadership Training",
    descriptionFr: "Merci de prendre quelques minutes pour évaluer cette formation",
    descriptionEn: "Thank you for taking a few minutes to evaluate this training",
    theme: "Leadership & Management",
    actif: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    rubriques: [
      {
        _id: '1',
        titreFr: "Contenu de la formation",
        titreEn: "Training Content",
        ordre: 1,
        questions: [
          {
            _id: 'q1',
            libelleFr: "La formation répond-elle à vos attentes ?",
            libelleEn: "Does the training meet your expectations?",
            echelle: [
              { valeurFr: "Pas du tout", valeurEn: "Not at all", ordre: 1 },
              { valeurFr: "Peu", valeurEn: "A little", ordre: 2 },
              { valeurFr: "Moyennement", valeurEn: "Moderately", ordre: 3 },
              { valeurFr: "Bien", valeurEn: "Well", ordre: 4 },
              { valeurFr: "Parfaitement", valeurEn: "Perfectly", ordre: 5 }
            ],
            sousQuestions: [
              {
                _id: 'sq1_1',
                libelleFr: "Pertinence du contenu",
                libelleEn: "Content relevance",
                commentaireObligatoire: false,
                ordre: 1
              },
              {
                _id: 'sq1_2',
                libelleFr: "Clarté des explications",
                libelleEn: "Clarity of explanations",
                commentaireObligatoire: false,
                ordre: 2
              },
              {
                _id: 'sq1_3',
                libelleFr: "Exemples pratiques",
                libelleEn: "Practical examples",
                commentaireObligatoire: true,
                ordre: 3
              }
            ],
            commentaireGlobal: true,
            ordre: 1
          },
          {
            _id: 'q2',
            libelleFr: "Le niveau de difficulté était-il adapté ?",
            libelleEn: "Was the difficulty level appropriate?",
            echelle: [
              { valeurFr: "Trop facile", valeurEn: "Too easy", ordre: 1 },
              { valeurFr: "Facile", valeurEn: "Easy", ordre: 2 },
              { valeurFr: "Adapté", valeurEn: "Appropriate", ordre: 3 },
              { valeurFr: "Difficile", valeurEn: "Difficult", ordre: 4 },
              { valeurFr: "Trop difficile", valeurEn: "Too difficult", ordre: 5 }
            ],
            sousQuestions: [],
            commentaireGlobal: false,
            ordre: 2
          }
        ]
      },
      {
        _id: '2',
        titreFr: "Animation et formateur",
        titreEn: "Facilitation and Trainer",
        ordre: 2,
        questions: [
          {
            _id: 'q3',
            libelleFr: "Comment évaluez-vous la qualité de l'animation ?",
            libelleEn: "How do you rate the quality of facilitation?",
            echelle: [
              { valeurFr: "Très mauvaise", valeurEn: "Very poor", ordre: 1 },
              { valeurFr: "Mauvaise", valeurEn: "Poor", ordre: 2 },
              { valeurFr: "Correcte", valeurEn: "Fair", ordre: 3 },
              { valeurFr: "Bonne", valeurEn: "Good", ordre: 4 },
              { valeurFr: "Excellente", valeurEn: "Excellent", ordre: 5 }
            ],
            sousQuestions: [],
            commentaireGlobal: true,
            ordre: 1
          }
        ]
      },
      {
        _id: '3',
        titreFr: "Organisation logistique",
        titreEn: "Logistics Organization",
        ordre: 3,
        questions: [
          {
            _id: 'q4',
            libelleFr: "Qualité des supports pédagogiques",
            libelleEn: "Quality of educational materials",
            echelle: [
              { valeurFr: "Très insatisfaisante", valeurEn: "Very unsatisfactory", ordre: 1 },
              { valeurFr: "Insatisfaisante", valeurEn: "Unsatisfactory", ordre: 2 },
              { valeurFr: "Correcte", valeurEn: "Fair", ordre: 3 },
              { valeurFr: "Satisfaisante", valeurEn: "Satisfactory", ordre: 4 },
              { valeurFr: "Très satisfaisante", valeurEn: "Very satisfactory", ordre: 5 }
            ],
            sousQuestions: [],
            commentaireGlobal: false,
            ordre: 1
          }
        ]
      }
    ]
  };

  // Validation des réponses
  const validateResponses = (): Record<string, boolean> => {
    const errors: Record<string, boolean> = {};
    
    evaluation.rubriques.forEach(rubrique => {
      rubrique.questions.forEach(question => {
        if (question.sousQuestions.length > 0) {
          // Question avec sous-questions
          question.sousQuestions.forEach(sousQuestion => {
            const key = `${question._id}_${sousQuestion._id}`;
            if (!responses[key]) {
              errors[key] = true;
            }
            // Vérifier commentaire obligatoire
            if (sousQuestion.commentaireObligatoire && !commentaires[key]) {
              errors[`${key}_comment`] = true;
            }
          });
        } else {
          // Question simple
          if (!responses[question._id!]) {
            errors[question._id!] = true;
          }
        }
      });
    });
    
    return errors;
  };

  // Gestion de la réponse
  const handleResponse = (questionId: string, sousQuestionId: string | null, ordre: number) => {
    const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
    setResponses(prev => ({
      ...prev,
      [key]: ordre
    }));
  };

  // Gestion des commentaires
  const handleComment = (questionId: string, sousQuestionId: string | null, value: string) => {
    const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
    setCommentaires(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Navigation
  const goToNextRubrique = () => {
    if (currentRubrique < evaluation.rubriques.length - 1) {
      setCurrentRubrique(currentRubrique + 1);
    }
  };

  const goToPrevRubrique = () => {
    if (currentRubrique > 0) {
      setCurrentRubrique(currentRubrique - 1);
    }
  };

  // Soumission
  const handleSubmit = async () => {
    const errors = validateResponses();
    if (Object.keys(errors).length > 0) {
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);
    
    // Construction de la réponse selon votre modèle
    const reponseData = {
      modele: evaluation._id,
      rubriques: evaluation.rubriques.map(rubrique => ({
        rubriqueId: rubrique._id,
        questions: rubrique.questions.map(question => {
          const questionReponse = {
            questionId: question._id,
            sousReponses: [] as any[],
            commentaireGlobal: commentaires[question._id!] || null
          };

          if (question.sousQuestions.length > 0) {
            // Question avec sous-questions
            questionReponse.sousReponses = question.sousQuestions.map(sq => ({
              sousQuestionId: sq._id,
              reponseEchelleOrdre: responses[`${question._id}_${sq._id}`],
              commentaire: commentaires[`${question._id}_${sq._id}`] || null
            }));
          } else {
            // Question simple
            (questionReponse as any).reponseEchelleOrdre = responses[question._id!];
          }

          return questionReponse;
        })
      })),
      commentaireGeneral: commentaireGeneral
    };

    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Réponse soumise:', reponseData);
      alert('Évaluation soumise avec succès !');
    } catch (error) {
      alert('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcul de progression
  const totalQuestions = evaluation.rubriques.reduce((total, rubrique) => {
    return total + rubrique.questions.reduce((qTotal, question) => {
      return qTotal + (question.sousQuestions.length > 0 ? question.sousQuestions.length : 1);
    }, 0);
  }, 0);

  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const RatingScale = ({ echelle, selectedOrdre, onSelect, questionId, sousQuestionId }: {
    echelle: Echelle[];
    selectedOrdre?: number;
    onSelect: (questionId: string, sousQuestionId: string | null, ordre: number) => void;
    questionId: string;
    sousQuestionId?: string | null;
  }) => (
    <div className="grid grid-cols-5 gap-2 my-4">
      {echelle.map((option) => (
        <button
          key={option.ordre}
          onClick={() => onSelect(questionId, sousQuestionId || null, option.ordre)}
          className={`p-3 rounded-lg border-2 transition-all text-sm ${
            selectedOrdre === option.ordre
              ? 'border-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151]'
          }`}
        >
          <div className="flex flex-col items-center">
            <Star 
              className={`h-5 w-5 mb-1 ${
                selectedOrdre === option.ordre ? 'text-[#3B82F6] fill-current' : 'text-[#9CA3AF]'
              }`} 
            />
            <span className="text-xs text-center">
              {language === 'fr' ? option.valeurFr : option.valeurEn}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  const CommentField = ({ questionId, sousQuestionId, isRequired = false, placeholder }: {
    questionId: string;
    sousQuestionId?: string | null;
    isRequired?: boolean;
    placeholder?: string;
  }) => {
    const key = sousQuestionId ? `${questionId}_${sousQuestionId}` : questionId;
    const hasError = showValidation && isRequired && !commentaires[key];
    
    return (
      <div className="mt-3">
        <textarea
          value={commentaires[key] || ''}
          onChange={(e) => handleComment(questionId, sousQuestionId || null, e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent ${
            hasError ? 'border-[#F87171] bg-[#FEF2F2]' : 'border-[#D1D5DB]'
          }`}
          rows={3}
        />
        {hasError && (
          <p className="text-[#EF4444] text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Commentaire obligatoire
          </p>
        )}
      </div>
    );
  };

  const currentRubriqueData = evaluation.rubriques[currentRubrique];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#E0E7FF]">
      {/* Header */}
      <div className="bg-[#FFFFFF] shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#DBEAFE] p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#111827]">
                  {language === 'fr' ? evaluation.titreFr : evaluation.titreEn}
                </h1>
                <p className="text-[#6B7280] text-sm">
                  {language === 'fr' ? evaluation.descriptionFr : evaluation.descriptionEn}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="px-3 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-[#6B7280] mb-2">
              <span>Progression</span>
              <span>{Math.round(progressPercentage)}% complété</span>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div 
                className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation des rubriques */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-2">
            {evaluation.rubriques.map((rubrique, index) => (
              <button
                key={rubrique._id}
                onClick={() => setCurrentRubrique(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  index === currentRubrique
                    ? 'bg-[#2563EB] text-[#FFFFFF]'
                    : index < currentRubrique
                    ? 'bg-[#DCFCE7] text-[#166534]'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {index + 1}. {language === 'fr' ? rubrique.titreFr : rubrique.titreEn}
                {index < currentRubrique && (
                  <CheckCircle className="inline h-4 w-4 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu de la rubrique */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              {language === 'fr' ? currentRubriqueData.titreFr : currentRubriqueData.titreEn}
            </h2>
            <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded"></div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentRubriqueData.questions.map((question) => (
              <div key={question._id} className="border-b border-[#E5E7EB] pb-8 last:border-b-0">
                <h3 className="text-lg font-semibold text-[#111827] mb-4">
                  {language === 'fr' ? question.libelleFr : question.libelleEn}
                </h3>

                {question.sousQuestions.length > 0 ? (
                  // Question avec sous-questions
                  <div className="space-y-6">
                    {question.sousQuestions.map((sousQuestion) => {
                      const key = `${question._id}_${sousQuestion._id}`;
                      const hasError = showValidation && !responses[key];
                      
                      return (
                        <div key={sousQuestion._id} className={`p-4 rounded-lg border ${
                          hasError ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
                        }`}>
                          <h4 className="font-medium text-[#1F2937] mb-3">
                            {language === 'fr' ? sousQuestion.libelleFr : sousQuestion.libelleEn}
                            {sousQuestion.commentaireObligatoire && (
                              <span className="text-[#EF4444] ml-1">*</span>
                            )}
                          </h4>
                          
                          {hasError && (
                            <div className="flex items-center text-[#DC2626] text-sm mb-3">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Veuillez sélectionner une réponse
                            </div>
                          )}

                          <RatingScale
                            echelle={question.echelle}
                            selectedOrdre={responses[key]}
                            onSelect={handleResponse}
                            questionId={question._id!}
                            sousQuestionId={sousQuestion._id!}
                          />

                          <CommentField
                            questionId={question._id!}
                            sousQuestionId={sousQuestion._id!}
                            isRequired={sousQuestion.commentaireObligatoire}
                            placeholder="Votre commentaire (optionnel)"
                          />
                        </div>
                      );
                    })}

                    {/* Commentaire global pour la question */}
                    {question.commentaireGlobal && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-[#374151] mb-2">
                          <MessageSquare className="inline h-4 w-4 mr-2" />
                          Commentaire général sur cette question
                        </label>
                        <CommentField
                          questionId={question._id!}
                          placeholder="Votre commentaire général..."
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // Question simple
                  <div>
                    {showValidation && !responses[question._id!] && (
                      <div className="flex items-center text-[#DC2626] text-sm mb-3">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Veuillez sélectionner une réponse
                      </div>
                    )}

                    <RatingScale
                      echelle={question.echelle}
                      selectedOrdre={responses[question._id!]}
                      onSelect={handleResponse}
                      questionId={question._id!}
                    />

                    {question.commentaireGlobal && (
                      <CommentField
                        questionId={question._id!}
                        placeholder="Votre commentaire..."
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commentaire général (dernière rubrique) */}
        {currentRubrique === evaluation.rubriques.length - 1 && (
          <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-8 mt-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-[#2563EB]" />
              Commentaire général sur la formation
            </h3>
            <textarea
              value={commentaireGeneral}
              onChange={(e) => setCommentaireGeneral(e.target.value)}
              placeholder="Partagez vos impressions générales, suggestions d'amélioration..."
              className="w-full p-4 border border-[#D1D5DB] rounded-lg resize-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              rows={4}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goToPrevRubrique}
            disabled={currentRubrique === 0}
            className="flex items-center px-6 py-3 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Précédent
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-[#4B5563] text-[#FFFFFF] rounded-lg hover:bg-[#374151] disabled:opacity-50 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>

            {currentRubrique === evaluation.rubriques.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-[#2563EB] text-[#FFFFFF] rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Soumettre l'évaluation
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={goToNextRubrique}
                className="flex items-center px-6 py-3 bg-[#2563EB] text-[#FFFFFF] rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                Suivant
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="mt-8 p-4 bg-[#EFF6FF] rounded-lg">
          <div className="flex items-center text-sm text-[#1E40AF]">
            <User className="h-4 w-4 mr-2" />
            <span>Vos réponses sont sauvegardées automatiquement</span>
            <Calendar className="h-4 w-4 ml-4 mr-2" />
            <span>Évaluation valide jusqu'au 31/01/2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;