import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

export const useDoctors = () => {
  const { speciality: urlSpeciality } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    urlSpeciality || ""
  );
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get("/admin/getAllDoctors");
      console.log("Doctors fetched:", data); // kiểm tra data
      setDoctors(data.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Unable to load doctors list");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    setSelectedSpecialty(urlSpeciality || "");
  }, [urlSpeciality]);

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => {
        const specialties = Array.isArray(doc.speciality)
          ? doc.speciality
          : [doc.speciality];

        return specialties.some(
          (spec) => spec?.toLowerCase?.() === selectedSpecialty.toLowerCase()
        );
      })
    : doctors;

  return {
    loading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    doctors,
    filteredDoctors,
    fetchDoctors,
  };
};
