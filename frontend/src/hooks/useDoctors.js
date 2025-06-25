import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.ts";
import { transformDoctorData } from "../utils/transformDoctorData";

export const useDoctors = () => {
  const { speciality: urlSpeciality } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    urlSpeciality || ""
  );
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get("/admin/getAllDoctors");
      const mongoDoctors = (data || []).map((doc) =>
        transformDoctorData(doc, "mongodb")
      );
      setDoctors(mongoDoctors);
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
    setCurrentPage(1);
  }, [selectedSpecialty]);

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

  const totalPage = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    loading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    doctors,
    currentPage,
    doctorsPerPage,
    filteredDoctors,
    totalPage,
    startIndex,
    paginatedDoctors,
    fetchDoctors,
    handlePageChange,
  };
};