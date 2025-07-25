import React from 'react';

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
  payload?: any;
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  showTotal?: boolean;
  totalLabel?: string;
  className?: string;
  labelClassName?: string;
  itemClassName?: string;
  valueClassName?: string;
  totalClassName?: string;
  colorIndicatorShape?: 'circle' | 'square' | 'rounded';
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
  customHeader?: (label: string, payload: TooltipPayloadItem[]) => React.ReactNode;
  customFooter?: (total: number, payload: TooltipPayloadItem[]) => React.ReactNode;
  maxItems?: number;
  sortPayload?: boolean;
  hideZeroValues?: boolean;
}

const CustomChartTooltip: React.FC<CustomChartTooltipProps> = ({
  active,
  payload,
  label,
  showTotal = true,
  totalLabel = 'Total',
  className = '',
  labelClassName = '',
  itemClassName = '',
  valueClassName = '',
  totalClassName = '',
  colorIndicatorShape = 'rounded',
  formatValue = (value) => value.toString(),
  formatLabel = (label) => label,
  customHeader,
  customFooter,
  maxItems,
  sortPayload = false,
  hideZeroValues = false,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Filtrer les valeurs nulles/zéro si nécessaire
  let filteredPayload = hideZeroValues 
    ? payload.filter(item => item.value > 0)
    : payload;

  // Trier si demandé
  if (sortPayload) {
    filteredPayload = [...filteredPayload].sort((a, b) => b.value - a.value);
  }

  // Limiter le nombre d'éléments si spécifié
  if (maxItems && filteredPayload.length > maxItems) {
    filteredPayload = filteredPayload.slice(0, maxItems);
  }

  const total = filteredPayload.reduce((sum, item) => sum + item.value, 0);

  const getColorIndicatorClass = () => {
    switch (colorIndicatorShape) {
      case 'circle':
        return 'w-3 h-3 rounded-full';
      case 'square':
        return 'w-3 h-3';
      case 'rounded':
      default:
        return 'w-3 h-3 rounded';
    }
  };

  const baseClasses = "bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs";
  const labelClasses = `font-medium text-gray-900 mb-2 ${labelClassName}`;
  const itemClasses = `flex items-center justify-between gap-4 mb-1 ${itemClassName}`;
  const valueClasses = `font-medium text-sm ${valueClassName}`;
  const totalClasses = `border-t pt-2 mt-2 ${totalClassName}`;

  return (
    <div className={`${baseClasses} ${className}`}>
      {/* Header personnalisé ou label par défaut */}
      {customHeader ? (
        customHeader(label || '', filteredPayload)
      ) : (
        label && (
          <p className={labelClasses}>
            {formatLabel(label)}
          </p>
        )
      )}

      {/* Liste des éléments */}
      {filteredPayload.map((item, index) => (
        <div key={`${item.dataKey}-${index}`} className={itemClasses}>
          <div className="flex items-center gap-2">
            <div 
              className={getColorIndicatorClass()}
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-600" title={item.name}>
              {item.name}
            </span>
          </div>
          <span className={valueClasses}>
            {formatValue(item.value)}
          </span>
        </div>
      ))}

      {/* Affichage du total ou footer personnalisé */}
      {showTotal && (
        <div className={totalClasses}>
          {customFooter ? (
            customFooter(total, filteredPayload)
          ) : (
            <div className="flex justify-between">
              <span className="text-sm font-medium">{totalLabel}:</span>
              <span className="font-bold">{formatValue(total)}</span>
            </div>
          )}
        </div>
      )}

      {/* Indicateur si des éléments ont été tronqués */}
      {maxItems && payload.length > maxItems && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          +{payload.length - maxItems} autres éléments
        </div>
      )}
    </div>
  );
};

// Hook personnalisé pour faciliter l'utilisation
export const useChartTooltip = (options: Partial<CustomChartTooltipProps> = {}) => {
  return (props: any) => <CustomChartTooltip {...props} {...options} />;
};

// Presets communs
export const TooltipPresets = {
  // Tooltip simple sans total
  simple: (props: any) => (
    <CustomChartTooltip 
      {...props} 
      showTotal={false}
      hideZeroValues={true}
    />
  ),

  // Tooltip avec pourcentages
  percentage: (props: any) => (
    <CustomChartTooltip 
      {...props}
      formatValue={(value) => `${value}%`}
      totalLabel="Total"
    />
  ),

  // Tooltip avec devise
  currency: (props: any) => (
    <CustomChartTooltip 
      {...props}
      formatValue={(value) => `${value.toLocaleString()} €`}
      totalLabel="Total"
    />
  ),

  // Tooltip compact (limité à 3 éléments)
  compact: (props: any) => (
    <CustomChartTooltip 
      {...props}
      maxItems={3}
      sortPayload={true}
      hideZeroValues={true}
    />
  ),

  // Tooltip avec indicateurs circulaires
  circular: (props: any) => (
    <CustomChartTooltip 
      {...props}
      colorIndicatorShape="circle"
    />
  ),
};

// Exemples d'utilisation
const ExampleUsage = () => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Exemples d'utilisation du CustomChartTooltip</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">1. Utilisation basique</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm">
          {`<Tooltip content={<CustomChartTooltip />} />`}
        </code>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">2. Avec formatage personnalisé</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm">
          {`<Tooltip content={
  <CustomChartTooltip 
    formatValue={(value) => \`\${value.toLocaleString()} €\`}
    totalLabel="Total des ventes"
    hideZeroValues={true}
  />
} />`}
        </code>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3. Avec preset</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm">
          {`<Tooltip content={TooltipPresets.currency} />`}
        </code>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">4. Avec hook personnalisé</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm">
          {`const MyTooltip = useChartTooltip({
  formatValue: (value) => \`\${value}%\`,
  colorIndicatorShape: 'circle',
  maxItems: 5
});

<Tooltip content={MyTooltip} />`}
        </code>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">5. Avec header et footer personnalisés</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm">
          {`<Tooltip content={
  <CustomChartTooltip 
    customHeader={(label, payload) => (
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-bold">{label}</span>
      </div>
    )}
    customFooter={(total, payload) => (
      <div className="text-center mt-2 text-blue-600">
        Moyenne: {Math.round(total / payload.length)}
      </div>
    )}
  />
} />`}
        </code>
      </div>
    </div>
  );
};

export default CustomChartTooltip;
export { ExampleUsage };