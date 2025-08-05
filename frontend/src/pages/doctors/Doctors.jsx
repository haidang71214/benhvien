import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useDoctors } from "../../hooks/useDoctors";
import DoctorsHero from "../../components/Doctors/DoctorsHero";
import SpecialtySidebar from "../../components/Doctors/SpecialtySidebar";
import DoctorsHeader from "../../components/Doctors/DoctorsHeader";
import DoctorsGrid from "../../components/doctors/DoctorsGrid";

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    loading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    doctorsPerPage,
    filteredDoctors,
    startIndex,
    fetchDoctors,
  } = useDoctors();

  const handleSpecialtyClick = (value) => {
    const newSpecialty = selectedSpecialty === value ? "" : value;
    setSelectedSpecialty(newSpecialty);
    if (newSpecialty) {
      navigate(`/booking/doctors/${newSpecialty}`);
    } else {
      navigate("/booking/doctors");
    }
  };

  const handleDoctorClick = (doctor) => {
    if (!user?.id) {
      toast.error("Please login to book an appointment!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
      return;
    }
    navigate(`/appointment/${doctor._id}/${user.id}`);
  };

  const handleRetry = () => {
    toast.info("Refreshing doctor list...");
    fetchDoctors();
  };

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50">
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
                doctors={filteredDoctors}
                loading={loading}
                error={error}
                selectedSpecialty={selectedSpecialty}
                onDoctorClick={handleDoctorClick}
                onRetry={handleRetry}
                onSpecialtyClick={handleSpecialtyClick}
              />
            </div>             
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
