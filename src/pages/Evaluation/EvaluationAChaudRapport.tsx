import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChevronDown, ChevronUp, MessageSquare, Users, TrendingUp, Star, Filter, Download, Calendar } from 'lucide-react';

// Types pour l'interface
interface EvaluationData {
  titreFr: string;
  titreEn: string;
  theme: string;
  totalReponses: number;
  tauxReponse: number;
  moyenneGlobale: number;
  dateDebut: string;
  dateFin: string;
}

interface RepartitionItem {
  echelle: string;
  valeur: number;
  couleur: string;
}

interface SousQuestion {
  libelle: string;
  moyenne: number;
}

interface Question {
  id: number;
  libelleFr: string;
  libelleEn: string;
  moyenne: number;
  repartition: RepartitionItem[];
  sousQuestions?: SousQuestion[];
}

interface Rubrique {
  id: number;
  titreFr: string;
  titreEn: string;
  moyenne: number;
  questions: Question[];
}

interface EvolutionData {
  mois: string;
  moyenne: number;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  titre: string;
  valeur: string | number;
  couleur: string;
  description?: string;
}

interface QuestionDetailProps {
  question: Question;
  language: string;
}

const EvaluationResults: React.FC = () => {
  const [selectedRubrique, setSelectedRubrique] = useState<number | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Données d'exemple
  const evaluationData: EvaluationData = {
    titreFr: "Évaluation - Formation Leadership Digital",
    titreEn: "Evaluation - Digital Leadership Training",
    theme: "Leadership & Management",
    totalReponses: 47,
    tauxReponse: 78,
    moyenneGlobale: 4.2,
    dateDebut: "2024-01-15",
    dateFin: "2024-01-19"
  };

  const rubriques: Rubrique[] = [
    {
      id: 1,
      titreFr: "Contenu de la formation",
      titreEn: "Training Content",
      moyenne: 4.3,
      questions: [
        {
          id: 1,
          libelleFr: "La formation répond-elle à vos attentes ?",
          libelleEn: "Does the training meet your expectations?",
          moyenne: 4.5,
          repartition: [
            { echelle: "Très satisfait", valeur: 32, couleur: "#22c55e" },
            { echelle: "Satisfait", valeur: 12, couleur: "#84cc16" },
            { echelle: "Neutre", valeur: 2, couleur: "#eab308" },
            { echelle: "Insatisfait", valeur: 1, couleur: "#f97316" },
            { echelle: "Très insatisfait", valeur: 0, couleur: "#ef4444" }
          ],
          sousQuestions: [
            { libelle: "Pertinence du contenu", moyenne: 4.4 },
            { libelle: "Clarté des explications", moyenne: 4.6 },
            { libelle: "Exemples pratiques", moyenne: 4.2 }
          ]
        },
        {
          id: 2,
          libelleFr: "Le niveau de difficulté était-il adapté ?",
          libelleEn: "Was the difficulty level appropriate?",
          moyenne: 4.1,
          repartition: [
            { echelle: "Très satisfait", valeur: 25, couleur: "#22c55e" },
            { echelle: "Satisfait", valeur: 18, couleur: "#84cc16" },
            { echelle: "Neutre", valeur: 3, couleur: "#eab308" },
            { echelle: "Insatisfait", valeur: 1, couleur: "#f97316" },
            { echelle: "Très insatisfait", valeur: 0, couleur: "#ef4444" }
          ]
        }
      ]
    },
    {
      id: 2,
      titreFr: "Animation et formateur",
      titreEn: "Facilitation and Trainer",
      moyenne: 4.6,
      questions: [
        {
          id: 3,
          libelleFr: "Qualité de l'animation",
          libelleEn: "Quality of facilitation",
          moyenne: 4.7,
          repartition: [
            { echelle: "Très satisfait", valeur: 38, couleur: "#22c55e" },
            { echelle: "Satisfait", valeur: 8, couleur: "#84cc16" },
            { echelle: "Neutre", valeur: 1, couleur: "#eab308" },
            { echelle: "Insatisfait", valeur: 0, couleur: "#f97316" },
            { echelle: "Très insatisfait", valeur: 0, couleur: "#ef4444" }
          ]
        }
      ]
    },
    {
      id: 3,
      titreFr: "Organisation logistique",
      titreEn: "Logistics Organization",
      moyenne: 3.8,
      questions: [
        {
          id: 4,
          libelleFr: "Qualité des supports pédagogiques",
          libelleEn: "Quality of educational materials",
          moyenne: 3.9,
          repartition: [
            { echelle: "Très satisfait", valeur: 15, couleur: "#22c55e" },
            { echelle: "Satisfait", valeur: 22, couleur: "#84cc16" },
            { echelle: "Neutre", valeur: 8, couleur: "#eab308" },
            { echelle: "Insatisfait", valeur: 2, couleur: "#f97316" },
            { echelle: "Très insatisfait", valeur: 0, couleur: "#ef4444" }
          ]
        }
      ]
    }
  ];

  const commentaires: string[] = [
    "Formation très enrichissante, j'ai particulièrement apprécié les cas pratiques.",
    "Le formateur était excellent, très pédagogue et à l'écoute.",
    "Contenu dense mais bien structuré. Les supports pourraient être améliorés.",
    "Parfait pour développer ses compétences en leadership digital.",
    "Bonne formation dans l'ensemble, je recommande."
  ];

  const evolutionData: EvolutionData[] = [
    { mois: 'Oct', moyenne: 3.8 },
    { mois: 'Nov', moyenne: 4.0 },
    { mois: 'Déc', moyenne: 4.1 },
    { mois: 'Jan', moyenne: 4.2 }
  ];

  const getBackgroundColor = (couleur: string): string => {
    switch (couleur) {
      case 'text-green-600':
        return 'bg-[#dcfce7]';
      case 'text-blue-600':
        return 'bg-[#dbeafe]';
      case 'text-purple-600':
        return 'bg-[#f3e8ff]';
      default:
        return 'bg-[#f3f4f6]';
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, titre, valeur, couleur, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{titre}</p>
          <p className={`text-3xl font-bold ${couleur}`}>{valeur}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-full ${getBackgroundColor(couleur)}`}>
          <Icon className={`h-6 w-6 ${couleur}`} />
        </div>
      </div>
    </div>
  );

  const QuestionDetail: React.FC<QuestionDetailProps> = ({ question }) => (
    <div className="bg-[#f9fafb] p-4 rounded-lg mb-4">
      <h4 className="font-medium text-gray-900 mb-3">
        {language === 'fr' ? question.libelleFr : question.libelleEn}
      </h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Répartition des réponses</h5>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={question.repartition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="echelle" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valeur" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique circulaire */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Distribution</h5>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={question.repartition}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="valeur"
                label={({ valeur }: { valeur: number }) => `${valeur}`}
              >
                {question.repartition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sous-questions */}
      {question.sousQuestions && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Détail par aspect</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {question.sousQuestions.map((sq, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-600">{sq.libelle}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-[#facc15] mr-1" />
                  <span className="font-semibold text-gray-900">{sq.moyenne}</span>
                  <span className="text-gray-500 text-sm ml-1">/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'fr' ? evaluationData.titreFr : evaluationData.titreEn}
              </h1>
              <p className="text-gray-600 mt-1">Thème: {evaluationData.theme}</p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                {evaluationData.dateDebut} - {evaluationData.dateFin}
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            titre="Participants"
            valeur={evaluationData.totalReponses}
            couleur="text-blue-600"
            description={`${evaluationData.tauxReponse}% de taux de réponse`}
          />
          <StatCard
            icon={Star}
            titre="Moyenne globale"
            valeur={`${evaluationData.moyenneGlobale}/5`}
            couleur="text-green-600"
          />
          <StatCard
            icon={TrendingUp}
            titre="Évolution"
            valeur="+0.1"
            couleur="text-green-600"
            description="vs mois précédent"
          />
          <StatCard
            icon={MessageSquare}
            titre="Commentaires"
            valeur={commentaires.length}
            couleur="text-purple-600"
          />
        </div>

        {/* Évolution temporelle */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution de la satisfaction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis domain={[3, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Résultats par rubrique */}
        <div className="space-y-6">
          {rubriques.map((rubrique) => (
            <div key={rubrique.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setSelectedRubrique(selectedRubrique === rubrique.id ? null : rubrique.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'fr' ? rubrique.titreFr : rubrique.titreEn}
                    </h3>
                    <div className="flex items-center bg-[#dcfce7] px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-[#16a34a] mr-1" />
                      <span className="font-semibold text-[#15803d]">{rubrique.moyenne}</span>
                    </div>
                  </div>
                  {selectedRubrique === rubrique.id ? 
                    <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </div>
              </div>

              {selectedRubrique === rubrique.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-6">
                    {rubrique.questions.map((question) => (
                      <QuestionDetail key={question.id} question={question} language={language} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Commentaires */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Commentaires des participants</h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center text-[#3b82f6] hover:text-[#2563eb]"
              >
                {showComments ? 'Masquer' : 'Afficher'} tous
                {showComments ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </button>
            </div>

            {(showComments ? commentaires : commentaires.slice(0, 2)).map((commentaire, index) => (
              <div key={index} className="bg-[#f9fafb] p-4 rounded-lg mb-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#dbeafe] p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-[#3b82f6]" />
                  </div>
                  <p className="text-gray-700 italic">"{commentaire}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResults;