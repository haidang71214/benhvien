import DoctorCard from "./DoctorCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

const DoctorsGrid = ({ 
  loading, 
  error, 
  paginatedDoctors, 
  selectedSpecialty, 
  onDoctorClick, 
  onRetry, 
  onSpecialtyClick 
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (paginatedDoctors.length === 0) {
    return (
      <EmptyState 
        selectedSpecialty={selectedSpecialty} 
        onSpecialtyClick={onSpecialtyClick} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {paginatedDoctors.map((doctor, index) => (
        <div
          key={doctor._id}
          onClick={() => onDoctorClick(doctor)}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "fadeInUp 0.6s ease-out forwards"
          }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:bg-white relative">
            <DoctorCard doctor={doctor} />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorsGrid;