// filter lại chỗ ni theo enum này
const DOCTOR_HEHE = [
  "general_practitioner",
  "gynecologist",
  "dermatologist",
  "pediatrician",
  "neurologist", 
  "gastroenterologist",
];
// 
const DOCTOR_SPECIALTIES = [
  "Bác sĩ mắt",
  "Bác sĩ nhi khoa",
  "Bác sĩ tổng quát",
  "Bác sĩ tim mạch",
  "Bác sĩ mắt",
  "Bác sĩ nhi khoa",
  "Bác sĩ tổng quát",
  "Bác sĩ tim mạch",
];

const SpecialtySidebar = ({ selectedSpecialty, onSpecialtyClick }) => {
  return (
    <div className="xl:w-80 flex-shrink-0">
      <div className="sticky top-28">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🏥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Specialties</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => onSpecialtyClick("")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                !selectedSpecialty
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Tất cả chuyên khoa</span>
                <span className="font-medium">Tất cả chuyên khoa</span>
                {!selectedSpecialty && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
                )}
              </div>
            </button>
            
            {DOCTOR_SPECIALTIES.map((speciality) => (
              <button
                key={speciality}
                onClick={() => onSpecialtyClick(speciality)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                  selectedSpecialty === speciality
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{speciality}</span>
                  {selectedSpecialty === speciality && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtySidebar;