<<<<<<< HEAD
import React from 'react'

const Doctors = () => {
  return (
    <div>Doctors</div>
  )
}

export default Doctors
=======
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const SPECIALTIES = [
  { display: "Internal Medicine", value: "internal_medicine" },
  { display: "Pediatrics", value: "pediatrics" },
  { display: "Dermatology", value: "dermatology" },
  { display: "Dentistry", value: "dentistry" },
  { display: "ENT", value: "ENT" },
  { display: "Ophthalmology", value: "ophthalmology" },
  { display: "Cardiology", value: "cardiology" },
  { display: "Neurology", value: "neurology" },
];

const Doctors = () => {
  const { speciality: urlSpeciality } = useParams();
  const { doctors, setDoctors } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(urlSpeciality || "");
  const navigate = useNavigate();

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/doctor/filterDoctor");
      console.log("API Response:", response);
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch doctors");
        toast.error(response.data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      setError("Error fetching doctors. Please try again.");
      toast.error("Error fetching doctors. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setDoctors]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => doc.specialty.includes(selectedSpecialty))
    : doctors;

  const handleSpecialtyClick = (value) => {
    const newSpecialty = selectedSpecialty === value ? "" : value;
    setSelectedSpecialty(newSpecialty);
    navigate(newSpecialty ? `/doctors/${newSpecialty}` : "/doctors");
  };

  return (
    <div className="mt-[6.5rem]">
      <p className="text-gray-600">Browse through the doctors specialist</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {SPECIALTIES.map(({ display, value }) => (
            <p
              key={value}
              onClick={() => handleSpecialtyClick(value)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                selectedSpecialty === value ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {display}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6 min-h-[400px]">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  toast.info("Retrying to fetch doctors...");
                  fetchDoctors();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              >
                <img
                  src={item.avatarUrl}
                  alt={item.userName}
                  className="w-full bg-blue-50"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-green-500 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p>Available</p>
                  </div>
                  <p className="font-medium text-lg text-gray-900">
                    {item.userName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.specialty.join(", ")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No doctors found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
>>>>>>> fe-demo
