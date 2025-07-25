


// const StatCard = ({ label, value }:StatCardProps) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 text-center">
//       <h3 className="text-gray-500 font-medium">{label}</h3>
//       <p className="text-xl font-bold text-blue-600">{value}</p>
//     </div>
//   );
// };

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-2xl shadow-lg border border-[#F3F4F6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex justify-between items-center">
    <div>
      <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
      <p className="text-3xl font-bold text-[#111827]">{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

export default StatCard;
