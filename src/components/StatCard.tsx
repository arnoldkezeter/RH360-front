
interface StatCardProps {
    label: string;
    value:number | string;
}

const StatCard = ({ label, value }:StatCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-gray-500 font-medium">{label}</h3>
      <p className="text-xl font-bold text-blue-600">{value}</p>
    </div>
  );
};

export default StatCard;
