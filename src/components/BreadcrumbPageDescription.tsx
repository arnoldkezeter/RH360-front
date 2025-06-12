import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reduceWord } from '../fonctions/fonction';

interface BreadcrumbItem {
  name: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbPageDescriptionProps {
  pageName: string;
  pageDescription?: string;
  titleColor?: string;
  isDashboard?: boolean;
  breadcrumbItems?: BreadcrumbItem[]; // Nouvelle prop pour les sous-pages
}

const BreadcrumbPageDescription = ({
  pageName,
  pageDescription,
  titleColor = 'text-gray-900',
  isDashboard = false,
  breadcrumbItems = [],
}: BreadcrumbPageDescriptionProps) => {
  const { t } = useTranslation();

  // Construction du breadcrumb complet
  const buildBreadcrumb = () => {
    const items: BreadcrumbItem[] = [
      {
        name: t('tableau_de_bord.title'),
        path: '/',
        isActive: isDashboard
      }
    ];

    if (!isDashboard) {
      // Ajout des éléments personnalisés
      items.push(...breadcrumbItems);
      
      // Ajout de la page actuelle si elle n'est pas déjà dans les items
      const isCurrentPageInItems = breadcrumbItems.some(item => item.isActive);
      if (!isCurrentPageInItems) {
        items.push({
          name: pageName,
          path: '',
          isActive: true
        });
      }
    }

    return items;
  };

  const breadcrumb = buildBreadcrumb();

  const renderBreadcrumb = (isMobile = false) => (
    <nav aria-label="Breadcrumb">
      <ol className={`flex items-center flex-wrap gap-1 ${
        isMobile ? 'text-xs sm:text-sm' : 'text-sm xl:text-base'
      }`}>
        {breadcrumb.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className={`text-gray-400 ${isMobile ? 'mx-1' : 'mx-2'}`}>
                /
              </span>
            )}
            {item.isActive ? (
              <span className="text-gray-700 font-medium">
                {isMobile 
                  ? reduceWord(item.name, 12) 
                  : reduceWord(item.name, 20)
                }
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                {isMobile 
                  ? reduceWord(item.name, 12) 
                  : reduceWord(item.name, 20)
                }
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <div className="bg-white border-gray-200">
      {/* Container principal avec padding responsive */}
      <div className="px-2 sm:px-1 lg:px-4 py-4 sm:py-1 lg:py-6">
        
        {/* Layout Desktop */}
        <div className="hidden lg:flex justify-between items-start">
          {/* Section gauche - Titre et description */}
          <div className="flex-1 min-w-0 pr-6">
            <h1 className={`text-1xl xl:text-2xl font-bold ${titleColor} mb-1`}>
              {pageName}
            </h1>
            {pageDescription && (
              <p className="text-sm xl:text-base text-gray-600 leading-relaxed">
                {pageDescription}
              </p>
            )}
          </div>

          {/* Section droite - Breadcrumb */}
          <div className="flex-shrink-0">
            {renderBreadcrumb(false)}
          </div>
        </div>

        {/* Layout Mobile et Tablet */}
        <div className="lg:hidden">
          {/* Titre et description en haut */}
          <div className="mb-3 sm:mb-4">
            <h1 className={`text-lg sm:text-xl md:text-2xl font-bold ${titleColor} mb-1 sm:mb-2`}>
              {pageName}
            </h1>
            {pageDescription && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 sm:mb-3">
                {pageDescription}
              </p>
            )}
          </div>

          {/* Breadcrumb en dessous sur mobile/tablet */}
          <div className="pt-1">
            {renderBreadcrumb(true)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbPageDescription;