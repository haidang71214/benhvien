import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useDoctors } from "../../hooks/useDoctors";
import DoctorsHero from "../../components/doctors/DoctorsHero";
import SpecialtySidebar from "../../components/doctors/SpecialtySidebar";
import DoctorsHeader from "../../components/doctors/DoctorsHeader";
import DoctorsGrid from "../../components/doctors/DoctorsGrid";

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    loading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    currentPage,
    doctorsPerPage,
    filteredDoctors,
    totalPage,
    startIndex,
    paginatedDoctors,
    fetchDoctors,
    handlePageChange,
  } = useDoctors();

  const handleSpecialtyClick = (value) => {
    const newSpecialty = selectedSpecialty === value ? "" : value;
    setSelectedSpecialty(newSpecialty);
    navigate(newSpecialty ? `/doctors/${newSpecialty}` : "/doctors");
  };

  const handleDoctorClick = (doctor) => {
    if (!user?.id) {
      toast.error("Please login to book an appointment!");
      return;
    }
    navigate(`/appointment/${doctor._id}`);
  };

  const handleRetry = () => {
    toast.info("Refreshing doctor list...");
    fetchDoctors();
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DoctorsHero />
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col xl:flex-row gap-8">
          <SpecialtySidebar
            selectedSpecialty={selectedSpecialty}
            onSpecialtyClick={handleSpecialtyClick}
          />

          <div className="flex-1 min-h-[600px] flex flex-col">
            <DoctorsHeader
              selectedSpecialty={selectedSpecialty}
              loading={loading}
              error={error}
              filteredDoctors={filteredDoctors}
              startIndex={startIndex}
              doctorsPerPage={doctorsPerPage}
            />

            <div className="flex-1">
              <DoctorsGrid
                loading={loading}
                error={error}
                paginatedDoctors={paginatedDoctors}
                selectedSpecialty={selectedSpecialty}
                onDoctorClick={handleDoctorClick}
                onRetry={handleRetry}
                onSpecialtyClick={handleSpecialtyClick}
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
