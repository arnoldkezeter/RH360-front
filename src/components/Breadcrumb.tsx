import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reduceWord } from '../fonctions/fonction';

interface BreadcrumbProps {
  pageName: string;
  isDashboard?: boolean;
  isChapitre?: boolean;
  isQuestion?: boolean;
  isTest?:boolean;
  isObjectif?: boolean;
  isPeriodeEnseignement?: boolean;
  isEnseignement?: boolean;
  returnWithMatiere?: () => void;
  returnWithChapitre?: () => void;
  returnWithPeriodeEnseignement?: () => void;

  isGestionEnseignant?: boolean;
  isGestionEtudiant?: boolean;
}

const Breadcrumb = ({
  pageName,
  isGestionEnseignant = false,
  isGestionEtudiant = false,
  isDashboard = false,
  isChapitre = false,
  isObjectif = false,
  isQuestion = false,
  isTest = false,
  isEnseignement = false,
  isPeriodeEnseignement = false,
}: BreadcrumbProps) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleMatiere = () => {
    navigate('/subjects/subject-list');
  };

  const handlePeriodeEnseigenement = () => {
    navigate('/subjects/periodes_enseignement');
  };

  const handleDisciplneEnseignant = () => {
    navigate('/teachers/disciplines/');
  };

  const handleDisciplneEtudiant = () => {
    navigate('/students/disciplines/');
  };
  
  const handleExercice = () => {
    navigate('/pedagogies/exercise-book');
  };

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:justify-between">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-black dark:text-white">{pageName}</h2>

      <nav>
        <ol className="text-[14.5px] md:text-[15px] flex items-center gap-2">
          <li>
            <span className='flex'>
              <Link className='hover:underline' to={"/"}>{t('tableau_de_bord.title')}</Link>
              <span className='ml-2'> /</span>
            </span>
          </li>

          {isChapitre && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/subjects/subject-list"} onClick={handleMatiere}>{t('sub_menu.liste_matiere')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isObjectif && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/subjects/subject-list"} onClick={handleMatiere}>{t('sub_menu.liste_matiere')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isEnseignement && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/subjects/subject-list"} onClick={handleMatiere}>{t('sub_menu.liste_matiere')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isPeriodeEnseignement && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/subjects/periodes_enseignement"} onClick={handlePeriodeEnseigenement}>{t('sub_menu.periodes_enseignement')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isGestionEnseignant && (
            <li>
              <span className='flex'>
                <Link className='hover:underline ' to={"/teachers/disciplines"} onClick={handleDisciplneEnseignant}>{ t('sub_menu.discipline')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isGestionEtudiant && (
            <li>
              <span className='flex'>
                <Link className='hover:underline ' to={"/students/disciplines"} onClick={handleDisciplneEtudiant}>{t('sub_menu.discipline')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {isQuestion && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/pedagogies/exercise-book"} onClick={handleExercice}>{t('sub_menu.cahier_exercice')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )}

          {/* {isTest && (
            <li>
              <span className='flex'>
                <Link className='hover:underline' to={"/pedagogies/exercise-book"} onClick={handleExercice}>{t('sub_menu.cahier_exercice')}</Link>
                <span className='ml-2'> /</span>
              </span>
            </li>
          )} */}

          {!isDashboard && <li className="text-primary">{reduceWord(pageName, 15)}</li>}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
