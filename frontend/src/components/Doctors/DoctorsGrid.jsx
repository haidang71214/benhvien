import DoctorCard from "./DoctorCard";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import EmptyState from "../states/EmptyState";
import { Star } from "lucide-react";

const getAvailabilityColor = (availability = "") => {
  const lowerCaseAvailability = availability.toLowerCase();
  if (
    lowerCaseAvailability.includes("ngay") ||
    lowerCaseAvailability.includes("hôm nay")
  ) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (
    lowerCaseAvailability.includes("mai") ||
    lowerCaseAvailability.includes("ngày mai")
  ) {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    );
  }

  return stars;
};
const DoctorsGrid = ({
  loading,
  error,
  doctors,
  selectedSpecialty,
  onDoctorClick,
  onRetry,
  onSpecialtyClick,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!doctors || doctors.length === 0) {
    return (
      <EmptyState
        selectedSpecialty={selectedSpecialty}
        onSpecialtyClick={onSpecialtyClick}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {doctors.map((doctor, index) => (
        <div
          key={doctor._id}
          onClick={() => onDoctorClick(doctor)}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "fadeInUp 0.6s ease-out forwards",
          }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:bg-white relative">
            <DoctorCard
              doctor={doctor}
              handleDoctorClick={onDoctorClick}
              getAvailabilityColor={getAvailabilityColor}
              renderStars={renderStars}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorsGrid;
