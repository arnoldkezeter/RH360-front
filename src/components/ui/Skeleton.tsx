// Animation CSS pour le skeleton loading



// Composant Skeleton de base
export const Skeleton = ({ className = "", width = "100%", height = "20px" }) => (
  <div 
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse ${className}`}
    style={{ 
      width, 
      height,
      backgroundSize: '200px 100%',
      animation: 'shimmer 1.5s infinite linear'
    }}
  />
);

// Skeleton pour les cartes de statistiques
export const StatsCardSkeleton = () => (
  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton width="60%" height="16px" className="mb-3" />
        <Skeleton width="40%" height="32px" className="mb-2" />
        <Skeleton width="50%" height="14px" />
      </div>
      <div className="ml-4">
        <Skeleton width="48px" height="48px" className="rounded-full" />
      </div>
    </div>
  </div>
);

// Skeleton pour le diagramme
export const ChartSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton width="60%" height="24px" className="mb-6" />
    <div className="h-80 flex items-end justify-around space-x-2 px-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-2 flex-1">
          <div className="flex space-x-1 w-full justify-center">
            <Skeleton width="20px" height={`${Math.random() * 150 + 50}px`} />
            <Skeleton width="20px" height={`${Math.random() * 120 + 40}px`} />
          </div>
          <Skeleton width="80%" height="12px" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton pour les lignes du tableau
export const TableRowSkeleton = () => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton width="80%" height="16px" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton width="60%" height="20px" className="rounded-full" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton width="50%" height="20px" className="rounded-full" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <Skeleton width="100px" height="8px" className="rounded-full" />
        <Skeleton width="30px" height="16px" />
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton width="70%" height="14px" className="mb-1" />
      <Skeleton width="50%" height="12px" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton width="60px" height="16px" />
    </td>
  </tr>
);